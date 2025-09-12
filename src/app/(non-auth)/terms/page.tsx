import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="Terms & Conditions" breadcrumbLabel="Terms & Conditions" />

      {/* Terms & Conditions Content */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lora']">
                Terms & Conditions
              </h2>
              <p className="text-gray-600">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing and using {COMPANY_CONFIG.name}'s website and
                  services, you accept and agree to be bound by the terms and
                  provision of this agreement.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  2. Services Description
                </h3>
                <p className="mb-3">
                  {COMPANY_CONFIG.name} provides legal consultation services
                  including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>Legal document drafting and review</li>
                  <li>Online legal consultation</li>
                  <li>Lawyer-client matching services</li>
                  <li>Document upload and storage</li>
                  <li>Payment processing for legal services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  3. User Responsibilities
                </h3>
                <p className="mb-3">As a user of our services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>Provide accurate and truthful information</li>
                  <li>Maintain the confidentiality of your account</li>
                  <li>Use the services for lawful purposes only</li>
                  <li>Respect the intellectual property rights of others</li>
                  <li>Not misuse or attempt to gain unauthorized access</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  4. Payment Terms
                </h3>
                <p className="mb-3">Payment terms and conditions:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>All fees are payable in advance of service delivery</li>
                  <li>Prices are subject to change with prior notice</li>
                  <li>Refunds are processed according to our refund policy</li>
                  <li>
                    Payment methods accepted: Credit/Debit cards, UPI, Net
                    Banking
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  5. Limitation of Liability
                </h3>
                <p>
                  {COMPANY_CONFIG.name} shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including but not limited to loss of profits, data, or use.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  6. Intellectual Property
                </h3>
                <p>
                  All content on this website, including text, graphics, logos,
                  and software, is the property of {COMPANY_CONFIG.name} and is
                  protected by copyright and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  7. Privacy and Data Protection
                </h3>
                <p>
                  Your privacy is important to us. Please review our{" "}
                  <a
                    href="/privacy"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  which also governs your use of our services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  8. Termination
                </h3>
                <p>
                  We may terminate or suspend your access to our services
                  immediately, without prior notice, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  9. Governing Law
                </h3>
                <p>
                  These Terms shall be interpreted and governed by the laws of
                  the United Kingdom, without regard to its conflict of law
                  provisions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  10. Contact Information
                </h3>
                <p>
                  If you have any questions about these Terms & Conditions,
                  please contact us at{" "}
                  <a
                    href={`mailto:${COMPANY_CONFIG.contact.email}`}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    {COMPANY_CONFIG.contact.email}
                  </a>{" "}
                  or call us at{" "}
                  <a
                    href={`tel:${COMPANY_CONFIG.contact.phone}`}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    {COMPANY_CONFIG.contact.phone}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Tenth
        companyName={COMPANY_CONFIG.name}
        companyDescription={COMPANY_CONFIG.description}
        contactInfo={{
          address: COMPANY_CONFIG.contact.address,
          phone: COMPANY_CONFIG.contact.phone,
          email: COMPANY_CONFIG.contact.email,
        }}
        newsletterTitle={COMPANY_CONFIG.newsletter.title}
        newsletterDescription={COMPANY_CONFIG.newsletter.description}
        showNewsletter={true}
        copyrightText={COMPANY_CONFIG.copyright}
      />
    </main>
  );
}
