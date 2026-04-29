import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Search, Filter, SlidersHorizontal, Car, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { Seo } from "@/components/seo";

const PAGE_SIZE = 16;

export default function Shop() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategorySlug = searchParams.get("category") ?? null;
  const initialSearch = searchParams.get("search") ?? "";
  const initialCarModelId = searchParams.get("carModelId") ? parseInt(searchParams.get("carModelId")!, 10) : null;
  const initialCarBrandId = searchParams.get("carBrandId") ? parseInt(searchParams.get("carBrandId")!, 10) : null;

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [carModelId] = useState<number | null>(initialCarModelId);
  const [carBrandId] = useState<number | null>(initialCarBrandId);
  const [page, setPage] = useState(1);
  const [jumpInput, setJumpInput] = useState("");

  // Scroll to top on page load
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: categories } = useGetCategories();

  // Resolve slug → id once categories are loaded
  useEffect(() => {
    if (!categories || !initialCategorySlug) return;
    const match = categories.find(c => c.slug === initialCategorySlug);
    if (match) setCategoryId(match.id);
  }, [categories, initialCategorySlug]);

  const { data: productsData, isLoading } = useGetProducts({
    categoryId: categoryId || undefined,
    search: debouncedSearch || undefined,
    carModelId: carModelId || undefined,
    carBrandId: carBrandId || undefined,
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  const totalPages = productsData?.totalPages ?? 1;
  const isCarFiltered = !!(carModelId || carBrandId);

  const handleCategoryClick = (cat: { id: number; slug: string }) => {
    if (cat.slug === "find-by-car") {
      navigate("/find-by-car");
      return;
    }
    setCategoryId(prev => prev === cat.id ? null : cat.id);
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <Layout>
      <Seo
        path="/shop"
        title="Shop Car Accessories"
        description="Browse TWM's full catalog of car accessories — roof boxes, dash cams, wipers, air fresheners, exterior and interior upgrades. Free shipping available."
      />
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">THE CATALOG</h1>
          <p className="text-muted-foreground max-w-2xl">Browse our complete selection of high-performance parts and premium accessories.</p>
        </div>
      </div>

      {isCarFiltered && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <Car className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-mono text-foreground flex-1">
              Showing accessories compatible with your selected car model
            </span>
            <Link
              href="/find-by-car"
              className="text-xs text-primary hover:underline font-mono whitespace-nowrap"
            >
              ← Change car
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
            >
              <X className="w-3 h-3" /> Clear filter
            </Link>
          </div>
        </div>
      )}

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
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider uppercase text-sm mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => { setCategoryId(null); setSearch(""); setDebouncedSearch(""); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${categoryId === null && !debouncedSearch ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-secondary"}`}
              >
                All Gear
              </button>

              {/* Find By Car — special pinned entry with image */}
              {(() => {
                const findByCar = categories?.find(c => c.slug === "find-by-car");
                return (
                  <Link
                    href="/find-by-car"
                    className="block w-full group relative overflow-hidden border border-primary/30 hover:border-primary transition-colors mb-2"
                  >
                    <div className="relative h-16">
                      <img
                        src={findByCar?.imageUrl || "/cat-exterior.png"}
                        alt="Find By Car Model"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
                      <div className="relative z-10 h-full flex items-center gap-2 px-3">
                        <Car className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-primary leading-tight">Find By Car Model</div>
                          <div className="text-xs text-muted-foreground font-mono">Select your vehicle →</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {/* Regular categories (exclude find-by-car) */}
              {categories?.filter(c => c.slug !== "find-by-car").map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${categoryId === cat.id ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  {cat.name} <span className="float-right opacity-50">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {debouncedSearch && (
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Car className="w-4 h-4 text-primary" />
              Showing results for <span className="text-foreground font-medium">"{debouncedSearch}"</span>
              <button onClick={() => { setSearch(""); setDebouncedSearch(""); }} className="text-primary hover:underline ml-1">✕ clear</button>
            </div>
          )}
          <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground border-b border-border pb-4">
            <div>
              {productsData
                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, productsData.total)} of ${productsData.total} results`
                : "Loading..."}
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <select className="bg-transparent border-none outline-none cursor-pointer focus:text-primary font-mono">
                <option value="featured" className="bg-card text-foreground">Featured</option>
                <option value="newest" className="bg-card text-foreground">Newest</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                onClick={() => { setCategoryId(null); setSearch(""); setDebouncedSearch(""); }}
                className="text-primary hover:underline uppercase text-sm font-bold tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsData?.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {/* First page */}
                <button
                  title="First page"
                  onClick={() => { setPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="p-2 border border-border text-sm font-mono hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                {/* Prev */}
                <button
                  title="Previous page"
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-border text-sm font-mono uppercase tracking-wider hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                {/* Page window */}
                {(() => {
                  let start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, start + 4);
                  start = Math.max(1, end - 4);
                  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                })().map(p => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 text-sm font-mono border transition-colors ${p === page ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:text-primary"}`}
                  >
                    {p}
                  </button>
                ))}
                {/* Next */}
                <button
                  title="Next page"
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border border-border text-sm font-mono uppercase tracking-wider hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
                {/* Last page */}
                <button
                  title="Last page"
                  onClick={() => { setPage(totalPages); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="p-2 border border-border text-sm font-mono hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
              {/* Jump to page */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const n = parseInt(jumpInput, 10);
                  if (!isNaN(n) && n >= 1 && n <= totalPages) {
                    setPage(n);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  setJumpInput("");
                }}
                className="flex items-center gap-2"
              >
                <span className="text-xs text-muted-foreground font-mono">Page {page} of {totalPages} — go to:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpInput}
                  onChange={e => setJumpInput(e.target.value)}
                  placeholder="#"
                  className="w-16 h-8 px-2 text-sm font-mono border border-border bg-background focus:outline-none focus:border-primary text-center"
                />
                <button
                  type="submit"
                  className="h-8 px-3 text-xs font-mono border border-border bg-background hover:border-primary hover:text-primary transition-colors"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
