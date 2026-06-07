const listeners = new Set();

export function onCartAdd(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emitCartAdd() {
  listeners.forEach((fn) => fn());
}
