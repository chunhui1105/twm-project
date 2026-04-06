import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { useUpload } from "@workspace/object-storage-web";
import { Upload, Trash2, ZoomIn, ZoomOut, RotateCw, Loader2, Plus, X, Crop, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_PX = 1600;

async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  maxPx: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const rad = (rotation * Math.PI) / 180;
      const bboxW = Math.abs(Math.cos(rad) * img.width) + Math.abs(Math.sin(rad) * img.height);
      const bboxH = Math.abs(Math.sin(rad) * img.width) + Math.abs(Math.cos(rad) * img.height);
      canvas.width = bboxW;
      canvas.height = bboxH;
      ctx.translate(bboxW / 2, bboxH / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = pixelCrop.width;
      cropCanvas.height = pixelCrop.height;
      const cropCtx = cropCanvas.getContext("2d")!;
      cropCtx.drawImage(canvas, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

      const scale = Math.min(1, maxPx / Math.max(pixelCrop.width, pixelCrop.height));
      const outW = Math.round(pixelCrop.width * scale);
      const outH = Math.round(pixelCrop.height * scale);
      const outCanvas = document.createElement("canvas");
      outCanvas.width = outW;
      outCanvas.height = outH;
      const outCtx = outCanvas.getContext("2d")!;
      outCtx.drawImage(cropCanvas, 0, 0, outW, outH);
      outCanvas.toBlob(b => b ? resolve(b) : reject(new Error("Canvas toBlob failed")), "image/jpeg", 0.92);
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

const ASPECT_RATIOS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
];

function CropModal({
  src,
  onConfirm,
  onCancel,
  defaultAspect,
}: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
  defaultAspect?: number;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, px: Area) => setCroppedArea(px), []);

  const handleConfirm = async () => {
    if (!croppedArea) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(src, croppedArea, rotation, MAX_PX);
      onConfirm(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/95">
      <div className="flex items-center justify-between px-5 py-3 bg-black/60 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Crop className="w-4 h-4 text-white/70" />
          <span className="text-sm font-mono uppercase tracking-widest text-white/80">Crop & Resize</span>
        </div>
        <button onClick={onCancel} className="p-1.5 text-white/60 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1" style={{ minHeight: 0 }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          minZoom={0.5}
          maxZoom={5}
          zoomWithScroll={true}
          restrictPosition={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          objectFit="contain"
          style={{
            containerStyle: { background: "#111", position: "absolute", inset: 0 },
          }}
        />
      </div>

      <div className="flex-shrink-0 bg-black/80 border-t border-white/10 px-5 py-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 font-mono uppercase">Aspect</span>
            <div className="flex gap-1">
              {ASPECT_RATIOS.map(r => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setAspect(r.value)}
                  className={`px-2.5 py-1 text-xs font-mono border transition-colors ${
                    aspect === r.value
                      ? "border-green-500 bg-green-500/20 text-green-400"
                      : "border-white/20 text-white/60 hover:border-white/40"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-48">
            <button type="button" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-1 text-white/50 hover:text-white transition-colors">
              <ZoomOut className="w-4 h-4 flex-shrink-0" />
            </button>
            <input
              type="range" min={0.5} max={5} step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 accent-green-500 cursor-pointer"
            />
            <button type="button" onClick={() => setZoom(z => Math.min(5, z + 0.2))} className="p-1 text-white/50 hover:text-white transition-colors">
              <ZoomIn className="w-4 h-4 flex-shrink-0" />
            </button>
            <span className="text-xs text-white/40 font-mono w-10 text-right">{zoom.toFixed(1)}×</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-mono"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate
            </button>
            <button
              type="button"
              onClick={() => { setZoom(1); setRotation(0); setCrop({ x: 0, y: 0 }); }}
              className="px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-mono"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-white/20 text-white/70 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crop className="w-4 h-4" />}
            {processing ? "Processing..." : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageCard({
  src,
  onRemove,
  onReplace,
  size = "md",
}: {
  src: string;
  onRemove: () => void;
  onReplace?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "w-32 h-32" : size === "md" ? "w-24 h-24" : "w-16 h-16";
  return (
    <div className={`relative group ${sizeClass} border border-border bg-secondary overflow-hidden`}>
      <img src={src} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
        {onReplace && (
          <button
            type="button"
            onClick={onReplace}
            title="Replace"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-sm transition-colors"
          >
            <Crop className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          title="Remove"
          className="p-1.5 bg-white/10 hover:bg-red-500/80 text-white rounded-sm transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: number;
  compact?: boolean;
}

export function SingleImageUpload({ value, onChange, label = "Upload Image", aspectRatio, compact = false }: SingleImageUploadProps) {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({ basePath: "/api/storage" });
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (pendingBlob) {
      handleUploadBlob(pendingBlob);
      setPendingBlob(null);
    }
  }, [pendingBlob]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadBlob = async (blob: Blob) => {
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });
    const res = await uploadFile(file);
    if (res?.uploadURL) {
      const url = new URL(res.uploadURL);
      const uuid = url.pathname.split("/").pop();
      onChange(`/api/storage/objects/uploads/${uuid}`);
      toast({ title: "Image uploaded" });
    } else {
      toast({ title: "Upload failed", variant: "destructive" });
    }
    setCropSrc(null);
  };

  if (compact) {
    return (
      <>
        {cropSrc && (
          <CropModal
            src={cropSrc}
            defaultAspect={aspectRatio}
            onConfirm={(blob) => { setCropSrc(null); setPendingBlob(blob); }}
            onCancel={() => setCropSrc(null)}
          />
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        <div className="relative w-full h-full">
          {value ? (
            <>
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                title="Replace image"
              >
                {isUploading ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Crop className="w-3 h-3 text-white" />}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center z-10"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="w-full h-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          defaultAspect={aspectRatio}
          onConfirm={(blob) => { setCropSrc(null); setPendingBlob(blob); }}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      <div className="flex flex-wrap gap-3 items-start">
        {value ? (
          <ImageCard
            src={value}
            size="lg"
            onReplace={() => fileRef.current?.click()}
            onRemove={() => onChange("")}
          />
        ) : null}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="w-32 h-32 border-2 border-dashed border-border hover:border-primary bg-background flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-60"
        >
          {isUploading
            ? <Loader2 className="w-6 h-6 animate-spin" />
            : <Upload className="w-6 h-6" />}
          <span className="text-xs font-mono uppercase tracking-wider">
            {isUploading ? "Uploading..." : value ? "Replace" : label}
          </span>
        </button>
      </div>
    </>
  );
}

interface GalleryImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function GalleryImageUpload({ values, onChange, maxImages = 10 }: GalleryImageUploadProps) {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({ basePath: "/api/storage" });
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [replaceIdx, setReplaceIdx] = useState<number | null>(null);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (pendingBlob) {
      handleUploadBlob(pendingBlob);
      setPendingBlob(null);
    }
  }, [pendingBlob]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadBlob = async (blob: Blob) => {
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });
    const res = await uploadFile(file);
    if (res?.uploadURL) {
      const url = new URL(res.uploadURL);
      const uuid = url.pathname.split("/").pop();
      const newUrl = `/api/storage/objects/uploads/${uuid}`;
      if (replaceIdx !== null) {
        const next = [...values];
        next[replaceIdx] = newUrl;
        onChange(next);
      } else {
        onChange([...values, newUrl]);
      }
      toast({ title: "Image uploaded" });
    } else {
      toast({ title: "Upload failed", variant: "destructive" });
    }
    setCropSrc(null);
    setReplaceIdx(null);
  };

  const removeImage = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  const replaceImage = (idx: number) => {
    setReplaceIdx(idx);
    fileRef.current?.click();
  };

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={(blob) => { setCropSrc(null); setPendingBlob(blob); }}
          onCancel={() => { setCropSrc(null); setReplaceIdx(null); }}
        />
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      <div className="flex flex-wrap gap-3">
        {values.map((src, idx) => (
          <ImageCard
            key={idx}
            src={src}
            size="md"
            onReplace={() => replaceImage(idx)}
            onRemove={() => removeImage(idx)}
          />
        ))}

        {values.length < maxImages && (
          <button
            type="button"
            onClick={() => { setReplaceIdx(null); fileRef.current?.click(); }}
            disabled={isUploading}
            className="w-24 h-24 border-2 border-dashed border-border hover:border-primary bg-background flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-60"
          >
            {isUploading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Plus className="w-5 h-5" />}
            <span className="text-xs font-mono uppercase tracking-wide">
              {isUploading ? "..." : "Add"}
            </span>
          </button>
        )}
      </div>
    </>
  );
}

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function VideoUpload({ value, onChange }: VideoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useUpload({ basePath: "/api/storage" });
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const res = await uploadFile(file);
    if (res?.uploadURL) {
      const url = new URL(res.uploadURL);
      const uuid = url.pathname.split("/").pop();
      onChange(`/api/storage/objects/uploads/${uuid}`);
      toast({ title: "Video uploaded" });
    } else {
      toast({ title: "Upload failed", variant: "destructive" });
    }
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
      {value ? (
        <div className="relative border border-border bg-black">
          <video src={value} controls className="w-full max-h-56 block" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="w-full h-24 border-2 border-dashed border-border hover:border-primary bg-background flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-60"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
          <span className="text-xs font-mono uppercase tracking-wide">
            {isUploading ? "Uploading..." : "Upload Video"}
          </span>
        </button>
      )}
    </div>
  );
}
