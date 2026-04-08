import { AdminLayout } from "@/components/admin-layout";
import { useGetProducts, useDeleteProduct, useUpdateProduct, useGetCategories, useGetCarBrands, getGetProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Search, Loader2, Star, Tag, Check, X, Car } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProductBulkActions } from "@/components/product-bulk-actions";

function InlineCategoryEditor({
  productId,
  currentCategoryId,
  currentCategoryName,
  categories,
  onSave,
  isPending,
}: {
  productId: number;
  currentCategoryId: number | null;
  currentCategoryName: string | null;
  categories: { id: number; name: string }[];
  onSave: (productId: number, categoryId: number | null) => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(currentCategoryId ?? null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(currentCategoryId ?? null);
  }, [currentCategoryId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSave = () => {
    onSave(productId, selected);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelected(currentCategoryId ?? null);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={isPending}
        title="Click to change category"
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors group
          ${currentCategoryId
            ? "bg-primary/8 text-primary border border-primary/20 hover:border-primary/50"
            : "text-muted-foreground border border-dashed border-border hover:border-primary/40 hover:text-primary"
          }`}
      >
        <Tag className="w-3 h-3 flex-shrink-0" />
        <span className="uppercase tracking-wide font-medium">
          {currentCategoryName ?? "Unassigned"}
        </span>
        {isPending && <Loader2 className="w-3 h-3 animate-spin ml-0.5" />}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-56 bg-card border border-border shadow-lg rounded overflow-hidden">
          <div className="p-1.5 border-b border-border bg-secondary/30">
            <p className="text-xs text-muted-foreground font-mono px-1">Assign category</p>
          </div>
          <div className="max-h-52 overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex items-center justify-between
                ${selected === null ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              <span className="italic">Unassigned</span>
              {selected === null && <Check className="w-3.5 h-3.5" />}
            </button>
            {categories.filter(c => c.name !== "Find By Car Model").map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex items-center justify-between
                  ${selected === cat.id ? "text-primary font-medium bg-primary/5" : "text-foreground"}`}
              >
                <span>{cat.name}</span>
                {selected === cat.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 p-2 border-t border-border bg-secondary/20">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 font-medium"
            >
              <Check className="w-3 h-3" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-border rounded hover:bg-muted text-muted-foreground"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type CarBrand = { id: number; name: string; models: { id: number; name: string }[] };

function InlineCarEditor({
  productId,
  currentCarBrandIds,
  currentCarModelIds,
  carBrands,
  onSave,
  isPending,
}: {
  productId: number;
  currentCarBrandIds: number[];
  currentCarModelIds: number[];
  carBrands: CarBrand[];
  onSave: (productId: number, brandIds: number[], modelIds: number[]) => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [brandIds, setBrandIds] = useState<number[]>(currentCarBrandIds);
  const [modelIds, setModelIds] = useState<number[]>(currentCarModelIds);
  const [expandedBrand, setExpandedBrand] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrandIds(currentCarBrandIds);
    setModelIds(currentCarModelIds);
  }, [currentCarBrandIds, currentCarModelIds, open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleBrand = (id: number) => {
    const removing = brandIds.includes(id);
    if (removing) {
      setBrandIds(prev => prev.filter(b => b !== id));
      const brand = carBrands.find(b => b.id === id);
      const brandModelIds = brand?.models.map(m => m.id) ?? [];
      setModelIds(prev => prev.filter(m => !brandModelIds.includes(m)));
      if (expandedBrand === id) setExpandedBrand(null);
    } else {
      setBrandIds(prev => [...prev, id]);
      setExpandedBrand(id);
    }
  };

  const toggleModel = (id: number) => {
    setModelIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const selectAllModels = (brand: CarBrand) => {
    setModelIds(prev => [...new Set([...prev, ...brand.models.map(m => m.id)])]);
  };

  const clearAllModels = (brand: CarBrand) => {
    const ids = brand.models.map(m => m.id);
    setModelIds(prev => prev.filter(m => !ids.includes(m)));
  };

  const handleSave = () => {
    onSave(productId, brandIds, modelIds);
    setOpen(false);
  };

  const handleCancel = () => {
    setBrandIds(currentCarBrandIds);
    setModelIds(currentCarModelIds);
    setOpen(false);
  };

  const totalModels = currentCarModelIds.length;
  const totalBrands = currentCarBrandIds.length;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        disabled={isPending}
        title="Click to set compatible car brands & models"
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors
          ${totalBrands > 0
            ? "bg-primary/8 text-primary border border-primary/20 hover:border-primary/50"
            : "text-muted-foreground border border-dashed border-border hover:border-primary/40 hover:text-primary"
          }`}
      >
        <Car className="w-3 h-3 flex-shrink-0" />
        <span className="font-medium">
          {totalBrands > 0
            ? `${totalBrands} brand${totalBrands > 1 ? "s" : ""}${totalModels > 0 ? `, ${totalModels} model${totalModels > 1 ? "s" : ""}` : ""}`
            : "No cars set"
          }
        </span>
        {isPending && <Loader2 className="w-3 h-3 animate-spin ml-0.5" />}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-80 bg-card border border-border shadow-xl rounded overflow-hidden">
          <div className="p-2 border-b border-border bg-secondary/30 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-mono px-1">Compatible Cars</p>
            <span className="text-xs text-primary font-mono">
              {brandIds.length} brand{brandIds.length !== 1 ? "s" : ""}, {modelIds.length} model{modelIds.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {carBrands.map(brand => {
              const isChecked = brandIds.includes(brand.id);
              const isExpanded = expandedBrand === brand.id && isChecked;
              const selectedModelsCount = brand.models.filter(m => modelIds.includes(m.id)).length;

              return (
                <div key={brand.id}>
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-secondary/30 transition-colors">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrand(brand.id)}
                        className="w-3.5 h-3.5 accent-primary"
                      />
                      <span className={`text-sm font-medium ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                        {brand.name}
                      </span>
                      {isChecked && selectedModelsCount > 0 && (
                        <span className="text-xs text-primary font-mono">({selectedModelsCount})</span>
                      )}
                    </label>
                    {isChecked && brand.models.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpandedBrand(isExpanded ? null : brand.id)}
                        className="text-xs text-muted-foreground hover:text-primary font-mono px-1"
                      >
                        {isExpanded ? "▲" : "▼"}
                      </button>
                    )}
                  </div>

                  {isExpanded && brand.models.length > 0 && (
                    <div className="bg-secondary/20 px-4 pb-3 pt-1">
                      <div className="flex gap-2 mb-2">
                        <button type="button" onClick={() => selectAllModels(brand)} className="text-xs text-primary hover:underline font-mono">All</button>
                        <span className="text-muted-foreground text-xs">·</span>
                        <button type="button" onClick={() => clearAllModels(brand)} className="text-xs text-muted-foreground hover:text-foreground hover:underline font-mono">None</button>
                      </div>
                      {/* Group models by series (text before first parenthesis) */}
                      {(() => {
                        const seriesMap = new Map<string, typeof brand.models>();
                        for (const m of brand.models) {
                          const series = (m.name.match(/^([^(]+)/) ?? [, m.name])[1]!.trim();
                          if (!seriesMap.has(series)) seriesMap.set(series, []);
                          seriesMap.get(series)!.push(m);
                        }
                        return (
                          <div className="max-h-52 overflow-y-auto pr-1 space-y-2">
                            {[...seriesMap.entries()].map(([series, models]) => {
                              const isGrouped = models.length > 1;
                              const groupIds = models.map(m => m.id);
                              const allChecked = groupIds.every(id => modelIds.includes(id));
                              const someChecked = groupIds.some(id => modelIds.includes(id));
                              return (
                                <div key={series}>
                                  {isGrouped && (
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <input
                                        type="checkbox"
                                        checked={allChecked}
                                        ref={el => { if (el) el.indeterminate = someChecked && !allChecked; }}
                                        onChange={() => {
                                          if (allChecked) {
                                            setModelIds(prev => prev.filter(id => !groupIds.includes(id)));
                                          } else {
                                            setModelIds(prev => [...new Set([...prev, ...groupIds])]);
                                          }
                                        }}
                                        className="w-3 h-3 accent-primary flex-shrink-0"
                                      />
                                      <span className="text-xs font-semibold text-foreground">{series}</span>
                                      <span className="text-xs text-muted-foreground font-mono">({models.length})</span>
                                    </div>
                                  )}
                                  <div className={`grid grid-cols-2 gap-1 ${isGrouped ? "pl-4" : ""}`}>
                                    {models.map(model => (
                                      <label key={model.id} className="flex items-center gap-1.5 cursor-pointer group">
                                        <input
                                          type="checkbox"
                                          checked={modelIds.includes(model.id)}
                                          onChange={() => toggleModel(model.id)}
                                          className="w-3 h-3 accent-primary flex-shrink-0"
                                        />
                                        <span className="text-xs group-hover:text-primary transition-colors truncate">
                                          {isGrouped
                                            ? (model.name.replace(series, "").trim().replace(/^\(/, "").replace(/\)$/, "").trim() || model.name)
                                            : model.name}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1.5 p-2 border-t border-border bg-secondary/20">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 font-medium"
            >
              <Check className="w-3 h-3" /> Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-border rounded hover:bg-muted text-muted-foreground"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [updatingCategoryFor, setUpdatingCategoryFor] = useState<number | null>(null);
  const [updatingCarsFor, setUpdatingCarsFor] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useGetProducts({ search: debouncedSearch || undefined, limit: 50 });
  const { data: categories } = useGetCategories();
  const { data: carBrands } = useGetCarBrands();
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Confirm deletion of this product?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Product deleted", variant: "destructive" });
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      }
    });
  };

  const handleToggleFeatured = (id: number, current: boolean) => {
    updateMutation.mutate(
      { id, data: { featured: !current } },
      {
        onSuccess: () => {
          toast({ title: current ? "Removed from Featured Gear" : "Added to Featured Gear" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
        },
        onError: () => toast({ title: "Failed to update", variant: "destructive" }),
      }
    );
  };

  const handleCategoryChange = (productId: number, categoryId: number | null) => {
    setUpdatingCategoryFor(productId);
    const product = data?.products.find(p => p.id === productId);
    const oldCategoryId = product?.categoryId ?? null;
    const currentCategoryIds = product?.categoryIds ?? [];

    let newCategoryIds: number[];
    if (categoryId === null) {
      newCategoryIds = currentCategoryIds.filter(id => id !== oldCategoryId);
    } else if (oldCategoryId && currentCategoryIds.includes(oldCategoryId)) {
      newCategoryIds = currentCategoryIds.map(id => id === oldCategoryId ? categoryId : id);
      if (!newCategoryIds.includes(categoryId)) newCategoryIds = [categoryId, ...newCategoryIds];
    } else {
      newCategoryIds = [...new Set([categoryId, ...currentCategoryIds])];
    }

    updateMutation.mutate(
      { id: productId, data: { categoryId: categoryId ?? undefined, categoryIds: newCategoryIds } },
      {
        onSuccess: () => {
          toast({ title: "Category updated" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          setUpdatingCategoryFor(null);
        },
        onError: () => {
          toast({ title: "Failed to update category", variant: "destructive" });
          setUpdatingCategoryFor(null);
        },
      }
    );
  };

  const handleCarsChange = (productId: number, brandIds: number[], modelIds: number[]) => {
    setUpdatingCarsFor(productId);
    updateMutation.mutate(
      { id: productId, data: { carBrandIds: brandIds, carModelIds: modelIds } as any },
      {
        onSuccess: () => {
          toast({ title: "Compatible cars updated" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          setUpdatingCarsFor(null);
        },
        onError: () => {
          toast({ title: "Failed to update", variant: "destructive" });
          setUpdatingCarsFor(null);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase mb-1">Products</h1>
            <p className="text-muted-foreground text-sm">
              Click the <Star className="inline w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> star to feature.
              Click <Tag className="inline w-3.5 h-3.5 text-primary" /> for category or <Car className="inline w-3.5 h-3.5 text-primary" /> for compatible cars.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="border border-border bg-card p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Bulk Actions</div>
          <ProductBulkActions onImportDone={() => queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() })} />
        </div>
      </div>

      <div className="bg-card border border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-background border border-border py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-4 text-center w-12">Featured</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Compatible Cars</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : data?.products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-mono">
                    No products found
                  </td>
                </tr>
              ) : (
                data?.products.map((product) => (
                  <tr key={product.id} className={`hover:bg-secondary/20 transition-colors ${product.featured ? "bg-yellow-50/40" : ""}`}>
                    {/* Featured star toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        disabled={updateMutation.isPending}
                        title={product.featured ? "Remove from Featured Gear" : "Add to Featured Gear"}
                        className="transition-transform hover:scale-110 disabled:opacity-40"
                      >
                        <Star
                          className={`w-5 h-5 ${product.featured ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      </button>
                    </td>

                    {/* Product name + image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background border border-border overflow-hidden flex-shrink-0 hidden sm:block">
                          {product.imageUrl && <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                          {product.sku && <div className="text-xs text-muted-foreground font-mono">{product.sku}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Inline category editor */}
                    <td className="px-4 py-4">
                      <InlineCategoryEditor
                        productId={product.id}
                        currentCategoryId={product.categoryId ?? null}
                        currentCategoryName={product.categoryName ?? null}
                        categories={categories ?? []}
                        onSave={handleCategoryChange}
                        isPending={updatingCategoryFor === product.id}
                      />
                    </td>

                    {/* Inline car brand/model editor */}
                    <td className="px-4 py-4">
                      <InlineCarEditor
                        productId={product.id}
                        currentCarBrandIds={(product as any).carBrandIds ?? []}
                        currentCarModelIds={(product as any).carModelIds ?? []}
                        carBrands={(carBrands as CarBrand[]) ?? []}
                        onSave={handleCarsChange}
                        isPending={updatingCarsFor === product.id}
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors bg-background border border-border"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-background border border-border disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 border-t border-border bg-secondary/20 text-xs text-muted-foreground font-mono flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Starred = shown in <strong>Featured Gear</strong> on homepage
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" />
            Click to reassign category
          </span>
          <span className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-primary" />
            Click to set compatible car brands &amp; models
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
