import { useQuery } from "@tanstack/react-query";
import { subsidiaries as staticSubsidiaries } from "@/data/subsidiaries";

export interface Business {
  id: number;
  name: string;
  slug: string;
  industry: string;
  description: string;
  longDescription: string | null;
  imageUrl: string | null;
  colorAccent: string | null;
  featured: boolean;
  order: number;
  services: string[];
  targetAudience: string | null;
  website: string | null;
  status: string;
  createdAt: string;
}

function mapApiBusiness(item: Record<string, unknown>): Business {
  return {
    id: item.id as number,
    name: item.name as string,
    slug: item.slug as string,
    industry: item.industry as string,
    description: item.description as string,
    longDescription: (item.longDescription as string) ?? null,
    imageUrl: (item.imageUrl as string) ?? null,
    colorAccent: (item.colorAccent as string) ?? null,
    featured: item.featured as boolean,
    order: item.order as number,
    services: (item.services as string[]) ?? [],
    targetAudience: (item.targetAudience as string) ?? null,
    website: (item.website as string) ?? null,
    status: item.status as string,
    createdAt: item.createdAt as string,
  };
}

function staticToBusiness(item: typeof staticSubsidiaries[number]): Business {
  return {
    id: 0,
    name: item.name,
    slug: item.slug,
    industry: item.industry,
    description: item.desc,
    longDescription: item.longDescription,
    imageUrl: item.image,
    colorAccent: null,
    featured: false,
    order: 0,
    services: item.services ?? [],
    targetAudience: item.targetAudience,
    website: item.website ?? null,
    status: "active",
    createdAt: "",
  };
}

const defaultFallback = staticSubsidiaries.map(staticToBusiness);

async function fetchBusinesses(featuredOnly?: boolean): Promise<Business[]> {
  const url = featuredOnly ? "/api/businesses?featured=true" : "/api/businesses";
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to fetch businesses");
  const json = await res.json();
  return (json as Record<string, unknown>[]).map(mapApiBusiness);
}

async function fetchBusinessBySlug(slug: string): Promise<Business | null> {
  const res = await fetch(`/api/businesses/${encodeURIComponent(slug)}`, { cache: "no-cache" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch business");
  const json = await res.json();
  return mapApiBusiness(json as Record<string, unknown>);
}

export function useBusinessesList(featuredOnly?: boolean) {
  return useQuery({
    queryKey: ["businesses", { featured: featuredOnly }],
    queryFn: () => fetchBusinesses(featuredOnly).catch(() => defaultFallback),
    staleTime: 60 * 1000,
    placeholderData: defaultFallback,
  });
}

export function useBusiness(slug: string) {
  return useQuery({
    queryKey: ["businesses", slug],
    queryFn: () => fetchBusinessBySlug(slug),
    staleTime: 60 * 1000,
    enabled: !!slug,
  });
}

export function getBusinessStaticFallback(slug?: string): Business[] {
  if (slug) {
    const found = staticSubsidiaries.find((s) => s.slug === slug);
    return found ? [staticToBusiness(found)] : [];
  }
  return defaultFallback;
}
