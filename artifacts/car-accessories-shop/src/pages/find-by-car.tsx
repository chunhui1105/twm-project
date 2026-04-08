import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { ChevronRight, ChevronDown, Search, Car, Layers } from "lucide-react";
import { useState } from "react";
import { useGetCarBrands } from "@workspace/api-client-react";

type Model = { id: number; name: string; series: string; years: string; imageUrl?: string | null };

function ModelCard({ model, onClick }: { model: Model; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left border border-border rounded overflow-hidden hover:border-primary hover:shadow-md transition-all"
    >
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
      <div className="px-3 py-2.5">
        <div className="font-medium text-sm group-hover:text-primary transition-colors leading-tight">{model.name}</div>
        {model.years && (
          <div className="text-xs text-muted-foreground font-mono mt-0.5">{model.years}</div>
        )}
      </div>
    </button>
  );
}

function SeriesSection({
  series,
  models,
  brandName,
  onModelSelect,
  onSeriesSelect,
  defaultExpanded,
}: {
  series: string;
  models: Model[];
  brandName: string;
  onModelSelect: (brand: string, model: string) => void;
  onSeriesSelect: (brand: string, series: string) => void;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-border rounded overflow-hidden">
      {/* Series header */}
      <div className="flex items-center bg-secondary/30 hover:bg-secondary/50 transition-colors">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-3 flex-1 px-4 py-3 text-left"
        >
          {expanded
            ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          }
          <Layers className="w-4 h-4 text-primary/60 flex-shrink-0" />
          <span className="font-semibold text-sm">{series}</span>
          <span className="text-xs text-muted-foreground font-mono">{models.length} variant{models.length !== 1 ? "s" : ""}</span>
        </button>
        <button
          onClick={() => onSeriesSelect(brandName, series)}
          className="text-xs text-primary hover:underline font-mono uppercase tracking-wider pr-4 hidden sm:block whitespace-nowrap"
        >
          Browse all →
        </button>
      </div>

      {/* Model grid */}
      {expanded && (
        <div className="px-4 py-3 border-t border-border grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {models.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              onClick={() => onModelSelect(brandName, model.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
            (m.series ?? "").toLowerCase().includes(search.toLowerCase()) ||
            b.name.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter(b => b.models.length > 0 || b.name.toLowerCase().includes(search.toLowerCase()))
    : carBrands;

  const handleModelSelect = (brand: string, model: string) => {
    navigate(`/shop?search=${encodeURIComponent(`${brand} ${model}`.trim())}`);
  };

  const handleSeriesSelect = (brand: string, series: string) => {
    navigate(`/shop?search=${encodeURIComponent(`${brand} ${series}`.trim())}`);
  };

  const handleBrandSelect = (brand: string) => {
    navigate(`/shop?search=${encodeURIComponent(brand)}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <div
        className="relative border-b border-border py-16 overflow-hidden"
        style={{ backgroundImage: "url('/bmw-m4-hero.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
            <Link href="/shop" className="hover:text-white transition-colors">Catalog</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Find By Car Model</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Car className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tighter text-white">FIND BY CAR MODEL</h1>
          </div>
          <p className="text-white/70 max-w-xl">
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

              // Group models by series
              const seriesMap = new Map<string, Model[]>();
              for (const m of brand.models as Model[]) {
                const key = m.series?.trim() ?? "";
                if (!seriesMap.has(key)) seriesMap.set(key, []);
                seriesMap.get(key)!.push(m);
              }
              // Named series (2+ models) shown as grouped sections; single-model series + ungrouped shown as cards
              const multiModelSeries = [...seriesMap.entries()]
                .filter(([s, ms]) => s !== "" && ms.length > 1)
                .sort(([a], [b]) => a.localeCompare(b));
              const singleModels = brand.models.filter((m: Model) => {
                const s = m.series?.trim() ?? "";
                return s === "" || (seriesMap.get(s)?.length ?? 0) <= 1;
              }) as Model[];

              const totalSeries = multiModelSeries.length;

              return (
                <div key={brand.id} className="border border-border rounded bg-card overflow-hidden">
                  {/* Brand header */}
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors">
                    <button
                      onClick={() => setExpandedBrand(prev => prev === brand.id ? null : brand.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className="font-bold text-lg tracking-tight">{brand.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {brand.models.length} model{brand.models.length !== 1 ? "s" : ""}
                        {totalSeries > 0 && ` · ${totalSeries} series`}
                      </span>
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
                    <div className="border-t border-border px-4 py-4 space-y-3">
                      {/* Series groups (2+ variants) */}
                      {multiModelSeries.map(([series, models]) => (
                        <SeriesSection
                          key={series}
                          series={series}
                          models={models}
                          brandName={brand.name}
                          onModelSelect={handleModelSelect}
                          onSeriesSelect={handleSeriesSelect}
                          defaultExpanded={search.trim().length > 0}
                        />
                      ))}

                      {/* Individual / ungrouped models */}
                      {singleModels.length > 0 && (
                        <div>
                          {multiModelSeries.length > 0 && (
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">
                              Other models
                            </p>
                          )}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {singleModels.map(model => (
                              <ModelCard
                                key={model.id}
                                model={model}
                                onClick={() => handleModelSelect(brand.name, model.name)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
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
