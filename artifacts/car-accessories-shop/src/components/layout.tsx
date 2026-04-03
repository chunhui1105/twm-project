import { Link, useLocation } from "wouter";
import { Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <img src="/twm-logo.png" alt="TWM" className="h-10 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex gap-6 text-sm font-medium">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`transition-colors hover:text-primary ${isActive(href) ? "text-primary font-semibold" : "text-muted-foreground"}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 text-muted-foreground hover:text-primary transition-colors hidden md:block" title="Admin">
              <UserCircle className="w-5 h-5" />
            </Link>

            <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-3 py-2.5 font-medium rounded transition-colors ${isActive(href) ? "text-primary bg-primary/5" : "text-foreground hover:bg-secondary"}`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary rounded transition-colors block"
              >
                Admin Panel
              </Link>
            </div>
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
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium automotive accessories for the modern driver. Precision, performance, and style.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Catalog</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=lighting" className="hover:text-primary transition-colors">Lighting</Link></li>
              <li><Link href="/shop?category=seat-covers" className="hover:text-primary transition-colors">Seat Covers</Link></li>
              <li><Link href="/shop?category=dash-cams" className="hover:text-primary transition-colors">Dash Cams</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">Subscribe for the latest products and updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-background border border-border px-3 py-2 text-sm w-full focus:outline-none focus:border-primary" />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors">Join</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TWM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
