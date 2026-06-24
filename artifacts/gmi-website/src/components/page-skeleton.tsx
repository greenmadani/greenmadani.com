import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-muted h-[320px] md:h-[400px] -mt-20 pt-20">
        <div className="container mx-auto px-4 pt-16">
          <Skeleton className="w-24 h-4 mb-8" />
          <Skeleton className="w-3/4 h-12 mb-4" />
          <Skeleton className="w-1/2 h-6" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-48 rounded-xl" />
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
