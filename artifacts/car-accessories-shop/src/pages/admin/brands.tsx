import { AdminLayout } from "@/components/admin-layout";
import { useState } from "react";
import {
  useGetBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  useReorderBrands,
  getGetBrandsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, GripVertical, Plus, X, Check, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader, useUpload } from "@workspace/object-storage-web";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Brand = { id: number; name: string; imageUrl: string; sortOrder: number; active: boolean };

function SortableBrandRow({
  brand,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, active: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: brand.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
      <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 touch-none">
        <GripVertical size={18} />
      </button>
      <div className="w-14 h-10 border rounded flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
        <img
          src={brand.imageUrl}
          alt={brand.name}
          className="max-w-full max-h-full object-contain mix-blend-multiply"
          onError={e => { (e.target as HTMLImageElement).src = "/twm-logo.png"; }}
        />
      </div>
      <div className="flex-1 font-medium text-sm">{brand.name}</div>
      <div className="text-xs text-gray-400 hidden sm:block truncate max-w-[160px]">{brand.imageUrl}</div>
      <div className="flex items-center gap-2">
        <Switch
          checked={brand.active}
          onCheckedChange={v => onToggleActive(brand.id, v)}
          className="data-[state=checked]:bg-green-700"
        />
        <span className="text-xs text-gray-500 hidden sm:block w-12">{brand.active ? "Visible" : "Hidden"}</span>
      </div>
      <button onClick={() => onEdit(brand)} className="text-blue-600 hover:text-blue-800 p-1">
        <Pencil size={16} />
      </button>
      <button onClick={() => onDelete(brand.id)} className="text-red-500 hover:text-red-700 p-1">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function ImageUrlField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const { toast } = useToast();
  const { getUploadParameters } = useUpload({
    onError: (err) => toast({ title: "Upload failed", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="/brand-carall.png" className="flex-1" />
        <ObjectUploader
          maxNumberOfFiles={1}
          onGetUploadParameters={getUploadParameters}
          onComplete={({ successful }) => {
            const uploadURL = successful[0]?.uploadURL;
            if (uploadURL) {
              const url = new URL(uploadURL);
              const uuid = url.pathname.split("/").pop();
              onChange(`/api/storage/objects/uploads/${uuid}`);
            }
          }}
        >
          <Upload className="w-3.5 h-3.5 mr-1" /> Upload
        </ObjectUploader>
      </div>
      {value && (
        <div className="w-20 h-12 border rounded flex items-center justify-center bg-white overflow-hidden">
          <img src={value} alt="preview" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}

export default function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: brands = [] } = useGetBrands();
  const { mutate: createBrand } = useCreateBrand();
  const { mutate: updateBrand } = useUpdateBrand();
  const { mutate: deleteBrand } = useDeleteBrand();
  const { mutate: reorderBrands } = useReorderBrands();

  const [localItems, setLocalItems] = useState<Brand[]>([]);
  const [synced, setSynced] = useState(false);
  if (!synced && brands.length > 0) { setLocalItems([...brands]); setSynced(true); }

  const [editing, setEditing] = useState<Brand | null>(null);
  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });

  function syncFromServer(data: Brand[]) {
    setLocalItems([...data]);
    setSynced(true);
  }

  // Sync when brands update from server (e.g. after mutations)
  if (synced && brands.length > 0 && JSON.stringify(brands.map(b => b.id + b.sortOrder)) !== JSON.stringify(localItems.map(b => b.id + b.sortOrder))) {
    // Only sync if not currently dragging — we handle optimistic order updates ourselves
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localItems.findIndex(i => i.id === active.id);
    const newIndex = localItems.findIndex(i => i.id === over.id);
    const newItems = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(newItems);
    reorderBrands(
      { data: { orderedIds: newItems.map(i => i.id) } },
      { onSuccess: () => invalidate(), onError: () => toast({ title: "Reorder failed", variant: "destructive" }) }
    );
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this brand?")) return;
    deleteBrand(
      { id },
      {
        onSuccess: () => {
          invalidate();
          setLocalItems(prev => prev.filter(b => b.id !== id));
          toast({ title: "Brand deleted" });
        },
        onError: () => toast({ title: "Delete failed", variant: "destructive" }),
      }
    );
  }

  function handleToggleActive(id: number, active: boolean) {
    updateBrand(
      { id, data: { active } },
      {
        onSuccess: () => {
          invalidate();
          setLocalItems(prev => prev.map(b => b.id === id ? { ...b, active } : b));
        },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      }
    );
  }

  function openEdit(brand: Brand) {
    setEditing(brand);
    setEditName(brand.name);
    setEditImageUrl(brand.imageUrl);
  }

  function saveEdit() {
    if (!editing) return;
    updateBrand(
      { id: editing.id, data: { name: editName, imageUrl: editImageUrl } },
      {
        onSuccess: () => {
          invalidate();
          setLocalItems(prev => prev.map(b => b.id === editing.id ? { ...b, name: editName, imageUrl: editImageUrl } : b));
          setEditing(null);
          toast({ title: "Brand updated" });
        },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      }
    );
  }

  function handleAdd() {
    if (!newName.trim() || !newImageUrl.trim()) {
      toast({ title: "Name and image are required", variant: "destructive" });
      return;
    }
    createBrand(
      { data: { name: newName.trim(), imageUrl: newImageUrl.trim() } },
      {
        onSuccess: (created) => {
          invalidate();
          setLocalItems(prev => [...prev, created as Brand]);
          setShowAdd(false);
          setNewName("");
          setNewImageUrl("");
          toast({ title: "Brand added" });
        },
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      }
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Brands</h1>
            <p className="text-sm text-gray-500 mt-1">Manage the trusted brands shown on the homepage. Drag to reorder.</p>
          </div>
          <Button onClick={() => setShowAdd(v => !v)} className="bg-green-700 hover:bg-green-800 text-white gap-2">
            <Plus size={16} /> Add Brand
          </Button>
        </div>

        {showAdd && (
          <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
            <h2 className="font-semibold">New Brand</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Brand Name</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. CARALL" />
              </div>
              <ImageUrlField value={newImageUrl} onChange={setNewImageUrl} label="Logo Image" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="bg-green-700 hover:bg-green-800 text-white gap-1">
                <Check size={14} /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setShowAdd(false); setNewName(""); setNewImageUrl(""); }} className="gap-1">
                <X size={14} /> Cancel
              </Button>
            </div>
          </div>
        )}

        {editing && (
          <div className="border rounded-lg p-4 bg-blue-50 space-y-3">
            <h2 className="font-semibold">Edit: {editing.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Brand Name</Label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <ImageUrlField value={editImageUrl} onChange={setEditImageUrl} label="Logo Image" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700 text-white gap-1">
                <Check size={14} /> Update
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(null)} className="gap-1">
                <X size={14} /> Cancel
              </Button>
            </div>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {localItems.map(brand => (
                <SortableBrandRow
                  key={brand.id}
                  brand={brand}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {localItems.length === 0 && (
          <div className="text-center py-12 text-gray-400">No brands yet. Add one above.</div>
        )}
      </div>
    </AdminLayout>
  );
}
