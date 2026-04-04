import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`}>
      <motion.div 
        whileHover={{ y: -4 }}
        className="group relative flex flex-col bg-card border border-border overflow-hidden cursor-pointer"
      >
        <div className="aspect-square bg-secondary overflow-hidden relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">
            {product.categoryName || "Gear"}
          </div>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
