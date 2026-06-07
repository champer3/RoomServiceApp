import {
  StyleSheet, View, Pressable, ScrollView, Dimensions, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../Data/cart";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import Text from "../components/Text";
import AppImage from "../components/AppImage";
import { cartLineTotal } from "../utils/productCartForm";

const { width: SW } = Dimensions.get("window");
const ACCENT = "#283618";

function RecieptScreen() {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [cartItems] = useState(Array.isArray(route.params?.items) ? [...route.params.items] : []);
  const orderId = route.params?.id || "—";
  const paramTotal = route.params?.total;
  const deliveryFee = Number(route.params?.deliveryFee ?? 0);
  const orderDate = route.params?.date || null;
  const orderType = route.params?.orderType || "Delivery";
  const orderStatus = route.params?.status || "";
  const isPickup = (orderType || "").toLowerCase() === "pickup";
  const isCancelled = ["cancelled", "canceled", "refunded"].includes((orderStatus || "").toLowerCase());
  const cancelLabel = (orderStatus || "").toLowerCase() === "refunded" ? "Refunded" : "Cancelled";

  const calculateTotalPrice = (formObject) => cartLineTotal(formObject);

  const subtotal = cartItems.reduce((sum, item) => sum + calculateTotalPrice(item), 0);
  const taxesAndFees = 0.3 * subtotal;
  const rawTotal = paramTotal != null ? Number(String(paramTotal).replace(/[^0-9.]/g, "")) : subtotal + taxesAndFees + deliveryFee;
  const grandTotal = isNaN(rawTotal) ? subtotal + taxesAndFees + deliveryFee : rawTotal;

  function getFormattedDate() {
    const d = orderDate ? new Date(orderDate) : new Date();
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function fmtDate() {
    const d = orderDate ? new Date(orderDate) : new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function fmtPrice(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  useEffect(() => {
    if (cartItems.length) dispatch(clearCart({ id: cartItems }));
  }, []);

  const html = buildReceiptHtml(cartItems, calculateTotalPrice, subtotal, taxesAndFees, deliveryFee, grandTotal, orderId, fmtDate(), isCancelled, cancelLabel);

  const printToFile = async () => {
    const { uri } = await Print.printToFileAsync({ html, width: 380, height: 900 });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.heroBar, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={goBack} hitSlop={8} style={styles.backCircle}>
            <Ionicons name="chevron-back" size={18} color="#fff" />
          </Pressable>
          <Text style={styles.heroTitle}>Order Receipt</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.emptyWrap}>
          <Ionicons name="receipt-outline" size={56} color="#9CA3AF" />
          <Text style={styles.emptyText}>No items on this receipt</Text>
          <Pressable onPress={() => navigation.navigate("HomeTabs")} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Go home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Green header */}
      <View style={[styles.heroBar, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.backCircle}>
          <Ionicons name="chevron-back" size={18} color="#fff" />
        </Pressable>
        <Text style={styles.heroTitle}>Order Receipt</Text>
        <Pressable onPress={printToFile} hitSlop={8} style={styles.backCircle}>
          <Ionicons name="share-outline" size={17} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.heroBottom}>
        <View style={styles.heroIdRow}>
          <Text style={styles.heroIdLabel}>Order ID</Text>
          <Text style={styles.heroIdValue} numberOfLines={1}>{orderId}</Text>
        </View>
        <View style={styles.heroIdRow}>
          <Text style={styles.heroIdLabel}>Date</Text>
          <Text style={styles.heroIdValue}>{getFormattedDate()}</Text>
        </View>
        {isPickup && (
          <View style={styles.pickupBadgeRow}>
            <View style={styles.pickupBadge}>
              <Ionicons name="bag-handle-outline" size={14} color="#283618" style={{ marginRight: 5 }} />
              <Text style={styles.pickupBadgeText}>Pickup Order</Text>
            </View>
          </View>
        )}
        {isCancelled && (
          <View style={styles.pickupBadgeRow}>
            <View style={styles.cancelledBadge}>
              <Ionicons name="close-circle" size={14} color="#EF4444" style={{ marginRight: 5 }} />
              <Text style={styles.cancelledBadgeText}>{cancelLabel}</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Items */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Items</Text> */}
          {cartItems.map((item, idx) => {
            const product = item.products?.[0];
            const qty = item.products?.length || 1;
            const linePrice = calculateTotalPrice(item);
            const allChips = [
              ...(item.extra || []).map((e) => ({ label: e.name, price: e.price })),
              ...(item.options || []).flatMap((o) => (o.values || []).map((v) => ({ label: v.name, price: v.price }))),
              ...(item.variantSelections || []).flatMap((g) => (g.selected || []).map((c) => ({ label: c.name, price: c.priceDelta }))),
              ...(item.schemaAddonsSelected || []).map((a) => ({ label: a.name, price: a.price })),
            ];
            return (
              <View key={idx} style={styles.itemCard}>
                <AppImage uri={product?.images?.[0]} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>{product?.title}</Text>
                  {qty > 1 && <Text style={styles.itemQty}>Qty: {qty}</Text>}
                  {item.components ? <Text style={styles.itemQty}>{item.components}</Text> : null}
                  {allChips.length > 0 && (
                    <View style={styles.chipRow}>
                      {allChips.map((c, i) => (
                        <View key={i} style={styles.chip}>
                          <Text style={styles.chipText}>{c.label}{Number(c.price) ? ` (+${fmtPrice(Number(c.price))})` : ""}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {item.instructions ? <Text style={styles.itemNote}>Note: {item.instructions}</Text> : null}
                </View>
                <Text style={styles.itemPrice}>{fmtPrice(linePrice)}</Text>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Summary</Text> */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{fmtPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxes & Fees</Text>
              <Text style={styles.summaryValue}>{fmtPrice(taxesAndFees)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, deliveryFee === 0 && { color: "#16A34A" }]}>{deliveryFee === 0 ? "Free" : fmtPrice(deliveryFee)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotalRow]}>
              <Text style={styles.summaryTotalLabel}>{isCancelled ? cancelLabel : "Total Paid"}</Text>
              <Text style={[styles.summaryTotalValue, isCancelled && { color: "#EF4444", textDecorationLine: "line-through" }]}>{fmtPrice(grandTotal)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

    </View>
  );
}

function buildReceiptHtml(cartItems, calculateTotalPrice, subtotal, taxesAndFees, deliveryFee, grandTotal, orderId, dateStr, isCancelled, cancelLabel) {
  const totalQty = cartItems.reduce((s, it) => s + (it.products?.length || 1), 0);
  const rows = cartItems.map((item) => {
    const p = item.products?.[0];
    const qty = item.products?.length || 1;
    const details = [
      ...(item.extra || []).map((e) => e.name + (e.price ? ` +$${Number(e.price).toFixed(2)}` : "")),
      ...(item.options || []).flatMap((o) => (o.values || []).map((v) => v.name + (v.price ? ` +$${Number(v.price).toFixed(2)}` : ""))),
      ...(item.variantSelections || []).flatMap((g) => (g.selected || []).map((c) => c.name + (c.priceDelta ? ` +$${Number(c.priceDelta).toFixed(2)}` : ""))),
      ...(item.schemaAddonsSelected || []).map((a) => a.name + (a.price ? ` +$${Number(a.price).toFixed(2)}` : "")),
    ];
    const comp = item.components ? `<br/><span class="item-extras">${item.components}</span>` : "";
    const detailStr = details.length ? `<br/><span class="item-extras">+ ${details.join(", ")}</span>` : "";
    const noteStr = item.instructions ? `<br/><span class="item-note">Note: ${item.instructions}</span>` : "";
    return `<tr>
      <td class="item-cell">
        <span class="item-name">${p?.title || "Item"}</span>${comp}${detailStr}${noteStr}
      </td>
      <td class="c">${qty}</td>
      <td class="r">$${calculateTotalPrice(item).toFixed(2)}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><style>
  @page { margin: 0; size: 380px auto; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    color: #111;
    background: #f5f5f0;
    padding: 12px;
  }
  .receipt {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 20px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .header { text-align: center; padding: 16px 0 8px; }
  .brand { font-size: 26px; font-weight: bold; letter-spacing: 3px; color: #283618; }
    .tagline { font-size: 10px; color: #333; margin-top: 2px; }
  .line { border-bottom: 1px dashed #bbb; margin: 10px 0; }
  .double-line { border-bottom: 3px double #222; margin: 10px 0; }
  .info-table { width: 100%; }
  .info-table td { padding: 2px 0; }
    .info-table .label { color: #333; }
  .info-table .value { text-align: right; font-weight: bold; }
    .col-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; letter-spacing: 1px; color: #333; padding: 4px 0; }
  table.items { width: 100%; border-collapse: collapse; }
  table.items td { padding: 6px 0; vertical-align: top; }
  .item-cell { width: 60%; }
  .item-name { font-weight: bold; font-size: 12px; }
    .item-extras { font-size: 10px; color: #444; }
    .item-note { font-size: 10px; color: #555; font-style: italic; }
  .c { text-align: center; width: 15%; }
  .r { text-align: right; width: 25%; }
  table.totals { width: 100%; border-collapse: collapse; }
  table.totals td { padding: 3px 0; }
    table.totals .label { color: #222; }
  table.totals .value { text-align: right; }
  .grand-row td {
    padding-top: 10px;
    border-top: 3px double #222;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 2px;
  }
  .grand-row .value { color: #283618; }
  .stamp {
    text-align: center;
    margin: 20px 0 8px;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 6px;
    color: #283618;
    border: 3px solid #283618;
    border-radius: 8px;
    display: inline-block;
    padding: 4px 20px;
  }
  .stamp-wrap { text-align: center; }
  .footer { text-align: center; font-size: 10px; color: #444; margin-top: 10px; padding-bottom: 10px; }
  .barcode { text-align: center; font-size: 28px; letter-spacing: 4px; color: #222; margin: 12px 0 4px; font-family: 'Libre Barcode 39', monospace; }
  .order-id-small { text-align: center; font-size: 10px; color: #333; }
  .cancelled-badge { text-align: center; margin: 8px 0; }
  .cancelled-badge span { display: inline-block; background: #FEE2E2; color: #EF4444; font-weight: bold; font-size: 11px; padding: 3px 14px; border-radius: 20px; letter-spacing: 1px; }
  .cancelled-total { text-decoration: line-through; color: #999 !important; }
  .stamp-cancelled { color: #EF4444; border-color: #EF4444; }
</style></head><body>
  <div class="receipt">
  <div class="header">
    <div class="brand">ROOMSERVICE</div>
    <div class="tagline">Thank you for your order!</div>
  </div>
  <div class="double-line"></div>

  <table class="info-table">
    <tr><td class="label">Order</td><td class="value">#${orderId}</td></tr>
    <tr><td class="label">Date</td><td class="value">${dateStr}</td></tr>
    <tr><td class="label">Items</td><td class="value">${totalQty}</td></tr>
  </table>
  ${isCancelled ? `<div class="cancelled-badge"><span>${cancelLabel.toUpperCase()}</span></div>` : ""}
  <div class="line"></div>

  <table class="items">
    <tr style="font-size:11px;color:#222;letter-spacing:1px;">
      <td><b>ITEM</b></td><td class="c"><b>QTY</b></td><td class="r"><b>PRICE</b></td>
    </tr>
  </table>
  <div class="line"></div>
  <table class="items">${rows}</table>
  <div class="line"></div>

  <table class="totals">
    <tr><td class="label">Subtotal</td><td class="value">$${subtotal.toFixed(2)}</td></tr>
    <tr><td class="label">Tax & Fees</td><td class="value">$${taxesAndFees.toFixed(2)}</td></tr>
    <tr><td class="label">Delivery</td><td class="value">${deliveryFee === 0 ? "FREE" : "$" + deliveryFee.toFixed(2)}</td></tr>
    <tr class="grand-row"><td>TOTAL</td><td class="value${isCancelled ? " cancelled-total" : ""}">$${grandTotal.toFixed(2)}</td></tr>
  </table>

  <div class="stamp-wrap"><div class="stamp${isCancelled ? " stamp-cancelled" : ""}">${isCancelled ? cancelLabel.toUpperCase() : "PAID"}</div></div>

  <div class="order-id-small">${orderId}</div>
  <div class="footer">We appreciate your business<br/>RoomService &copy; ${new Date().getFullYear()}</div>
  </div>

</body></html>`;
}

export default RecieptScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },

  heroBar: { backgroundColor: ACCENT, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingBottom: 14 },
  backCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  heroTitle: { flex: 1, textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#fff" },
  heroBottom: { backgroundColor: ACCENT, paddingHorizontal: 20, paddingBottom: 20 },
  heroIdRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  heroIdLabel: { fontFamily: "Poppins-Regular", fontSize: 13, color: "rgba(255,255,255,0.65)" },
  heroIdValue: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#fff", maxWidth: "60%", textAlign: "right" },
  pickupBadgeRow: { alignItems: "center", marginTop: 10 },
  pickupBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  pickupBadgeText: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: "#283618" },
  cancelledBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(239,68,68,0.12)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  cancelledBadgeText: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: "#EF4444" },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827", marginBottom: 12 },

  itemCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  itemImage: { width: 60, height: 60, borderRadius: 12, backgroundColor: "#EDEAE5" },
  itemInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  itemTitle: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#111827" },
  itemQty: { fontFamily: "Poppins-Regular", fontSize: 12, color: "#6B7280", marginTop: 2 },
  itemNote: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#9CA3AF", fontStyle: "italic", marginTop: 3 },
  itemPrice: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: ACCENT, alignSelf: "center", marginLeft: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 4 },
  chip: { backgroundColor: "rgba(188,108,37,0.08)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#6B7280" },

  summaryCard: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#6B7280" },
  summaryValue: { fontFamily: "Poppins-Medium", fontSize: 14, color: "#111827" },
  summaryTotalRow: { marginBottom: 0, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
  summaryTotalLabel: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827" },
  summaryTotalValue: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: ACCENT },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 16 },
  emptyText: { fontFamily: "Poppins-Medium", fontSize: 16, color: "#6B7280" },
  emptyBtn: { backgroundColor: ACCENT, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 32 },
  emptyBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#fff" },
});
