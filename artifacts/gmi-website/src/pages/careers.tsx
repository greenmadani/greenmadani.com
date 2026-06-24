import { useState } from "react";
import { Briefcase, Heart, Cog, Building2 } from "lucide-react";
import { Link } from "wouter";
import { useListJobs, useSubmitApplication, getListJobsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  positionApplying: z.string().min(2, "Position is required"),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  jobId: z.number().optional().nullable()
});

type ApplicationValues = z.infer<typeof applicationSchema>;

export default function Careers() {
  const [activeDepartment, setActiveDepartment] = useState<string>("All");
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: jobs, isLoading } = useListJobs(
    { department: activeDepartment !== "All" ? activeDepartment : undefined },
    { query: { queryKey: getListJobsQueryKey({ department: activeDepartment !== "All" ? activeDepartment : undefined }) } }
  );

  const applyMutation = useSubmitApplication();

  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", positionApplying: "", linkedinUrl: "", coverLetter: "", jobId: null
    }
  });

  const departments = ["All", "Agriculture", "Food & Beverage", "Technology", "Management", "Operations"];

  const openApplyDialog = (jobId?: number, jobTitle?: string) => {
    form.reset({
      ...form.getValues(),
      jobId: jobId || null,
      positionApplying: jobTitle || ""
    });
    setIsApplyOpen(true);
  };

  const onSubmit = (data: ApplicationValues) => {
    applyMutation.mutate({ data }, {
      onSuccess: (res) => {
        setIsApplyOpen(false);
        toast({
          title: "Application Submitted",
          description: res.message || "Thank you for applying to GMI. We will review your application soon.",
          className: "bg-primary text-primary-foreground border-none"
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again."
        });
      }
    });
  };

  return (
    <div className="w-full pb-24 bg-background">
      <PageHero
        title="Build Your Career with GMI"
        subtitle="Join a nationwide team of over 7,000 professionals helping bring 170+ products to communities across Bangladesh."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" }
        ]}
      >
        <Button onClick={() => openApplyDialog()} variant="secondary" size="lg">
          View Open Positions
        </Button>
      </PageHero>

      {/* Benefits */}
      <AnimatedSection animation="fade-up">
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 animate-stagger">
            {[
              { icon: Heart, title: "Attractive Compensation", desc: "Competitive salary plus allowance, with performance-based annual increments." },
              { icon: Cog, title: "Festival Bonuses", desc: "Half-salary bonus twice a year during Eid celebrations." },
              { icon: Building2, title: "Vehicle Benefits", desc: "Motorbikes for DSMs and private cars for ASMs based on performance in the first 3 months." },
              { icon: Heart, title: "Long-Term Rewards", desc: "A cash honor of ৳10 lakh for employees completing 10 years of continuous service." }
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="bg-white p-4 border border-border shadow-sm text-center">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-display text-foreground mb-1">{b.title}</h3>
                  <p className="text-muted-foreground text-sm">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Open Positions Table */}
      <AnimatedSection animation="fade-up">
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-foreground mb-4">Open Positions</h2>
            <p className="text-muted-foreground">Current recruitment drive across Agro and Consumer sectors</p>
          </div>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left p-4 font-semibold">Position</th>
                  <th className="text-left p-4 font-semibold">Openings</th>
                  <th className="text-left p-4 font-semibold">Qualification</th>
                  <th className="text-left p-4 font-semibold">Experience</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { position: "Divisional Sales Manager (DSM)", openings: "50", qualification: "Bachelor's/Master's", experience: "3–5 years" },
                  { position: "Area Sales Manager (ASM)", openings: "150", qualification: "Bachelor's/Master's", experience: "3–5 years" },
                  { position: "Thana Sales Manager (TSM)", openings: "600", qualification: "Degree/Bachelor's", experience: "3–5 years" },
                  { position: "Union Sales Manager (USM)", openings: "7,000 (phased, 1 per union)", qualification: "—", experience: "—" }
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/50"}>
                    <td className="p-4 font-semibold text-foreground">{row.position}</td>
                    <td className="p-4 text-muted-foreground">{row.openings}</td>
                    <td className="p-4 text-muted-foreground">{row.qualification}</td>
                    <td className="p-4 text-muted-foreground">{row.experience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* How to Apply */}
      <AnimatedSection animation="fade-up">
      <section className="py-16 bg-muted border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-foreground text-center mb-8">How to Apply</h2>
          <div className="bg-white p-4 md:p-8 shadow-sm border border-border">
            <p className="text-muted-foreground mb-6">
              Bring 2 copies of your photo, NID copy, Chairman certificate, and updated CV for direct interview.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-foreground mb-2">Interview Days</h4>
                <p className="text-muted-foreground">Every Friday & Saturday<br/>9 AM – 5 PM</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Location</h4>
                <p className="text-muted-foreground">924/C, Khilgaon, Dhaka-1219</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Contact</h4>
                <p className="text-muted-foreground">01340-862454<br/>02222201623</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden border-none">
          <div className="bg-primary p-6 text-white islamic-pattern-overlay">
            <DialogHeader>
              <DialogTitle className="font-display">Submit Application</DialogTitle>
              <DialogDescription className="text-primary-foreground/80">
                Join the GMI family. Fill out the form below.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="positionApplying" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-foreground">Position Applying For *</FormLabel>
                    <FormControl><Input {...field} className="border-border focus-visible:ring-primary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground">Full Name *</FormLabel>
                      <FormControl><Input {...field} className="border-border focus-visible:ring-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground">Email Address *</FormLabel>
                      <FormControl><Input type="email" {...field} className="border-border focus-visible:ring-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground">Phone Number *</FormLabel>
                      <FormControl><Input {...field} className="border-border focus-visible:ring-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground">LinkedIn Profile</FormLabel>
                      <FormControl><Input {...field} placeholder="https://" className="border-border focus-visible:ring-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="coverLetter" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-foreground">Cover Letter / Notes</FormLabel>
                    <FormControl><Textarea {...field} rows={4} className="border-border focus-visible:ring-primary resize-none" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={applyMutation.isPending} variant="secondary" className="px-8">
                    {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
