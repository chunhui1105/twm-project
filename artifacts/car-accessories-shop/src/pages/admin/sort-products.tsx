import { AdminLayout } from "@/components/admin-layout";
import { useGetCategories, useGetProducts, getGetProductsQueryKey } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GripVertical, Save, ChevronDown } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ProductItem = {
  id: number;
  name: string;
  imageUrl: string | null;
  sku: string | null;
  brand: string | null;
  sortOrder: number;
};

function SortableRow({ product, index }: { product: ProductItem; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-border transition-colors ${isDragging ? "bg-primary/5 shadow-lg" : "bg-card hover:bg-secondary/20"}`}
    >
      <td className="px-3 py-3 w-10 text-center">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-2 py-3 w-10 text-center text-xs font-mono text-muted-foreground">
        {index + 1}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-background border border-border overflow-hidden flex-shrink-0">
            {product.imageUrl
              ? <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-muted" />
            }
          </div>
          <div>
            <div className="font-medium text-sm leading-tight">{product.name}</div>
            {(product.brand || product.sku) && (
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {[product.brand, product.sku].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function AdminSortProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: categories } = useGetCategories();
  const { data: productsData, isLoading } = useGetProducts(
    { categoryId: selectedCategoryId ?? undefined, limit: 200 },
    { query: { enabled: selectedCategoryId !== null } }
  );

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (productsData?.products) {
      const sorted = [...productsData.products].sort((a, b) => {
        const aOrder = (a as unknown as ProductItem).sortOrder ?? 0;
        const bOrder = (b as unknown as ProductItem).sortOrder ?? 0;
        return aOrder - bOrder || a.id - b.id;
      });
      setItems(sorted.map(p => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl ?? null,
        sku: p.sku ?? null,
        brand: p.brand ?? null,
        sortOrder: (p as unknown as ProductItem).sortOrder ?? 0,
      })));
      setIsDirty(false);
    }
  }, [productsData]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(i => i.id === active.id);
        const newIndex = prev.findIndex(i => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
      setIsDirty(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = items.map((item, index) => ({ id: item.id, sortOrder: index }));
      const res = await fetch(`/api/products/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save order");
      toast({ title: "Order saved" });
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
    } catch {
      toast({ title: "Failed to save order", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories?.filter(c => c.name !== "Find By Car Model") ?? [];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase mb-1">Sort Products</h1>
            <p className="text-muted-foreground text-sm">
              Drag rows to reorder how products appear in the catalog for each category.
            </p>
          </div>
          {isDirty && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Order
            </button>
          )}
        </div>

        {/* Category picker */}
        <div className="bg-card border border-border p-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
            Select Category
          </label>
          <div className="relative max-w-xs">
            <select
              value={selectedCategoryId ?? ""}
              onChange={e => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
              className="w-full appearance-none bg-background border border-border py-2 pl-3 pr-8 text-sm focus:outline-none focus:border-primary"
            >
              <option value="">— Choose a category —</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.productCount ?? 0})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Product list */}
        {selectedCategoryId === null ? (
          <div className="bg-card border border-border p-12 text-center text-muted-foreground font-mono text-sm">
            Select a category above to start sorting
          </div>
        ) : isLoading ? (
          <div className="bg-card border border-border p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center text-muted-foreground font-mono text-sm">
            No products in this category
          </div>
        ) : (
          <div className="bg-card border border-border">
            <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {items.length} product{items.length !== 1 ? "s" : ""} — drag to reorder
              </span>
              {isDirty && (
                <span className="text-xs text-amber-600 font-mono font-medium">Unsaved changes</span>
              )}
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <table className="w-full text-sm">
                  <tbody>
                    {items.map((product, index) => (
                      <SortableRow key={product.id} product={product} index={index} />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
            {isDirty && (
              <div className="px-4 py-3 border-t border-border bg-amber-50/50 flex items-center justify-between">
                <span className="text-xs text-amber-700 font-mono">You have unsaved changes</span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
