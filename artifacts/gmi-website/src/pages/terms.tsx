import { useQuery } from "@tanstack/react-query";

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
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-display font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Welcome to {s?.siteName || "Green Madani International Private Ltd."}. By using our website and services, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-4">Use of Website</h2>
        <p className="text-gray-600 mb-4">
          You agree to use our website for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-4">Intellectual Property</h2>
        <p className="text-gray-600 mb-4">
          All content, trademarks, and intellectual property on this website are owned by or licensed to {s?.siteName || "Green Madani International Private Ltd."}. You may not reproduce, distribute, or use any content without prior written permission.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-4">Limitation of Liability</h2>
        <p className="text-gray-600 mb-4">
          {s?.siteName || "Green Madani International Private Ltd."} shall not be liable for any direct, indirect, incidental, or consequential damages arising out of your use of this website.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-4">Changes to Terms</h2>
        <p className="text-gray-600 mb-4">
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.
        </p>
        <p className="text-sm text-gray-400 mt-12">
          Last updated: June 2026
        </p>
      </div>
    </div>
  );
}