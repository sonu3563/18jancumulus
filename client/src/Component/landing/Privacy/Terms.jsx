import React from 'react'
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scroll } from 'lucide-react';

export const Terms = () => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 bg-white  z-50 p-3 md:p-0">
          <div className="bg-white rounded-xl shadow-2xl w-full h-screen relative border border-gray-100">
            {/* Header Section */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <Scroll className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Cumulus Inc. - Terms & Conditions</h2>
              </div>
              {/* <button
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button> */}
            </div>

            {/* Terms Content */}
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="prose prose-blue max-w-none">
                {/* <h3 className="text-2xl font-bold text-gray-900 mb-6">Cumulus Inc. - Terms & Conditions</h3> */}
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Effective Date: April 16, 2025</h3>
                <p className="text-gray-600 mb-4">Welcome to Cumulus Inc. ("Cumulus", "we", "us", or "our"). By accessing or using our services,
including our website and cloud storage platform (collectively, the "Services"), you agree to be
bound by the following Terms & Conditions ("Terms"). If you do not agree with these Terms, please
do not use our Services.
</p>
                <p className="text-gray-600 mb-8">Please read these Terms carefully. By accessing or using the Service, you agree to comply with and be bound by these Terms and all applicable laws.</p>

                <div className="space-y-8">
                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">1. Use of Services</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong> Cumulus provides secure cloud storage services for users who wish to preserve and share digital
documents for posthumous access by designated beneficiaries. You may use our Services only in
compliance with these Terms and all applicable laws.</p>
                      {/* <li><strong className="text-gray-900">1.2 Acceptance of Terms:</strong> Your use of the Service indicates that you have read, understood, and agree to be bound by these Terms, including any future modifications.</li>
                      <li><strong className="text-gray-900">1.3 Amendments to the Terms:</strong> Cumulus reserves the right to modify or amend these Terms at any time. Changes will be effective upon posting to our website or notification via the Service. Your continued use after any modifications means you accept the new Terms.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">2. User Accounts & Security</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong> You are responsible for maintaining the confidentiality of your account information and are required
to use two-factor authentication (2FA), which includes email and text message verification. You
agree to notify us immediately of any unauthorized use of your account.</p>
                      {/* <li><strong className="text-gray-900">2.2 Account Information:</strong> You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities conducted through your account.</li>
                      <li><strong className="text-gray-900">2.3 Accuracy of Information:</strong> You agree to provide accurate, current, and complete information about yourself when registering. You must update your information to maintain its accuracy.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">3. Eligibility</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong>By using our Services, you represent that you are at least 18 years of age and legally able to enter
                      into binding agreements.</p>
                      {/* <li><strong className="text-gray-900">3.2 Billing Cycle:</strong> Subscription fees are billed either monthly or annually, depending on your selection at the time of purchase. Payments are due at the beginning of each billing cycle.</li>
                      <li><strong className="text-gray-900">3.3 Automatic Renewal:</strong> Unless you cancel your subscription, your plan will automatically renew at the end of each billing cycle. You can manage renewal settings through your account.</li>
                      <li><strong className="text-gray-900">3.4 Payment Methods:</strong> By subscribing, you authorize Cumulus to charge your provided payment method for the fees associated with your selected subscription.</li>
                      <li><strong className="text-gray-900">3.5 Refund Policy:</strong> Subscription fees are non-refundable. Partial refunds are not available if you terminate your subscription before the end of a billing cycle.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">4. Document Access & Permissions</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong>You may designate individuals to receive access to your stored documents in the event of your
passing. It is your responsibility to keep this beneficiary list current. Cumulus is not liable for any
disputes arising from incorrect or outdated beneficiary information.</p>
                      {/* <li><strong className="text-gray-900">4.2 Prohibited Use:</strong> You agree not to:
                        <ul className="ml-6 mt-2 space-y-2">
                          <li>• Engage in any activity that interferes with or disrupts the Service.</li>
                          <li>• Attempt to gain unauthorized access to our systems.</li>
                          <li>• Reverse engineer or disassemble any part of the Service.</li>
                        </ul>
                      </li> */}
                      {/* <li><strong className="text-gray-900">4.3 User Responsibilities:</strong> You are responsible for your use of the Service and any data you share or upload. You agree not to misuse the Service in any way.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">5. Service Availability</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong>We strive to maintain uninterrupted access to our Services. However, we reserve the right to modify,
                      suspend, or discontinue any part of the Services without notice at any time.</p>
                      {/* <li><strong className="text-gray-900">5.2 License Restrictions:</strong> You may not distribute, modify, transmit, reuse, download, repost, or use the content of the Service without Cumulus's prior written permission.</li>
                      <li><strong className="text-gray-900">5.3 Intellectual Property Rights:</strong> All trademarks, logos, and service marks displayed through the Service are the property of Cumulus or third parties. You are not permitted to use them without prior consent.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h4>
                    <ul className="space-y-4 text-gray-600">
                      <li><strong className="text-gray-900"></strong>All content, trademarks, and technology associated with the Services are the property of Cumulus
Inc. or its licensors. You may not reproduce, distribute, or create derivative works without explicit
permission.</li>
                      {/* <li><strong className="text-gray-900">6.2 Data Protection:</strong> We use industry-standard encryption and security protocols to protect your data. However, Cumulus cannot guarantee that unauthorized third parties will never be able to defeat our security measures.</li>
                      <li><strong className="text-gray-900">6.3 User Rights:</strong> Under applicable data protection laws, you may have the right to request access to, modification of, or deletion of your personal data.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong>To the fullest extent permitted by law, Cumulus Inc. shall not be liable for any indirect, incidental,
special, consequential, or punitive damages arising out of or relating to your use of or inability to use
the Services.</p>
                      {/* <li><strong className="text-gray-900">7.2 Termination by Cumulus:</strong> We reserve the right to terminate or suspend your account immediately, without notice, for conduct that violates these Terms or is harmful to other users of the Service.</li>
                      <li><strong className="text-gray-900">7.3 Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease. All of your data and content may be deleted within a reasonable time, except as otherwise required by law.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">8. Termination</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong>We may suspend or terminate your access to the Services at any time, with or without cause or
                      notice. Upon termination, your right to use the Services will cease immediately.</p>
                      {/* <li><strong className="text-gray-900">8.2 Limitation on Damages:</strong> To the extent permitted by law, Cumulus shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Service.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">9. Governing Law</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in
                      which Cumulus Inc. is headquartered, without regard to its conflict of law provisions.</p>
                      {/* <li><strong className="text-gray-900">9.2 Arbitration:</strong> Any dispute arising from these Terms will be settled by arbitration in [Location], and you consent to personal jurisdiction in [Location] for the purposes of arbitrating such disputes.</li> */}
                    </ul>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h4>
                    <ul className="space-y-4 text-gray-600">
                      <p><strong className="text-gray-900"></strong>We reserve the right to update these Terms at any time. Continued use of the Services after any
                      modifications constitutes your acceptance of the revised Terms.</p>
                      {/* <li><strong className="text-gray-900">10.2 Severability:</strong> If any part of these Terms is held invalid or unenforceable, that part will be construed to reflect the parties' original intent, and the remaining portions will remain in full force.</li>
                      <li><strong className="text-gray-900">10.3 Waiver:</strong> No waiver by Cumulus of any breach of these Terms shall be a waiver of any preceding or succeeding breach.</li> */}
                    </ul>
                  </section>

                  <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h4 className="text-xl font-semibold text-blue-900 mb-4">11. Contact Information</h4>
                    <div className="text-blue-700">
                      <strong></strong> If you have questions or concerns regarding these Terms, please contact us at{' '}
                      <a href="mailto:support@cumulus.rip" className="text-blue-600 hover:underline">support@cumulus.rip</a>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Terms;