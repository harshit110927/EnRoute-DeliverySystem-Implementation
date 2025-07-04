import { products, orders, type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private currentProductId: number;
  private currentOrderId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.initializeProducts();
  }

  private initializeProducts() {
    const productData: InsertProduct[] = [
      // Grocery Products
      { name: "Fresh Organic Bananas", description: "Premium organic bananas, perfect for snacking", price: "2.48", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 100 },
      { name: "Wonder Bread Classic", description: "Soft white bread, perfect for sandwiches", price: "1.98", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 50 },
      { name: "Mixed Fresh Fruits", description: "Variety pack of seasonal fresh fruits", price: "8.97", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 25 },
      { name: "Great Value Milk", description: "Whole milk, 1 gallon", price: "3.64", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 30 },
      { name: "Fresh Vegetable Bundle", description: "Mixed vegetables for healthy meals", price: "6.48", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 40 },
      { name: "Barilla Pasta", description: "Premium pasta for family dinners", price: "1.24", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 75 },
      { name: "Fresh Chicken Breast", description: "Boneless, skinless chicken breast", price: "7.98", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 20 },
      { name: "Cheerios Cereal", description: "Heart healthy whole grain cereal", price: "4.68", category: "grocery", imageUrl: "https://images.unsplash.com/photo-1559717865-a99cac1c95d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 60 },
      
      // Electronics Products
      { name: "HP Laptop 15.6\"", description: "Intel Core i5, 8GB RAM, 256GB SSD", price: "549.00", category: "electronics", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 15 },
      { name: "iPhone 14", description: "128GB, Blue, Unlocked", price: "699.00", category: "electronics", imageUrl: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 10 },
      { name: "Sony WH-1000XM4", description: "Noise Cancelling Wireless Headphones", price: "248.00", category: "electronics", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 25 },
      { name: "Samsung 55\" 4K TV", description: "Smart TV with HDR, Built-in Alexa", price: "449.00", category: "electronics", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 8 },
      { name: "PlayStation 5", description: "Gaming console with wireless controller", price: "499.00", category: "electronics", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 5 },
      { name: "iPad Air", description: "10.9-inch display, Wi-Fi, 64GB", price: "519.00", category: "electronics", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 12 },
      
      // Home Products
      { name: "3-Piece Sofa Set", description: "Comfortable sectional sofa with cushions", price: "899.00", category: "home", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 3 },
      { name: "Coffee Maker", description: "12-cup programmable coffee maker", price: "79.99", category: "home", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 20 },
      { name: "Queen Bed Frame", description: "Modern platform bed with headboard", price: "299.00", category: "home", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 7 },
      { name: "Table Lamp Set", description: "Modern desk lamps with adjustable brightness", price: "45.99", category: "home", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300", inStock: 15 },
    ];

    productData.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const orderNumber = `WM-${new Date().getFullYear()}-${String(id).padStart(6, '0')}`;
    const order: Order = {
      ...insertOrder,
      id,
      orderNumber,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(o => o.orderNumber === orderNumber);
  }
}

export const storage = new MemStorage();
