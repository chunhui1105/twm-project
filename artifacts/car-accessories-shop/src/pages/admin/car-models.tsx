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
  X, Check, Loader2, Car, Layers, Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SingleImageUpload } from "@/components/image-upload-with-crop";

type Model = { id: number; brandId: number; name: string; series: string; years: string; imageUrl?: string | null; sortOrder: number };
type Brand = { id: number; name: string; origin: string; sortOrder: number; models: Model[] };

function ModelRow({ model, brandId, onRefresh }: { model: Model; brandId: number; onRefresh: () => void }) {
  const updateMutation = useUpdateCarModel();
  const deleteMutation = useDeleteCarModel();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(model.name);
  const [series, setSeries] = useState(model.series);
  const [years, setYears] = useState(model.years);
  const [imageUrl, setImageUrl] = useState(model.imageUrl ?? "");

  const save = async () => {
    try {
      await updateMutation.mutateAsync({ brandId, id: model.id, data: { name, series, years, imageUrl: imageUrl || null } });
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
      <div className="flex flex-col gap-2 p-3 border border-primary/30 bg-primary/5 rounded">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex-shrink-0 border border-border bg-background rounded overflow-hidden">
            <SingleImageUpload compact value={imageUrl} onChange={setImageUrl} />
          </div>
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
            className="w-32 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary font-mono"
            placeholder="e.g. 2005–present"
          />
        </div>
        <div className="flex items-center gap-2 pl-12">
          <Layers className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <input
            value={series}
            onChange={e => setSeries(e.target.value)}
            className="flex-1 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary font-mono"
            placeholder="Series name (e.g. Saga, Vios, Corolla Altis)"
          />
          <button type="button" onClick={save} disabled={updateMutation.isPending} className="text-primary hover:text-primary/80 disabled:opacity-50">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button type="button" onClick={() => { setEditing(false); setName(model.name); setSeries(model.series); setYears(model.years); setImageUrl(model.imageUrl ?? ""); }} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/50 group">
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

function AddModelForm({ brandId, onRefresh, onClose }: { brandId: number; onRefresh: () => void; onClose: () => void; defaultSeries?: string }) {
  const createMutation = useCreateCarModel();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [series, setSeries] = useState("");
  const [years, setYears] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createMutation.mutateAsync({ brandId, data: { name, series, years } });
      onRefresh();
      setName(""); setSeries(""); setYears("");
      toast({ title: "Model added" });
      onClose();
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 p-3 border border-dashed border-primary/40 rounded bg-primary/5 mt-2">
      <div className="flex items-center gap-2">
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
          className="w-32 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary font-mono"
          placeholder="e.g. 2008–present"
        />
      </div>
      <div className="flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <input
          value={series}
          onChange={e => setSeries(e.target.value)}
          className="flex-1 bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary font-mono"
          placeholder="Series name (e.g. Saga, Vios, Corolla Altis) — groups models together"
        />
        <button type="submit" disabled={createMutation.isPending} className="text-primary hover:text-primary/80 disabled:opacity-50">
          {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
    </form>
  );
}

function SeriesGroup({
  series,
  models,
  brandId,
  onRefresh,
}: {
  series: string;
  models: Model[];
  brandId: number;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  if (!series) {
    return (
      <div className="space-y-1">
        {models.map(m => <ModelRow key={m.id} model={m} brandId={brandId} onRefresh={onRefresh} />)}
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/40 hover:bg-secondary/60 transition-colors text-left"
      >
        {expanded
          ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        }
        <Layers className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
        <span className="text-sm font-semibold">{series}</span>
        <span className="text-xs text-muted-foreground font-mono ml-1">{models.length} model{models.length !== 1 ? "s" : ""}</span>
      </button>
      {expanded && (
        <div className="px-3 py-2 space-y-1">
          {models.map(m => <ModelRow key={m.id} model={m} brandId={brandId} onRefresh={onRefresh} />)}
        </div>
      )}
    </div>
  );
}

function detectSeries(modelName: string, allNames: string[]): string {
  if (modelName.includes("(")) {
    return modelName.split("(")[0].trim();
  }
  const words = modelName.split(/\s+/);
  // Try longest prefix that matches at least one other model
  for (let len = words.length - 1; len >= 1; len--) {
    const prefix = words.slice(0, len).join(" ");
    const hasMatch = allNames.some(n => n !== modelName && n.startsWith(prefix + " "));
    if (hasMatch) return prefix;
  }
  return modelName;
}

function BrandRow({ brand, onRefresh }: { brand: Brand; onRefresh: () => void }) {
  const updateMutation = useUpdateCarBrand();
  const updateModelMutation = useUpdateCarModel();
  const deleteMutation = useDeleteCarBrand();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [editingBrand, setEditingBrand] = useState(false);
  const [addingModel, setAddingModel] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [bName, setBName] = useState(brand.name);

  const autoDetectSeries = async () => {
    const ungrouped = brand.models.filter(m => !m.series?.trim());
    if (ungrouped.length === 0) {
      toast({ title: "All models already have a series set" });
      return;
    }
    setAutoDetecting(true);
    try {
      const allNames = brand.models.map(m => m.name);
      await Promise.all(
        ungrouped.map(m => {
          const series = detectSeries(m.name, allNames);
          return updateModelMutation.mutateAsync({ brandId: brand.id, id: m.id, data: { series } });
        })
      );
      onRefresh();
      toast({ title: `Series auto-detected for ${ungrouped.length} model${ungrouped.length !== 1 ? "s" : ""}` });
    } catch {
      toast({ title: "Error auto-detecting series", variant: "destructive" });
    } finally {
      setAutoDetecting(false);
    }
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

  // Group models by series; models with empty series go in an "" group (shown last, ungrouped)
  const seriesMap = new Map<string, Model[]>();
  for (const m of brand.models) {
    const key = m.series?.trim() ?? "";
    if (!seriesMap.has(key)) seriesMap.set(key, []);
    seriesMap.get(key)!.push(m);
  }
  // Named series first, then ungrouped
  const namedGroups = [...seriesMap.entries()].filter(([s]) => s !== "").sort(([a], [b]) => a.localeCompare(b));
  const ungrouped = seriesMap.get("") ?? [];

  return (
    <div className="border border-border bg-card rounded overflow-hidden">
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
            <span className="text-xs text-muted-foreground">
              {brand.models.length} model{brand.models.length !== 1 ? "s" : ""}
              {namedGroups.length > 0 && ` · ${namedGroups.length} series`}
            </span>
          </button>
          <button onClick={() => setEditingBrand(true)} className="text-muted-foreground hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={removeBrand} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-2">
          {/* Toolbar */}
          {brand.models.length > 0 && (
            <div className="flex items-center justify-end mb-1">
              <button
                type="button"
                onClick={autoDetectSeries}
                disabled={autoDetecting}
                title="Auto-detect series from model names"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary/40 rounded px-2 py-1 transition-colors disabled:opacity-50"
              >
                {autoDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                Auto-detect series
              </button>
            </div>
          )}

          {/* Named series groups */}
          {namedGroups.map(([series, models]) => (
            <SeriesGroup key={series} series={series} models={models} brandId={brand.id} onRefresh={onRefresh} />
          ))}

          {/* Ungrouped models */}
          {ungrouped.length > 0 && (
            <div>
              {namedGroups.length > 0 && (
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2 mt-3">
                  Ungrouped ({ungrouped.length})
                </p>
              )}
              <div className="space-y-1">
                {ungrouped.map(m => <ModelRow key={m.id} model={m} brandId={brand.id} onRefresh={onRefresh} />)}
              </div>
            </div>
          )}

          {brand.models.length === 0 && !addingModel && (
            <p className="text-xs text-muted-foreground italic py-2">No models yet — click "Add model" to get started.</p>
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
  const { data, isLoading } = useGetCarBrands();
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
        <p className="text-sm text-muted-foreground mb-2">
          Manage car brands and their models. Use the <strong>Series</strong> field to group related variants together.
        </p>
        <div className="flex items-center gap-2 bg-secondary/40 border border-border rounded px-3 py-2 text-xs text-muted-foreground mb-8">
          <Layers className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span>Set the <strong>Series</strong> name when adding or editing a model to group variants together — e.g. set <em>"Saga"</em> for Saga BLM, Saga FLX, and Saga VVT so they appear under one header.</span>
        </div>

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
