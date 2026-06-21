import { useParams } from "wouter";
import { ChevronRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useGetBusiness, getGetBusinessQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function BusinessDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: business, isLoading } = useGetBusiness(slug, {
    query: { 
      enabled: !!slug,
      queryKey: getGetBusinessQueryKey(slug) 
    }
  });

  if (isLoading) {
    return (
      <div className="w-full pb-24">
        <div className="h-[480px] bg-primary w-full flex flex-col justify-center px-4 md:px-12 -mt-20 overflow-hidden">
          <Skeleton className="w-32 h-6 mb-4 bg-white/20" />
          <Skeleton className="w-3/4 max-w-2xl h-16 mb-6 bg-white/20" />
          <Skeleton className="w-1/2 h-6 bg-white/20" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="w-full py-40 text-center">
        <h2 className="font-display text-foreground mb-4">Business Not Found</h2>
        <Link href="/businesses">
          <Button variant="primary">Back to Portfolio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 bg-white">
      {/* Hero */}
      <section className="bg-primary text-white pt-[64px] pb-24 -mt-20 relative border-b-4 border-accent overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6 flex-wrap gap-y-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            <Link href="/businesses" className="hover:text-white transition-colors">Businesses</Link>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            <span className="text-accent">{business.name}</span>
          </div>
          
          <div className="inline-block bg-accent text-accent-foreground font-bold text-xs uppercase tracking-widest px-4 py-1.5 mb-6">
            {business.industry}
          </div>
          <h1 className="font-display mb-6 max-w-4xl">{business.name}</h1>
          <p className="text-xl text-white/80 max-w-3xl leading-relaxed">
            {business.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-display text-foreground mb-6">Overview</h2>
              <div className="prose prose-lg prose-green max-w-none text-muted-foreground leading-relaxed">
                <p>{business.longDescription || business.description}</p>
              </div>
            </div>

            {business.services && business.services.length > 0 && (
              <div>
                <h2 className="font-display text-foreground mb-6">Key Offerings & Services</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {business.services.map((service, i) => (
                    <div key={i} className="bg-muted p-4 flex items-start gap-3">
                      <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                      <span className="text-foreground font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {business.targetAudience && (
              <div>
                <h2 className="font-display text-foreground mb-6">Target Market</h2>
                <div className="bg-background p-8 border-l-4 border-accent">
                  <p className="text-lg text-muted-foreground italic">{business.targetAudience}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-background p-8 border border-border shadow-sm sticky top-32">
              <h3 className="font-display text-foreground mb-4">Partner with Us</h3>
              <p className="text-muted-foreground mb-8">
                Interested in distribution, investment, or enterprise solutions with {business.name}?
              </p>
              <div className="space-y-4">
                <Link href="/contact">
                  <Button variant="primary" className="w-full py-6 text-lg">
                    Contact Sales <ArrowUpRight className="ml-2" size={18} />
                  </Button>
                </Link>
                {business.website && (
                  <Button variant="outline" className="w-full py-6 text-lg" onClick={() => window.open(business.website as string, '_blank')}>
                    Visit Dedicated Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
