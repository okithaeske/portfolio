import React from "react";

export default function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden>
      <svg className="w-full h-16" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ transform: flip ? 'scaleY(-1)' : undefined }}>
        <path d="M0,0 C360,100 1080,0 1440,100 L1440,0 L0,0 Z" className="fill-current text-gray-50 dark:text-gray-950" />
      </svg>
    </div>
  );
}


