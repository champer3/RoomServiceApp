export const PROMO_GREEN = '#425928';
export const PROMO_ACCENT = '#BC6C25';
export const PROMO_BG = '#F0F0F0';
export const PROMO_CARD = '#FFFFFF';

export function toneToColor(tone) {
  switch (tone) {
    case 'sale':
      return PROMO_ACCENT;
    case 'special':
      return PROMO_GREEN;
    case 'deal':
      return '#8B5A2B';
    case 'coupon':
      return '#6d28d9';
    default:
      return '#374151';
  }
}
