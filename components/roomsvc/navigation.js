/**
 * Returns the deepest active route name from navigation state (for hiding FAB, etc.)
 */
export function getActiveRouteName(state) {
  if (!state || state.routes == null) return undefined;
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
}

export function shouldHideFloatingCart(routeName) {
  if (!routeName) return false;
  return ['Checkout', 'Cart', 'Make Payment', 'Confirm Address'].includes(routeName);
}
