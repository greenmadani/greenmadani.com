import { useParams } from "wouter";
import { ChevronRight, ShoppingBasket, ArrowLeft, Tag, Building2 } from "lucide-react";
import { Link } from "wouter";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
        <Skeleton className="w-full aspect-square bg-gray-100 rounded-none" />
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
        <h2 className="text-3xl font-display font-bold text-[#1A1A1A] mb-4">Product Not Found</h2>
        <Link href="/products">
          <Button className="bg-[#1A5C38]">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F9F7F2] py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center text-sm font-semibold tracking-wider uppercase text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link href="/" className="hover:text-[#1A5C38] transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href="/products" className="hover:text-[#1A5C38] transition-colors">Products</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <span className="text-[#1A5C38] truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Link href="/products" className="inline-flex items-center text-[#1A5C38] font-semibold hover:text-[#C8960C] mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="bg-[#EEF4F0] aspect-square flex items-center justify-center p-8 border border-gray-100">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <ShoppingBasket size={120} className="text-[#1A5C38]/20" />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="inline-block bg-[#C8960C]/10 text-[#C8960C] font-bold text-xs tracking-widest uppercase px-3 py-1 mb-4 self-start">
              {product.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#1A1A1A] mb-6">
              {product.name}
            </h1>
            
            {product.businessSlug && (
              <div className="flex items-center text-gray-600 mb-8 pb-8 border-b border-gray-100">
                <Building2 size={18} className="text-[#1A5C38] mr-2" />
                <span>Manufactured by: <Link href={`/businesses/${product.businessSlug}`} className="text-[#1A5C38] font-semibold hover:underline">GMI Subsidiary</Link></span>
              </div>
            )}

            <div className="prose prose-lg prose-green mb-10 text-gray-700">
              <p className="text-xl font-medium mb-6">{product.description}</p>
              {product.longDescription && <p>{product.longDescription}</p>}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-10">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center">
                  <Tag size={14} className="mr-2" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-gray-100">
              <div className="bg-[#F9F7F2] p-6 border-l-4 border-[#1A5C38] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-bold text-[#1A1A1A] mb-1">Interested in wholesale?</h4>
                  <p className="text-sm text-gray-600">Contact our sales team for bulk pricing and distribution.</p>
                </div>
                <Link href={`/contact?subject=Inquiry about ${product.name}`}>
                  <Button className="bg-[#1A5C38] text-white hover:bg-[#0D3D25] rounded-none font-bold whitespace-nowrap">
                    Inquire Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
