import { Layout } from "@/components/layout";
import { Shield, Truck, Zap, Users } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border py-20 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">About TWM</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-tight mb-6">
            Built for<br /><span className="text-primary">Every Drive.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
            TWM is your trusted source for premium car accessories — from roof boxes to air fresheners, wipers to dash cams. We carry products that enhance your vehicle's performance, comfort, and style.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Our Mission</p>
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-6">Quality You Can Trust</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe every driver deserves access to reliable, well-crafted accessories. That's why we partner only with brands that meet our high standards for durability, design, and performance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our catalog spans a wide range of car accessories carefully selected for Malaysian roads and drivers — so you always find exactly what you need.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Shield, label: "Trusted Brands", desc: "Only proven, quality-certified brands" },
              { icon: Truck, label: "Quality Guaranteed", desc: "Every product vetted for performance" },
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

      {/* Brands */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Our Partners</p>
          <h2 className="text-4xl font-bold tracking-tighter uppercase mb-10">Brands We Carry</h2>
          <div className="flex flex-wrap gap-8 items-center">
            {["brand-carall.png", "brand-carboy.png", "brand-dlaa.png", "brand-pentair.png", "brand-ponyan.png"].map((b) => (
              <img key={b} src={`/${b}`} alt={b} className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
