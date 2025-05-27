"use client";
import { cn } from "@/lib/utils";
const NebulaBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 星云基础层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-900/80 to-purple-900/60" />

      {/* 动态星云粒子 */}
      <div className="absolute inset-0 animate-nebula-move">
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute h-[1px] w-[1px] rounded-full bg-white",
              "animate-particle-glow"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${Math.random() * 0.8 + 0.2})`,
            }}
          />
        ))}
      </div>
      {/* 星云流动层 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/3 h-96 w-[150%] animate-nebula-flow bg-[radial-gradient(circle_at_center,rgba(125,95,255,0.3),transparent)] blur-[100px]" />
        <div className="absolute -right-1/4 top-1/4 h-96 w-[150%] animate-nebula-flow-reverse bg-[radial-gradient(circle_at_center,rgba(225,100,255,0.2),transparent)] blur-[120px]" />
      </div>
      {/* 全局样式需添加至CSS文件 */}
      <style jsx global>{`
        @keyframes nebula-move {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-20%);
          }
        }
        @keyframes particle-glow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes nebula-flow {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          100% {
            transform: translateX(50%) rotate(360deg);
          }
        }
        @keyframes nebula-flow-reverse {
          0% {
            transform: translateX(0) rotate(180deg);
          }
          100% {
            transform: translateX(-50%) rotate(540deg);
          }
        }

        .animate-nebula-move {
          animation: nebula-move 30s linear infinite;
        }
        .animate-nebula-flow {
          animation: nebula-flow 40s linear infinite;
        }
        .animate-nebula-flow-reverse {
          animation: nebula-flow-reverse 50s linear infinite;
        }
        .animate-particle-glow {
          animation: particle-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NebulaBackground;
