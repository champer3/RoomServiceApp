import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function Review({ name, review, rate, date }) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topView}>
          <Text style={styles.topText}>{name}</Text>
        </View>
        <View style={styles.bottomView}>
          <AntDesign name="star" size={18} color="#BC6C25" />
          <Text style={{color: "#BC6C25"}}>{rate}</Text>
          <Text style={{color: "#BC6C25"}}>stars</Text>
        </View>
      </View>
      <View style={styles.review}>
        <Text style={styles.reviewText}>{review}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.line}></View>
    </View>
  );
}

export default Review;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // height: 150,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333333",
  },
  topView: {
    flex: 4
  },
  bottomView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  review: {
    // flex: 3
    marginVertical: 8
  },
  reviewText: {
    color: "#333333",
    opacity: 0.5,
    lineHeight: 20,
    fontSize: 16,
    alignSelf: "center",
  },
  dateText: {
    color: "#333333",
    opacity: 0.5,
    fontSize: 12,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  line: {
    height: 1,
    width: "100%",
    opacity: 0.5,
    backgroundColor: "#333333",
  },
});
