import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { ChevronRight, ChevronDown, Search, Car } from "lucide-react";
import { useState } from "react";
import { useGetCarBrands } from "@workspace/api-client-react";


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

              return (
                <div key={brand.id} className="border border-border rounded bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors">
                    <button
                      onClick={() => setExpandedBrand(prev => prev === brand.id ? null : brand.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className="font-bold text-lg tracking-tight">{brand.name}</span>
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
                    <div className="border-t border-border px-5 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {brand.models.map(model => (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(brand.name, model.name)}
                          className="group text-left border border-border rounded overflow-hidden hover:border-primary hover:shadow-md transition-all"
                        >
                          {/* Photo area */}
                          <div className="w-full aspect-video bg-secondary/40 flex items-center justify-center overflow-hidden">
                            {model.imageUrl ? (
                              <img
                                src={model.imageUrl}
                                alt={model.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Car className="w-8 h-8 text-muted-foreground/30" />
                            )}
                          </div>
                          {/* Name / years */}
                          <div className="px-3 py-2.5">
                            <div className="font-medium text-sm group-hover:text-primary transition-colors leading-tight">{model.name}</div>
                            {model.years && (
                              <div className="text-xs text-muted-foreground font-mono mt-0.5">{model.years}</div>
                            )}
                          </div>
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
