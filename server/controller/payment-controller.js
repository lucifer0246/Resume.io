import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Payment from "../model/Payment.js";

// ✅ Create Razorpay order (fixed ₹10)
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const FIXED_AMOUNT = 10 * 100; // ₹10 in paise

    const options = {
      amount: FIXED_AMOUNT,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Save order in DB
    const payment = await Payment.create({
      userId,
      orderId: order.id,
      amount: FIXED_AMOUNT,
      currency: order.currency,
      status: "created",
    });

    res.json({ success: true, order, payment });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};

// ✅ Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id, userId },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: "paid",
        },
        { new: true }
      );

      res.json({ success: true, message: "Payment verified" });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id, userId },
        { status: "failed" }
      );

      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ success: false, error: "Verification failed" });
  }
};
