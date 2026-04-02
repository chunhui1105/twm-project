import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { ArrowRight, Zap, Shield, Wrench, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetFeaturedProducts, useGetCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroSlides = [
  {
    image: "/hero.png",
    tag: "Next-Gen Gear Available",
    title: "PRECISION",
    highlight: "PERFORMANCE.",
    subtitle: "Equip your machine with elite accessories engineered for enthusiasts. No compromises.",
  },
  {
    image: "/cat-exterior.png",
    tag: "Exterior Collection",
    title: "BUILT FOR",
    highlight: "THE ROAD.",
    subtitle: "Aerodynamic styling and protection that looks as good as it performs.",
  },
  {
    image: "/cat-interior.png",
    tag: "Interior Series",
    title: "COMFORT",
    highlight: "REDEFINED.",
    subtitle: "Premium interior upgrades that transform every drive into an experience.",
  },
  {
    image: "/cat-lighting.png",
    tag: "Lighting Systems",
    title: "SEE &",
    highlight: "BE SEEN.",
    subtitle: "High-intensity lighting solutions engineered for visibility and presence.",
  },
];

const brands = [
  { name: "CARALL", src: "/brand-carall.jpeg" },
  { name: "CARBOY", src: "/brand-carboy.jpeg" },
  { name: "DLAA",   src: "/brand-dlaa.jpeg"   },
  { name: "Pentair",src: "/brand-pentair.jpeg" },
  { name: "PONYAN", src: "/brand-ponyan.jpeg"  },
];

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const categoryImages: Record<string, string> = {
    'lighting': '/cat-lighting.png',
    'exterior': '/cat-exterior.png',
    'interior': '/cat-interior.png',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const slide = heroSlides[currentSlide];

  return (
    <Layout>
      {/* Hero Slideshow */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-border">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="container relative z-10 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-sm font-mono uppercase tracking-widest mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {slide.tag}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
                {slide.title}<br />
                <span className="text-primary">{slide.highlight}</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">{slide.subtitle}</p>
              <Link
                href="/shop"
                className="bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Explore Catalog <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / Next controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-background/70 border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-background/70 border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-primary w-8" : "bg-border w-4 hover:bg-primary/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Brands Ticker */}
      <section className="py-12 border-b border-border bg-card/30 overflow-hidden">
        <div className="container mx-auto px-4 mb-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-center">Trusted Brands</p>
        </div>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex gap-16 items-center shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          >
            {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
              <img
                key={i}
                src={brand.src}
                alt={brand.name}
                className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity select-none"
                draggable={false}
              />
            ))}
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
