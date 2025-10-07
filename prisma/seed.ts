import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create forms first
  const consultationForm = await prisma.form.upsert({
    where: { id: "consultation-form" },
    update: {},
    create: {
      id: "consultation-form",
      name: "Consultation Form",
      description: "Form for consultation services",
      type: "SERVICE_FORM",
      schemaJson: {
        fields: [
          {
            type: "text",
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            type: "email",
            name: "email",
            label: "Email Address",
            required: true,
          },
          {
            type: "tel",
            name: "phone",
            label: "Phone Number",
            required: true,
          },
          {
            type: "textarea",
            name: "query",
            label: "Legal Query",
            required: true,
          },
        ],
      },
    },
  });

  const propertyForm = await prisma.form.upsert({
    where: { id: "property-form" },
    update: {},
    create: {
      id: "property-form",
      name: "Property Services Form",
      description: "Form for property-related services",
      type: "SERVICE_FORM",
      schemaJson: {
        fields: [
          {
            type: "text",
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            type: "email",
            name: "email",
            label: "Email Address",
            required: true,
          },
          {
            type: "tel",
            name: "phone",
            label: "Phone Number",
            required: true,
          },
          {
            type: "file",
            name: "documents",
            label: "Upload Documents",
            required: true,
          },
        ],
      },
    },
  });

  const documentForm = await prisma.form.upsert({
    where: { id: "document-form" },
    update: {},
    create: {
      id: "document-form",
      name: "Document Review Form",
      description: "Form for document review services",
      type: "SERVICE_FORM",
      schemaJson: {
        fields: [
          {
            type: "text",
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            type: "email",
            name: "email",
            label: "Email Address",
            required: true,
          },
          {
            type: "file",
            name: "documents",
            label: "Upload Documents for Review",
            required: true,
          },
        ],
      },
    },
  });

  const draftingForm = await prisma.form.upsert({
    where: { id: "drafting-form" },
    update: {},
    create: {
      id: "drafting-form",
      name: "Drafting Services Form",
      description: "Form for drafting services",
      type: "SERVICE_FORM",
      schemaJson: {
        fields: [
          {
            type: "text",
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            type: "email",
            name: "email",
            label: "Email Address",
            required: true,
          },
          {
            type: "select",
            name: "documentType",
            label: "Document Type",
            required: true,
            options: [
              "Residential Rent Agreement",
              "Commercial Rent Agreement",
              "Leave & License Agreement",
              "Sub-lease Agreement",
              "Sale Deed",
              "Agreement to Sell",
              "Gift Deed",
              "Last Will",
            ],
          },
        ],
      },
    },
  });

  const legalNoticeForm = await prisma.form.upsert({
    where: { id: "legal-notice-form" },
    update: {},
    create: {
      id: "legal-notice-form",
      name: "Legal Notice Form",
      description: "Form for legal notice services",
      type: "SERVICE_FORM",
      schemaJson: {
        fields: [
          {
            type: "text",
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            type: "email",
            name: "email",
            label: "Email Address",
            required: true,
          },
          {
            type: "textarea",
            name: "noticeDetails",
            label: "Notice Details",
            required: true,
          },
        ],
      },
    },
  });

  // Create service categories
  const consultationCategory = await prisma.serviceCategory.upsert({
    where: { name: "Consultation" },
    update: {},
    create: {
      name: "Consultation",
      slug: "consultation",
    },
  });

  const propertyCategory = await prisma.serviceCategory.upsert({
    where: { name: "Property Services" },
    update: {},
    create: {
      name: "Property Services",
      slug: "property-services",
    },
  });

  const documentCategory = await prisma.serviceCategory.upsert({
    where: { name: "Document Review" },
    update: {},
    create: {
      name: "Document Review",
      slug: "document-review",
    },
  });

  const draftingCategory = await prisma.serviceCategory.upsert({
    where: { name: "Drafting" },
    update: {},
    create: {
      name: "Drafting",
      slug: "drafting",
    },
  });

  const legalNoticeCategory = await prisma.serviceCategory.upsert({
    where: { name: "Legal Notices" },
    update: {},
    create: {
      name: "Legal Notices",
      slug: "legal-notices",
    },
  });

  // Create services
  const services = [
    // Consultation
    {
      name: "On Call Lawyer Consultation",
      slug: "on-call-lawyer-consultation",
      description: "Get instant legal advice from experienced lawyers over phone",
      categoryName: "Consultation",
      formId: consultationForm.id,
    },
    // Property Services
    {
      name: "Property Paper Review",
      slug: "property-paper-review",
      description: "Comprehensive review of property documents and papers",
      categoryName: "Property Services",
      formId: propertyForm.id,
    },
    {
      name: "Title Search Report",
      slug: "title-search-report",
      description: "Detailed title search and verification report",
      categoryName: "Property Services",
      formId: propertyForm.id,
    },
    {
      name: "Property Agreements",
      slug: "property-agreements",
      description: "Drafting and review of property-related agreements",
      categoryName: "Property Services",
      formId: propertyForm.id,
    },
    // Document Review
    {
      name: "Contract Review",
      slug: "contract-review",
      description: "Professional review of contracts and legal documents",
      categoryName: "Document Review",
      formId: documentForm.id,
    },
    {
      name: "Legal Document Check",
      slug: "legal-document-check",
      description: "Thorough checking and verification of legal documents",
      categoryName: "Document Review",
      formId: documentForm.id,
    },
    // Drafting - Rent Agreements
    {
      name: "Residential Rent Agreement",
      slug: "residential-rent-agreement",
      description: "Professional drafting of residential rent agreements",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    {
      name: "Commercial Rent Agreement",
      slug: "commercial-rent-agreement",
      description: "Comprehensive commercial rent agreement drafting",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    {
      name: "Leave & License Agreement",
      slug: "leave-license-agreement",
      description: "Professional leave and license agreement drafting",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    {
      name: "Sub-lease Agreement",
      slug: "sub-lease-agreement",
      description: "Drafting of sub-lease agreements for property subletting",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    // Drafting - Property Agreements
    {
      name: "Sale Deed",
      slug: "sale-deed",
      description: "Professional sale deed drafting and documentation",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    {
      name: "Agreement to Sell",
      slug: "agreement-to-sell",
      description: "Comprehensive agreement to sell documentation",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    {
      name: "Gift Deed",
      slug: "gift-deed",
      description: "Professional gift deed drafting and execution",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    {
      name: "Last Will",
      slug: "last-will",
      description: "Professional will drafting and legal documentation",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
    // Legal Notices
    {
      name: "Draft Legal Notice",
      slug: "draft-legal-notice",
      description: "Professional drafting of legal notices and communications",
      categoryName: "Legal Notices",
      formId: legalNoticeForm.id,
    },
    {
      name: "Reply to Legal Notice",
      slug: "reply-to-legal-notice",
      description: "Professional response to legal notices and communications",
      categoryName: "Legal Notices",
      formId: legalNoticeForm.id,
    },
    // Power of Attorney
    {
      name: "Power of Attorney",
      slug: "power-of-attorney",
      description: "Professional power of attorney drafting and execution",
      categoryName: "Drafting",
      formId: draftingForm.id,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name_categoryName: {
          name: service.name,
          categoryName: service.categoryName,
        },
      },
      update: {},
      create: {
        name: service.name,
        slug: service.slug,
        description: service.description,
        categoryName: service.categoryName,
        formId: service.formId,
        isActive: true,
        contentJson: {
          sections: [
            {
              title: "Service Overview",
              content: `Professional ${service.name.toLowerCase()} service with expert legal guidance.`,
            },
            {
              title: "What's Included",
              content: "Comprehensive legal assistance with experienced lawyers.",
            },
            {
              title: "Process",
              content: "Simple 3-step process: Submit details, Get consultation, Receive documents.",
            },
          ],
        },
      },
    });

    // Create pricing for each service
    const createdService = await prisma.service.findFirst({
      where: {
        name: service.name,
        categoryName: service.categoryName,
      },
    });

    if (createdService) {
      // Check if pricing already exists for this service
      const existingPrice = await prisma.servicePrice.findFirst({
        where: {
          serviceId: createdService.id,
          name: "Basic Package",
        },
      });

      if (!existingPrice) {
        await prisma.servicePrice.create({
          data: {
            serviceId: createdService.id,
            name: "Basic Package",
            price: 2500, // ₹25.00 in paisa
            discountAmount: 500, // ₹5.00 discount
            isCompulsory: true,
          },
        });
      }
    }
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
