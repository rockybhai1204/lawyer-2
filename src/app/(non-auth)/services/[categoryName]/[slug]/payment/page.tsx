import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ServiceContent } from "@/types/api/services";
import Navbar from "@/components/non-auth-comp/navbar";
import PaymentForm from "../../[serviceName]/payment/payment-form";

type Params = {
  params: Promise<{
    categoryName: string; // category slug
    slug: string; // subcategory slug
  }>;
};

export default async function SubcategoryPaymentPage({ params }: Params) {
  const { categoryName, slug } = await params;

  if (!categoryName || !slug) {
    notFound();
  }

  const categorySlug = categoryName.toLowerCase();
  const pathSlug = slug.toLowerCase();

  // Try case 1: service slug under this category (subcategory optional)
  let service = await prisma.service.findFirst({
    where: {
      isActive: true,
      slug: pathSlug,
      category: { slug: categorySlug },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isActive: true,
      contentJson: true,
      categoryName: true,
      formId: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: { id: true, name: true, slug: true, createdAt: true, updatedAt: true },
      },
      faqs: {
        select: {
          id: true,
          serviceId: true,
          question: true,
          answer: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      price: {
        select: {
          id: true,
          serviceId: true,
          name: true,
          price: true,
          discountAmount: true,
          isCompulsory: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      rating: {
        select: {
          id: true,
          serviceId: true,
          rating: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      _count: { select: { cases: true, rating: true } },
    },
  });

  // Fallback case 2: treat slug as subcategory; pick first active service inside it
  if (!service) {
    service = await prisma.service.findFirst({
      where: {
        isActive: true,
        category: { slug: categorySlug },
        subcategory: { slug: pathSlug, category: { slug: categorySlug } },
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        contentJson: true,
        categoryName: true,
        formId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, slug: true, createdAt: true, updatedAt: true },
        },
        faqs: {
          select: {
            id: true,
            serviceId: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        price: {
          select: {
            id: true,
            serviceId: true,
            name: true,
            price: true,
            discountAmount: true,
            isCompulsory: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        rating: {
          select: {
            id: true,
            serviceId: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: { select: { cases: true, rating: true } },
      },
    });
  }

  if (!service) {
    notFound();
  }

  const typedContentJson = service.contentJson as unknown as ServiceContent | null;
  const { _count, ...serviceWithoutCount } = service;
  const serviceData = {
    ...serviceWithoutCount,
    averageRating: 0,
    reviewCount: _count.rating,
    customerCount: _count.cases,
    contentJson: typedContentJson ?? undefined,
    pricingComponents:
      service.price?.map((price) => ({
        name: price.name,
        basePrice: price.price,
        discountAmount: price.discountAmount || 0,
        isCompulsory: price.isCompulsory || false,
      })) || [],
    contentSections: typedContentJson?.blocks?.filter((b) => b.type !== "deliverables") || [],
    deliverables: typedContentJson?.blocks?.find((b) => b.type === "deliverables") || null,
    faqs: service.faqs.map((faq) => ({
      id: faq.id,
      serviceId: faq.serviceId,
      question: faq.question,
      answer: faq.answer,
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString(),
    })),
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    category: {
      id: service.category.id,
      name: service.category.name,
      slug: service.category.slug,
      createdAt: service.category.createdAt.toISOString(),
      updatedAt: service.category.updatedAt.toISOString(),
    },
    price: service.price.map((price) => ({
      id: price.id,
      serviceId: price.serviceId,
      name: price.name,
      price: price.price,
      discountAmount: price.discountAmount,
      isCompulsory: price.isCompulsory,
      createdAt: price.createdAt.toISOString(),
      updatedAt: price.updatedAt.toISOString(),
    })),
    rating: service.rating.map((rating) => ({
      id: rating.id,
      serviceId: rating.serviceId,
      rating: rating.rating,
      createdAt: rating.createdAt.toISOString(),
      updatedAt: rating.updatedAt.toISOString(),
    })),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="pt-20 sm:pt-24 lg:pt-28 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PaymentForm
            service={serviceData as any}
            form={null}
            selectedPrices={(serviceData as any).price || []}
          />
        </div>
      </div>
    </div>
  );
}


