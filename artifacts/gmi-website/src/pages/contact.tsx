import { useState } from "react";
import { ChevronRight, MapPin, Phone, Mail, Clock, Building2, Handshake, Box } from "lucide-react";
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

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

const businessInquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  company: z.string().optional(),
  inquiryType: z.enum(["distributor", "investor", "partnership", "export", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  region: z.string().optional()
});

type ContactValues = z.infer<typeof contactSchema>;
type BusinessInquiryValues = z.infer<typeof businessInquirySchema>;

export default function Contact() {
  const { toast } = useToast();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const defaultSubject = searchParams.get("subject") || "";
  const inquiryTypeParam = searchParams.get("type");
  
  const [activeTab, setActiveTab] = useState(inquiryTypeParam ? "business" : "general");

  const contactMutation = useSubmitContact();
  const businessMutation = useSubmitBusinessInquiry();

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: defaultSubject, message: "" }
  });

  const businessForm = useForm<BusinessInquiryValues>({
    resolver: zodResolver(businessInquirySchema),
    defaultValues: { 
      name: "", email: "", phone: "", company: "", 
      inquiryType: (inquiryTypeParam as any) || "distributor", 
      message: "", region: "" 
    }
  });

  const onContactSubmit = (data: ContactValues) => {
    contactMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "We will get back to you shortly.", className: "bg-[#1A5C38] text-white" });
        contactForm.reset();
      }
    });
  };

  const onBusinessSubmit = (data: BusinessInquiryValues) => {
    businessMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Inquiry Received", description: "Our business development team will contact you.", className: "bg-[#1A5C38] text-white" });
        businessForm.reset();
      }
    });
  };

  return (
    <div className="w-full pb-24 bg-white">
      {/* Page Hero */}
      <section className="bg-[#1A5C38] text-white pt-16 pb-32 islamic-pattern-overlay relative border-b-4 border-[#C8960C]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8960C]">Contact</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6">Get in Touch</h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
            Whether you have a question about our products, want to partner with us, or are interested in investment opportunities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Column */}
          <div className="bg-[#0D3D25] text-white p-10 shadow-xl border-t-4 border-[#C8960C]">
            <h2 className="text-3xl font-display font-bold mb-8">Corporate Headquarters</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#C8960C] mt-1 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-sm text-[#C8960C] mb-1">Address</h4>
                  <p className="text-white/80 leading-relaxed">924/C, Taltola Moor<br/>Khilgaon-1219<br/>Dhaka, Bangladesh</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="text-[#C8960C] mt-1 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-sm text-[#C8960C] mb-1">Phone</h4>
                  <p className="text-white/80">01340-862454</p>
                  <p className="text-white/80">022 222 01623</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="text-[#C8960C] mt-1 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-sm text-[#C8960C] mb-1">Email</h4>
                  <p className="text-white/80">info@greenmadani.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-[#C8960C] mt-1 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-sm text-[#C8960C] mb-1">Business Hours</h4>
                  <p className="text-white/80">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                  <p className="text-white/80">Friday - Saturday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 bg-[#F9F7F2] p-10 border border-gray-100 shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-200 rounded-none h-12 p-1">
                <TabsTrigger value="general" className="rounded-none font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A5C38]">General Inquiry</TabsTrigger>
                <TabsTrigger value="business" className="rounded-none font-bold data-[state=active]:bg-[#1A5C38] data-[state=active]:text-white">Business / Partnership</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={contactForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Your Name *</FormLabel>
                          <FormControl><Input {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={contactForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Email Address *</FormLabel>
                          <FormControl><Input type="email" {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={contactForm.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Phone Number</FormLabel>
                          <FormControl><Input {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={contactForm.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Subject *</FormLabel>
                          <FormControl><Input {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={contactForm.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-[#1A1A1A]">Message *</FormLabel>
                        <FormControl><Textarea {...field} rows={6} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38] resize-none" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={contactMutation.isPending} className="w-full bg-[#1A5C38] text-white hover:bg-[#0D3D25] rounded-none py-6 font-bold text-lg">
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="business">
                <Form {...businessForm}>
                  <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                    <div className="bg-[#1A5C38]/5 border border-[#1A5C38]/20 p-4 mb-6">
                      <p className="text-[#1A5C38] font-medium text-sm">This form goes directly to our Business Development team for priority processing.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={businessForm.control} name="inquiryType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Inquiry Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white rounded-none border-gray-300 focus:ring-[#1A5C38]">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-none">
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
                          <FormLabel className="font-bold text-[#1A1A1A]">Company / Organization Name</FormLabel>
                          <FormControl><Input {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={businessForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Contact Person *</FormLabel>
                          <FormControl><Input {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={businessForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Business Email *</FormLabel>
                          <FormControl><Input type="email" {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={businessForm.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Phone Number *</FormLabel>
                          <FormControl><Input {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={businessForm.control} name="region" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[#1A1A1A]">Target Region / Country</FormLabel>
                          <FormControl><Input {...field} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={businessForm.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-[#1A1A1A]">Proposal Details *</FormLabel>
                        <FormControl><Textarea {...field} rows={6} className="bg-white rounded-none border-gray-300 focus-visible:ring-[#1A5C38] resize-none" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={businessMutation.isPending} className="w-full bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] rounded-none py-6 font-bold text-lg">
                      {businessMutation.isPending ? "Submitting..." : "Submit Business Inquiry"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Quick Inquiry Cards */}
      <section className="py-24 bg-white mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">How can we help you grow?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/contact?type=partnership">
              <div className="bg-[#EEF4F0] p-8 text-center border border-transparent hover:border-[#1A5C38] cursor-pointer transition-colors group">
                <Building2 size={40} className="text-[#1A5C38] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl mb-2 text-[#1A1A1A]">Business Partnership</h3>
                <p className="text-gray-600 text-sm">Collaborate with our subsidiaries.</p>
              </div>
            </Link>
            <Link href="/contact?type=distributor">
              <div className="bg-[#EEF4F0] p-8 text-center border border-transparent hover:border-[#1A5C38] cursor-pointer transition-colors group">
                <Box size={40} className="text-[#1A5C38] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl mb-2 text-[#1A1A1A]">Product Inquiry</h3>
                <p className="text-gray-600 text-sm">Wholesale and distribution details.</p>
              </div>
            </Link>
            <Link href="/contact?type=investor">
              <div className="bg-[#EEF4F0] p-8 text-center border border-transparent hover:border-[#1A5C38] cursor-pointer transition-colors group">
                <Handshake size={40} className="text-[#1A5C38] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl mb-2 text-[#1A1A1A]">For Investment</h3>
                <p className="text-gray-600 text-sm">Explore investment opportunities.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
