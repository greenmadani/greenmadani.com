import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Building2, Handshake, Box } from "lucide-react";
import { Link, useSearch } from "wouter";
import { useSubmitContact, useSubmitBusinessInquiry } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { AnimatedSection } from "@/components/animated-section";

const contactSchema = z.object({
 name:z.string().min(2, "Name is required"),
 email:z.string().email("Valid email is required"),
 phone:z.string().optional(),
 subject:z.string().min(2, "Subject is required"),
 message:z.string().min(10, "Message must be at least 10 characters")
});

const businessInquirySchema = z.object({
 name:z.string().min(2, "Name is required"),
 email:z.string().email("Valid email is required"),
 phone:z.string().min(10, "Valid phone number is required"),
 company:z.string().optional(),
 inquiryType:z.enum(["distributor", "investor", "partnership", "export", "other"]),
 message:z.string().min(10, "Message must be at least 10 characters"),
 region:z.string().optional()
});

type ContactValues = z.infer<typeof contactSchema>;
type BusinessInquiryValues = z.infer<typeof businessInquirySchema>;

export default function Contact() {
 const { toast } = useToast();
 const searchString = useSearch();
 const searchParams = new URLSearchParams(searchString);
 const defaultSubject = searchParams.get("subject") || "";
 const inquiryTypeParam = searchParams.get("type");
 
 const [activeTab, setActiveTab] = useState(inquiryTypeParam ? "business" :"general");

 const contactMutation = useSubmitContact();
 const businessMutation = useSubmitBusinessInquiry();

 const contactForm = useForm<ContactValues>({
 resolver:zodResolver(contactSchema),
 defaultValues:{ name:"", email:"", phone:"", subject:defaultSubject, message:"" }
 });

 const businessForm = useForm<BusinessInquiryValues>({
 resolver:zodResolver(businessInquirySchema),
 defaultValues:{ 
 name:"", email:"", phone:"", company:"", 
 inquiryType:(inquiryTypeParam as any) || "distributor", 
 message:"", region:"" 
 }
 });

 const onContactSubmit = (data:ContactValues) => {
 contactMutation.mutate({ data }, {
 onSuccess:() => {
 toast({ title:"Message Sent", description:"We will get back to you shortly.", className:"bg-primary text-white" });
 contactForm.reset();
 }
 });
 };

 const onBusinessSubmit = (data:BusinessInquiryValues) => {
 businessMutation.mutate({ data }, {
 onSuccess:() => {
 toast({ title:"Inquiry Received", description:"Our business development team will contact you.", className:"bg-primary text-white" });
 businessForm.reset();
 }
 });
 };

 return (
 <div className="w-full pb-24 bg-white">
 <PageHero
 title="Get in Touch"
 subtitle="Whether you're a farmer, distributor, investor, or future team member — we'd love to hear from you."
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"Contact", href:"/contact" }
 ]}
 />

 {/* Main Content */}
 <AnimatedSection animation="scale-in">
 <div className="container mx-auto px-4 -mt-16 relative z-20">
 <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
 {/* Info Column */}
 <div className="bg-secondary text-white p-6 shadow-xl border-t-4 border-accent card-hover border border-border">
 <h2 className="font-display mb-6">Corporate Headquarters</h2>
 
 <div className="space-y-4 md:space-y-8">
 <div className="flex items-start gap-4">
 <MapPin className="text-accent mt-1 shrink-0" size={24} />
 <div>
 <h4 className="uppercase tracking-wider text-accent mb-1">Address</h4>
 <p className="text-white/80 leading-relaxed">924/C, Taltola Moor<br/>Khilgaon-1219<br/>Dhaka, Bangladesh</p>
 </div>
 </div>
 
 <div className="flex items-start gap-4">
 <Phone className="text-accent mt-1 shrink-0" size={24} />
 <div>
 <h4 className="uppercase tracking-wider text-accent mb-1">Phone</h4>
 <p className="text-white/80">01340-862454</p>
 <p className="text-white/80">022 222 01623</p>
 </div>
 </div>
 
 <div className="flex items-start gap-4">
 <Mail className="text-accent mt-1 shrink-0" size={24} />
 <div>
 <h4 className="uppercase tracking-wider text-accent mb-1">Email</h4>
 <p className="text-white/80">info@greenmadani.com</p>
 <p className="text-white/80">greenmadaniinternational2026@gmail.com</p>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <Clock className="text-accent mt-1 shrink-0" size={24} />
 <div>
 <h4 className="uppercase tracking-wider text-accent mb-1">Business Hours</h4>
 <p className="text-white/80">Sunday – Thursday:9:00 AM – 6:00 PM</p>
 <p className="text-white/80">Friday & Saturday (Recruitment Interviews):9:00 AM – 5:00 PM</p>
 </div>
 </div>
 </div>
 </div>

 {/* Form Column */}
 <div className="lg:col-span-2 bg-background p-6 md:p-10 border border-gray-100 shadow-sm">
 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
 <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-8 bg-gray-200 h-12 p-1">
 <TabsTrigger value="general" className="font-bold data-[state=active]:bg-white data-[state=active]:text-primary">General Inquiry</TabsTrigger>
 <TabsTrigger value="business" className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Business / Partnership</TabsTrigger>
 </TabsList>
 
 <TabsContent value="general">
 <Form {...contactForm}>
 <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4 md:space-y-6">
 <div className="grid md:grid-cols-2 gap-6">
 <FormField control={contactForm.control} name="name" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Your Name *</FormLabel>
 <FormControl><Input {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={contactForm.control} name="email" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Email Address *</FormLabel>
 <FormControl><Input type="email" {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 <FormField control={contactForm.control} name="phone" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Phone Number</FormLabel>
 <FormControl><Input {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={contactForm.control} name="subject" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Subject *</FormLabel>
 <FormControl><Input {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>
 <FormField control={contactForm.control} name="message" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Message *</FormLabel>
 <FormControl><Textarea {...field} rows={6} className="bg-white border-input focus-visible:ring-primary resize-none" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <Button type="submit" variant="secondary" size="lg" disabled={contactMutation.isPending} className="w-full">
 {contactMutation.isPending ? "Sending..." :"Send Message"}
 </Button>
 </form>
 </Form>
 </TabsContent>

 <TabsContent value="business">
 <Form {...businessForm}>
 <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4 md:space-y-6">
 <div className="bg-primary/5 border border-primary/20 p-4 mb-6">
 <p className="text-primary font-medium text-sm">This form goes directly to our Business Development team for priority processing.</p>
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 <FormField control={businessForm.control} name="inquiryType" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Inquiry Type *</FormLabel>
 <Select onValueChange={field.onChange} defaultValue={field.value}>
 <FormControl>
 <SelectTrigger className="bg-white border-input focus:ring-primary">
 <SelectValue placeholder="Select type" />
 </SelectTrigger>
 </FormControl>
 <SelectContent className="">
 <SelectItem value="distributor">Become a Distributor</SelectItem>
 <SelectItem value="investor">Investment Opportunities</SelectItem>
 <SelectItem value="partnership">General Partnership</SelectItem>
 <SelectItem value="export">Export Inquiry</SelectItem>
 <SelectItem value="other">Other</SelectItem>
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={businessForm.control} name="company" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Company / Organization Name</FormLabel>
 <FormControl><Input {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 <FormField control={businessForm.control} name="name" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Contact Person *</FormLabel>
 <FormControl><Input {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={businessForm.control} name="email" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Business Email *</FormLabel>
 <FormControl><Input type="email" {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 <FormField control={businessForm.control} name="phone" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Phone Number *</FormLabel>
 <FormControl><Input {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={businessForm.control} name="region" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Target Region / Country</FormLabel>
 <FormControl><Input {...field} className="bg-white border-input focus-visible:ring-primary" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>
 <FormField control={businessForm.control} name="message" render={({ field }) => (
 <FormItem>
 <FormLabel className="font-bold text-foreground">Proposal Details *</FormLabel>
 <FormControl><Textarea {...field} rows={6} className="bg-white border-input focus-visible:ring-primary resize-none" /></FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <Button type="submit" variant="secondary" size="lg" disabled={businessMutation.isPending} className="w-full">
 {businessMutation.isPending ? "Submitting..." :"Submit Business Inquiry"}
 </Button>
 </form>
 </Form>
 </TabsContent>
 </Tabs>
 </div>
 </div>
 </div>

 </AnimatedSection>

 {/* Quick Inquiry Cards */}
 <AnimatedSection animation="fade-up">
 <section className="py-16 md:py-24 bg-white mt-8 md:mt-12">
 <div className="container mx-auto px-4">
 <SectionHeader title="How can we help you grow?" align="center" />
 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto animate-stagger">
 <Link href="/contact?type=partnership">
 <div className="bg-muted p-4 text-center border border-transparent card-hover">
 <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Business Partnership</span>
 <h3 className="font-display mb-2 text-foreground">Partner With Us</h3>
 <p className="text-muted-foreground text-sm">Interested in becoming a distributor or dealer? Let's discuss partnership opportunities.</p>
 </div>
 </Link>
 <Link href="/contact?type=distributor">
 <div className="bg-muted p-4 text-center border border-transparent card-hover">
 <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Product Inquiry</span>
 <h3 className="font-display mb-2 text-foreground">Ask About Our Products</h3>
 <p className="text-muted-foreground text-sm">Questions about Green Power Agro products or any of our 12 business verticals? Reach out.</p>
 </div>
 </Link>
 <Link href="/contact?type=investor">
 <div className="bg-muted p-4 text-center border border-transparent card-hover">
 <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Investment</span>
 <h3 className="font-display mb-2 text-foreground">Investment Opportunities</h3>
 <p className="text-muted-foreground text-sm">Explore how you can invest in Bangladesh's most diversified industrial group.</p>
 </div>
 </Link>
 </div>
 </div>
 </section>
 </AnimatedSection>
 </div>
 );
}
