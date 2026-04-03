import { AdminLayout } from "@/components/admin-layout";
import {
  useGetSlides,
  useCreateSlide,
  useUpdateSlide,
  useDeleteSlide,
  useReorderSlides,
  useGetCategories,
  getGetSlidesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Plus, Trash2, Pencil, Check, GripVertical, X, ImageIcon, Upload } from "lucide-react";
import { ObjectUploader, useUpload } from "@workspace/object-storage-web";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Slide = {
  id: number;
  imageUrl: string;
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  categorySlug?: string | null;
  sortOrder: number;
};

function SlideRow({
  slide,
  editId,
  editFields,
  setEditFields,
  imageEditId,
  imageUrl,
  setImageUrl,
  confirmDeleteId,
  setConfirmDeleteId,
  onStartEdit,
  onSaveEdit,
  onStartImageEdit,
  onSaveImage,
  setImageEditId,
  onDelete,
  getUploadParameters,
  toast,
  categories,
  deletePending,
  updatePending,
}: {
  slide: Slide;
  editId: number | null;
  editFields: Partial<Slide>;
  setEditFields: (v: Partial<Slide>) => void;
  imageEditId: number | null;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  confirmDeleteId: number | null;
  setConfirmDeleteId: (id: number | null) => void;
  onStartEdit: (slide: Slide) => void;
  onSaveEdit: (id: number) => void;
  onStartImageEdit: (slide: Slide) => void;
  onSaveImage: (id: number) => void;
  setImageEditId: (id: number | null) => void;
  onDelete: (id: number) => void;
  getUploadParameters: any;
  toast: any;
  categories: { id: number; name: string; slug: string }[];
  deletePending: boolean;
  updatePending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isEditing = editId === slide.id;
  const isImageEditing = imageEditId === slide.id;
  const isConfirmingDelete = confirmDeleteId === slide.id;

  return (
    <div ref={setNodeRef} style={style} className="border border-border rounded bg-card">
      {/* Main row */}
      <div className="flex items-center gap-3 p-3">
        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Thumbnail */}
        <div className="w-20 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
          {slide.imageUrl ? (
            <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <input
                className="border border-border rounded px-2 py-1 bg-background col-span-2"
                placeholder="Title"
                value={editFields.title ?? ""}
                onChange={e => setEditFields({ ...editFields, title: e.target.value })}
              />
              <input
                className="border border-border rounded px-2 py-1 bg-background"
                placeholder="Highlight (green text)"
                value={editFields.highlight ?? ""}
                onChange={e => setEditFields({ ...editFields, highlight: e.target.value })}
              />
              <input
                className="border border-border rounded px-2 py-1 bg-background"
                placeholder="Tag badge"
                value={editFields.tag ?? ""}
                onChange={e => setEditFields({ ...editFields, tag: e.target.value })}
              />
              <input
                className="border border-border rounded px-2 py-1 bg-background col-span-2"
                placeholder="Subtitle"
                value={editFields.subtitle ?? ""}
                onChange={e => setEditFields({ ...editFields, subtitle: e.target.value })}
              />
              <select
                className="border border-border rounded px-2 py-1 bg-background col-span-2"
                value={editFields.categorySlug ?? ""}
                onChange={e => setEditFields({ ...editFields, categorySlug: e.target.value || null })}
              >
                <option value="">No category link</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="font-semibold truncate">
                {slide.title} <span className="text-primary">{slide.highlight}</span>
              </div>
              {slide.tag && <div className="text-xs text-muted-foreground truncate">{slide.tag}</div>}
              {slide.subtitle && <div className="text-xs text-muted-foreground truncate">{slide.subtitle}</div>}
              {slide.categorySlug && (
                <div className="text-xs text-primary truncate">→ /shop?category={slide.categorySlug}</div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={() => onSaveEdit(slide.id)}
                disabled={updatePending}
                className="p-1.5 rounded hover:bg-primary hover:text-primary-foreground text-primary transition-colors"
                title="Save"
              >
                {updatePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setEditFields({}); }}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartImageEdit(slide)}
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Change image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onStartEdit(slide)}
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Edit text"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {isConfirmingDelete ? (
                <>
                  <button
                    onClick={() => onDelete(slide.id)}
                    disabled={deletePending}
                    className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                  >
                    {deletePending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2 py-1 text-xs border border-border rounded hover:bg-muted"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(slide.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image edit panel */}
      {isImageEditing && (
        <div className="border-t border-border p-3 space-y-2">
          <p className="text-sm font-medium">Change slide image</p>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-border rounded px-2 py-1.5 text-sm bg-background"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            <button
              onClick={() => onSaveImage(slide.id)}
              disabled={updatePending || !imageUrl}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {updatePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </button>
            <button
              onClick={() => setImageEditId(null)}
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted"
            >
              Cancel
            </button>
          </div>
          <div className="text-xs text-muted-foreground">Or upload:</div>
          <ObjectUploader
            getUploadParameters={getUploadParameters}
            onUploadComplete={(url: string) => {
              setImageUrl(url);
              toast({ title: "Image uploaded", description: "Click Save to apply." });
            }}
            onUploadError={(err: Error) => toast({ title: "Upload failed", description: err.message, variant: "destructive" })}
          >
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded hover:bg-muted">
              <Upload className="w-4 h-4" /> Upload image
            </button>
          </ObjectUploader>
        </div>
      )}
    </div>
  );
}

export default function AdminSlides() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: slides = [], isLoading } = useGetSlides();
  const { data: categories = [] } = useGetCategories();
  const createSlide = useCreateSlide();
  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();
  const reorderSlides = useReorderSlides();

  const { getUploadParameters } = useUpload();

  const [localSlides, setLocalSlides] = useState<Slide[]>([]);
  const [synced, setSynced] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Partial<Slide>>({});
  const [imageEditId, setImageEditId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // New slide form
  const [showNew, setShowNew] = useState(false);
  const [newFields, setNewFields] = useState({
    imageUrl: "",
    tag: "",
    title: "",
    highlight: "",
    subtitle: "",
    categorySlug: "",
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  // Sync remote → local once
  if (!synced && slides.length > 0) {
    setLocalSlides([...slides]);
    setSynced(true);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = localSlides.findIndex(s => s.id === active.id);
    const newIdx = localSlides.findIndex(s => s.id === over.id);
    const reordered = arrayMove(localSlides, oldIdx, newIdx);
    setLocalSlides(reordered);
    try {
      await reorderSlides.mutateAsync({ data: { orderedIds: reordered.map(s => s.id) } });
      queryClient.invalidateQueries({ queryKey: getGetSlidesQueryKey() });
    } catch {
      toast({ title: "Reorder failed", variant: "destructive" });
      setLocalSlides([...slides]);
    }
  };

  const handleStartEdit = (slide: Slide) => {
    setEditId(slide.id);
    setEditFields({
      tag: slide.tag,
      title: slide.title,
      highlight: slide.highlight,
      subtitle: slide.subtitle,
      categorySlug: slide.categorySlug ?? "",
    });
    setImageEditId(null);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateSlide.mutateAsync({
        id,
        data: {
          tag: editFields.tag,
          title: editFields.title,
          highlight: editFields.highlight,
          subtitle: editFields.subtitle,
          categorySlug: editFields.categorySlug || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetSlidesQueryKey() });
      setSynced(false);
      setEditId(null);
      toast({ title: "Slide updated" });
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleStartImageEdit = (slide: Slide) => {
    setImageEditId(slide.id);
    setImageUrl(slide.imageUrl);
    setEditId(null);
  };

  const handleSaveImage = async (id: number) => {
    try {
      await updateSlide.mutateAsync({ id, data: { imageUrl } });
      queryClient.invalidateQueries({ queryKey: getGetSlidesQueryKey() });
      setSynced(false);
      setImageEditId(null);
      toast({ title: "Image updated" });
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSlide.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetSlidesQueryKey() });
      setSynced(false);
      setConfirmDeleteId(null);
      toast({ title: "Slide deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleCreate = async () => {
    if (!newFields.imageUrl) {
      toast({ title: "Image URL required", variant: "destructive" });
      return;
    }
    try {
      await createSlide.mutateAsync({
        data: {
          imageUrl: newFields.imageUrl,
          tag: newFields.tag || undefined,
          title: newFields.title || undefined,
          highlight: newFields.highlight || undefined,
          subtitle: newFields.subtitle || undefined,
          categorySlug: newFields.categorySlug || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetSlidesQueryKey() });
      setSynced(false);
      setShowNew(false);
      setNewFields({ imageUrl: "", tag: "", title: "", highlight: "", subtitle: "", categorySlug: "" });
      setNewImageUrl("");
      toast({ title: "Slide added" });
    } catch {
      toast({ title: "Create failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Slideshow</h1>
            <p className="text-muted-foreground text-sm">Manage homepage hero slides. Drag to reorder.</p>
          </div>
          <button
            onClick={() => setShowNew(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add slide
          </button>
        </div>

        {/* New slide form */}
        {showNew && (
          <div className="border border-border rounded bg-card p-4 space-y-3">
            <p className="font-medium text-sm">New Slide</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-muted-foreground">Image URL</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-border rounded px-2 py-1.5 bg-background"
                    placeholder="/hero.png or https://..."
                    value={newFields.imageUrl}
                    onChange={e => setNewFields({ ...newFields, imageUrl: e.target.value })}
                  />
                  <ObjectUploader
                    getUploadParameters={getUploadParameters}
                    onUploadComplete={(url: string) => {
                      setNewFields(f => ({ ...f, imageUrl: url }));
                      toast({ title: "Image uploaded" });
                    }}
                    onUploadError={(err: Error) => toast({ title: "Upload failed", description: err.message, variant: "destructive" })}
                  >
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded hover:bg-muted">
                      <Upload className="w-4 h-4" /> Upload
                    </button>
                  </ObjectUploader>
                </div>
                {newFields.imageUrl && (
                  <img src={newFields.imageUrl} alt="preview" className="w-40 h-24 object-cover rounded border border-border mt-1" />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Title</label>
                <input className="w-full border border-border rounded px-2 py-1.5 bg-background" placeholder="BUILT FOR" value={newFields.title} onChange={e => setNewFields({ ...newFields, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Highlight (green text)</label>
                <input className="w-full border border-border rounded px-2 py-1.5 bg-background" placeholder="THE ROAD." value={newFields.highlight} onChange={e => setNewFields({ ...newFields, highlight: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tag badge</label>
                <input className="w-full border border-border rounded px-2 py-1.5 bg-background" placeholder="Exterior Collection" value={newFields.tag} onChange={e => setNewFields({ ...newFields, tag: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Category link</label>
                <select className="w-full border border-border rounded px-2 py-1.5 bg-background" value={newFields.categorySlug} onChange={e => setNewFields({ ...newFields, categorySlug: e.target.value })}>
                  <option value="">No category link</option>
                  {(categories as any[]).map(c => (
                    <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-muted-foreground">Subtitle</label>
                <input className="w-full border border-border rounded px-2 py-1.5 bg-background" placeholder="Aerodynamic styling and protection..." value={newFields.subtitle} onChange={e => setNewFields({ ...newFields, subtitle: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCreate}
                disabled={createSlide.isPending}
                className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {createSlide.isPending && <Loader2 className="w-3 h-3 animate-spin" />} Add slide
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-1.5 text-sm border border-border rounded hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Slides list */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading slides...
          </div>
        ) : localSlides.length === 0 ? (
          <p className="text-muted-foreground text-sm">No slides yet. Add one above.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localSlides.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {localSlides.map(slide => (
                  <SlideRow
                    key={slide.id}
                    slide={slide}
                    editId={editId}
                    editFields={editFields}
                    setEditFields={setEditFields}
                    imageEditId={imageEditId}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    confirmDeleteId={confirmDeleteId}
                    setConfirmDeleteId={setConfirmDeleteId}
                    onStartEdit={handleStartEdit}
                    onSaveEdit={handleSaveEdit}
                    onStartImageEdit={handleStartImageEdit}
                    onSaveImage={handleSaveImage}
                    setImageEditId={setImageEditId}
                    onDelete={handleDelete}
                    getUploadParameters={getUploadParameters}
                    toast={toast}
                    categories={categories as any[]}
                    deletePending={deleteSlide.isPending}
                    updatePending={updateSlide.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </AdminLayout>
  );
}
