import axios from 'axios';
import { SERVER_URL } from '../config';

const base = `${SERVER_URL}/api/v1/app`;

/**
 * @returns {Promise<{
 *   departments: Array<{
 *     id: string, name: string, slug: string, iconUrl: string,
 *     layoutPreset: 'food'|'grocery', categoryNavStyle: 'tabs'|'chips'|'grid'
 *   }>,
 *   promotions: { hero: any[], featuredStrip: any[], tiles: any[] }
 * } | undefined>}
 */
export async function fetchAppHome() {
  const res = await axios.get(`${base}/home`, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  return res.data?.data;
}

/**
 * @returns {Promise<{
 *   department: {
 *     id: string, name: string, slug: string, iconUrl: string,
 *     layoutPreset: 'food'|'grocery', categoryNavStyle: 'tabs'|'chips'|'grid'
 *   },
 *   categories: Array<{ id: string, name: string, slug: string, iconUrl?: string, imageUrl?: string }>,
 *   promotions: {
 *     hero: any[],
 *     topBanner: any[],
 *     featuredStrip: any[]
 *   }
 * } | undefined>}
 */
export async function fetchAppDepartment(slug) {
  const res = await axios.get(`${base}/departments/${encodeURIComponent(slug)}`, {
    timeout: 15000,
  });
  return res.data?.data;
}

/**
 * @param {string} slug Category slug from the API (not display name).
 * @param {{ departmentSlug?: string }} [options] When set, resolves the category inside that department (unique when slug repeats).
 * @returns {Promise<{
 *   category: {
 *     id: string, name: string, slug: string,
 *     iconUrl?: string, imageUrl?: string,
 *     department: { id: string, name: string, slug: string } | null
 *   },
 *   promotions: { topBanner: any[], inline: any[] }
 * } | undefined>}
 */
export async function fetchAppCategory(slug, options = {}) {
  const departmentSlug =
    options.departmentSlug != null ? String(options.departmentSlug).toLowerCase().trim() : '';
  const res = await axios.get(`${base}/categories/${encodeURIComponent(slug)}`, {
    timeout: 15000,
    params: departmentSlug ? { departmentSlug } : undefined,
  });
  return res.data?.data;
}

export async function fetchAppProduct(productId) {
  const res = await axios.get(`${base}/products/${encodeURIComponent(productId)}`, {
    timeout: 15000,
  });
  return res.data?.data;
}

export async function postAppCartPromotions(body) {
  const res = await axios.post(`${base}/cart/promotions`, body, {
    timeout: 15000,
  });
  return res.data?.data;
}

export async function postAppApplyCoupon(body) {
  const res = await axios.post(`${base}/cart/apply-coupon`, body, {
    timeout: 15000,
    validateStatus: (s) => s < 500,
  });
  return res;
}
