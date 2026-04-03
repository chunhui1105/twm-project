import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { ChevronRight, ChevronDown, Search, Car } from "lucide-react";
import { useState } from "react";

type CarModel = {
  name: string;
  years?: string;
};

type CarBrand = {
  name: string;
  origin: string;
  models: CarModel[];
};

const carBrands: CarBrand[] = [
  {
    name: "Proton",
    origin: "Malaysian",
    models: [
      { name: "Saga", years: "2008–present" },
      { name: "Persona", years: "2016–present" },
      { name: "Iriz", years: "2014–present" },
      { name: "X50", years: "2020–present" },
      { name: "X70", years: "2018–present" },
      { name: "Exora", years: "2009–present" },
      { name: "Waja", years: "2000–2011" },
      { name: "Gen2", years: "2004–2012" },
      { name: "Wira", years: "1993–2009" },
      { name: "Satria Neo", years: "2006–2015" },
    ],
  },
  {
    name: "Perodua",
    origin: "Malaysian",
    models: [
      { name: "Myvi", years: "2005–present" },
      { name: "Axia", years: "2014–present" },
      { name: "Alza", years: "2009–present" },
      { name: "Aruz", years: "2019–present" },
      { name: "Bezza", years: "2016–present" },
      { name: "Ativa", years: "2021–present" },
      { name: "Kancil", years: "1994–2009" },
      { name: "Viva", years: "2007–2014" },
      { name: "Kelisa", years: "2001–2007" },
    ],
  },
  {
    name: "Honda",
    origin: "Japanese",
    models: [
      { name: "City", years: "2002–present" },
      { name: "Civic", years: "2006–present" },
      { name: "Jazz / Fit", years: "2002–present" },
      { name: "HR-V", years: "2015–present" },
      { name: "CR-V", years: "2001–present" },
      { name: "BR-V", years: "2016–present" },
      { name: "WR-V", years: "2023–present" },
      { name: "Accord", years: "1994–present" },
      { name: "Odyssey", years: "1999–present" },
    ],
  },
  {
    name: "Toyota",
    origin: "Japanese",
    models: [
      { name: "Vios", years: "2003–present" },
      { name: "Camry", years: "2002–present" },
      { name: "Corolla Cross", years: "2020–present" },
      { name: "Hilux", years: "2005–present" },
      { name: "Fortuner", years: "2005–present" },
      { name: "Rush", years: "2018–present" },
      { name: "Veloz", years: "2022–present" },
      { name: "Yaris", years: "2014–present" },
      { name: "Innova", years: "2005–present" },
      { name: "Alphard", years: "2002–present" },
    ],
  },
  {
    name: "Mazda",
    origin: "Japanese",
    models: [
      { name: "CX-30", years: "2019–present" },
      { name: "CX-5", years: "2012–present" },
      { name: "CX-8", years: "2018–present" },
      { name: "Mazda 3", years: "2003–present" },
      { name: "Mazda 6", years: "2002–present" },
      { name: "BT-50", years: "2006–present" },
    ],
  },
  {
    name: "Mitsubishi",
    origin: "Japanese",
    models: [
      { name: "ASX", years: "2010–present" },
      { name: "Outlander", years: "2003–present" },
      { name: "Eclipse Cross", years: "2018–present" },
      { name: "Xpander", years: "2018–present" },
      { name: "Triton", years: "2005–present" },
      { name: "Pajero Sport", years: "2009–present" },
    ],
  },
  {
    name: "Nissan",
    origin: "Japanese",
    models: [
      { name: "Almera", years: "2011–present" },
      { name: "X-Trail", years: "2007–present" },
      { name: "Navara", years: "2005–present" },
      { name: "Note", years: "2005–present" },
      { name: "Serena", years: "2013–present" },
    ],
  },
  {
    name: "Hyundai",
    origin: "Korean",
    models: [
      { name: "Elantra", years: "2011–present" },
      { name: "Tucson", years: "2010–present" },
      { name: "Santa Fe", years: "2006–present" },
      { name: "Kona", years: "2017–present" },
      { name: "i10", years: "2007–present" },
      { name: "Creta", years: "2015–present" },
    ],
  },
  {
    name: "Kia",
    origin: "Korean",
    models: [
      { name: "Sonet", years: "2020–present" },
      { name: "Sorento", years: "2002–present" },
      { name: "Carnival", years: "1999–present" },
      { name: "Sportage", years: "2004–present" },
      { name: "Stinger", years: "2017–present" },
    ],
  },
  {
    name: "Suzuki",
    origin: "Japanese",
    models: [
      { name: "Swift", years: "2004–present" },
      { name: "Ertiga", years: "2012–present" },
      { name: "Jimny", years: "1998–present" },
      { name: "XL7", years: "2020–present" },
      { name: "Fronx", years: "2023–present" },
    ],
  },
  {
    name: "BMW",
    origin: "European",
    models: [
      { name: "1 Series", years: "2004–present" },
      { name: "3 Series", years: "1998–present" },
      { name: "5 Series", years: "2003–present" },
      { name: "X1", years: "2009–present" },
      { name: "X3", years: "2003–present" },
      { name: "X5", years: "1999–present" },
      { name: "7 Series", years: "2001–present" },
    ],
  },
  {
    name: "Mercedes-Benz",
    origin: "European",
    models: [
      { name: "A-Class", years: "2012–present" },
      { name: "C-Class", years: "1999–present" },
      { name: "E-Class", years: "2002–present" },
      { name: "GLA", years: "2013–present" },
      { name: "GLB", years: "2019–present" },
      { name: "GLC", years: "2015–present" },
      { name: "GLE", years: "2015–present" },
    ],
  },
  {
    name: "Volkswagen",
    origin: "European",
    models: [
      { name: "Golf", years: "2003–present" },
      { name: "Passat", years: "2005–present" },
      { name: "Tiguan", years: "2007–present" },
      { name: "Polo", years: "2009–present" },
      { name: "Arteon", years: "2017–present" },
    ],
  },
  {
    name: "Ford",
    origin: "American",
    models: [
      { name: "Ranger", years: "2011–present" },
      { name: "EcoSport", years: "2013–present" },
      { name: "Everest", years: "2015–present" },
      { name: "Mustang", years: "2015–present" },
    ],
  },
];

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
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

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
    const query = `${brand} ${model}`.trim();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
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

        {/* Brand Grid */}
        <div className="space-y-3">
          {filtered.map(brand => {
            const isExpanded = expandedBrand === brand.name || (search.trim().length > 0);
            const originClass = originColors[brand.origin] ?? "bg-secondary text-muted-foreground border-border";

            return (
              <div key={brand.name} className="border border-border rounded bg-card overflow-hidden">
                {/* Brand header */}
                <div className="flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors">
                  <button
                    onClick={() => setExpandedBrand(prev => prev === brand.name ? null : brand.name)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <span className="font-bold text-lg tracking-tight">{brand.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono uppercase tracking-wider ${originClass}`}>
                      {brand.origin}
                    </span>
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
                      onClick={() => setExpandedBrand(prev => prev === brand.name ? null : brand.name)}
                      className="text-muted-foreground"
                    >
                      {isExpanded && !search.trim()
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                {/* Models list */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {brand.models.map(model => (
                      <button
                        key={model.name}
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

        {filtered.length === 0 && (
          <div className="py-20 text-center border border-dashed border-border bg-card/50 rounded">
            <Car className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No matching cars found for "{search}"</p>
            <button onClick={() => setSearch("")} className="text-primary hover:underline text-sm">Clear search</button>
          </div>
        )}

        {/* Note */}
        <p className="text-xs text-muted-foreground mt-10 text-center">
          Don't see your model? Contact us — we source accessories for most vehicles on the road.
        </p>
      </div>
    </Layout>
  );
}
