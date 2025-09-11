import React from "react";

export default function CheckoutButton() {
  const handlePayment = () => {
    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Razorpay test/demo key
      amount: 1000, // ₹10 in paise
      currency: "INR",
      name: "MyResume.io",
      description: "Dummy Payment for Demo",
      handler: function (response) {
        alert("Payment completed (dummy)!");
        console.log("Razorpay response:", response);
      },
      modal: {
        ondismiss: function () {
          console.log("Checkout closed");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-1/2 mx-auto block py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
    >
      Pay ₹10 & Upload
    </button>
  );
}
