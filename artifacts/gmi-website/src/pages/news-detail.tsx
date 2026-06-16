import { useParams } from "wouter";
import { ChevronRight, ArrowLeft, UserCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useGetNewsArticle, getGetNewsArticleQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Linkedin, Facebook, MessageCircle } from "lucide-react";

export default function NewsDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: article, isLoading } = useGetNewsArticle(slug, {
    query: { 
      enabled: !!slug,
      queryKey: getGetNewsArticleQueryKey(slug) 
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Skeleton className="w-24 h-4 mb-8" />
        <Skeleton className="w-full h-16 mb-6" />
        <Skeleton className="w-1/2 h-4 mb-12" />
        <Skeleton className="w-full h-[400px] mb-12 rounded-none" />
        <div className="space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full py-40 text-center">
        <h2 className="text-3xl font-display font-bold text-[#1A1A1A] mb-4">Article Not Found</h2>
        <Link href="/news">
          <Button className="bg-[#1A5C38]">Back to News</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 bg-white">
      {/* Article Header */}
      <div className="bg-[#F9F7F2] pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-gray-500 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link href="/" className="hover:text-[#1A5C38] transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            <Link href="/news" className="hover:text-[#1A5C38] transition-colors">News</Link>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            <span className="text-[#1A5C38] truncate">{article.category}</span>
          </div>

          <div className="inline-block bg-[#C8960C]/10 text-[#C8960C] font-bold text-xs tracking-widest uppercase px-3 py-1 mb-6">
            {article.category}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#1A1A1A] mb-8 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {article.authorAvatarUrl ? (
                  <img src={article.authorAvatarUrl} alt={article.authorName} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle2 size={32} className="text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-bold text-[#1A1A1A]">{article.authorName || "GMI Press Office"}</div>
                <div className="text-sm text-gray-500 font-medium">{format(new Date(article.publishedAt), 'MMMM dd, yyyy')}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#1A5C38] hover:border-[#1A5C38] transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#1A5C38] hover:border-[#1A5C38] transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#1A5C38] hover:border-[#1A5C38] transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="w-full max-w-5xl mx-auto -mt-6 px-4 z-10 relative">
          <div className="w-full h-[400px] md:h-[600px] shadow-xl overflow-hidden bg-gray-100">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 max-w-3xl mt-16">
        {article.excerpt && (
          <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed italic mb-10 border-l-4 border-[#C8960C] pl-6 py-2">
            {article.excerpt}
          </p>
        )}
        
        <div className="prose prose-lg prose-green max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />

        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="bg-[#EEF4F0] text-[#1A5C38] text-sm px-4 py-1.5 font-bold uppercase tracking-wider rounded-none">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <Link href="/news">
            <Button variant="outline" className="border-[#1A5C38] text-[#1A5C38] hover:bg-[#1A5C38] hover:text-white rounded-none px-8 font-bold">
              <ArrowLeft size={16} className="mr-2" /> Back to News
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
