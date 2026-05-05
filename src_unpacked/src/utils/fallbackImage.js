const svgToDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const RETRO_LOGO_FALLBACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 72">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0%" stop-color="#9d50bb"/>
      <stop offset="100%" stop-color="#ffd700"/>
    </linearGradient>
  </defs>
  <rect width="240" height="72" rx="16" fill="#161616"/>
  <rect x="4" y="4" width="232" height="64" rx="12" fill="none" stroke="url(#g)" stroke-width="2"/>
  <text x="22" y="43" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">RETRO</text>
  <text x="132" y="43" fill="url(#g)" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">ROOM</text>
</svg>`);

export const DEFAULT_AVATAR_FALLBACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="a" x1="0" x2="1">
      <stop offset="0%" stop-color="#9d50bb"/>
      <stop offset="100%" stop-color="#ffd700"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="128" fill="#1a1a1a"/>
  <circle cx="128" cy="102" r="46" fill="url(#a)" opacity="0.92"/>
  <path d="M48 220c12-44 50-70 80-70s68 26 80 70" fill="url(#a)" opacity="0.92"/>
</svg>`);

export const MARKET_PLACEHOLDER_FALLBACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="m" x1="0" x2="1">
      <stop offset="0%" stop-color="#161616"/>
      <stop offset="100%" stop-color="#2a2a2a"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#m)"/>
  <rect x="24" y="24" width="592" height="312" rx="24" fill="none" stroke="#9d50bb" stroke-width="3" stroke-dasharray="10 10" opacity="0.75"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Retro listing image</text>
</svg>`);
