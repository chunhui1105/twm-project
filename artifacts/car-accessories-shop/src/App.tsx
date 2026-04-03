import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Shop from "@/pages/shop";
import ProductDetail from "@/pages/product-detail";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminProductForm from "@/pages/admin/product-form";
import AdminOrders from "@/pages/admin/orders";
import AdminCategories from "@/pages/admin/categories";
import AdminSlides from "@/pages/admin/slides";
import AdminBrands from "@/pages/admin/brands";
import FindByCar from "@/pages/find-by-car";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:id" component={ProductDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/find-by-car" component={FindByCar} />

      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/products/new" component={AdminProductForm} />
      <Route path="/admin/products/:id/edit" component={AdminProductForm} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/slides" component={AdminSlides} />
      <Route path="/admin/brands" component={AdminBrands} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
