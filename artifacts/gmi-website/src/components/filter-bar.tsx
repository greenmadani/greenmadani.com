import { Button } from "@/components/ui/button";

interface FilterBarProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export function FilterBar({ categories, active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={active === cat ? "primary" : "outline"}
          onClick={() => onChange(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
