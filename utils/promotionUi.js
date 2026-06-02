/**
 * @typedef {object} PromotionUI
 * @property {string} id
 * @property {'special'|'sale'|'deal'|'banner'|'coupon'} type
 * @property {string} title
 * @property {string} [subtitle]
 * @property {string} [description]
 * @property {string} status
 * @property {string} [imageUrl]
 * @property {string} [mobileImageUrl]
 * @property {string|null} [startAt]
 * @property {string|null} [endAt]
 * @property {{ label: string, tone?: string }} [badge]
 * @property {{ label: string, actionType: string, actionTarget?: string|null }} [cta]
 * @property {{ discountType?: string, discountValue?: number, formattedDiscount?: string }} [pricing]
 * @property {{ summary?: string, conditionSummary?: string[], rewardSummary?: string[] }} [deal]
 * @property {{ code?: string, minimumOrderAmount?: number, formattedMinimumOrderAmount?: string }} [coupon]
 * @property {{ surface: string, slot: string, contextType?: string, contextId?: string|null, contextName?: string }} placement
 */

import GenericPromotionCard from '../components/promotions/GenericPromotionCard';
import HomeHeroPromotion from '../components/promotions/HomeHeroPromotion';
import HomeFeaturedStripPromotion from '../components/promotions/HomeFeaturedStripPromotion';
import DepartmentTopBannerPromotion from '../components/promotions/DepartmentTopBannerPromotion';
import CategoryHeaderPromotion from '../components/promotions/CategoryHeaderPromotion';
import ProductPromoBadgeRow from '../components/promotions/ProductPromoBadgeRow';
import ProductInlinePromotion from '../components/promotions/ProductInlinePromotion';
import CartPromotionSummary from '../components/promotions/CartPromotionSummary';
import CouponEntrySection from '../components/promotions/CouponEntrySection';
import CheckoutPromoRow from '../components/promotions/CheckoutPromoRow';

/**
 * @param {PromotionUI['placement']} placement
 */
export function getPromotionComponent(placement) {
  if (!placement) return GenericPromotionCard;
  const key = `${placement.surface}:${placement.slot}`;
  switch (key) {
    case 'home:hero':
      return HomeHeroPromotion;
    case 'home:featured_strip':
      return HomeFeaturedStripPromotion;
    case 'department:top_banner':
      return DepartmentTopBannerPromotion;
    case 'category:top_banner':
      return CategoryHeaderPromotion;
    case 'product:badge_area':
      return ProductPromoBadgeRow;
    case 'product:inline_banner':
      return ProductInlinePromotion;
    case 'cart:summary_block':
      return CartPromotionSummary;
    case 'cart:coupon_entry':
      return CouponEntrySection;
    case 'checkout:summary_line':
      return CheckoutPromoRow;
    default:
      return GenericPromotionCard;
  }
}
