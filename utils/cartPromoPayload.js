/**
 * Build `{ productId, quantity }[]` for promotion APIs from legacy Redux cart shapes.
 * @param {any[]} cartItems — `state.cartItems.ids`
 */
export function cartLinesForPromoApi(cartItems) {
  const counts = new Map();

  const add = (productId, qty = 1) => {
    if (!productId) return;
    const k = String(productId);
    counts.set(k, (counts.get(k) || 0) + qty);
  };

  for (const line of cartItems || []) {
    if (!line || typeof line !== 'object') continue;

    if (line._id) {
      add(line._id, 1);
      continue;
    }

    if (Array.isArray(line.products) && line.products.length > 0 && line.products[0]._id) {
      add(line.products[0]._id, line.products.length);
      continue;
    }

    const keys = Object.keys(line);
    for (const key of keys) {
      const arr = line[key];
      if (!Array.isArray(arr)) continue;
      for (const cell of arr) {
        if (!cell || typeof cell !== 'object') continue;
        const inner = cell.products;
        if (Array.isArray(inner) && inner.length > 0) {
          const p0 = inner[0];
          if (p0 && p0._id) add(p0._id, inner.length);
        } else if (cell._id) {
          add(cell._id, 1);
        }
      }
    }
  }

  return [...counts.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}
