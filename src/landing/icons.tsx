import type { ReactNode } from 'react'

function Svg({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-brand-600 dark:fill-brand-500" />
      <path
        d="M7 15.5 16 8l9 7.5M10 13.5V24h12V13.5M13.5 24v-6.5L18.5 24v-6.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const ChevronRight = () => (
  <Svg size={16}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const ShieldCheck = () => (
  <Svg>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)

export const Scale = () => (
  <Svg>
    <path d="M12 4v16M7 20h10M5 8h14M5 8l-3 7a3 3 0 0 0 6 0L5 8ZM19 8l-3 7a3 3 0 0 0 6 0l-3-7Z" />
  </Svg>
)

export const Eye = () => (
  <Svg>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
)

export const Percent = () => (
  <Svg>
    <path d="M19 5 5 19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </Svg>
)

export const Home = () => (
  <Svg>
    <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6" />
  </Svg>
)

export const Wallet = () => (
  <Svg>
    <path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Z" />
    <circle cx="16" cy="14.5" r="1" />
  </Svg>
)

export const KeyIcon = () => (
  <Svg>
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 9-9M17 6l3 3M15 8l2 2" />
  </Svg>
)

export const Undo = () => (
  <Svg>
    <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />
  </Svg>
)

export const Send = () => (
  <Svg>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
  </Svg>
)

export const Search = () => (
  <Svg size={16}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)

export const Bell = () => (
  <Svg size={18}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />
  </Svg>
)

export const Check = () => (
  <Svg size={16}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
)

export const ArrowDown = () => (
  <Svg size={16}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </Svg>
)

export const ArrowUp = () => (
  <Svg size={16}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
)

export const Plus = () => (
  <Svg size={18}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
