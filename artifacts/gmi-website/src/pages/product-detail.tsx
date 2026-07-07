import { useParams } from "wouter";
import { useMemo } from "react";
import { ShoppingBasket, ArrowLeft, Tag, Building2, Star, Calendar } from "lucide-react";
import { Link } from "wouter";
import { useGetProduct, getGetProductQueryKey, useGetBusiness, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { format } from "date-fns";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: product, isLoading } = useGetProduct(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProductQueryKey(id),
    },
  });

  const { data: business } = useGetBusiness(product?.businessSlug ?? "");

  const categorySlug = (product as any)?.categorySlug;
  const { data: relatedData } = useListProducts(
    { category: categorySlug, limit: 4 },
    {
      query: {
        enabled: !!categorySlug,
        queryKey: getListProductsQueryKey({ category: categorySlug, limit: 4 }),
      },
    },
  );

  const relatedProducts = useMemo(
    () => (relatedData?.items ?? []).filter((p) => p.id !== product?.id).slice(0, 3),
    [relatedData, product],
  );

  if (isLoading) {
    return (
      <div className="w-full pb-24 bg-white">
        <div className="container mx-auto px-4 py-40 space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid md:grid-cols-2 gap-16">
            <Skeleton className="w-full aspect-square bg-muted" />
            <div className="space-y-6">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-32" />
              <Skeleton className="w-48 h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full py-40 text-center">
        <h2 className="font-display text-foreground mb-4">Product Not Found</h2>
        <Link href="/products">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const createdAt = (product as any).createdAt as string | undefined;

  return (
    <div className="w-full pb-24 bg-white">
      <PageHero
        title={product.name}
        subtitle={product.description}
        badge={product.category}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name, href: `/products/${product.id}` },
        ]}
      />

      <AnimatedSection animation="fade-up" delay={100}>
        <div className="container mx-auto px-4 py-16">
          <Link
            href="/products"
            className="inline-flex items-center text-primary font-semibold hover:text-accent mb-4 md:mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Catalog
          </Link>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-16">
            {/* Image */}
            <div className="bg-muted aspect-square flex items-center justify-center p-8 border border-border img-hover relative">
              {product.featured && (
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10 flex items-center gap-1">
                  <Star size={12} /> Featured
                </span>
              )}
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" loading="lazy" />
              ) : (
                <ShoppingBasket size={120} className="text-primary/20" />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {business && (
                <div className="flex items-center text-muted-foreground mb-4 md:mb-8 pb-4 md:pb-8 border-b border-border">
                  <Building2 size={18} className="text-primary mr-2" />
                  <span>
                    Manufactured by:{" "}
                    <Link href={`/businesses/${product.businessSlug}`} className="text-primary font-semibold hover:underline">
                      {business.name}
                    </Link>
                  </span>
                </div>
              )}

              {createdAt && (
                <div className="flex items-center text-muted-foreground mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">Added {format(new Date(createdAt), "MMMM yyyy")}</span>
                </div>
              )}

              {product.longDescription && (
                <div
                  className="prose prose-lg prose-green mb-4 md:mb-10 text-muted-foreground max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="mb-4 md:mb-10">
                  <h4 className="uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                    <Tag size={14} className="mr-2" /> Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="bg-muted text-muted-foreground text-sm px-3 py-1 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-border">
                <div className="bg-background p-6 border-l-4 border-primary flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-foreground mb-1">Interested in wholesale?</h4>
                    <p className="text-sm text-muted-foreground">Contact our sales team for bulk pricing and distribution.</p>
                  </div>
                  <Link href={`/contact?subject=Inquiry about ${product.name}`}>
                    <Button variant="secondary">Inquire Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24 pt-8 md:pt-16 border-t border-border">
              <h2 className="font-display text-foreground mb-8">More in {product.category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="border border-border card-hover flex flex-col h-full group"
                  >
                    <div className="w-full h-48 bg-muted img-hover relative">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBasket size={36} className="opacity-20" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-display mb-1 text-foreground text-sm">{p.name}</h3>
                      <p className="text-muted-foreground text-xs mb-3 flex-1 line-clamp-2">{p.description}</p>
                      <span className="text-primary text-sm font-semibold group-hover:underline">View Details</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
