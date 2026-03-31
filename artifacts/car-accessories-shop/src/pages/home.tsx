import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { ArrowRight, Zap, Shield, Wrench } from "lucide-react";
import { useGetFeaturedProducts, useGetCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();

  // Mock category images matching our generated images
  const categoryImages: Record<string, string> = {
    'lighting': '/cat-lighting.png',
    'exterior': '/cat-exterior.png',
    'interior': '/cat-interior.png',
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Premium Car Accessories" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-sm font-mono uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Next-Gen Gear Available
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
              PRECISION <br/>
              <span className="text-primary">PERFORMANCE.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Equip your machine with elite accessories engineered for enthusiasts. No compromises.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-2">
                Explore Catalog <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary text-primary rounded-md">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Peak Performance</h3>
                <p className="text-sm text-muted-foreground">Components built to exceed factory specifications.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary text-primary rounded-md">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Bulletproof Warranty</h3>
                <p className="text-sm text-muted-foreground">Every piece of gear is backed by our lifetime guarantee.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary text-primary rounded-md">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Expert Fitment</h3>
                <p className="text-sm text-muted-foreground">Precision engineered to drop right into your specific make and model.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-2">CATEGORIES</h2>
              <p className="text-muted-foreground">Find exactly what your build needs.</p>
            </div>
            <Link href="/shop" className="text-primary hover:text-primary/80 font-mono text-sm uppercase flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingCategories ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="aspect-[4/3] w-full bg-secondary" />)
            ) : categories?.slice(0, 3).map((category, index) => (
              <Link key={category.id} href={`/shop?category=${category.id}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-[4/3] overflow-hidden bg-secondary flex flex-col justify-end p-6 border border-border"
                >
                  <img 
                    src={categoryImages[category.slug] || `/cat-lighting.png`} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold tracking-tight mb-1">{category.name}</h3>
                    <p className="text-primary font-mono text-sm uppercase">{category.productCount} items</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-2">FEATURED GEAR</h2>
            <p className="text-muted-foreground">Top tier equipment hand-picked by our engineers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingFeatured ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-square w-full bg-secondary" />
                  <Skeleton className="h-4 w-2/3 bg-secondary" />
                  <Skeleton className="h-4 w-1/3 bg-secondary" />
                </div>
              ))
            ) : featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
