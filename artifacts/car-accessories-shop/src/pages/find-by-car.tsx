import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { ChevronRight, ChevronDown, Search, Car } from "lucide-react";
import { useState } from "react";
import { useGetCarBrands } from "@workspace/api-client-react";

const originColors: Record<string, string> = {
  Malaysian: "bg-green-100 text-green-700 border-green-200",
  Japanese: "bg-red-50 text-red-700 border-red-200",
  Korean: "bg-blue-50 text-blue-700 border-blue-200",
  European: "bg-purple-50 text-purple-700 border-purple-200",
  American: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function FindByCar() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [expandedBrand, setExpandedBrand] = useState<number | null>(null);
  const { data: carBrands = [], isLoading } = useGetCarBrands();

  const filtered = search.trim()
    ? carBrands
        .map(b => ({
          ...b,
          models: b.models.filter(m =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            b.name.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter(b => b.models.length > 0 || b.name.toLowerCase().includes(search.toLowerCase()))
    : carBrands;

  const handleModelSelect = (brand: string, model: string) => {
    navigate(`/shop?search=${encodeURIComponent(`${brand} ${model}`.trim())}`);
  };

  const handleBrandSelect = (brand: string) => {
    navigate(`/shop?search=${encodeURIComponent(brand)}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/shop" className="hover:text-primary transition-colors">Catalog</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Find By Car Model</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Car className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tighter">FIND BY CAR MODEL</h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Select your car make and model to browse compatible accessories and parts for your vehicle.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Search */}
        <div className="relative max-w-lg mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search make or model (e.g. Myvi, Civic, Ranger…)"
            className="w-full bg-card border border-border py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary font-mono"
            value={search}
            onChange={e => { setSearch(e.target.value); setExpandedBrand(null); }}
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-14 border border-border bg-card rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(brand => {
              const isExpanded = expandedBrand === brand.id || search.trim().length > 0;
              const originClass = originColors[brand.origin] ?? "bg-secondary text-muted-foreground border-border";

              return (
                <div key={brand.id} className="border border-border rounded bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors">
                    <button
                      onClick={() => setExpandedBrand(prev => prev === brand.id ? null : brand.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className="font-bold text-lg tracking-tight">{brand.name}</span>
                      {brand.origin && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-mono uppercase tracking-wider ${originClass}`}>
                          {brand.origin}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{brand.models.length} models</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleBrandSelect(brand.name)}
                        className="text-xs text-primary hover:underline font-mono uppercase tracking-wider hidden sm:block"
                      >
                        Browse all →
                      </button>
                      <button
                        onClick={() => setExpandedBrand(prev => prev === brand.id ? null : brand.id)}
                        className="text-muted-foreground"
                      >
                        {isExpanded && !search.trim()
                          ? <ChevronDown className="w-4 h-4" />
                          : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border px-5 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {brand.models.map(model => (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(brand.name, model.name)}
                          className="group text-left px-3 py-2.5 border border-border rounded hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">{model.name}</div>
                          {model.years && (
                            <div className="text-xs text-muted-foreground font-mono mt-0.5">{model.years}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center border border-dashed border-border bg-card/50 rounded">
            <Car className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No matching cars found for "{search}"</p>
            <button onClick={() => setSearch("")} className="text-primary hover:underline text-sm">Clear search</button>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-10 text-center">
          Don't see your model? Contact us — we source accessories for most vehicles on the road.
        </p>
      </div>
    </Layout>
  );
}
