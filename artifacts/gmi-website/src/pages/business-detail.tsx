import { useParams } from "wouter";
import { ArrowUpRight, CheckCircle2, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useBusiness, getBusinessStaticFallback } from "@/lib/businesses";

export default function BusinessDetail() {
 const params = useParams();
 const slug = params.slug || "";
 const { data: business, isLoading } = useBusiness(slug);
 const fallback = !isLoading && !business ? getBusinessStaticFallback(slug)[0] ?? null : null;
 const display = business ?? fallback;

 if (isLoading) {
 return (
 <div className="w-full pb-24 bg-white">
 <div className="container mx-auto px-4 py-40 space-y-6">
 <Skeleton className="h-10 w-1/3" />
 <Skeleton className="h-6 w-1/2" />
 <Skeleton className="h-64 w-full" />
 <Skeleton className="h-8 w-1/4" />
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-3/4" />
 </div>
 </div>
 );
 }

 if (!display) {
 return (
 <div className="w-full py-40 text-center">
 <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
 <h2 className="font-display text-foreground mb-4">Business Not Found</h2>
 <Link href="/businesses">
 <Button variant="primary">Back to Portfolio</Button>
 </Link>
 </div>
 );
 }

 return (
 <div className="w-full pb-24 bg-white">
 <PageHero
 title={display.name}
 subtitle={display.description}
 badge={display.industry}
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"Businesses", href:"/businesses" },
 { label:display.name, href:`/businesses/${display.slug}` }
 ]}
 />

 <AnimatedSection animation="fade-up" delay={100}>
 <div className="container mx-auto px-4 py-16 md:py-24">
 <div className="grid lg:grid-cols-3 gap-6 md:gap-16">
 <div className="lg:col-span-2 space-y-6 md:space-y-12">
 <div className="shimmer-wrap img-hover shadow-xl border border-border border-b-4 border-b-accent/30 overflow-hidden mb-4 md:mb-8">
  <div className="aspect-[3/2]">
 <img
 src={display.imageUrl ?? "/images/businesses/placeholder.svg"}
 alt={display.name}
 className="w-full h-full object-cover"
 loading="lazy"
 onLoad={(e) => e.currentTarget.closest('.shimmer-wrap')?.classList.add('loaded')}
 />
 </div>
 </div>
 <div>
 <h2 className="font-display text-foreground mb-6">Overview</h2>
  <div className="prose prose-lg prose-green max-w-none text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: display.longDescription ?? "" }} />
 </div>

 <div>
 <h2 className="font-display text-foreground mb-6">Key Offerings & Services</h2>
 <div className="grid sm:grid-cols-2 gap-4 animate-stagger">
 {display.services?.map((service, i) => (
 <div key={i} className="bg-muted p-4 flex items-start gap-3">
 <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
 <span className="text-foreground font-medium">{service}</span>
 </div>
 ))}
 </div>
 </div>

 <div>
 <h2 className="font-display text-foreground mb-6">Target Market</h2>
 <div className="bg-background p-8 border-l-4 border-accent">
 <p className="text-lg text-muted-foreground italic">{display.targetAudience}</p>
 </div>
 </div>
 </div>

 <div>
 <div className="bg-background p-8 border border-border shadow-sm sticky top-32">
 <h3 className="font-display text-foreground mb-4">Partner with Us</h3>
 <p className="text-muted-foreground mb-4 md:mb-8">
 Interested in distribution, investment, or enterprise solutions with {display.name}?
 </p>
 <div className="space-y-4">
 <Link href="/contact">
 <Button variant="secondary" size="lg" className="w-full">
 Contact Sales <ArrowUpRight className="ml-2" size={18} />
 </Button>
 </Link>
  {display.website && (
  <Button variant="outline" size="lg" className="w-full" onClick={() => window.open(display.website!, '_blank')}>
  Visit Dedicated Website
  </Button>
  )}
 </div>
 </div>
 </div>
 </div>
 </div>
 </AnimatedSection>
 </div>
 );
}
