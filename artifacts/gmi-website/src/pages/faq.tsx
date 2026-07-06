import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const faqCategories = [
 {
 category:"General",
 items:[
 { q:"What is Green Madani International (GMI)?", a:"Green Madani International Private Ltd. (GMI) is a diversified business group operating across 12 integrated verticals — from agriculture and food to healthcare, education, hospitality, and media. Formerly known as Green Universe Group, GMI is headquartered in Dhaka, Bangladesh, and operates across 42 districts." },
 { q:"Who founded GMI?", a:"GMI was founded by A.R. Chowdhury Reju, who currently serves as the Founder & Managing Director." },
 { q:"What does GMI stand for?", a:"GMI stands for Green Madani International. 'Madani' reflects our commitment to ethical, community-focused development." },
 { q:"When was GMI established?", a:"GMI began its journey in 2018 as Green Universe Group and rebranded to Green Madani International Private Ltd. in 2026." },
 { q:"Where is GMI headquartered?", a:"Our corporate headquarters is located at 924/C, Taltola Moor, Khilgaon-1219, Dhaka, Bangladesh." },
 ]
 },
 {
 category:"Business & Products",
 items:[
 { q:"How many subsidiaries does GMI operate?", a:"GMI operates 12 fully integrated business verticals:GMI Power Agro, GMI Essential Food & Consumer, GMI Beverage, GMI Hospital, GMI Hotel & Resort, GMI Supermarket, GMI Tour & Travels, GMI Education, GMI Skin Care, GMI Fashion House, GMI News & Media, and GMI R&D Center." },
 { q:"What products does GMI offer?", a:"GMI offers 170+ products across agriculture, food, beverages, skincare, and more. Key products include hybrid maize seeds, organic fertilizers, plant growth regulators, pure drinking water, natural juices, and herbal skincare products." },
 { q:"What is the farm-to-shelf model?", a:"Our farm-to-shelf model integrates production, processing, and distribution — eliminating middlemen, ensuring quality control, and delivering better margins to farmers and value to consumers." },
 { q:"Does GMI export products internationally?", a:"Yes. GMI products are built to international standards and we are actively expanding our export operations as part of our Vision 2030 roadmap." },
 ]
 },
 {
 category:"Partnership & Distribution",
 items:[
 { q:"How can I become a GMI distributor?", a:"You can apply by visiting our Contact page and submitting a business inquiry. Our team will review your application and reach out with next steps." },
 { q:"Does GMI offer investment opportunities?", a:"Yes. We welcome investors interested in partnering with Bangladesh's fastest-growing diversified group. Contact us through our Business Inquiry form to explore opportunities." },
 { q:"How can farmers work with GMI?", a:"Farmers can partner with GMI Power Agro for hybrid seeds, organic fertilizers, and technical support. We provide training, fair pricing, and direct market access." },
 ]
 },
 {
 category:"Careers",
 items:[
 { q:"How do I apply for a job at GMI?", a:"Visit our Careers page to view open positions. You can submit a general application online, or bring your documents for a direct interview every Friday and Saturday, 9 AM – 5 PM at our Dhaka office." },
 { q:"What documents do I need for an interview?", a:"Please bring 2 copies of your photo, NID copy, Chairman certificate, and an updated CV." },
 { q:"What positions are currently open?", a:"We are hiring across multiple roles including Divisional Sales Managers (DSM), Area Sales Managers (ASM), Thana Sales Managers (TSM), and Union Sales Managers (USM). Visit our Careers page for details." },
 ]
 },
 {
 category:"Contact & Support",
 items:[
 { q:"How can I contact GMI?", a:"You can reach us by phone at 01340-862454, email at info@greenmadani.com, or visit our office at 924/C, Khilgaon, Dhaka-1219. Our Contact page also has inquiry forms." },
 { q:"What are your business hours?", a:"Sunday – Thursday:9:00 AM – 6:00 PM. Friday & Saturday (Recruitment Interviews):9:00 AM – 5:00 PM." },
 { q:"How do I submit a product inquiry?", a:"Use the general inquiry form on our Contact page, or select 'Product Inquiry' from the quick inquiry cards to ask about any of our 12 business verticals." },
 ]
 }
];

export default function FAQ() {
 const [searchQuery, setSearchQuery] = useState("");
 const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

 const toggleItem = (key:string) => {
 setOpenItems(prev => ({ ...prev, [key]:!prev[key] }));
 };

 const filtered = faqCategories.map(cat => ({
 ...cat,
 items:cat.items.filter(item =>
 item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
 item.a.toLowerCase().includes(searchQuery.toLowerCase())
 )
 })).filter(cat => cat.items.length > 0);

 return (
 <div className="w-full pb-24 bg-background">
 <PageHero
 title="Frequently Asked Questions"
 subtitle="Find answers to common questions about GMI, our products, partnerships, and career opportunities."
 badge="FAQ"
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"FAQ", href:"/faq" }
 ]}
 />

 <AnimatedSection animation="fade-up">
 <div className="container mx-auto px-4 -mt-10 relative z-20">
 <div className="max-w-3xl mx-auto">
 <div className="bg-white shadow-xl border-t-4 border-accent p-6 mb-6 md:mb-12">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
 <Input
 type="search"
 placeholder="Search questions..."
 className="pl-12 h-12 bg-muted border-border focus-visible:ring-primary"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 </div>

 {filtered.map((cat) => (
 <div key={cat.category} className="mb-6 md:mb-12">
 <h2 className="font-display text-foreground mb-6 flex items-center gap-3">
 <span className="w-8 h-0.5 bg-accent"></span>
 {cat.category}
 </h2>
 <div className="space-y-3">
 {cat.items.map((item, i) => {
 const key = `${cat.category}-${i}`;
 const isOpen = openItems[key];
 return (
 <div key={key} className="bg-white border border-border shadow-sm overflow-hidden">
 <button
 onClick={() => toggleItem(key)}
 className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
 >
 <span className="font-semibold text-foreground pr-4">{item.q}</span>
 <ChevronDown
 size={18}
 className={`text-accent shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" :""}`}
 />
 </button>
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ height:0, opacity:0 }}
 animate={{ height:"auto", opacity:1 }}
 exit={{ height:0, opacity:0 }}
 transition={{ duration:0.25, ease:"easeInOut" }}
 className="overflow-hidden"
 >
 <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
 {item.a}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </div>
 </div>
 ))}

 {filtered.length === 0 && (
 <div className="text-center py-20 bg-white border border-dashed border-border">
 <p className="text-muted-foreground text-lg">No results found for "{searchQuery}"</p>
 <p className="text-muted-foreground text-sm mt-2">Try a different search term.</p>
 </div>
 )}
 </div>
 </div>
 </AnimatedSection>

 <AnimatedSection animation="fade-up">
 <section className="py-20 bg-muted border-t border-border mt-12">
 <div className="container mx-auto px-4 text-center max-w-2xl">
 <SectionHeader
 title="Still Have Questions?"
 description="Can't find what you're looking for? Reach out to our team and we'll get back to you promptly."
 />
 <div className="flex flex-wrap justify-center gap-4 mt-8">
 <a href="/contact">
 <button className="bg-primary text-primary-foreground px-8 py-3 font-bold hover:opacity-90 transition-opacity">
 Contact Us
 </button>
 </a>
 <a href="tel:01340862454">
 <button className="bg-accent text-accent-foreground px-8 py-3 font-bold hover:opacity-90 transition-opacity">
 Call 01340-862454
 </button>
 </a>
 </div>
 </div>
 </section>
 </AnimatedSection>
 </div>
 );
}
