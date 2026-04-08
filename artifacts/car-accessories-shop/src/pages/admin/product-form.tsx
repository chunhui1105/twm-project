import { AdminLayout } from "@/components/admin-layout";
import { useGetProduct, useCreateProduct, useUpdateProduct, useGetCategories, useGetCarBrands, getGetProductsQueryKey, getGetProductQueryKey } from "@workspace/api-client-react";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { GalleryImageUpload, VideoUpload } from "@/components/image-upload-with-crop";

type Variation = { name: string; options: string[] };

export default function AdminProductForm() {
  const [match, params] = useRoute("/admin/products/:id/edit");
  const isEdit = match && params?.id !== "new";
  const productId = isEdit ? parseInt(params.id) : 0;

  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading: loadingProduct } = useGetProduct(productId, { 
    query: { enabled: isEdit } 
  });
  const { data: categories } = useGetCategories();
  const { data: carBrands } = useGetCarBrands();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    imageUrls: [] as string[],
    videoUrl: "",
    categoryId: 0,
    categoryIds: [] as number[],
    carBrandIds: [] as number[],
    carModelIds: [] as number[],
    variations: [] as Variation[],
    brand: "",
    sku: "",
    stock: 0,
    featured: false,
    tags: [] as string[]
  });

  const [variationOptionInputs, setVariationOptionInputs] = useState<string[]>([]);

  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        imageUrls: product.imageUrls || [],
        videoUrl: product.videoUrl || "",
        categoryId: product.categoryId || 0,
        categoryIds: product.categoryIds || [],
        carBrandIds: product.carBrandIds || [],
        carModelIds: product.carModelIds || [],
        variations: (product.variations as Variation[]) || [],
        brand: product.brand || "",
        sku: product.sku || "",
        stock: product.stock,
        featured: product.featured,
        tags: product.tags || []
      });
      setTagsInput((product.tags || []).join(", "));
      setVariationOptionInputs(((product.variations as Variation[]) || []).map(() => ""));
    }
  }, [isEdit, product]);

  const addVariation = () => {
    setForm(prev => ({ ...prev, variations: [...prev.variations, { name: "", options: [] }] }));
    setVariationOptionInputs(prev => [...prev, ""]);
  };

  const removeVariation = (idx: number) => {
    setForm(prev => ({ ...prev, variations: prev.variations.filter((_, i) => i !== idx) }));
    setVariationOptionInputs(prev => prev.filter((_, i) => i !== idx));
  };

  const updateVariationName = (idx: number, name: string) => {
    setForm(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => i === idx ? { ...v, name } : v)
    }));
  };

  const addOptionToVariation = (idx: number) => {
    const raw = variationOptionInputs[idx]?.trim();
    if (!raw) return;
    const newOptions = raw.split(",").map(s => s.trim()).filter(Boolean);
    setForm(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === idx ? { ...v, options: [...v.options, ...newOptions.filter(o => !v.options.includes(o))] } : v
      )
    }));
    setVariationOptionInputs(prev => prev.map((s, i) => i === idx ? "" : s));
  };

  const removeOption = (varIdx: number, optIdx: number) => {
    setForm(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === varIdx ? { ...v, options: v.options.filter((_, j) => j !== optIdx) } : v
      )
    }));
  };

  const toggleCategory = (id: number) => {
    setForm(prev => {
      const ids = prev.categoryIds.includes(id)
        ? prev.categoryIds.filter(c => c !== id)
        : [...prev.categoryIds, id];
      return {
        ...prev,
        categoryIds: ids,
        categoryId: ids[0] ?? 0
      };
    });
  };

  const toggleCarBrand = (id: number) => {
    setForm(prev => {
      const removing = prev.carBrandIds.includes(id);
      const newBrandIds = removing
        ? prev.carBrandIds.filter(b => b !== id)
        : [...prev.carBrandIds, id];
      if (removing) {
        const brand = carBrands?.find(b => b.id === id);
        const brandModelIds = brand?.models.map(m => m.id) ?? [];
        return {
          ...prev,
          carBrandIds: newBrandIds,
          carModelIds: prev.carModelIds.filter(m => !brandModelIds.includes(m))
        };
      }
      return { ...prev, carBrandIds: newBrandIds };
    });
  };

  const toggleCarModel = (id: number) => {
    setForm(prev => ({
      ...prev,
      carModelIds: prev.carModelIds.includes(id)
        ? prev.carModelIds.filter(m => m !== id)
        : [...prev.carModelIds, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...form,
      imageUrl: form.imageUrls[0] ?? null,
      videoUrl: form.videoUrl || null,
      categoryId: form.categoryIds[0] ?? null,
      categoryIds: form.categoryIds,
      carBrandIds: form.carBrandIds,
      carModelIds: form.carModelIds,
      variations: form.variations.filter(v => v.name.trim()),
      compareAtPrice: form.compareAtPrice || null,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean)
    };

    if (isEdit) {
      updateMutation.mutate({ id: productId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Gear updated successfully" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(productId) });
          setLocation("/admin/products");
        }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "New gear added successfully" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          setLocation("/admin/products");
        }
      });
    }
  };

  if (isEdit && loadingProduct) return <AdminLayout><div className="p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-8 pb-4 border-b border-border">
          {isEdit ? 'Modify Gear Specs' : 'Register New Gear'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Product Name *</label>
              <input 
                required type="text" 
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Description</label>
              <textarea 
                rows={4}
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary resize-none" 
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Images
                <span className="ml-2 text-muted-foreground font-normal normal-case tracking-normal">
                  (up to 7 — first image is the cover)
                  {form.imageUrls.length > 0 && <span className="ml-2 text-primary font-mono">{form.imageUrls.length}/7</span>}
                </span>
              </label>
              <GalleryImageUpload
                values={form.imageUrls}
                onChange={urls => setForm(prev => ({ ...prev, imageUrls: urls }))}
                maxImages={7}
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Product Video
                <span className="ml-2 text-muted-foreground font-normal normal-case tracking-normal">(optional — shown first on product page)</span>
              </label>
              <VideoUpload
                value={form.videoUrl}
                onChange={url => setForm(prev => ({ ...prev, videoUrl: url }))}
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Categories
                {form.categoryIds.length > 0 && (
                  <span className="ml-2 text-primary">({form.categoryIds.length} selected)</span>
                )}
              </label>
              {categories && categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-border p-4 bg-background">
                  {categories.map(c => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.categoryIds.includes(c.id)}
                        onChange={() => toggleCategory(c.id)}
                        className="w-4 h-4 accent-primary bg-background border-border flex-shrink-0"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors truncate">{c.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No categories available — add them in Categories admin.</p>
              )}
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Compatible Car Brands
                {form.carBrandIds.length > 0 && (
                  <span className="ml-2 text-primary">({form.carBrandIds.length} selected)</span>
                )}
              </label>
              {carBrands && carBrands.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-border p-4 bg-background">
                  {carBrands.map(b => (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.carBrandIds.includes(b.id)}
                        onChange={() => toggleCarBrand(b.id)}
                        className="w-4 h-4 accent-primary bg-background border-border flex-shrink-0"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors truncate">{b.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No car brands available — add them in Car Models admin.</p>
              )}
            </div>

            {form.carBrandIds.length > 0 && carBrands && (
              <div className="space-y-3 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Compatible Car Models
                  {form.carModelIds.length > 0 && (
                    <span className="ml-2 text-primary">({form.carModelIds.length} selected)</span>
                  )}
                </label>
                <div className="border border-border bg-background divide-y divide-border">
                  {carBrands
                    .filter(b => form.carBrandIds.includes(b.id))
                    .map(brand => {
                      const seriesMap = new Map<string, typeof brand.models>();
                      for (const m of brand.models) {
                        const series = (m.name.match(/^([^(]+)/) ?? [, m.name])[1]!.trim();
                        if (!seriesMap.has(series)) seriesMap.set(series, []);
                        seriesMap.get(series)!.push(m);
                      }
                      const groups = [...seriesMap.entries()];
                      return (
                        <div key={brand.id} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold uppercase tracking-wider">{brand.name}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const brandModelIds = brand.models.map(m => m.id);
                                  setForm(prev => ({ ...prev, carModelIds: [...new Set([...prev.carModelIds, ...brandModelIds])] }));
                                }}
                                className="text-xs text-primary hover:underline font-mono"
                              >
                                All
                              </button>
                              <span className="text-muted-foreground text-xs">·</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const brandModelIds = brand.models.map(m => m.id);
                                  setForm(prev => ({ ...prev, carModelIds: prev.carModelIds.filter(m => !brandModelIds.includes(m)) }));
                                }}
                                className="text-xs text-muted-foreground hover:text-foreground hover:underline font-mono"
                              >
                                None
                              </button>
                            </div>
                          </div>
                          {brand.models.length > 0 ? (
                            <div className="space-y-3">
                              {groups.map(([series, models]) => {
                                const isGrouped = models.length > 1;
                                const allChecked = models.every(m => form.carModelIds.includes(m.id));
                                const someChecked = models.some(m => form.carModelIds.includes(m.id));
                                const groupIds = models.map(m => m.id);
                                return (
                                  <div key={series}>
                                    {isGrouped && (
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <input
                                          type="checkbox"
                                          checked={allChecked}
                                          ref={el => { if (el) el.indeterminate = someChecked && !allChecked; }}
                                          onChange={() => {
                                            setForm(prev => ({
                                              ...prev,
                                              carModelIds: allChecked
                                                ? prev.carModelIds.filter(m => !groupIds.includes(m))
                                                : [...new Set([...prev.carModelIds, ...groupIds])]
                                            }));
                                          }}
                                          className="w-4 h-4 accent-primary bg-background border-border flex-shrink-0"
                                        />
                                        <span className="text-sm font-semibold text-foreground">{series}</span>
                                        <span className="text-xs text-muted-foreground font-mono">({models.length})</span>
                                      </div>
                                    )}
                                    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${isGrouped ? "pl-6" : ""}`}>
                                      {models.map(model => (
                                        <label key={model.id} className="flex items-center gap-2 cursor-pointer group">
                                          <input
                                            type="checkbox"
                                            checked={form.carModelIds.includes(model.id)}
                                            onChange={() => toggleCarModel(model.id)}
                                            className="w-4 h-4 accent-primary bg-background border-border flex-shrink-0"
                                          />
                                          <span className="text-sm group-hover:text-primary transition-colors truncate">
                                            {isGrouped ? model.name.replace(series, "").trim().replace(/^\(/, "").replace(/\)$/, "").trim() || model.name : model.name}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No models added for this brand.</p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Product Variations
                  {form.variations.length > 0 && (
                    <span className="ml-2 text-primary">({form.variations.length})</span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={addVariation}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Variation
                </button>
              </div>
              {form.variations.length === 0 ? (
                <p className="text-sm text-muted-foreground italic border border-dashed border-border p-4">
                  No variations yet. Click "Add Variation" to create options like Color, Size, or Material.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.variations.map((variation, varIdx) => (
                    <div key={varIdx} className="border border-border bg-background p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Variation name (e.g. Color, Size, Material)"
                          value={variation.name}
                          onChange={e => updateVariationName(varIdx, e.target.value)}
                          className="flex-1 bg-secondary border border-border p-2.5 focus:outline-none focus:border-primary text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariation(varIdx)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {variation.options.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {variation.options.map((opt, optIdx) => (
                            <span key={optIdx} className="inline-flex items-center gap-1.5 bg-secondary border border-border px-2.5 py-1 text-sm font-mono">
                              {opt}
                              <button
                                type="button"
                                onClick={() => removeOption(varIdx, optIdx)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add option (comma-separate multiple: Red, Blue, Black)"
                          value={variationOptionInputs[varIdx] || ""}
                          onChange={e => setVariationOptionInputs(prev => prev.map((s, i) => i === varIdx ? e.target.value : s))}
                          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addOptionToVariation(varIdx); } }}
                          className="flex-1 bg-secondary border border-border p-2 focus:outline-none focus:border-primary text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => addOptionToVariation(varIdx)}
                          className="px-3 py-2 bg-secondary border border-border hover:border-primary text-sm font-mono transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Brand / Manufacturer</label>
              <input 
                type="text" 
                value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">SKU / Part Number</label>
              <input 
                type="text" 
                value={form.sku} onChange={e => setForm({...form, sku: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Tags (comma separated)</label>
              <input 
                type="text" 
                value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono text-sm" 
                placeholder="exterior, carbon, performance..."
              />
            </div>

            <div className="space-y-2 md:col-span-2 flex items-center gap-3 pt-4 border-t border-border">
              <input 
                type="checkbox" 
                id="featured"
                checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})}
                className="w-5 h-5 accent-primary bg-background border-border" 
              />
              <label htmlFor="featured" className="font-bold uppercase tracking-wider cursor-pointer">Featured Product</label>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-4">
            <Link 
              href="/admin/products"
              className="px-6 py-3 font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-primary text-primary-foreground font-bold uppercase tracking-widest px-8 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? "Processing..." : isEdit ? "Commit Changes" : "Deploy Gear"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
