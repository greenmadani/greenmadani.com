import { ArrowUpRight, Building2, Handshake } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-12 border-t-4 border-primary shadow-sm rounded-xl flex flex-col justify-between">
            <div>
              <Building2 size={48} className="text-primary mb-6" />
              <h3 className="font-display text-foreground mb-4">Become a Distributor</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Join our nationwide network. Gain access to premium products, dedicated support, and competitive margins.
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
              <Handshake size={48} className="text-accent mb-6" />
              <h3 className="font-display text-foreground mb-4">Become an Investor</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Partner with a fast-growing conglomerate driving sustainable impact across multiple high-growth sectors.
              </p>
            </div>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Request Info <ArrowUpRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
