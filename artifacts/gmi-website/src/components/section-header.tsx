interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({ badge, title, description, align = "center", className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""} ${className}`}>
      {badge && (
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
          {badge}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
