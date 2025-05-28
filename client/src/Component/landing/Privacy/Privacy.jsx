import React from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from 'lucide-react';

export const Privacy = () => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 bg-white  z-50 p-3 md:p-0">
          <div className="bg-white rounded-xl shadow-2xl w-full h-screen relative border border-gray-100">

            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Cumulus Inc. - Privacy Policy</h2>
              </div>
          
            </div>

            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="prose prose-blue max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Effective Date: April 16, 2025</h3>
                <p className="text-gray-600 mb-4">Cumulus Inc. ("Cumulus", "we", "us", or "our") values your privacy and is committed to protecting
your personal information. This Privacy Policy explains how we collect, use, and safeguard your
data when you use our Services.</p>
                <p className="text-gray-600 mb-8">By accessing or using the Service, you agree to the terms outlined in this Policy. If you do not agree with the terms, please do not use our Service.</p>

                <div className="space-y-8">
                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li>
                        <p className="mt-2">We collect information that you provide directly to us, such as your name, email address, phone
number, and documents you choose to upload. We also collect technical data (e.g., IP address,
device type) for security and authentication purposes.
</p>
                      </li>
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">2. Two-Factor Authentication</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li>
                        <ul className="ml-6 mt-2 space-y-2">
                          <p>To help protect your account, we use two-factor authentication via email and text messaging. This
                          data is used strictly for security and account verification.</p>
                        </ul>
                      </li>
                      
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li>
                        <p className="mt-2">We use your information to:</p>
                        <ul className="ml-6 mt-2 space-y-2">
                          <li>• Provide and maintain our Services</li>
                          <li>• Authenticate your identity</li>
                          <li>• Deliver customer support</li>
                          <li>• Fulfill your instructions regarding document access and beneficiary management</li>
                          <li>• Improve the security and functionality of our platform</li>
                        </ul>
                      </li>
                   
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">4. Data Sharing & Disclosure</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li>
                        <p className="mt-2">We do not sell, rent, or trade your personal information to third parties. We may disclose your
information only in the following cases:</p>
                        <ul className="ml-6 mt-2 space-y-2">
                          <li>• With your explicit consent</li>
                          <li>• To comply with legal obligations or court orders</li>
                          <li>• To prevent fraud or enforce our Terms & Conditions</li>
                        </ul>
                      </li>
                    
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li>
                        <p className="mt-2">We implement industry-standard security measures to protect your data from unauthorized access,
alteration, disclosure, or destruction. This includes encryption, secure server infrastructure, and
two-factor authentication.</p>
                      </li>
                    
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li>
                        <p className="mt-2">We retain your data for as long as your account remains active or as needed to fulfill legal
                        obligations. You may request deletion of your data by contacting support.</p>
                      </li>
                     
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">7. Access & Control</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li>
                        <p className="mt-2">You may access, update, or delete your personal information at any time through your account
dashboard. Beneficiary access is granted only upon confirmed passing and subject to verification
protocols.</p>
                      </li>
                  
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h4>
                    <p className="text-gray-600">We do not allow third-party advertising on our platform. Any third-party integrations (such as SMS
                      delivery) are used solely to provide core services and are subject to strict privacy controls.</p>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h4>
                    <p className="text-gray-600">We may update this Privacy Policy from time to time. Any changes will be posted on this page and
                    effective immediately upon posting.</p>
                  </section>

                 

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h4>
                    <p className="text-gray-600">If you have any questions about this Privacy Policy, please contact us at:</p>
                      <a href="mailto:support@cumulus.rip" className="text-blue-600 hover:underline">support@cumulus.rip</a>
            
                  </section>

                 
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Privacy;