import { ReactNode, useEffect, useRef, useState } from "react";

type AnimationVariant =
 | "fade-up"
 | "fade-down"
 | "fade-left"
 | "fade-right"
 | "scale-in"
 | "zoom-in"
 | "fade-in";

interface AnimatedSectionProps {
 children:ReactNode;
 className?:string;
 delay?:number;
 animation?:AnimationVariant;
 duration?:number;
 stagger?:boolean;
 threshold?:number;
 as?:"section" | "div";
}

const variantMap:Record<AnimationVariant, string> = {
 "fade-up":"animate-fade-up",
 "fade-down":"animate-fade-down",
 "fade-left":"animate-fade-left",
 "fade-right":"animate-fade-right",
 "scale-in":"animate-scale-in",
 "zoom-in":"animate-zoom-in",
 "fade-in":"animate-fade-in",
};

export function AnimatedSection({
 children,
 className = "",
 delay = 0,
 animation = "fade-up",
 duration = 700,
 stagger = false,
 threshold = 0.1,
 as:Component = "div",
}:AnimatedSectionProps) {
 const ref = useRef<HTMLDivElement>(null);
 const [isInView, setIsInView] = useState(false);
 const [hasAnimated, setHasAnimated] = useState(false);

 useEffect(() => {
 const element = ref.current;
 if (!element || hasAnimated) return;

 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 setIsInView(true);
 setHasAnimated(true);
 observer.unobserve(element);
 }
 },
 { threshold }
 );

 observer.observe(element);
 return () => observer.disconnect();
 }, [threshold, hasAnimated]);

 return (
 <Component
 ref={ref}
 className={`${isInView ? variantMap[animation] :"opacity-0"} ${stagger && isInView ? "animate-stagger" :""} ${className}`}
 style={{
 animationDuration:`${duration}ms`,
 animationDelay:`${delay}ms`,
 }}
 >
 {children}
 </Component>
 );
}
