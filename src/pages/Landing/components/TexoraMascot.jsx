// src/pages/Landing/components/TexoraMascot.jsx

import React from "react";

/**
 * Small decorative AI-assistant mascot used in the panel header.
 * Pure inline SVG so no extra image asset is required.
 * Swap this out for a branded illustration/PNG later if you have one —
 * just replace the contents of this component (props stay the same).
 */
const TexoraMascot = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* antenna */}
    <line
      x1="32"
      y1="3"
      x2="32"
      y2="11"
      stroke="#FF7A1A"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="32" cy="3" r="3" fill="#FF7A1A" />

    {/* ears */}
    <rect x="2" y="22" width="7" height="14" rx="3.5" fill="#FFE0CC" />
    <rect x="55" y="22" width="7" height="14" rx="3.5" fill="#FFE0CC" />

    {/* head */}
    <rect
      x="9"
      y="10"
      width="46"
      height="38"
      rx="14"
      fill="#F4F5F7"
      stroke="#E5E7EB"
      strokeWidth="2"
    />

    {/* screen / face */}
    <rect x="15" y="19" width="34" height="20" rx="8" fill="#1A1A2E" />

    {/* eyes */}
    <circle cx="26" cy="29" r="3.5" fill="#36D1FF" />
    <circle cx="38" cy="29" r="3.5" fill="#36D1FF" />

    {/* smile */}
    <path
      d="M27 35c1.6 1.4 7.4 1.4 9 0"
      stroke="#36D1FF"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />

    {/* body */}
    <rect x="17" y="50" width="30" height="11" rx="5.5" fill="#E5E7EB" />
    <circle cx="32" cy="55.5" r="2.5" fill="#FF7A1A" />
  </svg>
);

export default TexoraMascot;