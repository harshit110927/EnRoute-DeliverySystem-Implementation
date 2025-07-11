// src/App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import EnrouteMap from "@/pages/EnrouteMap"; // ✅ this is the map page
import DeliveryPage from "@/pages/Delivery"; // ✅ this is for chokepoint + slot selection

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/enroute" component={EnrouteMap} />
      <Route path="/delivery" component={DeliveryPage} /> {/* Add delivery page here */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
