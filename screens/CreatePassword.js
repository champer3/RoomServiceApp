import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Buttons/Button";
import Info from "../components/Info";
import Input from "../components/Inputs/Input";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CreatePassword() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);
  const [form, setForm] = useState(data);
  console.log("FORM: ", form);
  const profile = useSelector((state) => state.profileData.profile);
  const postData = {
    firstName: form.firstName,
    lastName: form.secondName,
    phoneNumber: form.number,
    email: form.email,
    password: form.password,
    passwordConfirm: form.password,
  };
  let authToken;
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const navigation = useNavigation();
  async function pressHandler() {
    try {
      handleUpdate();
      console.log(profile);
      await createAccount();
      // Call the function to save the token
      await saveTokenToAsyncStorage();
      navigation.navigate("HomeTabs");
    } catch (err) {
      console.log(err);
    }
  }
  function handleFormChange(value) {
    setForm((prev) => ({ ...prev, ["password"]: value }));
  }

  function handleUpdate() {
    dispatch(updateProfile({ id: form }));
  }
  const createAccount = async () => {
    try {
      const response = await axios.post(
        `http://10.0.0.173:3000/api/v1/users/signup`,
        JSON.stringify(postData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      authToken = response.data.token;

      console.log(response.data);
      console.log("got here");
    } catch (err) {
      console.log(err.error);
    }
    // console.log(response.data)
  };

  // Save the token to AsyncStorage
  const saveTokenToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      console.log("Token saved successfully.");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.welcomeView}>
            <Text style={styles.text}>Done,</Text>
            <Text style={styles.text}>Create A Password🤩</Text>
            <View style={styles.lineContainer}>
              <View style={styles.line}></View>
              <View style={styles.line}></View>
              <View style={styles.line}></View>
              <View
                style={[styles.line, { backgroundColor: "#283618" }]}
              ></View>
            </View>
          </View>
          <View style={{ flex: 3 }}>
            <Input
              type="password"
              text="Password"
              secured={true}
              icon={<MaterialIcons name="lock" size={24} color="#aaa" />}
              textInputConfig={{
                cursorColor: "#aaa",
                value: form.password,
                onChangeText: handleFormChange.bind(this),
              }}
            />
            <Input
              type="password"
              text="Confirm Password"
              secured={true}
              icon={<MaterialIcons name="lock" size={24} color="#aaa" />}
            />
            <View style={{ marginTop: 20 }}>
              <Info text="Choose a strong and secure password to complete your account creation" />
            </View>
          </View>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <View style={styles.buttonContainer}>
              <Button onPress={pressHandler}>
                <Text style={{ fontSize: 16, color: "white" }}>
                  Create Password{" "}
                </Text>
                <Image
                  style={styles.vector}
                  source={require("../assets/Vector.png")}
                />
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}

export default CreatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginHorizontal: "5%",
    marginVertical: 80,
  },
  welcomeView: {
    flex: 1,
    marginBottom: 42,
  },
  description: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    height: 65,
    marginBottom: -20,
  },
  vector: {
    width: "10%",
    resizeMode: "center",
  },
  facebook: {
    width: "12%",
    resizeMode: "cover",
  },
  threeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    height: 2,
    backgroundColor: "#EEEEEE",
    width: "30%",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    color: "#333333",
    fontSize: 32,
    fontWeight: "500",
    letterSpacing: 2,
  },
  lineContainer: {
    flexDirection: "row",
    marginTop: "5%",
    justifyContent: "space-between",
    height: "34%",
  },
  line: {
    height: "5%",
    width: "20%",
    backgroundColor: "#D9D9D9",
  },
});
