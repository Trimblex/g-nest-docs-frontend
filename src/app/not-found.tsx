"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Stars = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};
const SafeHydrationStars = dynamic(() => Promise.resolve(Stars), {
  ssr: false,
});
export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    const redirect = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* Animated 404 Number */}
        <div className="animate-bounce">
          <h1 className="text-9xl font-bold text-white mb-4 opacity-90">
            4<span className="inline-block mx-2 animate-spin-slow">0</span>4
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-white/90">
            哎呀！页面消失了...
          </h2>
          <p className="text-lg text-white/80 mb-8">
            您寻找的页面可能已经漂流到数字宇宙的某个角落
          </p>

          {/* Countdown Timer */}
          <div className="text-white/70 mb-8">
            <span className="animate-pulse">{countdown}</span> 秒后返回首页
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="bg-white/10 hover:bg-white/20 text-white/90 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              返回首页
            </button>
            <button
              onClick={() => router.back()}
              className="border border-white/30 hover:border-white/50 text-white/80 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              返回上一页
            </button>
          </div>
        </div>
      </div>
      <SafeHydrationStars />

      <style jsx global>{`
        @keyframes star {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-200px) scale(2);
            opacity: 0;
          }
        }
        .animate-star {
          animation: star 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
