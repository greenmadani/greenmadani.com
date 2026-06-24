import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface GridCardProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  href?: string;
  className?: string;
  children?: ReactNode;
}

export function GridCard({ icon: Icon, iconColor, title, description, className = "", children }: GridCardProps) {
  return (
    <div className={`group bg-white p-8 border border-transparent card-hover rounded-2xl h-full flex flex-col ${className}`}>
      {Icon && (
        <div className="w-14 h-14 bg-muted text-primary flex items-center justify-center mb-6 rounded-xl">
          <Icon size={28} />
        </div>
      )}
      <h3 className="font-display mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm flex-1">{description}</p>
      {children}
    </div>
  );
}
