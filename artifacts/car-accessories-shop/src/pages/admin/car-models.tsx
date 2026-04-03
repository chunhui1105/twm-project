import { AdminLayout } from "@/components/admin-layout";
import {
  useGetCarBrands,
  useCreateCarBrand,
  useUpdateCarBrand,
  useDeleteCarBrand,
  useCreateCarModel,
  useUpdateCarModel,
  useDeleteCarModel,
  getGetCarBrandsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  ChevronDown, ChevronRight, Plus, Pencil, Trash2,
  X, Check, Loader2, Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Model = { id: number; brandId: number; name: string; years: string; sortOrder: number };
type Brand = { id: number; name: string; origin: string; sortOrder: number; models: Model[] };

const ORIGINS = ["Malaysian", "Japanese", "Korean", "European", "American", "Other"];

function ModelRow({ model, brandId, onRefresh }: { model: Model; brandId: number; onRefresh: () => void }) {
  const updateMutation = useUpdateCarModel();
  const deleteMutation = useDeleteCarModel();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(model.name);
  const [years, setYears] = useState(model.years);

  const save = async () => {
    try {
      await updateMutation.mutateAsync({ brandId, id: model.id, data: { name, years } });
      onRefresh();
      setEditing(false);
      toast({ title: "Saved" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
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
        <button onClick={save} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
        <button onClick={() => { setEditing(false); setName(model.name); setYears(model.years); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/50 group">
      <span className="flex-1 text-sm font-medium">{model.name}</span>
      {model.years && <span className="text-xs text-muted-foreground font-mono">{model.years}</span>}
      <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity"><Pencil className="w-3.5 h-3.5" /></button>
      <button onClick={remove} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
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
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [editingBrand, setEditingBrand] = useState(false);
  const [addingModel, setAddingModel] = useState(false);
  const [bName, setBName] = useState(brand.name);
  const [bOrigin, setBOrigin] = useState(brand.origin);

  const saveBrand = async () => {
    try {
      await updateMutation.mutateAsync({ id: brand.id, data: { name: bName, origin: bOrigin } });
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
          <select
            value={bOrigin}
            onChange={e => setBOrigin(e.target.value)}
            className="bg-background border border-border px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
          >
            {ORIGINS.map(o => <option key={o}>{o}</option>)}
          </select>
          <button onClick={saveBrand} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
          <button onClick={() => { setEditingBrand(false); setBName(brand.name); setBOrigin(brand.origin); }} className="text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-3 flex-1 text-left group">
            {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <span className="font-bold tracking-tight">{brand.name}</span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 border border-border rounded-full font-mono">{brand.origin}</span>
            <span className="text-xs text-muted-foreground">{brand.models.length} models</span>
          </button>
          <button onClick={() => setEditingBrand(true)} className="text-muted-foreground hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={removeBrand} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Models */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-1">
          {brand.models.map(m => (
            <ModelRow key={m.id} model={m} brandId={brand.id} onRefresh={onRefresh} />
          ))}
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
  const [newBrandOrigin, setNewBrandOrigin] = useState("Japanese");

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetCarBrandsQueryKey() });

  const addBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      await createBrandMutation.mutateAsync({ data: { name: newBrandName, origin: newBrandOrigin } });
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
            <select
              value={newBrandOrigin}
              onChange={e => setNewBrandOrigin(e.target.value)}
              className="bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              {ORIGINS.map(o => <option key={o}>{o}</option>)}
            </select>
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
