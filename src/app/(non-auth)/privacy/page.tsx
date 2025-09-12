import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="Privacy Policy" breadcrumbLabel="Privacy Policy" />

      {/* Privacy Policy Content */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lora']">
                Privacy Policy
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
                  1. Information We Collect
                </h3>
                <p className="mb-3">
                  We collect information you provide directly to us, such as
                  when you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>Fill out forms on our website</li>
                  <li>Contact us for legal consultation</li>
                  <li>Register as a lawyer</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Upload documents for legal services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  2. How We Use Your Information
                </h3>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>Provide legal consultation services</li>
                  <li>Connect you with qualified lawyers</li>
                  <li>Process payments and transactions</li>
                  <li>Send you important updates and notifications</li>
                  <li>Improve our services and user experience</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  3. Information Sharing
                </h3>
                <p>
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy or as required by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  4. Data Security
                </h3>
                <p>
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  5. Your Rights
                </h3>
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  6. Contact Us
                </h3>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at{" "}
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
