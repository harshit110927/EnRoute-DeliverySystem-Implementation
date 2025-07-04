import { useState } from "react";
import { Search, MapPin, Heart, ShoppingCart, Menu, Star } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All', icon: Menu },
  { id: 'grocery', name: 'Grocery', icon: ShoppingCart },
  { id: 'electronics', name: 'Electronics', icon: Search },
  { id: 'home', name: 'Home', icon: Heart },
];

export function Header({ searchQuery, onSearchChange, selectedCategory, onCategoryChange }: HeaderProps) {
  const { itemCount, toggleCart } = useCart();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  return (
    <header className="bg-walmart-blue text-white sticky top-0 z-30">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-blue-600">
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">How do you want your items?</span>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Sacramento, 95829</span>
              <span className="text-walmart-yellow">•</span>
              <span className="hidden sm:inline">Sacramento Supercenter</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Sign In</span>
            <span className="hidden md:inline">Account</span>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-walmart-yellow rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-walmart-blue" />
              </div>
              <span className="text-2xl font-bold">Walmart</span>
            </div>
            
            <nav className="hidden lg:flex space-x-6">
              <a href="#" className="hover:text-walmart-yellow transition-colors">Departments</a>
              <a href="#" className="hover:text-walmart-yellow transition-colors">Services</a>
            </nav>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Search everything at Walmart online and in store"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-12 pr-16 py-3 rounded-full text-gray-900 border-0 focus:ring-2 focus:ring-walmart-yellow"
              />
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <Button
                type="submit"
                className="absolute right-2 top-2 bg-walmart-yellow text-walmart-blue px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:text-walmart-yellow transition-colors text-white"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden md:inline">Reorder</span>
            </Button>
            <Button
              onClick={toggleCart}
              variant="ghost"
              className="flex items-center space-x-2 hover:text-walmart-yellow transition-colors text-white relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-walmart-yellow text-walmart-blue rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  variant="ghost"
                  className={`flex items-center space-x-2 whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'text-walmart-blue font-semibold'
                      : 'text-gray-700 hover:text-walmart-blue'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
