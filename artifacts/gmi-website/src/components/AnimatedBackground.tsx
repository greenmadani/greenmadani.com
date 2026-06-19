import { motion } from "framer-motion";

const shapes = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  size: Math.random() * 100 + 50,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * 5,
  type: i % 3 === 0 ? "circle" : i % 3 === 1 ? "square" : "diamond",
}));

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 14.142L14.142 30 30 45.858 45.858 30 30 14.142z' fill='%23C8960C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute opacity-[0.05]"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            backgroundColor: shape.id % 2 === 0 ? "#C8960C" : "#EEF4F0",
            borderRadius: shape.type === "circle" ? "50%" : shape.type === "diamond" ? "15%" : "0%",
            rotate: shape.type === "diamond" ? 45 : 0,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            rotate: shape.type === "circle" ? 0 : [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}
