import { useReducedMotion } from "framer-motion";

const shapes = Array.from({ length:5 }).map((_, i) => ({
 id:i,
 size:Math.random() * 80 + 40,
 x:Math.random() * 100,
 y:Math.random() * 100,
 duration:Math.random() * 25 + 20,
 delay:Math.random() * 5,
}));

export default function AnimatedBackground() {
 const prefersReducedMotion = useReducedMotion();

 if (prefersReducedMotion) {
 return (
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
 <div className="absolute inset-0 opacity-[0.03]"
 style={{
 backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 14.142L14.142 30 30 45.858 45.858 30 30 14.142z' fill='%23C8960C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
 backgroundSize:"60px 60px",
 }}
 />
 </div>
 );
 }

 return (
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
 <div className="absolute inset-0 opacity-[0.03]"
 style={{
 backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 14.142L14.142 30 30 45.858 45.858 30 30 14.142z' fill='%23C8960C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
 backgroundSize:"60px 60px",
 }}
 />
 {shapes.map((shape) => (
 <div
 key={shape.id}
 className="absolute opacity-[0.08] will-change-transform"
 style={{
 width:shape.size,
 height:shape.size,
 left:`${shape.x}%`,
 top:`${shape.y}%`,
 backgroundColor:shape.id % 2 === 0 ? "#C8960C" :"#EEF4F0",
 transform:shape.id % 2 === 0 ? "none" :"rotate(45deg)",
 animation:`float ${shape.duration}s ease-in-out ${shape.delay}s infinite`,
 }}
 />
 ))}
 <style>{`
 @keyframes float {
 0%, 100% { transform:translate(0, 0) rotate(0deg); }
 50% { transform:translate(30px, -60px) rotate(180deg); }
 }
 `}</style>
 </div>
 );
}
