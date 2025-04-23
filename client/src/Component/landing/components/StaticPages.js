// StaticPages.js
import React from 'react';

export const TermsPage = () => (
  <iframe
    src="/Terms.html"
    title="Terms and Conditions"
    width="100%"
    height="100%"
    style={{ border: 'none', minHeight: '100vh' }}
  />
);

export const PrivacyPage = () => (
  <iframe
    src="/privacy.html"
    title="Privacy Policy"
    width="100%"
    height="100%"
    style={{ border: 'none', minHeight: '100vh' }}
  />
);
