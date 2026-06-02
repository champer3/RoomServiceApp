/**
 * Cart line shape for products: legacy (options/extra/components) + schema (variantGroups/addons).
 */

function initVariantSelections(product) {
  const groups = Array.isArray(product?.variantGroups) ? product.variantGroups : [];
  return groups.map((g) => ({
    groupId: String(g.id ?? g.name ?? ""),
    groupName: g.name || "Option",
    selectionType: g.selectionType === "multiple" ? "multiple" : "single",
    required: !!g.required,
    choices: (Array.isArray(g.choices) ? g.choices : []).map((c) => ({
      id: String(c.id ?? c.name ?? ""),
      name: c.name || "",
      priceDelta: Number(c.priceDelta) || 0,
    })),
    selected: [],
  }));
}

export function buildDefaultFormObject(product) {
  const p = product || {};
  return {
    extra: p.extra ? [] : null,
    components:
      Array.isArray(p.components) && p.components.length > 0 ? "" : null,
    options: Array.isArray(p.options)
      ? p.options.map((option) => ({
          name: option.name,
          required: option.required || false,
          quantity: option.quantity || null,
          values: [],
        }))
      : [],
    products: [p],
    instructions: p.instructions ? "" : null,
    variantSelections: initVariantSelections(p),
    schemaAddonsSelected: [],
  };
}

/**
 * When reopening from cart, keep saved selections but fill missing keys from current product defaults.
 */
export function mergeCartFormWithProduct(productData, product) {
  const base = buildDefaultFormObject(product);
  if (!productData || typeof productData !== "object") return base;
  return {
    ...base,
    ...productData,
    options: Array.isArray(productData.options) ? productData.options : base.options,
    variantSelections: Array.isArray(productData.variantSelections)
      ? productData.variantSelections
      : base.variantSelections,
    schemaAddonsSelected: Array.isArray(productData.schemaAddonsSelected)
      ? productData.schemaAddonsSelected
      : base.schemaAddonsSelected,
    extra: productData.extra !== undefined ? productData.extra : base.extra,
    components:
      productData.components !== undefined ? productData.components : base.components,
    instructions:
      productData.instructions !== undefined
        ? productData.instructions
        : base.instructions,
    products:
      Array.isArray(productData.products) && productData.products.length > 0
        ? productData.products
        : base.products,
  };
}

export function cartLineTotal(formObject) {
  const productQuantity = Math.max(
    1,
    Array.isArray(formObject?.products) ? formObject.products.length : 1
  );
  const unitBase = Number(formObject?.products?.[0]?.price) || 0;
  let total = unitBase * productQuantity;

  (Array.isArray(formObject?.extra) ? formObject.extra : []).forEach((extraItem) => {
    total += (Number(extraItem.price) || 0) * productQuantity;
  });

  (Array.isArray(formObject?.options) ? formObject.options : []).forEach(
    (optionCategory) => {
      const vals = Array.isArray(optionCategory.values)
        ? optionCategory.values
        : [];
      if (optionCategory.required) {
        vals.forEach((selectedOption) => {
          total += (Number(selectedOption.price) || 0) * productQuantity;
        });
      } else {
        vals.forEach((selectedOption) => {
          total += Number(selectedOption.price) || 0;
        });
      }
    }
  );

  (Array.isArray(formObject?.variantSelections)
    ? formObject.variantSelections
    : []
  ).forEach((g) => {
    (Array.isArray(g.selected) ? g.selected : []).forEach((c) => {
      total += (Number(c.priceDelta) || 0) * productQuantity;
    });
  });

  (Array.isArray(formObject?.schemaAddonsSelected)
    ? formObject.schemaAddonsSelected
    : []
  ).forEach((ad) => {
    total += (Number(ad.price) || 0) * productQuantity;
  });

  return total;
}

export function canAddCartLine(product, formObject) {
  const p = product || {};
  const f = formObject || {};

  if (p.extra) {
    if (!Array.isArray(f.extra) || f.extra.length < 2) return false;
  }
  if (
    Array.isArray(p.components) &&
    p.components.length > 0 &&
    (f.components == null || String(f.components).trim() === "")
  ) {
    return false;
  }
  for (const optionCategory of f.options || []) {
    if (optionCategory.required) {
      const selectedCount = Array.isArray(optionCategory.values)
        ? optionCategory.values.length
        : 0;
      const need = optionCategory.quantity || 1;
      if (selectedCount < need) return false;
    }
  }

  for (const g of f.variantSelections || []) {
    if (!g.required) continue;
    const n = Array.isArray(g.selected) ? g.selected.length : 0;
    if (n < 1) return false;
  }

  return true;
}
