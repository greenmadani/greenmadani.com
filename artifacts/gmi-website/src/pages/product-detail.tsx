import { useParams } from "wouter";
import { useMemo } from "react";
import { ShoppingBasket, ArrowLeft, Tag, Building2, Star, Calendar } from "lucide-react";
import { Link } from "wouter";
import { useGetProduct, getGetProductQueryKey, useGetBusiness, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
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
        <div className="container mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-5 w-64" />
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square bg-muted" />
            <div className="space-y-6">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-12" />
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
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link
            href="/products"
            className="inline-flex items-center text-muted-foreground font-medium hover:text-primary mb-6 transition-colors text-sm"
          >
            <ArrowLeft size={14} className="mr-1.5" /> Back to Products
          </Link>

          {/* Product Main Section */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="bg-muted aspect-square flex items-center justify-center p-8 md:p-12 border border-border img-hover relative rounded-lg">
              {product.featured && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1.5 z-10 flex items-center gap-1 rounded">
                  <Star size={12} /> Featured
                </span>
              )}
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" loading="lazy" />
              ) : (
                <ShoppingBasket size={120} className="text-primary/20" />
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-accent font-semibold tracking-widest uppercase text-xs mb-3">
                {product.category}
              </span>

              <h1 className="font-display text-foreground text-3xl md:text-4xl leading-tight mb-4">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border">
                {business && (
                  <div className="flex items-center text-muted-foreground">
                    <Building2 size={16} className="text-primary mr-2 shrink-0" />
                    <span className="text-sm">
                      Manufactured by{" "}
                      <Link href={`/businesses/${product.businessSlug}`} className="text-primary font-semibold hover:underline">
                        {business.name}
                      </Link>
                    </span>
                  </div>
                )}

                {createdAt && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar size={16} className="text-primary mr-2 shrink-0" />
                    <span className="text-sm">Added {format(new Date(createdAt), "MMMM yyyy")}</span>
                  </div>
                )}
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                    <Tag size={14} className="mr-2" /> Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-border">
                <div className="bg-background p-6 border-l-4 border-primary rounded-r-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-foreground font-semibold mb-1">Interested in wholesale?</h4>
                    <p className="text-sm text-muted-foreground">Contact our sales team for bulk pricing and distribution.</p>
                  </div>
                  <Link href={`/contact?subject=Inquiry about ${product.name}`}>
                    <Button variant="secondary">Inquire Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Long Description */}
      {product.longDescription && (
        <section className="bg-muted py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                title="Product Details"
                badge="Details"
              />
              <div className="mt-8">
                <div
                  className="prose prose-lg prose-green max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <AnimatedSection animation="fade-up">
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <SectionHeader
                title={`More in ${product.category}`}
                badge="Related"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 animate-stagger">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="border border-border card-hover flex flex-col h-full group rounded-lg overflow-hidden"
                  >
                    <div className="w-full aspect-square bg-muted img-hover relative">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBasket size={36} className="opacity-20" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10 rounded">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-display mb-1.5 text-foreground text-sm">{p.name}</h3>
                      <p className="text-muted-foreground text-xs mb-3 flex-1 line-clamp-2">{p.description}</p>
                      <span className="text-primary text-sm font-semibold group-hover:underline">View Details</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}
    </div>
  );
}
