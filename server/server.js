const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const stripeRoutes = require('./routes/stripeRoutes');
const { router: userRoutes } = require('./routes/userRoutes');
const fileuploadRoutes = require("./routes/fileuploadRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const voiceuploadRoutes = require("./routes/voiceuploadRoutes");
const defaultfileRoutes = require("./routes/defaultfileRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const helpandsupport = require("./routes/userhelpRoutes");
const designeeRoutes = require("./routes/designeeRoutes");
const { router: emailRoutes } = require('./email/emailUtils');
const afterlifeRoutes = require("./routes/afterlifeRoutes");
const assistanceRoutes = require('./routes/assistanceRoutes');
const faqRoutes = require('./routes/faqRoutes');
const stripeWebhook = require('./utilities/webhook');
const historyRoutes = require('./routes/historyRoutes');
const securitypassRoutes = require('./routes/securitypassRoutes');
const OtpRoutes = require('./routes/OtpRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));


// app.use('/api/payment', express.raw({ type: 'application/json' }));
app.use('/api/payment', stripeWebhook);
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: 'https://www.cumulus.rip',
  // origin: 'http://localhost:3001',
  credentials: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// app.use('/api/payment', stripeWebhook);
app.use('/api/stripe', stripeRoutes); 
app.use("/api/auth", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api", fileuploadRoutes);
app.use("/api/voice-memo", voiceuploadRoutes);
app.use("/api/default", defaultfileRoutes);
app.use("/api/otp", OtpRoutes);
app.use('/api', membershipRoutes);
app.use("/api/help-support", helpandsupport);
app.use("/api/designee", designeeRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/after-life", afterlifeRoutes);
app.use("/api", assistanceRoutes);
app.use("/api", faqRoutes);
app.use("/api", emailRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/gain-access", securitypassRoutes);
app.use("/admin", adminRoutes);


app.get('/Terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Terms.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});


const DB_URI = process.env.DB_URI;
mongoose
  .connect(DB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });




app.listen(PORT, '0.0.0.0', () => console.log(`Server running on https://www.cumulus.rip:${PORT}`));
