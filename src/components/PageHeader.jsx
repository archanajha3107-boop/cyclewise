import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  backTo,
  showLogo = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-5">
      {showBack && (
        <button
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="flex items-center gap-1 text-mauve mb-3 text-sm font-medium"
        >
          <span className="text-base">←</span>
          <span>Back</span>
        </button>
      )}
      <div className="flex items-center gap-2">
        {showLogo ? (
          <Logo size={22} />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M50 8 C26 8 8 26 8 50 C8 74 26 92 50 92 C37 81 28 66 28 50 C28 34 37 19 50 8Z"
              fill="#9B6B8A"
              opacity="0.95"
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
          </svg>
        )}
        <h1 className="page-title">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-muted-rose text-sm mt-1 ml-5">{subtitle}</p>
      )}
    </div>
  );
}