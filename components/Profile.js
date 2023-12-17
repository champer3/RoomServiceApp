import { Image, Pressable, Dimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");



function Profile({ image, quantity, action,  children }) {
  let text = "Oladimeji Abubakar";

  return (
    <View style={[styles.container]}>
      <View style={styles.imageContainer}>
        <View
          style={{
            flex: -1,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 20,
            borderRadius: 30,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
        >
          <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Image
              style={styles.image}
              source={require("../assets/Profile.png")}
            />
          </Pressable>
        </View>

        <View style={{ flex: -1.5, justifyContent: 'space-between',gap: 9 }}>
          
            <View style={styles.textContainer}>
                <View style= {{width: '80%'}}>
              <Text
                style={[styles.text]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {text
                  ? text.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ""}
              </Text>
              </View>
              {action}
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 9, alignItems: 'center' }}
              >
                <Text style={{fontWeight: '300', fontSize: 16, color: 'white'}}>oladimeji@gmail.com</Text>
              </View>
            </View>
        </View>
      </View>
    </View>
  );
}
export default Profile;
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    // marginTop: 20,
    padding: 20,
    backgroundColor: "#283618",
    justifyContent: "space-around",
    
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'
    // borderWidth: 2
  },
  textContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  image: {
    maxWidth: width / 5.7,
    height: height / 12,
  },
  text: { fontSize: 20, fontWeight: 'bold', lineHeight: 25, color: 'white' },
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
