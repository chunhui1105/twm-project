import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategoryId = searchParams.get('category') ? parseInt(searchParams.get('category')!) : null;

  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: categories } = useGetCategories();
  
  const { data: productsData, isLoading } = useGetProducts({
    categoryId: categoryId || undefined,
    search: debouncedSearch || undefined,
  });

  return (
    <Layout>
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">THE CATALOG</h1>
          <p className="text-muted-foreground max-w-2xl">Browse our complete selection of high-performance parts and premium accessories.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search gear..." 
                className="w-full bg-card border border-border py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary font-mono"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider uppercase text-sm mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setCategoryId(null)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${categoryId === null ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                All Gear
              </button>
              {categories?.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${categoryId === cat.id ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  {cat.name} <span className="float-right opacity-50">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground border-b border-border pb-4">
            <div>
              Showing {productsData?.products.length || 0} results
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <select className="bg-transparent border-none outline-none cursor-pointer focus:text-primary font-mono">
                <option value="featured" className="bg-card text-foreground">Featured</option>
                <option value="newest" className="bg-card text-foreground">Newest</option>
                <option value="price-asc" className="bg-card text-foreground">Price: Low to High</option>
                <option value="price-desc" className="bg-card text-foreground">Price: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-square w-full bg-secondary" />
                  <Skeleton className="h-4 w-2/3 bg-secondary" />
                  <Skeleton className="h-4 w-1/3 bg-secondary" />
                </div>
              ))}
            </div>
          ) : productsData?.products.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border bg-card/50">
              <p className="text-muted-foreground mb-4">No gear found matching your criteria.</p>
              <button 
                onClick={() => { setCategoryId(null); setSearch(""); }}
                className="text-primary hover:underline uppercase text-sm font-bold tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsData?.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
