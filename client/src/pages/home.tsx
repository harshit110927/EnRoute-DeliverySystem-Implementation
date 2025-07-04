import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { CartSidebar } from "@/components/cart-sidebar";
import { CheckoutModal } from "@/components/checkout-modal";
import { OrderConfirmation } from "@/components/order-confirmation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const { isOpen, setCartOpen } = useCart();

  const handleCheckout = () => {
    setCartOpen(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = (orderNum: string) => {
    setShowCheckout(false);
    setShowConfirmation(true);
    setOrderNumber(orderNum);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setOrderNumber('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-walmart-blue to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Save Money. Live Better.</h1>
            <p className="text-xl mb-6">Free shipping on orders $35+ or pickup in-store</p>
            <button className="bg-walmart-yellow text-walmart-dark px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <ProductGrid 
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </main>

      <CartSidebar onCheckout={handleCheckout} />

      {showCheckout && (
        <CheckoutModal 
          onClose={() => setShowCheckout(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {showConfirmation && (
        <OrderConfirmation 
          orderNumber={orderNumber}
          onClose={handleCloseConfirmation}
        />
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
