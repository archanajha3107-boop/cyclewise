import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, label = 'Back' }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="flex items-center gap-1 text-mauve mb-4 text-sm font-medium"
    >
      <span className="text-base">←</span>
      <span>{label}</span>
    </button>
  );
}