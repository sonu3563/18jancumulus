const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ✅ Keep express.raw() for raw body handling
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("🔹 Webhook received!");

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    console.log("🔹 Headers:", req.headers);
    console.log("🔹 Raw Body Type:", typeof req.body); // Should be 'object'
    console.log("🔹 Raw Body as String:", req.body.toString()); // Should be a raw JSON string

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔹 Event Received:", event.type);
  return res.status(200).json({ received: true });
});

module.exports = router;
