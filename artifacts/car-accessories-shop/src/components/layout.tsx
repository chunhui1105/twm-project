import { Link, useLocation } from "wouter";
import { Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <img src="/twm-logo.png" alt="TWM" className="h-10 w-auto object-contain" />
            </Link>
            
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className={`transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
                Home
              </Link>
              <Link href="/shop" className={`transition-colors hover:text-primary ${location.startsWith("/shop") ? "text-primary" : "text-muted-foreground"}`}>
                Shop
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 text-muted-foreground hover:text-primary transition-colors hidden md:block">
              <UserCircle className="w-5 h-5" />
            </Link>
            
            <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-4">
            <Link href="/" className="font-medium text-lg" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/shop" className="font-medium text-lg" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link href="/admin" className="font-medium text-lg text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-card py-12 mt-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src="/twm-logo.png" alt="TWM" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-muted-foreground text-sm">
              Premium automotive accessories for the modern driver. Precision, performance, and style.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Catalog</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop?category=interior">Interior</Link></li>
              <li><Link href="/shop?category=exterior">Exterior</Link></li>
              <li><Link href="/shop?category=lighting">Lighting</Link></li>
              <li><Link href="/shop?category=electronics">Electronics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Contact Us</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">Subscribe for the latest gear and updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-background border border-border px-3 py-2 text-sm w-full focus:outline-none focus:border-primary" />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
