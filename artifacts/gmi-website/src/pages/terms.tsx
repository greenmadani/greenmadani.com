import { useQuery } from "@tanstack/react-query";
import { AnimatedSection } from "@/components/animated-section";

interface SiteSettings {
  siteName: string;
}

export default function TermsPage() {
  const { data: s } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: () => fetch("/api/settings").then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <AnimatedSection animation="fade-up">
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="font-display mb-8">Terms of Service</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          By accessing or using the Green Madani International website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
        <h2 className="mt-8 mb-4">Acceptance of Terms</h2>
        <p className="text-muted-foreground mb-4">
          By accessing or using the Green Madani International website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
        <h2 className="mt-8 mb-4">Use of Content</h2>
        <p className="text-muted-foreground mb-4">
          All content on this website, including text, images, logos, and product information, is the property of Green Madani International Private Ltd. and may not be reproduced without written permission.
        </p>
        <h2 className="mt-8 mb-4">Product Information</h2>
        <p className="text-muted-foreground mb-4">
          While we strive for accuracy, GMI does not guarantee that all product descriptions, pricing, or availability information on this website is error-free or current at all times.
        </p>
        <h2 className="mt-8 mb-4">Limitation of Liability</h2>
        <p className="text-muted-foreground mb-4">
          Green Madani International Private Ltd. shall not be held liable for any indirect, incidental, or consequential damages arising from the use of this website or its content.
        </p>
        <p className="text-sm text-muted-foreground mt-12">
          Last updated: June 2026
        </p>
      </div>
    </div>
    </AnimatedSection>
  );
}
