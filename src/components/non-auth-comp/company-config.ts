export const COMPANY_CONFIG = {
  // Company Information
  name: "lawyer",
  description:
    "lawyer is a leading law firm in the India, providing legal services & corporates in commercial & family matters.",

  // Contact Information
  contact: {
    email: "hello@lawyer.com",
    phone: "+91 9876543210",
    address: [
      "Plot No. 18, BlueStone ",
      "Lake View Road, Phase II",
      "Block C, Sector 12",
      "Indore, MP 123456",
    ], 
  },

  // Lawyer-specific contact
  lawyerContact: {
    email: "lawyers@lawyer.com",
  },

  // CEO Information
  ceo: {
    name: "Albert Homer",
    title: "CEO, lawyer Law firm",
  },

  // Copyright
  copyright: "© 2025 developed by 3RP-Technetium",

  // Newsletter
  newsletter: {
    title: "Sign Up For Our Newsletter",
    description: "Stay updated with our latest legal insights and services.",
  },

  // Social Media (if needed in future)
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
};

export type CompanyConfig = typeof COMPANY_CONFIG;
