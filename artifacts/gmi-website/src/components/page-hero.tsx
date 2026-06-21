import { ReactNode } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumbs?: Breadcrumb[];
  badge?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHero({ title, subtitle, breadcrumbs, badge, children, className = "" }: PageHeroProps) {
  return (
    <section className={`bg-gradient-to-br from-primary via-secondary to-[#09281A] text-white pt-40 pb-32 -mt-20 relative border-b-4 border-accent overflow-hidden ${className}`}>
      <AnimatedBackground />
      <div className="container mx-auto px-4 relative z-10 text-center">
        {breadcrumbs && (
          <div className="flex items-center justify-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center">
                {i > 0 && <ChevronRight size={14} className="mx-2" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-accent">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white transition-colors link-underline">{crumb.label}</Link>
                )}
              </span>
            ))}
          </div>
        )}
        {badge && (
          <span className="inline-block text-accent font-semibold tracking-widest uppercase text-sm mb-4 border border-accent/30 px-3 py-1 border bg-accent/10">
            {badge}
          </span>
        )}
        <h1 className="font-display mb-6">{title}</h1>
        <p className="text-xl text-white/80 max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
        {children}
      </div>
    </section>
  );
}
