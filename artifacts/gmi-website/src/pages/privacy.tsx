import { useQuery } from "@tanstack/react-query";
import { AnimatedSection } from "@/components/animated-section";

interface SiteSettings {
  siteName: string;
  privacyPolicyUrl: string;
  copyrightText: string;
}

export default function PrivacyPage() {
  const { data: s } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: () => fetch("/api/settings").then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <AnimatedSection animation="fade-up">
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="font-display mb-8">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          At {s?.siteName || "Green Madani International"}, we are committed to protecting your privacy and ensuring the security of your personal information.
        </p>
        <h2 className="mt-8 mb-4">Information We Collect</h2>
        <p className="text-muted-foreground mb-4">
          We collect information you provide directly to us, such as when you submit a contact form, apply for a career opportunity, or send a business inquiry. This may include your name, email address, phone number, and any other information you choose to share.
        </p>
        <h2 className="mt-8 mb-4">How We Use Your Information</h2>
        <p className="text-muted-foreground mb-4">
          We use the information we collect to respond to your inquiries, process your job applications, improve our services, and communicate with you about our business activities.
        </p>
        <h2 className="mt-8 mb-4">Data Security</h2>
        <p className="text-muted-foreground mb-4">
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
        </p>
        <h2 className="mt-8 mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-4">
          If you have any questions about this Privacy Policy, please contact us at info@greenmadani.com.
        </p>
        <p className="text-sm text-muted-foreground mt-12">
          Last updated: June 2026
        </p>
      </div>
    </div>
    </AnimatedSection>
  );
}
