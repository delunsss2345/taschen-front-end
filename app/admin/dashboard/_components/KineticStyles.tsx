import type { CSSProperties } from 'react'

export const adminKineticVars = {
  '--dash-ink': '#17130f',
  '--dash-muted': '#6d655c',
  '--dash-canvas': '#f2efe7',
  '--dash-paper': '#fffaf0',
  '--dash-paper-strong': '#fff4d7',
  '--dash-line': '#ded6c7',
  '--dash-green': '#1f6b4c',
  '--dash-green-soft': '#dfeade',
  '--dash-coral': '#d95f43',
  '--dash-coral-soft': '#f7ded6',
  '--dash-gold': '#b88021',
  '--dash-gold-soft': '#f3e2bb',
  '--dash-blue': '#2f5d83',
  '--dash-blue-soft': '#dce7ef',
  '--dash-plum': '#5f416d',
  '--dash-plum-soft': '#eaddeb',
  '--dash-display': 'Georgia, Cambria, "Times New Roman", serif',
  '--dash-sans': '"Aptos", "Helvetica Neue", Arial, sans-serif',
} as CSSProperties

export function KineticStyles() {
  return (
    <style>{`
      @keyframes dash-rise {
        from {
          opacity: 0;
          transform: translate3d(0, 22px, 0) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }

      @keyframes dash-glow {
        0%, 100% {
          transform: translate3d(-8%, -8%, 0) scale(1);
          opacity: 0.5;
        }
        50% {
          transform: translate3d(8%, 6%, 0) scale(1.12);
          opacity: 0.85;
        }
      }

      @keyframes dash-sweep {
        from {
          transform: translateX(-120%) skewX(-18deg);
        }
        to {
          transform: translateX(220%) skewX(-18deg);
        }
      }

      @keyframes dash-scan {
        0% {
          transform: translateY(-100%);
          opacity: 0;
        }
        18%, 74% {
          opacity: 0.7;
        }
        100% {
          transform: translateY(180%);
          opacity: 0;
        }
      }

      @keyframes dash-marquee {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-50%);
        }
      }

      @keyframes dash-hue {
        from {
          background-position: 0% 50%;
        }
        to {
          background-position: 220% 50%;
        }
      }

      @keyframes dash-bar {
        from {
          transform: scaleY(0.08);
          filter: saturate(0.6);
        }
        to {
          transform: scaleY(1);
          filter: saturate(1.12);
        }
      }

      @keyframes dash-width {
        from {
          transform: scaleX(0.08);
        }
        to {
          transform: scaleX(1);
        }
      }

      @keyframes dash-float {
        0%, 100% {
          transform: translateY(0) rotate(var(--tilt, -4deg));
        }
        50% {
          transform: translateY(-12px) rotate(calc(var(--tilt, -4deg) * -1));
        }
      }

      @keyframes dash-pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(217, 95, 67, 0.34);
        }
        50% {
          box-shadow: 0 0 0 12px rgba(217, 95, 67, 0);
        }
      }

      @keyframes dash-rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .kinetic-ambient {
        position: relative;
        isolation: isolate;
      }

      .kinetic-ambient::before,
      .kinetic-ambient::after {
        content: "";
        position: absolute;
        z-index: -1;
        pointer-events: none;
      }

      .kinetic-ambient::before {
        width: 44rem;
        height: 44rem;
        right: -18rem;
        top: -20rem;
        background:
          radial-gradient(circle at 35% 35%, rgba(217, 95, 67, 0.28), transparent 34%),
          radial-gradient(circle at 64% 62%, rgba(31, 107, 76, 0.2), transparent 35%),
          radial-gradient(circle at 50% 50%, rgba(184, 128, 33, 0.18), transparent 48%);
        filter: blur(2px);
        animation: dash-glow 11s ease-in-out infinite;
      }

      .kinetic-ambient::after {
        inset: 0;
        background:
          linear-gradient(90deg, rgba(23, 19, 15, 0.035) 1px, transparent 1px),
          linear-gradient(rgba(23, 19, 15, 0.03) 1px, transparent 1px);
        background-size: 56px 56px;
        mask-image: linear-gradient(to bottom, black, transparent 68%);
      }

      .kinetic-panel,
      .kinetic-item,
      .kinetic-hero {
        animation: dash-rise 720ms cubic-bezier(0.18, 0.9, 0.28, 1) both;
        animation-delay: var(--delay, 0ms);
      }

      .kinetic-panel,
      .kinetic-item {
        transition:
          transform 220ms ease,
          box-shadow 220ms ease,
          border-color 220ms ease,
          background-color 220ms ease;
      }

      .kinetic-panel:hover,
      .kinetic-item:hover {
        transform: translateY(-3px);
        border-color: rgba(23, 19, 15, 0.36);
        box-shadow: 10px 10px 0 rgba(23, 19, 15, 0.08);
      }

      .kinetic-shine {
        position: relative;
        overflow: hidden;
      }

      .kinetic-shine::after {
        content: "";
        position: absolute;
        inset: -18% auto -18% -35%;
        width: 32%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.42), transparent);
        animation: dash-sweep 4.8s cubic-bezier(0.2, 0.7, 0.2, 1) infinite;
      }

      .kinetic-scan {
        position: relative;
        overflow: hidden;
      }

      .kinetic-scan::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(transparent 0 94%, rgba(255, 255, 255, 0.08) 94% 100%);
        background-size: 100% 12px;
        opacity: 0.34;
      }

      .kinetic-scan::after {
        content: "";
        position: absolute;
        inset: 0;
        height: 52%;
        pointer-events: none;
        background: linear-gradient(180deg, transparent, rgba(255, 250, 240, 0.24), transparent);
        animation: dash-scan 5.6s ease-in-out infinite;
      }

      .kinetic-bar {
        transform-origin: bottom;
        animation: dash-bar 920ms cubic-bezier(0.18, 0.9, 0.28, 1) both;
        animation-delay: var(--delay, 0ms);
      }

      .kinetic-width {
        transform-origin: left;
        animation: dash-width 900ms cubic-bezier(0.18, 0.9, 0.28, 1) both;
        animation-delay: var(--delay, 0ms);
      }

      .kinetic-book {
        animation: dash-float 4.8s ease-in-out infinite;
        animation-delay: var(--delay, 0ms);
      }

      .kinetic-pulse {
        animation: dash-pulse 2.4s ease-in-out infinite;
      }

      .kinetic-orbit {
        animation: dash-rotate 18s linear infinite;
      }

      .kinetic-marquee {
        display: flex;
        width: max-content;
        animation: dash-marquee 24s linear infinite;
      }

      .kinetic-marquee:hover {
        animation-play-state: paused;
      }

      .kinetic-gradient-text {
        background: linear-gradient(90deg, var(--dash-ink), var(--dash-coral), var(--dash-green), var(--dash-ink));
        background-size: 220% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: dash-hue 8s linear infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .kinetic-ambient::before,
        .kinetic-panel,
        .kinetic-item,
        .kinetic-hero,
        .kinetic-shine::after,
        .kinetic-scan::after,
        .kinetic-bar,
        .kinetic-width,
        .kinetic-book,
        .kinetic-pulse,
        .kinetic-orbit,
        .kinetic-marquee,
        .kinetic-gradient-text {
          animation: none !important;
        }

        .kinetic-panel,
        .kinetic-item {
          transition: none !important;
        }
      }
    `}</style>
  )
}
