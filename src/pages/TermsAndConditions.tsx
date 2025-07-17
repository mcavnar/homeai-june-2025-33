
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const TermsAndConditions = () => {
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
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-500 mt-2">Last Updated: June 6, 2025</p>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-6">
          <p>
            These Terms of Service ("Terms") govern your use of the online platform and related services provided by HomeAI ("HomeAI," "we," "us," or "our") through our platform (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree with these Terms, you may not access or use the Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">1. ELIGIBILITY</h2>
          <p>
            You must be at least 18 years old and capable of forming a legally binding contract to use the Service. By registering for or using the Service, you represent and warrant that you meet these eligibility requirements.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">2. ACCOUNT REGISTRATION & SECURITY</h2>
          <p>
            <strong>Account Creation.</strong> To access certain features of the Service (e.g., uploading and storing inspection reports), you may need to create an account and provide accurate, complete, and current information, including a valid email address and a secure password.
          </p>
          <p>
            <strong>Account Credentials.</strong> You are solely responsible for maintaining the confidentiality of your account credentials (e.g., username and password) and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or suspected breach of security. HomeAI will not be liable for any loss or damage arising from your failure to keep your credentials secure.
          </p>
          <p>
            <strong>Account Termination.</strong> We reserve the right to suspend or terminate your account, in our sole discretion, if you violate these Terms or engage in any fraudulent, abusive, or illegal behavior.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">3. SERVICE DESCRIPTION</h2>
          <p>
            HomeAI provides an online platform where registered users can:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Upload home inspection reports in digital formats (e.g., PDF, DOCX).</li>
            <li>Read analysis of these reports</li>
          </ul>
          <p>
            We do not prepare, review, or verify the contents of any inspection report uploaded by users. You acknowledge that HomeAI acts only as a storage and retrieval service for user-provided content.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">4. USER CONTENT</h2>
          <p>
            <strong>User Responsibility.</strong> You retain full ownership of any home inspection reports or other materials (collectively, "Content") that you upload to the Service. By uploading Content, you represent and warrant that you have all necessary rights, licenses, and permissions to store and distribute that Content as contemplated by these Terms.
          </p>
          <p>
            <strong>License Grant.</strong> By uploading Content, you grant HomeAI a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, store, reproduce, modify, and display your Content solely to operate, provide, and improve the Service. You may revoke this license at any time by deleting your Content or terminating your account.
          </p>
          <p>
            <strong>Prohibited Content.</strong> You may not upload, store, or distribute Content that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Violates any applicable law, regulation, or third-party right (including intellectual property, privacy, or publicity rights).</li>
            <li>Contains defamatory, obscene, harassing, hateful, or otherwise objectionable material.</li>
            <li>Contains viruses, malware, or any code intended to disrupt, damage, or limit the functioning of any software or hardware.</li>
            <li>Impersonates another person or entity, or misrepresents your affiliation with a person or entity.</li>
            <li>Is intended to facilitate the planning or execution of illegal activities.</li>
          </ul>
          <p>
            If we determine, in our sole discretion, that your Content violates these prohibitions, we may remove or disable access to it without notice.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">5. PRIVACY</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the Service, you agree to the collection and use of information as described in the Privacy Policy. The Privacy Policy is incorporated by reference into these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">6. FEES & PAYMENT</h2>
          <p>
            <strong>Free Tier vs. Paid Plans.</strong> HomeAI may offer both free and paid subscription plans. The features, storage limits, and pricing for each plan will be described on our website. We reserve the right to modify pricing, storage quotas, and feature availability at any time, upon notice.
          </p>
          <p>
            <strong>Billing Cycle.</strong> Unless otherwise specified, paid subscriptions will renew automatically on a monthly or annual basis (depending on your chosen billing cycle) until canceled. You authorize HomeAI (or its billing processor) to charge the payment method you provide for all recurring fees.
          </p>
          <p>
            <strong>Late or Failed Payments.</strong> If a payment fails or is late, we may suspend access to your paid features or storage until the balance is paid. We are not responsible for any loss of access, data, or functionality resulting from failed payments.
          </p>
          <p>
            <strong>Refunds.</strong> Except where required by law, all fees are non-refundable. We do not offer prorated refunds for partial billing periods. If you believe you are entitled to a refund, please contact us, and we will consider refund requests on a case-by-case basis.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">7. INTELLECTUAL PROPERTY</h2>
          <p>
            <strong>Our Content.</strong> The Service, including all text, graphics, logos, software, and other materials (excluding your Content), is owned by HomeAI or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, republish, or create derivative works from any part of the Service without our prior written consent.
          </p>
          <p>
            <strong>Trademarks.</strong> "HomeAI" and related logos are trademarks owned by HomeAI or its affiliates. You agree not to use our trademarks without our express permission.
          </p>
          <p>
            <strong>Feedback.</strong> If you provide suggestions, feedback, or ideas ("Feedback") about the Service, you grant HomeAI a worldwide, perpetual, irrevocable, royalty-free license to use, reproduce, modify, and incorporate such Feedback into the Service or other products at our discretion.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">8. PROHIBITED USES</h2>
          <p>
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Use the Service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.</li>
            <li>Bypass or attempt to bypass any security measures or access restrictions on the Service.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service, including using bots, scrapers, or automated scripts.</li>
            <li>Engage in "spamming," "phishing," or unsolicited advertising.</li>
            <li>Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code of any part of the Service.</li>
            <li>Use the Service to store or transmit infringing, libelous, or otherwise unlawful or tortious material.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">9. DISCLAIMERS</h2>
          <p>
            <strong>NO PROFESSIONAL ADVICE.</strong> The Service is a platform for storing and retrieving home inspection reports. HomeAI does not provide inspection, legal, real estate, or other professional advice. You should consult a qualified professional for any decisions based on your inspection report.
          </p>
          <p>
            <strong>"AS IS" AND "AS AVAILABLE."</strong> THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. HOMEAI MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
          </p>
          <p>
            <strong>NO VERIFICATION.</strong> HomeAI does not verify the accuracy, completeness, or legality of any Content uploaded by users. You acknowledge that reliance on any Content is at your own risk.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">10. LIMITATION OF LIABILITY</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL HOMEAI, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION, OR DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE SERVICE, EVEN IF HOMEAI HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. HOMEAI'S AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO HOMEAI IN THE SIX (6) MONTHS PRECEDING THE CLAIM.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">11. INDEMNIFICATION</h2>
          <p>
            You agree to defend, indemnify, and hold harmless HomeAI and its officers, directors, employees, agents, and licensors from and against all claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Your breach of these Terms;</li>
            <li>Your violation of any applicable law or third-party right;</li>
            <li>Your Content or the use of your Content by others;</li>
            <li>Any activity related to your account by you or any other person accessing the Service using your account.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">12. TERMINATION</h2>
          <p>
            <strong>Termination by You.</strong> You may delete your account at any time by following the instructions on the Service or contacting us. Upon deletion, your Content will be removed from active systems; however, copies may remain in backup archives for a reasonable time.
          </p>
          <p>
            <strong>Termination by HomeAI.</strong> We may suspend or terminate your access to all or part of the Service at any time, without notice, for any reason, including if we believe you have violated these Terms.
          </p>
          <p>
            <strong>Effect of Termination.</strong> Upon termination, all licenses granted to you under these Terms will immediately cease. Sections 4 ("User Content"), 7 ("Intellectual Property"), 9 ("Disclaimers"), 10 ("Limitation of Liability"), 11 ("Indemnification"), 12.3 ("Effect of Termination"), 13 ("Governing Law & Dispute Resolution"), and 14 ("General Provisions") shall survive any termination of your account or of these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">13. GOVERNING LAW & DISPUTE RESOLUTION</h2>
          <p>
            <strong>Governing Law.</strong> These Terms and any disputes arising out of or related to these Terms or the Service shall be governed by and construed in accordance with the laws of the State of California, excluding its conflict of law principles.
          </p>
          <p>
            <strong>Arbitration.</strong> You agree that any dispute, claim, or controversy arising out of or in connection with these Terms or the Service, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules. The arbitration shall take place in Los Angeles County, California, or another mutually agreed location. Judgment on the arbitrator's award may be entered in any court having jurisdiction.
          </p>
          <p>
            <strong>Small Claims & Injunctive Relief.</strong> Notwithstanding the foregoing, either party may bring an individual action in a small claims court for disputes or seek injunctive relief in a court of competent jurisdiction to prevent actual or threatened infringement, misappropriation, or violation of a party's intellectual property or proprietary rights.
          </p>
          <p>
            <strong>No Class Actions.</strong> You and HomeAI agree that any arbitration shall be solely on an individual basis; class arbitrations and class actions are not permitted.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">14. GENERAL PROVISIONS</h2>
          <p>
            <strong>Modifications to the Terms.</strong> We reserve the right to modify these Terms at any time. If we make material changes, we will notify you via email or by posting a notice on the Service prior to the effective date. Your continued use of the Service after any such changes constitutes your acceptance of the modified Terms.
          </p>
          <p>
            <strong>Severability.</strong> If any provision of these Terms is held to be invalid or unenforceable by a court of competent jurisdiction, that provision will be enforced to the maximum extent permissible, and the remaining provisions of these Terms will remain in full force and effect.
          </p>
          <p>
            <strong>Waiver.</strong> No waiver of any term or condition in these Terms shall be deemed a further or continuing waiver of such term or condition or any other term or condition.
          </p>
          <p>
            <strong>Assignment.</strong> You may not assign or transfer these Terms, by operation of law or otherwise, without our prior written consent. We may assign or transfer these Terms without restriction.
          </p>
          <p>
            <strong>Entire Agreement.</strong> These Terms, together with any documents they incorporate by reference (including the Privacy Policy), constitute the entire agreement between you and HomeAI regarding the Service and supersede all prior or contemporaneous agreements, understandings, and communications, whether written or oral.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8">15. CONTACT US</h2>
          <p>
            If you have any questions, concerns, or feedback about these Terms or the Service, please contact us at:
          </p>
          <p className="mt-2">
            HomeAI<br />
            Email: info@fivefourventures.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
