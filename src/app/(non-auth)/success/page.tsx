"use client";

import { useState } from "react";
import ServiceNavbar from "@/components/non-auth-comp/(services)/service-navbar";
import ServiceFooter from "@/components/non-auth-comp/(services)/service-footer";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <ServiceNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        onMobileMenuClose={handleMobileMenuClose}
      />

      <div className="pt-20 sm:pt-24 lg:pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mb-8">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Case Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for choosing our services. We have received your case
                details and will contact you soon.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What happens next?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Review</h3>
                  <p className="text-gray-600 text-sm">
                    Our team will review your case details and requirements
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
                  <p className="text-gray-600 text-sm">
                    We'll reach out to you within 24-48 hours to discuss your
                    case
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Begin</h3>
                  <p className="text-gray-600 text-sm">
                    Once confirmed, we'll start working on your case immediately
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Back to Home
              </Button>
              <div>
                <Button
                  onClick={() => (window.location.href = "/services")}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
                >
                  Browse More Services
                </Button>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                Have questions? Contact us at info@vakilfy.com or call +91
                8979096507
              </p>
            </div>
          </div>
        </div>
      </div>

      <ServiceFooter />
    </div>
  );
}
