import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useCart } from "@/lib/cart-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
}

export function ProductGrid({ selectedCategory, searchQuery }: ProductGridProps) {
  const { addItem } = useCart();
  const [sortBy, setSortBy] = useState<string>('best-match');

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: searchQuery 
      ? ['/api/products/search', searchQuery]
      : selectedCategory === 'all' 
        ? ['/api/products']
        : ['/api/products/category', selectedCategory],
    queryFn: async ({ queryKey }) => {
      let url = queryKey[0] as string;
      if (queryKey[1]) {
        if (url.includes('search')) {
          url += `?q=${encodeURIComponent(queryKey[1] as string)}`;
        } else {
          url += `/${queryKey[1]}`;
        }
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
    });
  };

  const sortedProducts = products ? [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  }) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-walmart-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-walmart-dark">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Products'}
        </h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="best-match">Sort by: Best Match</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-walmart-blue">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.inStock <= 5 && (
                      <Badge variant="destructive" className="text-xs">
                        Only {product.inStock} left
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.inStock === 0}
                    className="w-full bg-walmart-blue hover:bg-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
