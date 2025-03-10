const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware to handle raw body parsing specifically for the webhook
router.use("/webhook", express.raw({ type: "application/json" }));

router.post("/webhook", async (req, res) => {
  console.log("🔹 Webhook received!");

  const sig = req.headers["stripe-signature"];
  
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    console.log("🔹 Headers:", req.headers);
    console.log("🔹 Raw Body:", req.body.toString()); // Convert Buffer to String for logging

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔹 Event Received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Payment Successful:", session);

    const metadata = session.metadata || {};

    const paymentData = {
      sessionId: session.id,
      customerEmail: session.customer_email,
      planType: metadata.planType || "N/A",
      duration: metadata.duration || "N/A",
      amountPaid: session.amount_total / 100,
      currency: session.currency,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + (metadata.duration === "monthly" ? 1 : 12))),
    };

    console.log("✅ Payment Data:", paymentData);

    return res.status(200).json({ received: true });
  }

  console.warn("⚠️ Unhandled event type:", event.type);
  res.status(400).json({ error: "Unhandled event type" });
});

module.exports = router;
