import { Layout } from "@/components/layout";
import { Shield, ShieldCheck, Zap, Users, MapPin } from "lucide-react";
import { useGetBrands } from "@workspace/api-client-react";

export default function About() {
  const { data: brandsData } = useGetBrands();
  const brands = (brandsData ?? []).filter(b => b.active);

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border py-20 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">About TWM</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-tight mb-6">
            Built for<br /><span className="text-primary">Every Drive.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed mb-6">
            TWM is a Malaysian car accessories company — your trusted source for premium products from roof boxes to air fresheners, wipers to dash cams. We carry products that enhance your vehicle's performance, comfort, and style.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <MapPin className="w-4 h-4" />
            <span>Proudly based in Malaysia</span>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Our Mission</p>
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-6">Quality You Can Trust</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe every Malaysian driver deserves access to reliable, well-crafted accessories. That's why we partner only with brands that meet our high standards for durability, design, and performance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our catalog is carefully curated for Malaysian roads and conditions — from city commutes to highway drives — so you always find exactly what your vehicle needs.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Shield, label: "Trusted Brands", desc: "Only proven, quality-certified brands" },
              { icon: ShieldCheck, label: "Quality Guaranteed", desc: "Every product vetted for performance" },
              { icon: Zap, label: "Wide Range", desc: "Hundreds of accessories in stock" },
              { icon: Users, label: "Customer First", desc: "Your satisfaction drives us" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="border border-border bg-card p-5">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold text-sm uppercase tracking-wider mb-1">{label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Based in Malaysia */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Where We Are</p>
          <h2 className="text-4xl font-bold tracking-tighter uppercase mb-6">Based in Malaysia</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            TWM operates within Malaysia, serving customers across the country. As a local business, we understand the needs of Malaysian drivers — the weather, the roads, and the vehicles most common on our streets. Everything we stock is selected with the Malaysian market in mind.
          </p>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Our Partners</p>
          <h2 className="text-4xl font-bold tracking-tighter uppercase mb-3">Brands We Carry</h2>
          <p className="text-muted-foreground text-sm mb-10 max-w-2xl">
            We stock and sell products from these brands as an authorised reseller in Malaysia. Please note that TWM may not be the sole or main distributor for all brands listed — we are one of many resellers bringing these quality products to Malaysian customers.
          </p>
          <div className="flex flex-wrap gap-10 items-center">
            {brands.map((brand) => (
              <img
                key={brand.id}
                src={brand.imageUrl}
                alt={brand.name}
                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity mix-blend-multiply"
              />
            ))}
            {brands.length === 0 && (
              ["brand-carall.png", "brand-carboy.png", "brand-dlaa.png", "brand-pentair.png", "brand-ponyan.png"].map((b) => (
                <img key={b} src={`/${b}`} alt={b} className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity mix-blend-multiply" />
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
