import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import { CheckoutFormData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: (orderNumber: string) => void;
}

export function CheckoutModal({ onClose, onSuccess }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    deliveryType: 'home',
  });

  const subtotal = total;
  const deliveryFee = formData.deliveryType === 'route' ? 0 : (subtotal >= 35 ? 0 : 5.99);
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + deliveryFee + tax;

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (data) => {
      clearCart();
      onSuccess(data.orderNumber);
      toast({
        title: "Order placed successfully!",
        description: `Your order #${data.orderNumber} has been confirmed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error placing order",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      shippingCity: formData.city,
      shippingState: formData.state,
      shippingZip: formData.zip,
      deliveryType: formData.deliveryType,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: finalTotal.toFixed(2),
      items: JSON.stringify(items),
      status: 'pending',
    };

    placeOrderMutation.mutate(orderData);
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Checkout</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                  <div className="mb-4">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        type="text"
                        value={formData.zip}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Delivery Options</h3>
                  <RadioGroup
                    value={formData.deliveryType}
                    onValueChange={(value) => handleInputChange('deliveryType', value)}
                  >
                    <Card className="border-2 border-gray-200 hover:border-walmart-blue transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home" className="cursor-pointer flex-1">
                            <div className="font-medium">Home Delivery</div>
                            <div className="text-sm text-gray-600">Direct delivery to your address</div>
                            <div className="text-sm font-medium text-walmart-blue">
                              {subtotal >= 35 ? 'FREE' : '$5.99'}
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-gray-200 hover:border-walmart-blue transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="route" id="route" />
                          <Label htmlFor="route" className="cursor-pointer flex-1">
                            <div className="font-medium">Route Delivery</div>
                            <div className="text-sm text-gray-600">Delivery during scheduled route</div>
                            <div className="text-sm font-medium text-walmart-blue">FREE</div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </RadioGroup>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <Card className="border-2 border-gray-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            defaultValue="4111 1111 1111 1111"
                            disabled
                            className="opacity-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            type="text"
                            placeholder="MM/YY"
                            defaultValue="12/27"
                            disabled
                            className="opacity-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            defaultValue="123"
                            disabled
                            className="opacity-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            type="text"
                            placeholder="John Doe"
                            defaultValue="John Doe"
                            disabled
                            className="opacity-50"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        * Payment details are pre-filled for demo purposes
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  type="submit"
                  disabled={placeOrderMutation.isPending}
                  className="w-full bg-walmart-blue hover:bg-blue-600 text-white py-3"
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
