const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Userlogin } = require("../models/userModel");
const PaymentDetails = require("../models/paymentDetailsModel");
const { sendEmail } = require("../email/emailUtils");

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("🔹 Webhook received!");

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("🔹 Event Verified:", JSON.stringify(event, null, 2));
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);

    await sendEmail({
      to: "sonu@techarchsoftwares.in",
      subject: "❌ Webhook Signature Verification Failed",
      body: `<p>Error: ${err.message}</p>`,
    });

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "invoice.payment_succeeded") {
    let invoice = event.data.object;
    let user_id = invoice.customer; 
    let subscription_id = invoice.subscription; 
    let amount_paid = invoice.amount_paid / 100; 
    let currency = invoice.currency;
    let payment_status = invoice.status;
    let invoice_url = invoice.hosted_invoice_url;
    let invoice_id = invoice.id;

    console.log("🟢 Invoice Payment Succeeded:", { user_id, subscription_id, amount_paid, currency, payment_status });

    try {
      const user = await Userlogin.findById(user_id);
      if (!user) {
        console.error("❌ User not found:", user_id);

        await sendEmail({
          to: "sonu@techarchsoftwares.in",
          subject: "❌ Payment Processing Failed - User Not Found",
          body: `<p>User ID: ${user_id} not found in the database.</p>`,
        });

        return res.status(404).json({ error: "User not found" });
      }

      const paymentDetails = new PaymentDetails({
        user_id,
        subscription_id,
        amount_paid,
        currency,
        payment_status,
        invoice_url,
        invoice_id,
        expiryDate: new Date(invoice.lines.data[0].period.end * 1000),
      });

      await paymentDetails.save();
      console.log("✅ Payment Details Saved!");

      const newMembership = {
        subscription_id,
        buyingDate: new Date(),
        planTime: "1 month",
        expiryDate: new Date(invoice.lines.data[0].period.end * 1000),
      };

      if (!Array.isArray(user.memberships)) {
        user.memberships = [];
      }
      user.memberships.push(newMembership);
      user.activeMembership = true;

      await user.save();
      console.log("✅ User Subscription Updated!");

      res.status(200).json({ success: true, subscription_id });

      const emailData = {
        to: user.email,
        subject: "✅ Payment Confirmed – Your Subscription is Active!",
        body: `
          <p>Hi ${user.username},</p>
          <p>Your payment has been successfully processed and your subscription is now active.</p>
          <h3>📜 Subscription Details:</h3>
          <ul>
            <li>📌 Subscription ID: <strong>${subscription_id}</strong></li>
            <li>📅 Next Billing Date: <strong>${new Date(invoice.lines.data[0].period.end * 1000).toDateString()}</strong></li>
          </ul>
          <p>📄 <strong>Download your invoice:</strong> <a href="${invoice_url}" target="_blank">Click here</a></p>
          <p>You can manage your subscription anytime in your <a href="https://yourwebsite.com/account">Account Settings</a>.</p>
          <p>Thank you for being a valued customer!</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Your Company Team</strong></p>
        `,
      };

      try {
        const response = await sendEmail(emailData);
        if (!response.success) {
          console.error("❌ Email sending failed:", response.error);

          await sendEmail({
            to: "sonu@techarchsoftwares.in",
            subject: "❌ Payment Success, But Email Failed",
            body: `<p>Payment processed successfully for User ID: ${user_id}, but email failed.</p>`,
          });
        } else {
          console.log("✅ Email sent successfully:", response.previewURL);
        }
      } catch (emailError) {
        console.error("❌ Email error:", emailError);

        await sendEmail({
          to: "sonu@techarchsoftwares.in",
          subject: "❌ Email Sending Error",
          body: `<p>Error: ${emailError.message}</p>`,
        });
      }

    } catch (error) {
      console.error("❌ Error processing payment:", error);

      await sendEmail({
        to: "sonu@techarchsoftwares.in",
        subject: "❌ Internal Server Error During Payment Processing",
        body: `<p>Error Details: ${error.message}</p>`,
      });

      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  } else {
    console.log("ℹ️ Received an unhandled event:", event.type);

    await sendEmail({
      to: "sonu@techarchsoftwares.in",
      subject: "ℹ️ Unhandled Webhook Event",
      body: `<p>Event Type: ${event.type}</p>`,
    });
  }

  res.status(200).json({ received: true });
});

module.exports = router;
