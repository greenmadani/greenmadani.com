import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animated-section";

export default function ServerError() {
 return (
 <AnimatedSection animation="scale-in" threshold={0}>
 <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-[#09281A] text-white relative overflow-hidden">
 <div className="absolute inset-0 opacity-10">
 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent blur-3xl"></div>
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent blur-3xl"></div>
 </div>
 <div className="container mx-auto px-4 relative z-10">
 <div className="max-w-2xl mx-auto text-center">
 <div className="w-24 h-24 bg-accent/20 flex items-center justify-center mx-auto mb-4 md:mb-8">
 <AlertTriangle size={48} className="text-accent" />
 </div>
 <h1 className="font-display text-8xl md:text-9xl font-bold text-accent mb-4">500</h1>
 <h2 className="font-display text-3xl md:text-4xl mb-4">Server Error</h2>
 <p className="text-lg text-white/70 mb-2 max-w-lg mx-auto">
 Something went wrong on our end. We're working to fix it.
 </p>
 <p className="text-sm text-white/50 mb-4 md:mb-10">
 Please try refreshing the page or come back later.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link href="/">
 <Button variant="secondary" size="lg" className="shadow-lg">
 <ArrowLeft className="mr-2" size={18} /> Back to Home
 </Button>
 </Link>
 <Button
 variant="outline"
 size="lg"
 className="border-white/20 text-white hover:bg-white/10"
 onClick={() => window.location.reload()}
 >
 <RefreshCw className="mr-2" size={18} /> Refresh Page
 </Button>
 </div>
 </div>
 </div>
 </div>
 </AnimatedSection>
 );
}
