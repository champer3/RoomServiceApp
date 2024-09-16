import { Image, Pressable, Dimensions, ScrollView } from "react-native";
import { StyleSheet, View } from "react-native";
import Text from '../Text';
const { width, height } = Dimensions.get("window");
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons';


function ProductDescription({ title, image, price, reviews, category, component, side, flavour, options, instruction, quantity, action, onPress, onTap, children }) {
  function isValidURL(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }

    return str.startsWith("http://") || str.startsWith("https://");
  }
  return (
    <View style={[styles.container]}>
      <View style={styles.imageContainer}>
        <View
          style={{
            flex: -1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10
          }}
        >
          <View style={{
            justifyContent: "center",
            alignItems: "center",
            marginRight: 20,
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 50,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
            {image && isValidURL(image) && <Image
              style={styles.image}
              source={{ uri: image }}
            />}
          </View>
          <Text style={{ fontWeight: 900, fontSize: 14 }}>{`Total: $${(price).toFixed(2)}`}</Text>
          {component && <Text style={{ fontWeight: 900, fontSize: 14 }}>{`Picked: ${component}`}</Text>}
        </View>

        <View style={{ flex: -1.5, justifyContent: 'space-between', gap: 9 }}>

          <View style={styles.textContainer}>
            <View style={{ width: '85%' }}>
              <Text
                style={[styles.text]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {title
                  ? title.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ""}
              </Text>
            </View>
            {(side || component || instruction || !flavour?.length == 0) && onPress && <Pressable onPress={onPress} style={styles.right}>
              <AntDesign name="edit" size={25} color="#BC6C25" />
            </Pressable>}
            {action && <Pressable onPress={action} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={35} color="#B22334" /></Pressable>}

          </View>
          <ScrollView style={{ maxHeight: 100 }}>
    {/* Sides Section */}
    {side && (
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text style={{ fontSize: 15 }}>Sides</Text>
        {side.map((item, idx) => (
          <Text key={idx} style={{ fontWeight: 'bold', fontSize: 10 }}>
            + {item.name}: ${item.price.toFixed(2)}
          </Text>
        ))}
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: width / 3, height: 3, marginTop: 8 }} />
      </View>
    )}

    {/* Options Section */}
    {options.map((option, index) => option.values?.length > 0 && (
      <View key={index} style={{ alignItems: 'center', marginTop: 8 }}>
        <Text style={{ fontSize: 10, textAlign: 'center' }}>
          {option.name}: {option.values.map((value) => value.name).join(', ')}
        </Text>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: width / 3, height: 3, marginTop: 8 }} />
      </View>
    ))}

    {/* Instructions Section */}
    {instruction && (
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 13 }}>Instructions</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'right' }}>
          {instruction}
        </Text>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: width / 3, height: 3, marginTop: 8 }} />
      </View>
    )}
  </ScrollView>
        </View>
      </View>
    </View>
  );
}
// {item.extra?.length > 0 && (
//   <View>
//     {item.extra.map((extraItem, index) => (
//       <Text key={index} style={{fontSize: 8}}>+ {item.name}: ${item.price.toFixed(2)}</Text>
//     ))}
//   </View>
// )}
// {item.options?.length > 0 && <View
//   style={{ alignItems: "center", gap: 9, alignItems: 'center' , marginTop: 8}}
// >

// {/* Render selected options */}
// {item.options?.length > 0 && (
//   <View>
//     {item.options.map((option, index) => (
//       option.values?.length > 0 && <View key={index}>
//         <Text style={{fontSize: 8}}>{option.name}: {option.values.map((value, valIndex) => (
//             value.name + " , "
//         ))}</Text>
//       </View>
//     ))}
//   </View>
// )}
export default ProductDescription;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 15,
    // marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "space-around",

  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'
    // borderWidth: 2
  },
  textContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  image: {
    width: width / 5,
    height: height / 10,
    borderRadius: 50,
  },
  text: { fontSize: 16, lineHeight: 18, textAlign: 'center' },
  priceView: {
    position: "absolute",
    top: 15,
    zIndex: 2,
    left: 15,
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "#283618",
    padding: 0.5,
    paddingHorizontal: 6,
    borderRadius: 30,
    zIndex: 1,
  },
  priceText: {
    color: "white",
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    fontWeight: "700",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  },
});
