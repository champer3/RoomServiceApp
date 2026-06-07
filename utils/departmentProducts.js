/**
 * Normalize category from API / populated product for matching.
 * @param {unknown} cat
 * @returns {string} slug-like key
 */
export function guessCategorySlug(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function categoryKeyFromProduct(cat) {
  if (cat == null) return "";
  if (typeof cat === "string") return guessCategorySlug(cat);
  if (typeof cat === "object") {
    const slug = cat.slug != null ? String(cat.slug).toLowerCase().trim() : "";
    if (slug) return slug.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return guessCategorySlug(cat.name);
  }
  return "";
}

export function productDepartmentId(product) {
  const d = product?.department;
  if (d == null) return "";
  if (typeof d === "object" && d._id != null) return String(d._id);
  return String(d);
}

export function productDepartmentSlug(product) {
  const d = product?.department;
  if (d && typeof d === "object" && d.slug) return String(d.slug).toLowerCase().trim();
  return "";
}

/**
 * @param {object[]} products
 * @param {{ id: string, slug?: string }} departmentMeta from API
 * @param {{ slug: string, name: string }[]} categoriesOrdered
 * @returns {{ category: object, products: object[] }[]}
 */
export function groupProductsByCategoryOrder(products, departmentMeta, categoriesOrdered) {
  const deptId = departmentMeta?.id != null ? String(departmentMeta.id) : "";
  const deptSlug = departmentMeta?.slug ? String(departmentMeta.slug).toLowerCase().trim() : "";

  const inDept = products.filter((p) => {
    if (p?.availability === false) return false;
    const pid = productDepartmentId(p);
    const pslug = productDepartmentSlug(p);
    if (deptId && pid === deptId) return true;
    if (deptSlug && pslug === deptSlug) return true;
    return false;
  });

  const list = Array.isArray(categoriesOrdered) ? categoriesOrdered : [];
  return list.map((cat) => {
    const catSlug = (cat.slug && String(cat.slug).toLowerCase().trim()) || "";
    const catGuess = guessCategorySlug(cat.name);
    const prods = inDept.filter((p) => {
      const pk = categoryKeyFromProduct(p.category);
      if (catSlug && pk === catSlug) return true;
      if (catGuess && pk === catGuess) return true;
      if (cat.name && guessCategorySlug(p.category?.name || p.category) === catGuess) return true;
      return false;
    });
    return { category: cat, products: prods };
  });
}
