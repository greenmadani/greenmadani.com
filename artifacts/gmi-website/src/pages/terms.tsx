import { useQuery } from "@tanstack/react-query";
import { Scale, FileText, Package, AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";

interface SiteSettings {
  siteName: string;
}

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    text: "By accessing or using the Green Madani International website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you must not use our website."
  },
  {
    icon: Scale,
    title: "Use of Content",
    text: "All content on this website, including text, images, logos, and product information, is the property of Green Madani International Private Ltd. and may not be reproduced, distributed, or used without prior written permission."
  },
  {
    icon: Package,
    title: "Product Information",
    text: "While we strive for accuracy, GMI does not guarantee that all product descriptions, pricing, or availability information on this website is error-free or current at all times. We reserve the right to correct any errors and update information without prior notice."
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    text: "Green Madani International Private Ltd. shall not be held liable for any indirect, incidental, or consequential damages arising from the use of this website or its content. This includes but is not limited to damages for loss of data, profits, or business interruption."
  }
];

export default function TermsPage() {
  return (
    <div className="w-full pb-24 bg-background">
      <PageHero
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website or services."
        badge="Legal"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions", href: "/terms" }
        ]}
      />

      <AnimatedSection animation="fade-up">
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white shadow-sm border-t-4 border-accent p-8 md:p-12 mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to Green Madani International Private Ltd. By using our website and services, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <div key={i} className="bg-white border border-border p-8 md:p-10 flex gap-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-foreground mb-4">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground mt-12 text-center border-t border-border pt-8">
            Last updated: June 2026
          </p>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
}
