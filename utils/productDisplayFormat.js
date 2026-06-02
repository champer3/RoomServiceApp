/**
 * Helpers to present API product documents (mongoose schema) in the customer app.
 * Category / department are often populated objects from GET /products.
 */

const METADATA_LABELS = {
  brand: "Brand",
  unit_size: "Unit / size",
  ingredients: "Ingredients",
  prep_time: "Prep time (mins)",
  calories: "Calories",
  spice_level: "Spice level",
  allergens: "Allergens",
  expiration_type: "Expiration type",
  supplier: "Supplier",
};

function humanizeKey(key) {
  if (!key || typeof key !== "string") return "Details";
  if (METADATA_LABELS[key]) return METADATA_LABELS[key];
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getCategoryLabel(product) {
  const c = product?.category;
  if (c && typeof c === "object" && c.name) return String(c.name).trim() || null;
  return null;
}

export function getDepartmentLabel(product) {
  const d = product?.department;
  if (d && typeof d === "object" && d.name) return String(d.name).trim() || null;
  const c = product?.category;
  const cd = c?.department;
  if (cd && typeof cd === "object" && cd.name) return String(cd.name).trim() || null;
  return null;
}

export function formatMetadataValue(value) {
  if (value == null || value === "") return null;
  if (Array.isArray(value)) {
    const parts = value
      .map((v) => {
        if (v == null) return "";
        if (typeof v === "object") return JSON.stringify(v);
        return String(v).trim();
      })
      .filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  const s = String(value).trim();
  return s || null;
}

/**
 * @returns {{ key: string, label: string, value: string }[]}
 */
export function getMetadataRows(product) {
  const meta = product?.metadata;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return [];
  const rows = [];
  for (const key of Object.keys(meta)) {
    const formatted = formatMetadataValue(meta[key]);
    if (!formatted) continue;
    rows.push({ key, label: humanizeKey(key), value: formatted });
  }
  rows.sort((a, b) => a.label.localeCompare(b.label));
  return rows;
}

export function getStockMessage(product) {
  if (product?.availability === false) return "Currently unavailable";
  if (product?.trackInventory === false) return null;
  const s = Number(product?.stock);
  if (!Number.isFinite(s)) return null;
  if (s <= 0) return "Out of stock";
  const low = Number(product?.lowStockThreshold);
  if (Number.isFinite(low) && low > 0 && s <= low) {
    return `Only ${s} left`;
  }
  return "In stock";
}

export function formatPrice(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  return x.toFixed(2);
}
