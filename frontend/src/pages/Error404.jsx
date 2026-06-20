import React, { useState } from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    setMouse({ x, y });
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-gray-950
      flex
      items-center
      justify-center
      px-6
      "
    >

      <div className="absolute inset-0">
        <div
          className="
          absolute
          top-20
          left-20
          h-96
          w-96
          rounded-full
          bg-indigo-600/30
          blur-3xl
          animate-pulse
          "
        />

        <div
          className="
          absolute
          bottom-20
          right-20
          h-96
          w-96
          rounded-full
          bg-purple-600/30
          blur-3xl
          animate-pulse
          "
        />
      </div>

      <div className="absolute inset-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <span
            key={i}
            className="
          absolute
          h-2
          w-2
          rounded-full
          bg-indigo-400
          animate-bounce
          "
            style={{
              top: `${i * 15}%`,
              left: `${i * 13}%`,
              animationDelay: `${i}s`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          transform: `translate(${mouse.x}px,${mouse.y}px)`,
        }}
        className="
      relative
      z-10
      max-w-xl
      w-full
      rounded-3xl
      border
      border-gray-800
      bg-gray-900/80
      backdrop-blur-xl
      p-12
      text-center
      shadow-2xl
      transition-transform
      duration-300
      "
      >

        <h1
          className="
        text-[120px]
        leading-none
        font-black
        bg-gradient-to-r
        from-indigo-400
        via-purple-400
        to-pink-400
        bg-clip-text
        text-transparent
        animate-pulse
        "
        >
          404
        </h1>

        <h2
          className="
        mt-4
        text-3xl
        font-bold
        text-white
        "
        >
          Lost in Space 🚀
        </h2>

        <p
          className="
        mt-5
        text-gray-400
        "
        >
          The page you are looking for doesn't exist. Maybe it travelled to
          another dimension.
        </p>

        <div
          className="
        mt-10
        flex
        justify-center
        gap-5
        "
        >
          <Link
            to="/"
            className="
          group
          rounded-xl
          bg-indigo-500
          px-7
          py-3
          text-white
          font-semibold
          shadow-lg
          shadow-indigo-500/40
          transition
          hover:-translate-y-1
          hover:bg-indigo-400
          "
          >
            <span className="group-hover:mr-2 transition">🏠</span>
            Go Home
          </Link>

          <Link
            to="/support"
            className="
          rounded-xl
          border
          border-gray-700
          px-7
          py-3
          text-gray-300
          font-semibold
          transition
          hover:bg-gray-800
          hover:text-white
          hover:-translate-y-1
          "
          >
            Support →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Error404;
