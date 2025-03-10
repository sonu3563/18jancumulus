const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../services/stripeService");

router.post("/create-checkout-session", async (req, res) => {
  console.log("Received request body:", req.body); 

  const { planType, duration } = req.body;

  if (!planType || !duration) {
    console.log("❌ Missing required fields:", { planType, duration }); // ✅ Log missing values
    return res.status(400).json({ error: "planType and duration are required." });
  }

  try {
    const session = await createCheckoutSession({ planType, duration });

    res.json({
      id: session.id,
      startDate: session.metadata.startDate,
      endDate: session.metadata.endDate,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
