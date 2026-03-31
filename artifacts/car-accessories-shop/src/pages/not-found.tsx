import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-background border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <AlertCircle className="w-24 h-24 text-primary mx-auto mb-6 opacity-80" />
            <h1 className="text-8xl font-bold tracking-tighter text-foreground mb-4 font-mono">404</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-mono uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
              Transmission Failed
            </div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
              Destination Coordinates Unknown
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              The sector you are trying to reach has either been relocated or does not exist in our current registry.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary/90 transition-colors w-full sm:w-auto">
                <ArrowLeft className="w-5 h-5" /> Return to Base
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-secondary text-foreground border border-border font-bold uppercase tracking-widest px-8 py-4 hover:bg-secondary/80 transition-colors w-full sm:w-auto">
                Browse Catalog
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
