import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Text from '../components/Text';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {Path} from 'react-native-svg';
import { addToCart } from "../Data/cart";
import useThrottledPress from "../hooks/useThrottledPress";
import { emitCartAdd } from "../utils/cartEvents";
import IncrementDecrementBton from "../components/Buttons/IncrementDecrementBtn copy";
import { LinearGradient } from "expo-linear-gradient";
import { useToast } from "../context/ToastContext";
import {
  getCategoryLabel,
  getDepartmentLabel,
  getMetadataRows,
  getStockMessage,
  formatPrice,
} from "../utils/productDisplayFormat";
import {
  buildDefaultFormObject,
  mergeCartFormWithProduct,
  cartLineTotal,
  canAddCartLine,
} from "../utils/productCartForm";
import { fetchAppProduct } from "../api/appPromotions";
import ProductPromoBadgeRow from "../components/promotions/ProductPromoBadgeRow";
import ProductInlinePromotion from "../components/promotions/ProductInlinePromotion";

const { width: screenWidth, height: windowHeight } = Dimensions.get("window");

/** ~42% of screen, capped so tall phones are not dominated by the hero image */
const HERO_IMAGE_HEIGHT = Math.min(Math.round(windowHeight * 0.42), 380);

function ProductDisplay() {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const params = route.params || {};
  const product = params.product || {};
  const productData = params.productData || buildDefaultFormObject(product);

  const [formObject, setFormObject] = useState(() =>
    mergeCartFormWithProduct(productData, product)
  );
  const [appProductPromos, setAppProductPromos] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [option, setOption] = useState();
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); 
  }, []);
  const [plus, setPlus] = useState([]);
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids);
  const productItems = useSelector((state) => state.productItems.ids);
  const ingredients = productItems.filter(product => 
    product?.subCategory?.some(sub => /side/i.test(sub)) || /side/i.test(product?.category)
  ).map(product => ({
    name: product.title,   // Extract title as name
    images: product.images,  // Extract images
    price: product.price    // Extract price
  }));

  const imageUrls = (Array.isArray(product.images) ? product.images : []).filter(
    (u) =>
      typeof u === "string" &&
      (u.startsWith("http://") || u.startsWith("https://"))
  );
  const carouselSlides = imageUrls.length > 0 ? imageUrls : [null];

  useEffect(() => {
    const timer = setTimeout(() => setRefresh(false), 1000);
  }, [refresh]);
  const navigation = useNavigation();

  useEffect(() => {
    const id = product?._id;
    if (!id) return undefined;
    let cancelled = false;
    fetchAppProduct(String(id))
      .then((d) => {
        if (!cancelled) setAppProductPromos(d?.promotions ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product?._id]);
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0); 
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageW = screenWidth || 1;
    const index = Math.min(
      Math.max(0, Math.round(offsetX / pageW)),
      Math.max(0, carouselSlides.length - 1)
    );
    setActiveIndex(index);
  };
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState('');
  const [quantity, setQuantity] = useState({});

  const handleSelectIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };
  const handleSelectVariation = (ingredient) => {
    if (formObject.components == (ingredient)) {
      setFormObject(prevForm => ({
        ...prevForm,
       components: ''
      }));
    } else {
      setFormObject(prevForm => ({
        ...prevForm,
        components: ingredient
      }));
    }
  };
  function handleIncrement() {
    const newExtra = [...(Array.isArray(formObject.products) ? formObject.products : [])];
    newExtra.push(product);
    setFormObject(prevForm => ({
      ...prevForm,
      products: newExtra
    }));
   }
   function handleDecrement(){
    const newExtra = [...(Array.isArray(formObject.products) ? formObject.products : [])];
    const currentQuantity = newExtra.length; 
    if (currentQuantity > 1) {
      newExtra.splice(0, 1);
    }
    setFormObject(prevForm => ({
      ...prevForm,
      products: newExtra
    }));
   }
  const handleQuantityChange = (item) => {
    const newExtra = [...(Array.isArray(formObject.extra) ? formObject.extra : [])];
    const isSelected = newExtra.findIndex(i => i.name === item.name) !== -1;
    const newValues = isSelected
      ? newExtra.filter((val) => val.name !== item.name)
      : [...newExtra, item];

    setFormObject(prevForm => ({
      ...prevForm,
      extra: newValues
    }));
  };
  const renderIngredient = ({ item }) => {
    const extraList = Array.isArray(formObject.extra) ? formObject.extra : [];
    const quantity = extraList.filter((i) => i.name === item.name).length;
    return <View style={styles.optionRow}>
    <View style={{flexDirection: 'row', width: 150, alignItems: 'center'}}>{item?.images?.length > 0 && <ImageBackground style={{height: 30, width: 32, marginRight:12,}} imageStyle={{borderRadius: 6, backgroundColor: '#666'}} source={{uri: item.images[0]}}/>}
    <Text style={styles.optionName}>{item.name}</Text></View>
    {item.price > 0 && <Text style={styles.ingredientDetails}>+${item.price.toFixed(2)}</Text>}
    <Pressable onPress={()=> handleQuantityChange(item)}><Ionicons name={`${ extraList.findIndex((opt) => opt.name === item.name) !== -1 ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" /></Pressable>

  </View>
  };
  const [selectedOptions, setSelectedOptions] = useState({});
  const calculateTotalPrice = () => cartLineTotal(formObject);

  const toggleVariantChoice = useCallback((groupIndex, choice) => {
    setFormObject((prev) => {
      const vs = [...(prev.variantSelections || [])];
      if (!vs[groupIndex]) return prev;
      const g = { ...vs[groupIndex] };
      let sel = Array.isArray(g.selected) ? [...g.selected] : [];
      const idx = sel.findIndex((s) => s.id === choice.id);
      const pick = {
        id: choice.id,
        name: choice.name,
        priceDelta: Number(choice.priceDelta) || 0,
      };
      if (g.selectionType === "multiple") {
        if (idx >= 0) sel.splice(idx, 1);
        else sel.push(pick);
      } else if (idx >= 0) {
        sel = g.required ? [pick] : [];
      } else {
        sel = [pick];
      }
      g.selected = sel;
      vs[groupIndex] = g;
      return { ...prev, variantSelections: vs };
    });
  }, []);

  const toggleSchemaAddonPick = useCallback((addon) => {
    setFormObject((prev) => {
      const list = [...(prev.schemaAddonsSelected || [])];
      const id = String(addon.id ?? addon.name ?? "");
      const i = list.findIndex((a) => String(a.id) === id);
      if (i >= 0) list.splice(i, 1);
      else {
        list.push({
          id: addon.id != null ? String(addon.id) : id,
          name: addon.name || "Add-on",
          price: Number(addon.price) || 0,
        });
      }
      return { ...prev, schemaAddonsSelected: list };
    });
  }, []);
  const scrollViewRef = useRef(null);
  const fuflfilCart = useThrottledPress(() => {
    Keyboard.dismiss();
    if (canAddToCart()){
    dispatch(addToCart({ id: formObject }));
    emitCartAdd();
    setFormObject({
      ...buildDefaultFormObject(product),
      products: [product],
    });
    showToast({
      type: "success",
      title: "Item added to cart",
      actionLabel: "View Cart →",
      onAction: () => navigation.navigate("Cart"),
    });
  }else{
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: HERO_IMAGE_HEIGHT, animated: true });
      }
      showToast({ type: "error", title: "Required options", message: "Choose all required options." });
    }
  }, 500);
  const handleSelectOption = (category, item, required, change = 0) => {
    setFormObject((prevForm) => {
      const updatedOptions = prevForm.options.map((opt) => {
        if (opt.name === category ) {
          let newValues = [...opt.values];
          const currentQuantity = newValues.filter((val) => val.name === item.name).length;
          if (item.price == 0 || required || change == 0){
            const isSelected = opt.values.findIndex(i => i.name === item.name) !== -1;
            if (!(!required && (formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity ))|| isSelected){
           newValues = isSelected
            ? opt.values.filter((val) => val.name !== item.name) 
            : [...opt.values, item]; 
            }
          }
          else if (change > 0) {
            // Add the item to the array
            newValues.push(item);
          } else if (change < 0 && currentQuantity > 0) {
            // Remove one instance of the item
            const index = newValues.findIndex(i => i.name === item.name);
            if (index !== -1) newValues.splice(index, 1);
          }

          return { ...opt, values: newValues };
        }
        return opt;
      });
      return { ...prevForm, options: updatedOptions };
    });
  };

  const renderOptionItem = ({ item, category, required }) => {
    const getQuantity = (category, option) => {
      const optionCategory = formObject.options.find((opt) => opt.name === category);
      if (!optionCategory) return 0;
      
      // Calculate quantity based on how many times the item exists in the values array
      const quantity = optionCategory.values.filter((val) => val.name === option).length;
      return quantity;
    };
    const quantity = getQuantity(category, item.name);
    return <View style={styles.optionRow}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>{item?.images?.length > 0 && <ImageBackground style={{height: 30, width: 32, marginRight:12,}} imageStyle={{borderRadius: 6, backgroundColor: '#666'}} source={{uri: item.images[0]}}/>}
      <Text style={styles.optionName}>{item.name}</Text></View>
      {item.price > 0 && <Text style={styles.ingredientDetails}>+${item.price.toFixed(2)}</Text>}
      {(item.price > 0  && !required ) &&   <View style={styles.ingredientActions}>{((!required && quantity > 0) || !(formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity )) && <>
        <TouchableOpacity onPress={()=> handleSelectOption(category, item, required,-1)} disabled={quantity == 0}>
        <View style={{alignItems: 'center', justifyContent: 'center',  borderRadius: 200, borderWidth: 0 }}><AntDesign name="minuscircleo" size={17} color="#BC6C25" /></View>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}{quantity != 0 && `${'x'}`}</Text>
        <TouchableOpacity onPress={()=> handleSelectOption(category, item, required,1)} disabled={(!required && (formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity ))}>
        <View style={{padding: 0, borderRadius: 100, width: 'auto' , alignItems: 'center', justifyContent: 'center', }}><AntDesign name="pluscircleo" size={17} color="#BC6C25" /></View>
        </TouchableOpacity></>}</View>}
        {(((item.price == 0 && !formObject.options.find((opt) => opt.name === category).quantity ) || required) || ((!required && quantity > 0) || !(formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity ))) && <Pressable  onPress={()=> handleSelectOption(category, item, required)}><Ionicons name={`${ formObject.options.find((opt) => opt.name === category)?.values.findIndex(i => i.name === item.name) != -1 ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" /></Pressable>
    }
    </View>
  };

  const renderOptions = ({ items }) => {
    return <View style={styles.optionSection}>
        <View style={styles.separator} />
        <View style={styles.sectionTitle}><Text >{items.name}</Text><Text style={[styles.pill ,{color: formObject.options.find((opt) => opt.name === items.name)?.values.length < items.quantity ? items.required ? '#A52A2A' : '#654321': '#2E6F'}]}> {(!items.required) ? 'Optional' : 'Required' }</Text></View>
      {items.required && <Text style={{marginBottom: 4}}>{`Pick ${items.quantity} item(s)`}</Text>}
      {!items.required && items.quantity && <Text style={{marginBottom: 4}}>{`Pick up to ${items.quantity} item(s)`}</Text>}
      <View style={styles.separator} />
      {(Array.isArray(items.value) ? items.value : []).map((item) => (
        <View key={item.name}>{renderOptionItem({ item, category: items.name, required: items.required })}</View>
      ))}
    </View>
  };

  const renderVariations = ({ item }) => (
    <View style={styles.ingredientRow}>
      <Text style={styles.optionName}>{item}</Text>
      <View style={{}}>
        {/* Quantity buttons */}
        <Pressable onPress={()=> handleSelectVariation(item)}><Ionicons name={`${formObject.components == (item)? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" /></Pressable>
      </View>
    </View>
  );

  const renderImageCarousel = () => {
    return (
      <View style={{ height: HERO_IMAGE_HEIGHT }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {carouselSlides.map((uri, index) => (
            <View key={uri || `placeholder-${index}`} style={{ width: screenWidth, height: HERO_IMAGE_HEIGHT }}>
              {uri ? (
                <ImageBackground
                  style={[styles.productImage, { width: screenWidth, height: HERO_IMAGE_HEIGHT }]}
                  source={{ uri }}
                >
                  <LinearGradient
                    colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                    style={styles.gradient}
                  />
                </ImageBackground>
              ) : (
                <View style={[styles.imagePlaceholder, { width: screenWidth, height: HERO_IMAGE_HEIGHT }]}>
                  <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.imagePlaceholderText} numberOfLines={2}>
                    {product.title || "Product"}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {carouselSlides.length > 1 ? (
          <View style={styles.dotsContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                borderRadius: 25,
                marginTop: 10,
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
            >
              {carouselSlides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  const renderSchemaVariantGroups = () => {
    const groups = Array.isArray(formObject.variantSelections)
      ? formObject.variantSelections
      : [];
    if (!groups.length) return null;
    return (
      <>
        <View style={styles.separator} />
        {groups.map((g, gi) => (
          <View key={g.groupId || `vg-${gi}`} style={styles.optionSection}>
            <View style={styles.sectionTitle}>
              <Text>{g.groupName}</Text>
              <Text
                style={[
                  styles.pill,
                  {
                    color:
                      (g.selected?.length || 0) < 1 && g.required
                        ? "#A52A2A"
                        : "#654321",
                  },
                ]}
              >
                {g.required ? "Required" : "Optional"}
              </Text>
            </View>
            <Text style={{ marginBottom: 4 }}>
              {g.selectionType === "multiple"
                ? "Pick any that apply"
                : "Pick one"}
            </Text>
            <View style={styles.separator} />
            {(g.choices || []).map((c) => {
              const on = (g.selected || []).some((s) => s.id === c.id);
              return (
                <View key={c.id} style={styles.optionRow}>
                  <Text style={styles.optionName}>{c.name}</Text>
                  {Number(c.priceDelta) > 0 ? (
                    <Text style={styles.ingredientDetails}>
                      +${Number(c.priceDelta).toFixed(2)}
                    </Text>
                  ) : (
                    <View style={{ minWidth: 48 }} />
                  )}
                  <Pressable onPress={() => toggleVariantChoice(gi, c)}>
                    <Ionicons
                      name={
                        g.selectionType === "multiple"
                          ? on
                            ? "checkbox-outline"
                            : "square-outline"
                          : on
                            ? "radio-button-on"
                            : "radio-button-off"
                      }
                      size={24}
                      color="black"
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
      </>
    );
  };

  const renderSchemaAddonsPickers = () => {
    const addons = Array.isArray(product?.addons) ? product.addons : [];
    if (!addons.length) return null;
    const picked = formObject.schemaAddonsSelected || [];
    return (
      <>
        <View style={styles.separator} />
        <View style={styles.optionSection}>
          <View style={styles.sectionTitle}>
            <Text>Add-ons</Text>
            <Text style={[styles.pill, { color: "#654321" }]}>Optional</Text>
          </View>
          <Text style={{ marginBottom: 4 }}>Extras for this item</Text>
          <View style={styles.separator} />
          {addons.map((a) => {
            const id = String(a.id ?? a.name ?? "");
            const on = picked.some((p) => String(p.id) === id);
            return (
              <View key={id} style={styles.optionRow}>
                <Text style={styles.optionName}>{a.name || "Add-on"}</Text>
                {Number(a.price) > 0 ? (
                  <Text style={styles.ingredientDetails}>
                    +${Number(a.price).toFixed(2)}
                  </Text>
                ) : (
                  <View style={{ minWidth: 48 }} />
                )}
                <Pressable onPress={() => toggleSchemaAddonPick(a)}>
                  <Ionicons
                    name={on ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color="black"
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const canAddToCart = () => canAddCartLine(product, formObject);

  const basePrice = Number(product?.price) || 0;
  const priceParts = basePrice.toFixed(2).split(".");
  const compareRaw = Number(product?.comparePrice);
  const showCompare =
    Number.isFinite(compareRaw) && compareRaw > basePrice + 0.001;
  const categoryLabel = getCategoryLabel(product);
  const departmentLabel = getDepartmentLabel(product);
  const metadataRows = getMetadataRows(product);
  const stockMsg = getStockMessage(product);
  const tagList = Array.isArray(product?.tags)
    ? product.tags.map((t) => String(t).trim()).filter(Boolean)
    : [];
  const subCats = Array.isArray(product?.subCategory) ? product.subCategory : [];
  const pillLabels = [...new Set([...subCats, ...tagList])];
  const ratingAvg = Number(product?.ratingsAverage);
  const ratingQty = Number(product?.ratingsQuantity);
  const hasRatings = Number.isFinite(ratingQty) && ratingQty > 0;
  const skuText =
    product?.sku != null && String(product.sku).trim()
      ? String(product.sku).trim()
      : null;
  const longDescription = String(product?.description || "").trim();
  const shortDesc = String(product?.shortDescription || "").trim();

  return (<>
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 88,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Section */}

      {/* Product Image Carousel */}
      <View style={styles.carouselContainer}>
        {renderImageCarousel()}
      </View>
      <View style={styles.detailsContainer}>
        {pillLabels.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.pill}>
            <Text style={styles.pillText}>{item}</Text>
          </View>
        ))}
      </View>
      {/* Product Title and Quantity Selector */}
      <View style={{  borderTopRightRadius: 25,
  borderTopLeftRadius: 25,
  backgroundColor: 'white',
  padding: 10,
  // paddingTop: 15,
  paddingBottom: 60,
  // iOS shadow properties
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 }, // shadow towards the top
  shadowOpacity: 0.3,
  shadowRadius: 6,
  // Android elevation
  elevation: 6,}}>
      <View style={styles.titleSection}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.productTitle}>{product.title}</Text>
          {(product.chefSpecial || product.isFeatured) && (
            <View style={styles.badgeRow}>
              {product.chefSpecial ? (
                <View style={styles.badgeChef}>
                  <Text style={styles.badgeChefText}>Chef's special</Text>
                </View>
              ) : null}
              {product.isFeatured ? (
                <View style={styles.badgeFeatured}>
                  <Text style={styles.badgeFeaturedText}>Featured</Text>
                </View>
              ) : null}
            </View>
          )}
          {appProductPromos?.badgeArea?.length ? (
            <View style={{ marginTop: 8 }}>
              {appProductPromos.badgeArea.map((p) => (
                <ProductPromoBadgeRow key={p.id} promotion={p} />
              ))}
            </View>
          ) : null}
        </View>
        <View style={styles.priceSection}>
          <View style={{ alignItems: "flex-end" }}>
            {showCompare ? (
              <Text style={styles.compareAtPrice}>
                ${formatPrice(compareRaw)}
              </Text>
            ) : null}
            <View style={styles.priceContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <Text style={styles.priceInteger}>{priceParts[0]}</Text>
              <Text style={styles.priceDecimal}>.{priceParts[1]}</Text>
            </View>
          </View>
        </View>
      </View>
      {stockMsg ? (
        <Text
          style={[
            styles.stockNotice,
            product.availability === false || /out of stock/i.test(stockMsg)
              ? styles.stockNoticeWarn
              : null,
          ]}
        >
          {stockMsg}
        </Text>
      ) : null}
      {appProductPromos?.inline?.length ? (
        <View style={{ marginTop: 8 }}>
          {appProductPromos.inline.map((p) => (
            <ProductInlinePromotion
              key={p.id}
              promotion={p}
              navigation={navigation}
              products={productItems}
            />
          ))}
        </View>
      ) : null}
      {hasRatings ? (
        <Text style={styles.ratingLine}>
          {Number.isFinite(ratingAvg) ? ratingAvg.toFixed(1) : "—"} ★ ·{" "}
          {ratingQty} review{ratingQty === 1 ? "" : "s"}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          paddingRight: 15,
        }}
      >
        <View style={styles.verticalLine} />
        <View style={{ flexDirection: "column", flex: 1 }}>
          {shortDesc ? (
            <Text style={styles.shortDescription}>{shortDesc}</Text>
          ) : null}
          {longDescription ? (
            <>
              <Text
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 4}
                style={[
                  styles.aboutDescription,
                  shortDesc ? { marginTop: 8 } : null,
                ]}
              >
                {longDescription}
              </Text>
              {lengthMore ? (
                <Text
                  onPress={toggleNumberOfLines}
                  style={styles.readMoreLink}
                >
                  {textShown ? "Read less…" : "Read more…"}
                </Text>
              ) : null}
            </>
          ) : !shortDesc ? (
            <Text style={styles.aboutDescriptionMuted}>
              No description provided.
            </Text>
          ) : null}
        </View>
      </View>
    <View style={styles.separator} />
    {categoryLabel ||
    departmentLabel ||
    skuText ||
    metadataRows.length > 0 ? (
      <>
        <Text style={styles.productInfoHeading}>Product information</Text>
        {departmentLabel ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{departmentLabel}</Text>
          </View>
        ) : null}
        {categoryLabel ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{categoryLabel}</Text>
          </View>
        ) : null}
        {skuText ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SKU</Text>
            <Text style={styles.infoValue}>{skuText}</Text>
          </View>
        ) : null}
        {metadataRows.map((row) => (
          <View key={row.key} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        ))}
        <View style={styles.separator} />
      </>
    ) : null}
    {renderSchemaVariantGroups()}
    {renderSchemaAddonsPickers()}
    {Array.isArray(product.nutrients) && product.nutrients.length > 0 ? (
      <>
        <View
          style={{
            paddingHorizontal: 10,
            width: screenWidth,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {product.nutrients.map((nutrient, index) => (
            <React.Fragment key={index}>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>{nutrient.name}</Text>
                <Text style={styles.value}>{`${nutrient.value} ${nutrient.unit}`}</Text>
              </View>
              {index < product.nutrients.length - 1 ? (
                <View
                  style={{
                    borderRightWidth: 1,
                    borderRightColor: "rgba(0,0,0,0.2)",
                  }}
                />
              ) : null}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.separator} />
      </>
    ) : null}
      {/* Extra Options */}
      {/* Ingredients List */}
      {Array.isArray(product.components) && product.components.length > 0 ? (
        <>
          <Text
            style={[
              styles.sectionTitle,
              (!formObject.components || String(formObject.components).trim() === "")
                ? { color: "#A52A2A", fontSize: 18 }
                : { color: "black" },
            ]}
          >
            Choose one
          </Text>
          <View style={styles.separator} />
          {product.components.map((item) => (
            <View key={item}>{renderVariations({ item })}</View>
          ))}
        </>
      ) : null}
      {product.extra ? (
        <>
          <View style={styles.sectionTitle}>
            <Text>Add extra Ingredients</Text>
            <Text
              style={[
                styles.pill,
                {
                  color:
                    (Array.isArray(formObject.extra) ? formObject.extra.length : 0) < 2
                      ? "#A52A2A"
                      : "#2E6F",
                },
              ]}
            >
              Required
            </Text>
          </View>
          <Text style={{ marginBottom: 4 }}>{`Pick 2 item(s)`}</Text>
          <View style={styles.separator} />
          {ingredients.map((item) => (
            <View key={item.name}>{renderIngredient({ item })}</View>
          ))}
        </>
      ) : null}
      {(Array.isArray(product.options) ? product.options : []).map((option) => (
        <View key={option.name}>{renderOptions({ items: option })}</View>
      ))}
      {/* Notes Section */}
      {product.instructions && <TextInput
        style={styles.notesInput}
        placeholder="Write Notes"
        value={formObject.instructions}
        onChangeText={(text) => 
          setFormObject((prev) => ({ ...prev, instructions: text }))
        }
      />}
        <View style={styles.separator} />

      {/* Bottom CTA (Next Button and Total Price) */}
  
      </View>
    </ScrollView>
    <View>
    <View style={[styles.cartSection, { bottom: Math.max(insets.bottom, 8) + 4 }]}>
  <IncrementDecrementBton
                  minValue={Math.max(1, Array.isArray(formObject.products) ? formObject.products.length : 1)}
                  onIncrease ={
              handleIncrement
                }
                  onDecrease={handleDecrement}
                />
       <TouchableOpacity onPress={fuflfilCart} >
      <LinearGradient
        colors={canAddToCart() ? ['#d9853b','#BC6C25',] : ['#aaa', "#ddd"]} // Example colors, you can change them
        style={styles.nextButton}
        start={{ x: 0, y: 0 }} // Top-left corner
        end={{ x: 1, y: 0 }}   // Top-right corner (horizontal gradient)
      >
        <Text style={styles.nextButtonText}>Next</Text>
        <View style={{  width: 1, height: 30,
    backgroundColor: 'rgba(0,0,0,0.2)', marginHorizontal: 30}} />
        <Text style={styles.nextButtonPrice}>${calculateTotalPrice().toFixed(2)}</Text>
      </LinearGradient>
    </TouchableOpacity>
      </View>
      </View>
      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 10,
          zIndex: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={navigation.goBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Svg width={43} height={43} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <Path fill="#F0F0F0" opacity=".8" d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm112 0c0-6.1 2.3-12.3 7-17L231 127c4.7-4.7 10.8-7 17-7s12.3 2.3 17 7c9.4 9.4 9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9c-4.7 4.7-10.8 7-17 7s-12.3-2.3-17-7L119 273c-4.7-4.7-7-10.8-7-17z" />
            <Path fill="black" d="M119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273z" />
          </Svg>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },detailsContainer: {
    flexDirection: 'row',
    // position: 'absolute',
    gap: 3,
    bottom: 0,
    width: screenWidth,
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 5,
  },pill: {
    backgroundColor: '#F0F0F0', // Light background for the pill
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 12,
    color: '#555', // Darker text for contrast
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6347',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselContainer: {
  },
  productImage: {
    // height set inline with HERO_IMAGE_HEIGHT
  },
  imagePlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 10,
    width: screenWidth,
 
  },  cartSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 23,
    position: 'absolute',
    bottom: 4,
    borderRadius: 35,
    width: screenWidth - 10,
    height: 60,
    marginHorizontal: 5
  },
  dot: {
    width: 4,
    height:4,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#BC6C25',
    width: 10,
    height: 4
  },
  nutritionItem: {
    alignItems: 'center',
    marginRight: 20, // Space between items
  },
  label: {
    fontSize: 14,
    color: '#777', // Light gray for label
  },sectionTitle: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: "row"
  },
  value: {
    fontSize: 18,
    color: '#333', // Darker color for value
  },
  inactiveDot: {
    backgroundColor: '#666',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
  }, ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientName: {
    fontSize: 16,
    width: '468',
  },
  ingredientDetails: {
    fontSize: 14,
    width: '20%',
  },
  ingredientActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: '30%',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCategory: {
    fontSize: 18,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionName: {
    fontSize: 16,
    width: 118,
  },
  optionPrice: {
    fontSize: 16,
    color: '#555',
    width: '30%',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  dollarSign: {
    fontSize: 18,
    color: '#A0A0A0',
    marginRight: 3,
  },
  priceInteger: {
    fontSize: 28,
    color: '#000',
  },
  priceDecimal: {
    fontSize: 18,
    color: '#A0A0A0',
    marginLeft: 3,
  },
  changeQuantityButton: {
    fontSize: 20,
    color: '#BC6C25',
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 16,
    color:"#BC6C25", 
    marginHorizontal: 1,
  },
  addToCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesInput: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#BC6C25',
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 30,
    borderRadius: 10,
      // iOS shadow properties
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 }, // shadow towards the top
  shadowOpacity: 0.3,
  shadowRadius: 6,
  // Android elevation
  elevation: 6
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    // width: 80,
  },
  nextButtonPrice: {
    color: '#fff',
    fontSize: 18,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 20,
    width: screenWidth/1.5,
    color: '#333',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 13,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 12,
    color: '#555',
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sizeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  }, verticalLine: {
    width: 3,
    height: '100%',
    backgroundColor: '#BC6C25',   
     marginRight: 13, // Spacing between the line and text
    borderRadius: 2, // Rounded edges for the vertical line
  },
  sizeOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSizeOption: {
    backgroundColor: '#FF6347',
  },
  sizeText: {
    fontSize: 16,
    color: '#555',
  },
  selectedSizeText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  compareAtPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  stockNotice: {
    fontSize: 13,
    color: '#166534',
    marginTop: 6,
    marginBottom: 2,
  },
  stockNoticeWarn: {
    color: '#B91C1C',
  },
  ratingLine: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  badgeChef: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeChefText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  badgeFeatured: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeFeaturedText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  productInfoHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
    paddingRight: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    width: '34%',
  },
  infoValue: {
    fontSize: 13,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  shortDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  aboutDescriptionMuted: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  readMoreLink: {
    textAlign: 'right',
    color: '#BC6C25',
    fontSize: 13,
    marginTop: 4,
  },
  optionGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  optionChoiceLine: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 4,
    marginBottom: 2,
  },
});

export default ProductDisplay;