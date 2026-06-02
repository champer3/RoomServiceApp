import { Linking } from 'react-native';
import { buildDefaultFormObject } from './productCartForm';

function resolveCategoryNameFromProducts(target, products) {
  const t = String(target);
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const c = p.category;
    if (c && typeof c === 'object' && c._id != null && String(c._id) === t) {
      return c.name || p.categoryName || String(t);
    }
  }
  return t;
}

/**
 * @param {import('./promotionUi').PromotionUI} promotion
 * @param {object} navigation — React Navigation
 * @param {{ products?: object[] }} [options]
 */
export function handlePromotionCtaPress(navigation, promotion, options = {}) {
  const cta = promotion?.cta;
  if (!cta || cta.actionType === 'none' || !navigation) return;

  const target = cta.actionTarget;
  const products = Array.isArray(options.products) ? options.products : [];

  if (cta.actionType === 'custom_link' && target) {
    const url = String(target);
    if (url.startsWith('http://') || url.startsWith('https://')) {
      Linking.openURL(url).catch(() => {});
    }
    return;
  }

  if (cta.actionType === 'coupon') {
    return;
  }

  if (cta.actionType === 'product' && target) {
    const prod = products.find((p) => String(p._id) === String(target));
    if (prod) {
      const productData = buildDefaultFormObject(prod);
      navigation.navigate('Product', { product: prod, productData });
    }
    return;
  }

  if (cta.actionType === 'category' && target) {
    const catParam = resolveCategoryNameFromProducts(target, products);
    navigation.navigate('Category', { cat: catParam });
    return;
  }

  if (cta.actionType === 'department' && target) {
    navigation.navigate('All Categories');
  }
}
