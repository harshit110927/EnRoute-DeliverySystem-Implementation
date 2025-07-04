import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationProps {
  orderNumber: string;
  onClose: () => void;
}

export function OrderConfirmation({ orderNumber, onClose }: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700">Order Number</p>
              <p className="text-lg font-bold text-walmart-blue">#{orderNumber}</p>
            </div>
            <Button
              onClick={onClose}
              className="w-full bg-walmart-blue hover:bg-blue-600 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
