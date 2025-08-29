type Device = "mobile" | "tablet" | "computer";

export function detectDevice(): Device {
  const ua = navigator.userAgent || "";
  const ch = (navigator as any).userAgentData;

  if (ch?.mobile === true) return "mobile";
  const isIpadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;

  const isTabletUA =
    /\b(iPad|Tablet|Nexus 7|Nexus 9|SM-T|Tab|Kindle|Silk)\b/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    isIpadOs;

  const isMobileUA = /\b(Mobi|iPhone|Android.+Mobile)\b/i.test(ua);

  if (isMobileUA) return "mobile";
  if (isTabletUA) return "tablet";

  try {
    if (matchMedia("(pointer: coarse)").matches) {
      return Math.min(screen.width, screen.height) < 768 ? "mobile" : "tablet";
    }
  } catch {
    /* ignore */
  }

  return "computer";
}
