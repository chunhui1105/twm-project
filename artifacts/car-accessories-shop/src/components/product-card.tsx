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
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-luminosity opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 uppercase tracking-wider">
              Sale
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-xs font-bold px-2 py-1 uppercase tracking-wider">
              Out of Stock
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">
            {product.categoryName || "Gear"}
          </div>
          <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-auto flex items-end gap-2 pt-4">
            <span className="font-mono font-bold text-lg text-primary">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through font-mono">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
