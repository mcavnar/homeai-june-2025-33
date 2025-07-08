
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-500 mt-2">Last Updated: June 6, 2025</p>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-6">
          <p>
            This Privacy Policy ("Policy") applies to the collection, use, and disclosure of personal 
            information by HomeAi ("HomeAi," "we," "us," or "our") in connection with our online platform, 
            available at [your‐platform‐URL], where users can upload, store, and access home inspection 
            reports (collectively, the "Services").
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">1. UPDATES TO THIS PRIVACY POLICY</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make changes, we will post the updated 
            Policy on our website and, where required by law, notify you via email or another communication method. 
            Your continued use of the Services after any changes indicates your acceptance of the updated Policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">2. PERSONAL INFORMATION WE COLLECT</h2>
          <p>
            We collect personal information you provide directly and personal information obtained automatically 
            when you use the Services. We also may collect information from third‐party sources.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">A. Personal Information You Provide to Us Directly</h3>
          <p>
            <strong>Account Information.</strong> When you create an account, you may provide us with your name, email address, 
            password, and contact information (e.g., phone number).
          </p>
          <p>
            <strong>Inspection Reports and Related Data.</strong> You upload home inspection reports (e.g., PDF, DOCX), which may 
            contain property details (such as address, owner name, photographs, or notes). We treat the contents of these reports 
            as personal information if they include identifiers or other sensitive data.
          </p>
          <p>
            <strong>Communications.</strong> If you contact us via email, support ticket, or feedback form, we collect any information 
            you provide (e.g., name, email address, message content).
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">B. Personal Information Collected Automatically</h3>
          <p>
            <strong>Usage Data.</strong> We collect information about how you interact with our Services, including IP address, 
            device type, browser type, pages visited, timestamps, and referring URLs.
          </p>
          <p>
            <strong>Cookies and Tracking Technologies.</strong> We and third parties may use cookies, pixel tags, and similar 
            technologies to collect data about your activities on our site for analytics, personalization, and security purposes. 
            You can manage or disable cookies through your browser settings, though some features may not function properly if 
            cookies are disabled.
          </p>
          <p>
            <strong>Analytics Services.</strong> We use Google Analytics 4 and Hotjar to collect and analyze information about how 
            users interact with our Services. These services may collect information such as your IP address, browser type, pages 
            visited, time spent on pages, and other usage statistics. Google Analytics uses cookies to track your interactions, 
            and Hotjar may record user sessions and create heatmaps of user behavior. You can opt out of Google Analytics by installing 
            the Google Analytics opt-out browser add-on, and you can opt out of Hotjar by visiting their opt-out page.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">C. Personal Information Collected from Third‐Party Sources</h3>
          <p>
            <strong>Service Integrations.</strong> If you choose to link a third‐party service (e.g., a cloud storage provider), 
            we may obtain basic profile information (such as name, email, and account ID) from that service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">3. HOW WE USE PERSONAL INFORMATION</h2>
          <p>
            We use the personal information we collect for various business purposes, including to provide, maintain, and improve 
            our Services, communicate with you, and comply with legal obligations.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">A. Provide and Operate the Services</h3>
          <p>
            <strong>Report Storage & Retrieval.</strong> We use your uploaded inspection reports to store and retrieve them at your request.
          </p>
          <p>
            <strong>Account Management.</strong> We use account information to authenticate you, manage your profile, and enable you to 
            access and manage your uploaded reports.
          </p>
          <p>
            <strong>Customer Support.</strong> We use the information you provide in support requests to respond to your inquiries and 
            resolve issues.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">B. Administrative & Operational Purposes</h3>
          <p>
            <strong>Security & Fraud Prevention.</strong> We use log data, IP addresses, and device information to detect and prevent 
            unauthorized access, fraudulent activity, and other security incidents.
          </p>
          <p>
            <strong>Service Improvement.</strong> We perform analytics on usage patterns to improve our platform, develop new features, 
            and optimize performance. This includes using Google Analytics 4 to understand user behavior and Hotjar to analyze user 
            interactions through heatmaps and session recordings.
          </p>
          <p>
            <strong>Compliance & Legal Obligations.</strong> We use information as necessary to comply with applicable laws, respond 
            to lawful requests, and enforce our agreements.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">C. Marketing (With Your Consent)</h3>
          <p>
            <strong>Promotional Communications.</strong> We may send you marketing emails or newsletters if you opt in. You can 
            unsubscribe at any time by following the instructions in the communication or contacting us directly.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">D. Other Purposes with Your Consent</h3>
          <p>
            <strong>Additional Uses.</strong> We may use your information for any other purposes disclosed to you at the time of 
            collection or with your consent.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">4. HOW WE DISCLOSE PERSONAL INFORMATION</h2>
          <p>
            We do not sell personal information. We disclose personal information only as described below and in accordance with 
            applicable law.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">A. Service Providers</h3>
          <p>
            We share your personal information with third‐party vendors and service providers who perform services on our behalf 
            (e.g., hosting providers, analytics providers like Google Analytics and Hotjar, email service providers). These providers 
            are bound by contractual obligations to keep your information confidential and to use it only for the services they perform.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">B. Legal & Safety Reasons</h3>
          <p>
            We may access, preserve, and disclose your information if we believe in good faith that disclosure is necessary to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Comply with any applicable law, regulation, legal process, or governmental request;</li>
            <li>Enforce our terms, policies, and agreements;</li>
            <li>Protect the rights, property, or safety of HomeAi, our users, or others;</li>
            <li>Detect, prevent, or otherwise address fraud, security, or technical issues.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">C. Business Transfers</h3>
          <p>
            If HomeAi is involved in a merger, acquisition, reorganization, or sale of assets, personal information may be 
            transferred as part of that transaction. We will notify you before your information is transferred and becomes 
            subject to a different privacy policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">5. YOUR PRIVACY CHOICES</h2>
          <p>
            You have certain choices regarding how we use and share your personal information.
          </p>
          <p>
            <strong>Email Communications.</strong> You can opt out of marketing emails by following the "unsubscribe" link in any 
            email or contacting us at the address below. Note that you cannot opt out of transactional or service‐related emails.
          </p>
          <p>
            <strong>Cookies & Tracking.</strong> You can manage or disable cookies and similar technologies through your browser 
            settings. However, disabling cookies may affect your ability to use certain features.
          </p>
          <p>
            <strong>Analytics Opt-Out.</strong> You can opt out of Google Analytics tracking by installing the Google Analytics 
            opt-out browser add-on available at: https://tools.google.com/dlpage/gaoptout. You can opt out of Hotjar by visiting: 
            https://www.hotjar.com/legal/compliance/opt-out.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">6. INTERNATIONAL TRANSFERS OF PERSONAL INFORMATION</h2>
          <p>
            Your information may be transferred to, and processed in, countries other than your country of residence (for example, 
            to the United States). Data protection laws in these jurisdictions may differ from those in your country. When we transfer 
            your information internationally, we will implement appropriate safeguards (such as standard contractual clauses) to protect 
            your personal information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">7. CHILDREN'S INFORMATION</h2>
          <p>
            Our Services are not intended for children under the age of 16, and we do not knowingly collect personal information 
            from children under 16. If we become aware that a child under 16 has provided us with personal information, we will 
            delete such information unless we have a legal obligation to retain it.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">8. THIRD‐PARTY WEBSITES & RESOURCES</h2>
          <p>
            Our Services may contain links to third‐party websites or services that are not operated by us. This Privacy Policy 
            does not apply to those third‐party websites. We encourage you to review the privacy policies of any third‐party 
            websites you visit.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">9. CONTACT US</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our practices, or if you wish to exercise any of 
            your rights, please contact us at:
          </p>
          <p className="mt-2">
            HomeAi<br />
            Email: info@fivefourventures.com
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">Definitions and Additional Details</h2>
          <p>
            "Personal information" refers to any information that identifies, relates to, describes, or could reasonably 
            be linked with a particular individual.
          </p>
          <p>
            <strong>Retention Periods.</strong> We retain personal information for as long as necessary to provide the 
            Services, comply with our legal obligations, resolve disputes, and enforce our agreements. Analytics data 
            collected by Google Analytics and Hotjar is subject to their respective data retention policies.
          </p>
          <p>
            <strong>Your Rights.</strong> Subject to applicable law, you may have rights to access, correct, delete, or restrict 
            processing of your personal information, as well as to object to certain processing or request portability. To 
            exercise these rights, please contact us using the information above.
          </p>

          <p className="mt-8">
            Thank you for trusting HomeAi with your data. We are committed to protecting your privacy and ensuring the 
            security of your home inspection reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
