import { AdminLayout } from "@/components/admin-layout";
import {
  useGetCarBrands,
  useCreateCarBrand,
  useUpdateCarBrand,
  useDeleteCarBrand,
  useCreateCarModel,
  useUpdateCarModel,
  useDeleteCarModel,
  useReorderCarModels,
  getGetCarBrandsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  ChevronDown, ChevronRight, Plus, Pencil, Trash2,
  X, Check, Loader2, Car, Camera, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SingleImageUpload } from "@/components/image-upload-with-crop";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Model = { id: number; brandId: number; name: string; years: string; imageUrl?: string | null; sortOrder: number };
type Brand = { id: number; name: string; origin: string; sortOrder: number; models: Model[] };

function ModelRow({ model, brandId, onRefresh }: { model: Model; brandId: number; onRefresh: () => void }) {
  const updateMutation = useUpdateCarModel();
  const deleteMutation = useDeleteCarModel();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(model.name);
  const [years, setYears] = useState(model.years);
  const [imageUrl, setImageUrl] = useState(model.imageUrl ?? "");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: model.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const save = async () => {
    try {
      await updateMutation.mutateAsync({ brandId, id: model.id, data: { name, years, imageUrl: imageUrl || null } });
      onRefresh();
      setEditing(false);
      toast({ title: "Saved" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  const saveImage = async (url: string) => {
    try {
      await updateMutation.mutateAsync({ brandId, id: model.id, data: { imageUrl: url } });
      onRefresh();
      toast({ title: "Image saved" });
    } catch { toast({ title: "Error saving image", variant: "destructive" }); }
  };

  const remove = async () => {
    if (!confirm(`Delete "${model.name}"?`)) return;
    try {
      await deleteMutation.mutateAsync({ brandId, id: model.id });
      onRefresh();
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 p-2 border border-primary/30 bg-primary/5 rounded">
        {/* Image thumbnail / uploader */}
        <div className="relative w-10 h-10 flex-shrink-0 border border-border bg-background rounded overflow-hidden">
          <SingleImageUpload compact value={imageUrl} onChange={setImageUrl} />
        </div>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary"
          placeholder="Model name"
        />
        <input
          value={years}
          onChange={e => setYears(e.target.value)}
          className="w-36 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary font-mono"
          placeholder="e.g. 2005–present"
        />
        <button type="button" onClick={save} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
        <button type="button" onClick={() => { setEditing(false); setName(model.name); setYears(model.years); setImageUrl(model.imageUrl ?? ""); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/50 group">
      <button type="button" {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" title="Drag to reorder">
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      {/* Image thumbnail */}
      <div className="relative w-8 h-8 flex-shrink-0 border border-border rounded overflow-hidden bg-secondary/50">
        <SingleImageUpload compact value={model.imageUrl ?? ""} onChange={saveImage} />
      </div>
      <span className="flex-1 text-sm font-medium">{model.name}</span>
      {model.years && <span className="text-xs text-muted-foreground font-mono">{model.years}</span>}
      <button type="button" onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity"><Pencil className="w-3.5 h-3.5" /></button>
      <button type="button" onClick={remove} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  );
}

function AddModelForm({ brandId, onRefresh, onClose }: { brandId: number; onRefresh: () => void; onClose: () => void }) {
  const createMutation = useCreateCarModel();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [years, setYears] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createMutation.mutateAsync({ brandId, data: { name, years } });
      onRefresh();
      setName(""); setYears("");
      toast({ title: "Model added" });
      onClose();
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 p-2 border border-dashed border-primary/40 rounded bg-primary/5">
      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        className="flex-1 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary"
        placeholder="Model name *"
      />
      <input
        value={years}
        onChange={e => setYears(e.target.value)}
        className="w-36 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary font-mono"
        placeholder="e.g. 2008–present"
      />
      <button type="submit" className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
      <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
    </form>
  );
}

function BrandRow({ brand, onRefresh }: { brand: Brand; onRefresh: () => void }) {
  const updateMutation = useUpdateCarBrand();
  const deleteMutation = useDeleteCarBrand();
  const reorderMutation = useReorderCarModels();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [editingBrand, setEditingBrand] = useState(false);
  const [addingModel, setAddingModel] = useState(false);
  const [bName, setBName] = useState(brand.name);
  const [localModels, setLocalModels] = useState(brand.models);
  const [orderChanged, setOrderChanged] = useState(false);

  useEffect(() => { setLocalModels(brand.models); setOrderChanged(false); }, [brand.models]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalModels(prev => {
      const oldIndex = prev.findIndex(m => m.id === active.id);
      const newIndex = prev.findIndex(m => m.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setOrderChanged(true);
  };

  const saveOrder = async () => {
    try {
      await reorderMutation.mutateAsync({ brandId: brand.id, data: { orderedIds: localModels.map(m => m.id) } });
      setOrderChanged(false);
      onRefresh();
      toast({ title: "Order saved" });
    } catch { toast({ title: "Error saving order", variant: "destructive" }); }
  };

  const saveBrand = async () => {
    try {
      await updateMutation.mutateAsync({ id: brand.id, data: { name: bName } });
      onRefresh();
      setEditingBrand(false);
      toast({ title: "Saved" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  const removeBrand = async () => {
    if (!confirm(`Delete "${brand.name}" and all its models?`)) return;
    try {
      await deleteMutation.mutateAsync({ id: brand.id });
      onRefresh();
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  return (
    <div className="border border-border bg-card rounded overflow-hidden">
      {/* Brand header */}
      {editingBrand ? (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border-b border-border">
          <input
            autoFocus
            value={bName}
            onChange={e => setBName(e.target.value)}
            className="flex-1 bg-background border border-border px-2 py-1.5 text-sm focus:outline-none focus:border-primary font-bold"
            placeholder="Brand name"
          />
          <button onClick={saveBrand} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
          <button onClick={() => { setEditingBrand(false); setBName(brand.name); }} className="text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-3 flex-1 text-left group">
            {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <span className="font-bold tracking-tight">{brand.name}</span>
            <span className="text-xs text-muted-foreground">{brand.models.length} models</span>
          </button>
          <button onClick={() => setEditingBrand(true)} className="text-muted-foreground hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={removeBrand} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Models */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localModels.map(m => m.id)} strategy={verticalListSortingStrategy}>
              {localModels.map(m => (
                <ModelRow key={m.id} model={m} brandId={brand.id} onRefresh={onRefresh} />
              ))}
            </SortableContext>
          </DndContext>
          {orderChanged && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground flex-1">Order changed</span>
              <button
                type="button"
                onClick={saveOrder}
                disabled={reorderMutation.isPending}
                className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
              >
                {reorderMutation.isPending ? "Saving..." : "Save Order"}
              </button>
              <button
                type="button"
                onClick={() => { setLocalModels(brand.models); setOrderChanged(false); }}
                className="text-xs px-2 py-1 border border-border rounded hover:bg-secondary/50"
              >
                Cancel
              </button>
            </div>
          )}
          {addingModel ? (
            <AddModelForm brandId={brand.id} onRefresh={onRefresh} onClose={() => setAddingModel(false)} />
          ) : (
            <button
              onClick={() => setAddingModel(true)}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 mt-2 font-mono uppercase tracking-wider"
            >
              <Plus className="w-3 h-3" /> Add model
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminCarModels() {
  const { data, isLoading, refetch } = useGetCarBrands();
  const createBrandMutation = useCreateCarBrand();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [addingBrand, setAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetCarBrandsQueryKey() });

  const addBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      await createBrandMutation.mutateAsync({ data: { name: newBrandName } });
      refresh();
      setNewBrandName("");
      setAddingBrand(false);
      toast({ title: "Brand added" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tighter uppercase">Car Models</h1>
          </div>
          <Button onClick={() => setAddingBrand(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Add Brand
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Manage car brands and their models shown on the "Find By Car Model" page.
        </p>

        {addingBrand && (
          <form onSubmit={addBrand} className="flex items-center gap-3 mb-6 p-4 border border-dashed border-primary/40 bg-primary/5">
            <input
              autoFocus
              value={newBrandName}
              onChange={e => setNewBrandName(e.target.value)}
              placeholder="Brand name *"
              className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <Button type="submit" size="sm" disabled={createBrandMutation.isPending}>
              {createBrandMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </Button>
            <button type="button" onClick={() => setAddingBrand(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="space-y-3">
            {(data ?? []).map(brand => (
              <BrandRow key={brand.id} brand={brand as Brand} onRefresh={refresh} />
            ))}
            {(data ?? []).length === 0 && (
              <div className="py-20 text-center border border-dashed border-border rounded text-muted-foreground">
                No car brands yet. Click "Add Brand" to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
