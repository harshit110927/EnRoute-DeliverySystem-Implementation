// File: src/components/checkout-modal.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import { CheckoutFormData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EnrouteSelector } from "@/components/EnrouteSelector";

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

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedChokepoint, setSelectedChokepoint] = useState<any | null>(null);
  const [assignmentResult, setAssignmentResult] = useState<any | null>(null);
  const [hasRescheduled, setHasRescheduled] = useState(false);

  const subtotal = total;
  const deliveryFee = formData.deliveryType === 'route' ? 0 : subtotal >= 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + deliveryFee + tax;

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);

      if (!response.ok) {
        const text = await response.text();
        console.error("Order API Error:", response.status, text);
        throw new Error("Order submission failed");
      }

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
    onError: () => {
      toast({
        title: "Error placing order",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.deliveryType === 'route' && !assignmentResult) {
      toast({
        title: "Select EnRoute Chokepoint",
        description: "Please select a chokepoint and confirm your slot before placing order.",
        variant: "destructive",
      });
      return;
    }

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
      enrouteInfo: assignmentResult || {},
    };

    placeOrderMutation.mutate(orderData);
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
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

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                  <Input id="firstName" placeholder="First Name" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required />
                  <Input id="lastName" placeholder="Last Name" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required className="mt-2" />
                  <Input id="email" placeholder="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required className="mt-2" />
                  <Input id="phone" placeholder="Phone Number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required className="mt-2" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
                  <Input id="address" placeholder="Street Address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
                  <Input id="city" placeholder="City" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required className="mt-2" />
                  <Input id="zip" placeholder="ZIP" value={formData.zip} onChange={(e) => handleInputChange('zip', e.target.value)} required className="mt-2" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Delivery Type</h3>
                  <RadioGroup value={formData.deliveryType} onValueChange={(val) => handleInputChange('deliveryType', val)}>
                    <RadioGroupItem value="home" id="home" /> <Label htmlFor="home">Home Delivery</Label>
                    <RadioGroupItem value="route" id="route" className="ml-4" /> <Label htmlFor="route">EnRoute Delivery</Label>
                  </RadioGroup>
                </div>

                {formData.deliveryType === 'route' && (
                  <EnrouteSelector
                    address={formData.address}
                    onAddressChange={(val) => handleInputChange('address', val)}
                    coords={coords}
                    setCoords={setCoords}
                    selectedChokepoint={selectedChokepoint}
                    setSelectedChokepoint={setSelectedChokepoint}
                    assignmentResult={assignmentResult}
                    setAssignmentResult={setAssignmentResult}
                    hasRescheduled={hasRescheduled}
                    setHasRescheduled={setHasRescheduled}
                  />
                )}

                <Button type="submit" disabled={placeOrderMutation.isPending} className="w-full bg-walmart-blue hover:bg-blue-700 text-white">
                  {placeOrderMutation.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>) : ('Place Order')}
                </Button>
              </form>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Delivery:</span><span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span></div>
                    <div className="flex justify-between"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>${finalTotal.toFixed(2)}</span></div>
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