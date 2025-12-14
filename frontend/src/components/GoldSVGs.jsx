import React from 'react';

// Gold Paisley SVG - Elegant Indian motif
export const GoldPaisley = ({ className = "", size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="goldGradientPaisley" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#C5A02F" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <path
      d="M50 10C30 10 15 30 15 50C15 70 35 90 50 90C65 90 85 70 85 50C85 40 75 25 60 20C55 18 52 15 50 10Z"
      fill="url(#goldGradientPaisley)"
      opacity="0.8"
    />
    <path
      d="M50 25C38 25 28 38 28 50C28 62 38 75 50 75C62 75 72 62 72 50C72 42 65 32 55 28"
      stroke="url(#goldGradientPaisley)"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="50" cy="50" r="8" fill="url(#goldGradientPaisley)" />
  </svg>
);

// Decorative Flower SVG - Like Anand Sweets pick flower
export const GoldFlower = ({ className = "", size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="goldFlowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    {/* Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={i}
        cx="50"
        cy="25"
        rx="12"
        ry="20"
        fill="url(#goldFlowerGrad)"
        opacity="0.8"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    {/* Center */}
    <circle cx="50" cy="50" r="15" fill="#FFD700" />
    <circle cx="50" cy="50" r="10" fill="#C5A02F" />
    <circle cx="50" cy="50" r="5" fill="#FFD700" />
  </svg>
);

// Gold Diya (Lamp) SVG - Festival element
export const GoldDiya = ({ className = "", size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="diyaGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#FF6B35" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFF4E0" />
      </linearGradient>
    </defs>
    {/* Diya base */}
    <ellipse cx="50" cy="75" rx="35" ry="12" fill="url(#diyaGold)" />
    <path d="M20 75C20 58 32 48 50 48C68 48 80 58 80 75" fill="url(#diyaGold)" />
    {/* Oil surface */}
    <ellipse cx="50" cy="52" rx="18" ry="6" fill="#8B4513" opacity="0.5" />
    {/* Flame */}
    <path d="M50 15C48 28 43 38 50 45C57 38 52 28 50 15Z" fill="url(#flameGrad)" />
    <path d="M50 22C49 30 46 36 50 42C54 36 51 30 50 22Z" fill="#FFD700" />
    {/* Glow */}
    <circle cx="50" cy="30" r="8" fill="#FFD700" opacity="0.3" />
  </svg>
);

// Gold Ladoo SVG - Sweet representation
export const GoldLadoo = ({ className = "", size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <defs>
      <radialGradient id="ladooGold" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="70%" stopColor="#C5A02F" />
        <stop offset="100%" stopColor="#B8860B" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="url(#ladooGold)" />
    {/* Texture dots */}
    <circle cx="35" cy="35" r="5" fill="#FFE55C" opacity="0.6" />
    <circle cx="60" cy="40" r="4" fill="#FFE55C" opacity="0.5" />
    <circle cx="45" cy="60" r="4" fill="#FFE55C" opacity="0.5" />
    <circle cx="65" cy="55" r="3" fill="#FFE55C" opacity="0.4" />
    <circle cx="30" cy="55" r="3" fill="#FFE55C" opacity="0.4" />
  </svg>
);

// Gold Barfi SVG - Diamond shaped sweet
export const GoldBarfi = ({ className = "", size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="barfiGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <linearGradient id="barfiSilver" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E8E8E8" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#C0C0C0" />
      </linearGradient>
    </defs>
    {/* Diamond shape */}
    <polygon points="50,10 90,50 50,90 10,50" fill="url(#barfiGold)" />
    <polygon points="50,20 80,50 50,80 20,50" fill="#FFF8DC" opacity="0.9" />
    {/* Silver vark */}
    <polygon points="50,25 75,50 50,75 25,50" fill="url(#barfiSilver)" />
  </svg>
);

// Decorative Gold Border/Divider
export const GoldFrame = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 200 20" preserveAspectRatio="none">
    <defs>
      <linearGradient id="frameGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B8860B" />
        <stop offset="25%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#C5A02F" />
        <stop offset="75%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <rect width="200" height="2" y="9" fill="url(#frameGold)" />
    <circle cx="20" cy="10" r="4" fill="url(#frameGold)" />
    <circle cx="100" cy="10" r="6" fill="url(#frameGold)" />
    <circle cx="180" cy="10" r="4" fill="url(#frameGold)" />
  </svg>
);

// Sparkle/Star SVG
export const Sparkle = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <defs>
      <radialGradient id="sparkleGold">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#C5A02F" />
      </radialGradient>
    </defs>
    <path
      d="M50 0L55 40L100 50L55 60L50 100L45 60L0 50L45 40Z"
      fill="url(#sparkleGold)"
    />
  </svg>
);

// Ornate Corner Decoration
export const GoldCorner = ({ className = "", size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="cornerGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <path
      d="M0 100 Q0 50 50 50 Q50 0 100 0 L100 10 Q55 10 55 50 Q10 50 10 100 Z"
      fill="url(#cornerGold)"
      opacity="0.8"
    />
    <circle cx="50" cy="50" r="5" fill="#FFD700" />
    <circle cx="30" cy="70" r="3" fill="#FFD700" opacity="0.6" />
    <circle cx="70" cy="30" r="3" fill="#FFD700" opacity="0.6" />
  </svg>
);

// Swirl/Flourish Decoration
export const GoldSwirl = ({ className = "", size = 100 }) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 200 80" className={className}>
    <defs>
      <linearGradient id="swirlGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B8860B" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <path
      d="M10 40 Q30 10 60 30 T110 30 T160 30 T190 40"
      stroke="url(#swirlGold)"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M10 50 Q30 80 60 50 T110 50 T160 50 T190 50"
      stroke="url(#swirlGold)"
      strokeWidth="3"
      fill="none"
    />
    <circle cx="100" cy="40" r="8" fill="#FFD700" />
    <circle cx="60" cy="40" r="4" fill="#FFD700" opacity="0.7" />
    <circle cx="140" cy="40" r="4" fill="#FFD700" opacity="0.7" />
  </svg>
);

// Falling Sweets Animation Component
export const FallingSweetsAnimation = () => {
  const sweets = [
    { id: 1, type: 'ladoo', left: '5%', delay: '0s', duration: '20s', size: 25 },
    { id: 2, type: 'barfi', left: '12%', delay: '4s', duration: '25s', size: 20 },
    { id: 3, type: 'flower', left: '22%', delay: '8s', duration: '22s', size: 30 },
    { id: 4, type: 'ladoo', left: '35%', delay: '2s', duration: '24s', size: 22 },
    { id: 5, type: 'sparkle', left: '48%', delay: '10s', duration: '18s', size: 18 },
    { id: 6, type: 'barfi', left: '58%', delay: '5s', duration: '23s', size: 24 },
    { id: 7, type: 'flower', left: '70%', delay: '1s', duration: '26s', size: 26 },
    { id: 8, type: 'ladoo', left: '82%', delay: '7s', duration: '21s', size: 20 },
    { id: 9, type: 'sparkle', left: '92%', delay: '12s', duration: '19s', size: 16 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sweets.map((sweet) => (
        <div
          key={sweet.id}
          className="absolute animate-fall"
          style={{
            left: sweet.left,
            top: '-60px',
            animationDelay: sweet.delay,
            animationDuration: sweet.duration,
          }}
        >
          {sweet.type === 'ladoo' && <GoldLadoo size={sweet.size} className="opacity-20" />}
          {sweet.type === 'barfi' && <GoldBarfi size={sweet.size} className="opacity-20" />}
          {sweet.type === 'flower' && <GoldFlower size={sweet.size} className="opacity-15" />}
          {sweet.type === 'sparkle' && <Sparkle size={sweet.size} className="opacity-25" />}
        </div>
      ))}
    </div>
  );
};

// Floating Decorations Component for page backgrounds
export const FloatingDecorations = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Top left corner */}
    <div className="absolute top-0 left-0">
      <GoldCorner size={120} className="opacity-20" />
    </div>
    {/* Top right corner (flipped) */}
    <div className="absolute top-0 right-0 transform scale-x-[-1]">
      <GoldCorner size={120} className="opacity-20" />
    </div>
    {/* Floating paisleys */}
    <div className="absolute top-32 left-8 animate-float opacity-15">
      <GoldPaisley size={60} />
    </div>
    <div className="absolute top-48 right-12 animate-float opacity-15" style={{ animationDelay: '2s' }}>
      <GoldPaisley size={50} />
    </div>
    {/* Floating flowers */}
    <div className="absolute top-1/3 left-4 animate-float opacity-10" style={{ animationDelay: '1s' }}>
      <GoldFlower size={40} />
    </div>
    <div className="absolute top-1/2 right-8 animate-float opacity-10" style={{ animationDelay: '3s' }}>
      <GoldFlower size={35} />
    </div>
    {/* Sparkles */}
    <div className="absolute top-20 left-1/4 animate-sparkle opacity-30">
      <Sparkle size={16} />
    </div>
    <div className="absolute top-40 right-1/4 animate-sparkle opacity-30" style={{ animationDelay: '1s' }}>
      <Sparkle size={14} />
    </div>
    <div className="absolute bottom-32 left-1/3 animate-sparkle opacity-25" style={{ animationDelay: '0.5s' }}>
      <Sparkle size={12} />
    </div>
  </div>
);

// External SVG from Anand Sweets (for reference design)
export const AnandFlowerSVG = ({ className = "" }) => (
  <img 
    src="https://www.anandsweets.in/cdn/shop/files/pick_flower.svg?v=1709636209" 
    alt="Decorative flower"
    className={className}
  />
);

// External guilt-free icon from Anand Sweets
export const GiltFreeIcon = ({ className = "" }) => (
  <img 
    src="https://cdn.shopify.com/s/files/1/0569/3456/4001/files/Guilt_Free_Sweets_top_icon_8e04c652-9c48-4fdd-92ed-440d9ef25c5d.svg?v=1709719757" 
    alt="Guilt free sweets"
    className={className}
  />
);
