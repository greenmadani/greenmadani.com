import { ArrowUpRight, Handshake, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animated-section";

export function CTASection() {
  return (
    <AnimatedSection animation="fade-up">
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-12 border-t-4 border-primary shadow-sm rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">For Distributors</span>
              <h3 className="font-display text-foreground mb-4">Become a Distributor</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Join our nationwide distribution network and grow your business with GMI's trusted product lines.
              </p>
            </div>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Apply Now <ArrowUpRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>

          <div className="bg-card p-12 border-t-4 border-accent shadow-sm rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">For Investors</span>
              <h3 className="font-display text-foreground mb-4">Become an Investor</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Partner with Bangladesh's fastest-growing diversified group and be part of our 2030 vision.
              </p>
            </div>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Explore Investment <ArrowUpRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
    </AnimatedSection>
  );
}
