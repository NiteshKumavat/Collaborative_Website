import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { authUser, createPaymentOrder, verifyPayment } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!authUser) {
      toast.error("Please login to upgrade");
      return;
    }

    if (authUser.plan === "pro") {
      toast.success("You are already on the Pro plan!");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order on our backend
      const order = await createPaymentOrder();
      
      if (!order) {
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CollabSpace",
        description: "Upgrade to Pro",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          navigate("/"); // Go back home on success
        },
        prefill: {
          name: authUser.fullName,
          email: authUser.email,
        },
        theme: {
          color: "#8B5CF6", // Purple to match UI
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response) {
        console.log("Payment Failed:", response.error);
        toast.error("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-20">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">
          Choose your <span className="text-purple-400">Plan</span>
        </h1>
        <p className="text-gray-400 mt-4">
          Simple pricing for developers and teams using CollabSpace.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* Free Plan */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Free</h2>
          <p className="text-gray-400 mb-6">Perfect for individual developers</p>

          <h3 className="text-4xl font-bold mb-6">₹0</h3>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li>✔ Explore projects</li>
            <li>✔ Join teams</li>
            <li>✔ Basic chat</li>
            <li>✔ Developer profile</li>
          </ul>

          <button className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
            {authUser?.plan === 'free' ? 'Current Plan' : 'Free Plan'}
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 rounded-2xl p-8 relative">

          <span className="absolute top-4 right-4 bg-purple-500 text-xs px-3 py-1 rounded-full">
            Popular
          </span>

          <h2 className="text-2xl font-semibold mb-4">Pro</h2>
          <p className="text-gray-400 mb-6">For serious builders & teams</p>

          <h3 className="text-4xl font-bold mb-6">
            ₹199<span className="text-lg text-gray-400">/month</span>
          </h3>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li>✔ Create unlimited teams</li>
            <li>✔ Priority project listing</li>
            <li>✔ Advanced chat</li>
            <li>✔ File sharing</li>
            <li>✔ Team collaboration tools</li>
          </ul>

          <button 
            onClick={handlePayment} 
            disabled={isProcessing || authUser?.plan === 'pro'}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : (authUser?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Pricing;