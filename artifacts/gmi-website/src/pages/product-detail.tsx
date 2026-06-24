import { useParams } from "wouter";
import { ShoppingBasket, ArrowLeft, Tag, Building2 } from "lucide-react";
import { Link } from "wouter";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: product, isLoading } = useGetProduct(id, {
    query: { 
      enabled: !!id,
      queryKey: getGetProductQueryKey(id) 
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 grid md:grid-cols-2 gap-16">
        <Skeleton className="w-full aspect-square bg-muted" />
        <div>
          <Skeleton className="w-24 h-6 mb-6" />
          <Skeleton className="w-full h-12 mb-6" />
          <Skeleton className="w-full h-32 mb-8" />
          <Skeleton className="w-48 h-12" />
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

  return (
    <div className="w-full pb-24 bg-white">
      <PageHero
        title={product.name}
        subtitle={product.description}
        badge={product.category}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name, href: `/products/${product.id}` }
        ]}
      />

      <AnimatedSection animation="fade-up" delay={100}>
      <div className="container mx-auto px-4 py-16">
        <Link href="/products" className="inline-flex items-center text-primary font-semibold hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="bg-muted aspect-square flex items-center justify-center p-8 border border-border img-hover">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" loading="lazy" />
            ) : (
              <ShoppingBasket size={120} className="text-primary/20" />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.businessSlug && (
              <div className="flex items-center text-muted-foreground mb-8 pb-8 border-b border-border">
                <Building2 size={18} className="text-primary mr-2" />
                <span>Manufactured by: <Link href={`/businesses/${product.businessSlug}`} className="text-primary font-semibold hover:underline">GMI Subsidiary</Link></span>
              </div>
            )}

            {product.longDescription && (
              <div className="prose prose-lg prose-green mb-10 text-muted-foreground">
                <p>{product.longDescription}</p>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mb-10">
                <h4 className="uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                  <Tag size={14} className="mr-2" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-muted text-muted-foreground text-sm px-3 py-1 font-medium rounded-full">
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
                  <Button variant="secondary">
                    Inquire Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </AnimatedSection>
    </div>
  );
}
