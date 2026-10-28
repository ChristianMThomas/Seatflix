import React from "react";

const Spinner = ({ label = "Loading..." }) => {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-5 py-20">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin shadow-[0_0_30px_rgb(var(--brand-rgb)/0.35)]" />
        <div className="absolute inset-3 rounded-full bg-brand/20 blur-md animate-pulse" />
      </div>
      <span className="text-light-200 text-sm tracking-wide">{label}</span>
    </div>
  );
};

export default Spinner;
