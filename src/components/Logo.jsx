import React from 'react';

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 8 C26 8 8 26 8 50 C8 74 26 92 50 92 C37 81 28 66 28 50 C28 34 37 19 50 8Z"
        fill="#9B6B8A"
        opacity="0.95"
      />
      <path
        d="M50 18 C32 18 18 32 18 50 C18 68 32 82 50 82 C39 72 32 62 32 50 C32 38 39 28 50 18Z"
        fill="#C4A8BB"
        opacity="0.5"
      />
      <path
        d="M53 57 C53 46 58 37 63 33 C63 33 67 44 61 57Z"
        fill="#C4836A"
        opacity="0.95"
      />
      <path
        d="M53 57 C48 47 42 41 38 39 C38 39 41 51 51 58Z"
        fill="#C4836A"
        opacity="0.75"
      />
      <path
        d="M53 57 C58 47 65 44 68 44 C68 44 65 55 57 59Z"
        fill="#C4836A"
        opacity="0.75"
      />
      <path
        d="M53 57 C53 63 52 68 51 73"
        stroke="#C4836A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M52 66 C52 66 46 62 44 56 C47 59 52 66 52 66Z"
        fill="#7A9E87"
        opacity="0.85"
      />
    </svg>
  );
}