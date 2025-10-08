import axios from "axios";
import { CreditCard, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: number;
  price: number;
  documentType: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  documentId,
  price,
  documentType,
}) => {
  console.log("PaymentModal Props:", {
    isOpen,
    documentId,
    price,
    documentType,
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");
  const [processing, setProcessing] = useState(false);
  const token = localStorage.getItem("authToken");

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Replace with your actual payment endpoint
      const response = await axios.post(
        `http://localhost:7000/payment/create-checkout-session`,
        {
          documentId,
          amount: Math.ceil(price / 1507),
          quantity: 1,
          currency: "USD",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Payment response:", response.data.url);

      if (response.data.url) {
        toast.success("Redirecting to payment...");
        // Redirect to the payment URL
        window.location.href = response.data.url;
      } else {
        toast.error("Payment URL not received. Please try again.");
      }

      toast.success("Payment processed successfully!");
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Request Summary
            </h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 capitalize">
                {documentType.replace("_", " ")}
              </span>
              <span className="font-semibold text-gray-900">
                {price.toLocaleString()} RWF
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-blue-600">
                {price.toLocaleString()} RWF
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="space-y-3">
              {/* Card Payment */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === "card"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === "card"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <CreditCard size={24} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">
                    Credit/Debit Card
                  </div>
                  <div className="text-sm text-gray-500">
                    Visa, Mastercard, Amex
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "card"
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "card" && (
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  )}
                </div>
              </button>

              {/* Mobile Money */}
              {/* <button
                onClick={() => setPaymentMethod("momo")}
                className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === "momo"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === "momo"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Smartphone size={24} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">
                    Mobile Money
                  </div>
                  <div className="text-sm text-gray-500">MTN, Airtel</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "momo"
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "momo" && (
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  )}
                </div>
              </button> */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            {processing ? "Processing..." : `Pay ${price.toLocaleString()} RWF`}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
