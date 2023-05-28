import React from "react";

const colors = [
  "bg-red-400",
  "bg-orange-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-indigo-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-teal-400",
  "bg-rose-400",
  "bg-cyan-400",
  "bg-lime-400",
  "bg-yellow-400",
  "bg-violet-400",
  "bg-fuchsia-400",
  "bg-slate-400",
  "bg-gray-400",
  "bg-stone-400",
  "bg-zinc-400",
  "bg-neutral-400",
];
const DefaultUserLogo = ({ dims, nameAbbreviation }) => {
  return (
    <div
      className={`${
        colors[Math.floor(Math.random() * colors.length)]
      } ${dims} text-white rounded-full flex items-center justify-center text-4xl font-bold relative z-[1]`}
    >
      {nameAbbreviation}
    </div>
  );
};

export default DefaultUserLogo;
