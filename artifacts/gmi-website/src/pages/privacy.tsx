import { useQuery } from "@tanstack/react-query";
import { Shield, Mail, Database, FileText } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";

interface SiteSettings {
 siteName:string;
 email:string;
}

const sections = [
 {
 icon:FileText,
 title:"Information We Collect",
 text:"We collect personal information such as your name, email address, phone number, and any details you voluntarily provide when submitting inquiries, job applications, or partnership requests through our website."
 },
 {
 icon:Database,
 title:"How We Use Your Information",
 text:"Your information is used to respond to inquiries, process job applications, manage business partnerships, and improve our products and services across all GMI business verticals."
 },
 {
 icon:Shield,
 title:"Data Protection",
 text:"We implement reasonable technical and organizational measures to protect your personal data from unauthorized access, alteration, or disclosure."
 },
 {
 icon:Mail,
 title:"Contact Us",
 text:"If you have any questions about this Privacy Policy or how your data is handled, please contact us at info@greenmadani.com."
 }
];

export default function PrivacyPage() {
 const { data:s } = useQuery<SiteSettings>({
 queryKey:["site-settings"],
 queryFn:() => fetch("/api/settings").then((r) => r.json()),
 staleTime:5 * 60 * 1000,
 });

 return (
 <div className="w-full pb-24 bg-background">
 <PageHero
 title="Privacy Policy"
 subtitle="How we collect, use, and protect your personal information."
 badge="Legal"
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"Privacy Policy", href:"/privacy" }
 ]}
 />

 <AnimatedSection animation="fade-up">
 <section className="py-16">
 <div className="container mx-auto px-4 max-w-4xl">
 <div className="bg-white shadow-sm border-t-4 border-accent p-8 md:p-12 mb-8">
 <p className="text-lg text-muted-foreground leading-relaxed">
 At {s?.siteName || "Green Madani International Private Ltd."}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
 </p>
 </div>

 <div className="space-y-8">
 {sections.map((section, i) => {
 const Icon = section.icon;
 return (
 <div key={i} className="bg-white border border-border p-8 md:p-10 flex gap-6">
 <div className="w-12 h-12 bg-accent/10 flex items-center justify-center shrink-0 mt-1">
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
 Last updated:June 2026
 </p>
 </div>
 </section>
 </AnimatedSection>
 </div>
 );
}
