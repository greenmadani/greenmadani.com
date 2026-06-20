import { useState } from "react";
import { Briefcase, GraduationCap, Heart, Rocket } from "lucide-react";
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
        subtitle="Join a purpose-driven conglomerate where your work creates real impact across Bangladesh."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" }
        ]}
      >
        <Button onClick={() => openApplyDialog()} variant="secondary" className="px-8 py-6 text-lg">
          Submit General Application
        </Button>
      </PageHero>

      {/* Benefits */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Rocket, title: "Career Growth", desc: "Clear pathways for advancement across 12 subsidiaries." },
              { icon: Heart, title: "Great Culture", desc: "A supportive environment rooted in strong ethical values." },
              { icon: Briefcase, title: "Premium Benefits", desc: "Competitive compensation and comprehensive healthcare." },
              { icon: GraduationCap, title: "Continuous Learning", desc: "Regular training and skill development programs." }
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="bg-white p-8 border border-border shadow-sm text-center">
                  <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-foreground mb-8">Open Positions</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {departments.map(dept => (
                <Button
                  key={dept}
                  variant={activeDepartment === dept ? "primary" : "outline"}
                  onClick={() => setActiveDepartment(dept)}
                  className={`rounded-full font-bold px-6 ${
                    activeDepartment === dept 
                      ? "bg-primary text-white hover:bg-secondary" 
                      : "bg-white border-border text-muted-foreground hover:text-primary hover:border-primary"
                  }`}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-6 border border-border flex items-center justify-between">
                  <div className="space-y-3 w-1/2">
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                  <Skeleton className="w-32 h-10" />
                </div>
              ))
            ) : jobs?.length === 0 ? (
              <div className="bg-white p-12 text-center border border-dashed border-border">
                <h3 className="text-xl font-bold text-muted-foreground mb-2">No open positions found</h3>
                <p className="text-muted-foreground">There are currently no openings in this department. Feel free to submit a general application.</p>
              </div>
            ) : (
              jobs?.map((job) => (
                <div key={job.id} className="bg-white p-6 border border-border card-hover flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center"><Briefcase size={14} className="mr-1.5 text-accent" /> {job.department}</span>
                      <span className="flex items-center"><span className="text-primary bg-muted px-2 py-0.5 font-bold uppercase text-xs tracking-wider">{job.type}</span></span>
                      <span>{job.location}</span>
                      <span className="text-muted-foreground border-l border-border pl-4">Posted: {format(new Date(job.postedAt), 'MMM dd')}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => openApplyDialog(job.id, job.title)} 
                    variant="outline"
                    className="px-8 md:w-max w-full"
                  >
                    Apply Now
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden border-none">
          <div className="bg-primary p-6 text-white islamic-pattern-overlay">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Submit Application</DialogTitle>
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
