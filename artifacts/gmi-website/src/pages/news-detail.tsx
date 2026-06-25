import { useParams } from "wouter";
import { ArrowLeft, UserCircle2, Linkedin, Facebook, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useGetNewsArticle, getGetNewsArticleQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";

export default function NewsDetail() {
 const params = useParams();
 const slug = params.slug || "";
 
 const { data:article, isLoading } = useGetNewsArticle(slug, {
 query:{ 
 enabled:!!slug,
 queryKey:getGetNewsArticleQueryKey(slug) 
 }
 });

 if (isLoading) {
 return (
 <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
 <Skeleton className="w-24 h-4 mb-4 md:mb-8" />
 <Skeleton className="w-full h-16 mb-6" />
 <Skeleton className="w-1/2 h-4 mb-6 md:mb-12" />
 <Skeleton className="w-full h-[400px] mb-6 md:mb-12" />
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
 <h2 className="font-display text-foreground mb-4">Article Not Found</h2>
 <Link href="/news">
 <Button variant="primary">Back to News</Button>
 </Link>
 </div>
 );
 }

 return (
 <div className="w-full pb-24 bg-white">
 <PageHero
 title={article.title}
 subtitle={article.excerpt || "Read more about our latest developments and news."}
 badge={article.category}
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"News", href:"/news" },
 { label:article.category, href:`/news?category=${article.category}` }
 ]}
 />

 {/* Article Meta */}
 <AnimatedSection animation="fade-up" delay={50}>
 <div className="bg-background border-b border-border">
 <div className="container mx-auto px-4 max-w-5xl py-6">
 <div className="flex items-center justify-between flex-wrap gap-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-muted flex items-center justify-center overflow-hidden shrink-0">
 {article.authorAvatarUrl ? (
 <img src={article.authorAvatarUrl} alt={article.authorName} className="w-full h-full object-cover" loading="lazy" />
 ) :(
 <UserCircle2 size={32} className="text-muted-foreground" />
 )}
 </div>
 <div>
 <div className="font-bold text-foreground">{article.authorName || "GMI Press Office"}</div>
 <div className="text-sm text-muted-foreground font-medium">{format(new Date(article.publishedAt), 'MMMM dd, yyyy')}</div>
 </div>
 </div>
 
 <div className="flex gap-3">
 <a href="#" className="w-10 h-10 bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
 <Facebook size={16} />
 </a>
 <a href="#" className="w-10 h-10 bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
 <MessageCircle size={16} />
 </a>
 <a href="#" className="w-10 h-10 bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
 <Linkedin size={16} />
 </a>
 </div>
 </div>
 </div>
 </div>
 </AnimatedSection>

 {/* Featured Image */}
 {article.imageUrl && (
 <AnimatedSection animation="scale-in" delay={100}>
 <div className="w-full max-w-5xl mx-auto mt-8 px-4 z-10 relative">
 <div className="w-full h-[400px] md:h-[500px] shadow-xl img-hover bg-muted overflow-hidden">
 <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
 </div>
 </div>
 </AnimatedSection>
 )}

 {/* Article Content */}
 <AnimatedSection animation="fade-up" delay={150}>
 <div className="container mx-auto px-4 max-w-3xl mt-16">
 <div className="prose prose-lg prose-green max-w-none text-foreground" dangerouslySetInnerHTML={{ __html:article.content.replace(/\n/g, '<br/>') }} />

 {article.tags && article.tags.length > 0 && (
 <div className="mt-12 pt-8 border-t border-border">
 <div className="flex flex-wrap gap-2">
 {article.tags.map(tag => (
 <span key={tag} className="bg-muted text-primary text-sm px-4 py-1.5 font-bold uppercase tracking-wider">
 #{tag}
 </span>
 ))}
 </div>
 </div>
 )}
 
 <div className="mt-16 text-center">
 <Link href="/news">
 <Button variant="outline" size="lg">
 <ArrowLeft size={16} className="mr-2" /> Back to News
 </Button>
 </Link>
 </div>
 </div>
 </AnimatedSection>
 </div>
 );
}
