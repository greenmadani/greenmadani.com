import { useState } from "react";
import { ChevronRight, Briefcase, GraduationCap, Heart, Rocket } from "lucide-react";
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
import AnimatedBackground from "@/components/AnimatedBackground";

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
          className: "bg-[#1A5C38] text-white border-none"
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
    <div className="w-full pb-24 bg-[#F9F7F2]">
      {/* Page Hero */}
      <section className="bg-[#1A5C38] text-white pt-16 pb-24 relative border-b-4 border-[#C8960C] overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8960C]">Careers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6">Build Your Career with GMI</h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
            Join a purpose-driven conglomerate where your work creates real impact across Bangladesh.
          </p>
          <Button onClick={() => openApplyDialog()} className="bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] font-bold px-8 py-6 rounded-none text-lg">
            Submit General Application
          </Button>
        </div>
      </section>

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
                <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm text-center">
                  <div className="w-14 h-14 bg-[#EEF4F0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-[#1A5C38]" />
                  </div>
                  <h3 className="font-display font-bold text-[#1A1A1A] text-lg mb-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm">{b.desc}</p>
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
            <h2 className="text-4xl font-display font-bold text-[#1A1A1A] mb-8">Open Positions</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {departments.map(dept => (
                <Button
                  key={dept}
                  variant={activeDepartment === dept ? "default" : "outline"}
                  onClick={() => setActiveDepartment(dept)}
                  className={`rounded-full font-bold px-6 ${
                    activeDepartment === dept 
                      ? "bg-[#1A5C38] text-white hover:bg-[#0D3D25]" 
                      : "bg-white border-gray-300 text-gray-600 hover:text-[#1A5C38] hover:border-[#1A5C38]"
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
                <div key={i} className="bg-white p-6 border border-gray-100 flex items-center justify-between">
                  <div className="space-y-3 w-1/2">
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                  <Skeleton className="w-32 h-10" />
                </div>
              ))
            ) : jobs?.length === 0 ? (
              <div className="bg-white p-12 text-center border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-gray-500 mb-2">No open positions found</h3>
                <p className="text-gray-400">There are currently no openings in this department. Feel free to submit a general application.</p>
              </div>
            ) : (
              jobs?.map((job) => (
                <div key={job.id} className="bg-white p-6 border border-gray-100 shadow-sm hover:border-[#1A5C38] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-[#1A1A1A] mb-2 group-hover:text-[#1A5C38] transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 font-medium">
                      <span className="flex items-center"><Briefcase size={14} className="mr-1.5 text-[#C8960C]" /> {job.department}</span>
                      <span className="flex items-center"><span className="text-[#1A5C38] bg-[#EEF4F0] px-2 py-0.5 font-bold uppercase text-xs tracking-wider">{job.type}</span></span>
                      <span>{job.location}</span>
                      <span className="text-gray-400 border-l border-gray-300 pl-4">Posted: {format(new Date(job.postedAt), 'MMM dd')}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => openApplyDialog(job.id, job.title)} 
                    className="bg-transparent border-2 border-[#1A5C38] text-[#1A5C38] hover:bg-[#1A5C38] hover:text-white rounded-none font-bold px-8 md:w-max w-full"
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
        <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden border-none rounded-none">
          <div className="bg-[#1A5C38] p-6 text-white islamic-pattern-overlay">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Submit Application</DialogTitle>
              <DialogDescription className="text-white/80">
                Join the GMI family. Fill out the form below.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="positionApplying" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#1A1A1A]">Position Applying For *</FormLabel>
                    <FormControl><Input {...field} className="rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[#1A1A1A]">Full Name *</FormLabel>
                      <FormControl><Input {...field} className="rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[#1A1A1A]">Email Address *</FormLabel>
                      <FormControl><Input type="email" {...field} className="rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[#1A1A1A]">Phone Number *</FormLabel>
                      <FormControl><Input {...field} className="rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[#1A1A1A]">LinkedIn Profile</FormLabel>
                      <FormControl><Input {...field} placeholder="https://" className="rounded-none border-gray-300 focus-visible:ring-[#1A5C38]" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="coverLetter" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#1A1A1A]">Cover Letter / Notes</FormLabel>
                    <FormControl><Textarea {...field} rows={4} className="rounded-none border-gray-300 focus-visible:ring-[#1A5C38] resize-none" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)} className="rounded-none border-gray-300">Cancel</Button>
                  <Button type="submit" disabled={applyMutation.isPending} className="bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] font-bold rounded-none px-8">
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
