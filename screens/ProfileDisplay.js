import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Content from "../components/Content";
import FlexButton from "../components/Buttons/FlexButton";
import BottomSheet from "../components/Modals/BottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useCallback, useRef } from "react";
import Input from "../components/Inputs/Input";
import PhoneIcon from "../components/PhoneIcon";
import Info from "../components/Info";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";

function ProfileDisplay() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);
  console.log(data)

  const [warning, setWarning] = useState();
  const [text, setText] = useState();
  const [form, setForm] = useState(data);
  function handleUpdate() {
    dispatch(updateProfile({ id: form }));
  }
  function handleFormChange(field, value) {
    if (field == "number") {
      const cleanedInput = value.replace(/\D/g, "");

      // Add brackets dynamically based on entered digits
      let formattedNumber = "";
      for (let i = 0; i < cleanedInput.length; i++) {
        if (i === 0) {
          formattedNumber += "(";
        } else if (i === 3) {
          formattedNumber += ") ";
        } else if (i === 6) {
          formattedNumber += "-";
        }
        formattedNumber += cleanedInput[i];
      }
      value = formattedNumber;
    }
    if (field == "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setWarning("Provide a valid email address");
      } else {
        setWarning();
      }
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  const ref = useRef(null);
  const onPress = useCallback((e) => {
    const isActive = ref?.current?.isActive();
    // ref?.current?.scrollTo(0);
    if (e == "name") {
      ref?.current?.scrollTo(-770);
      setText("name");
    } else if (e == "email") {
      ref?.current?.scrollTo(-770);
      setText("email");
    } else if (e == "number") {
      ref?.current?.scrollTo(-770);
      setText("number");
    } else if (e == "language") {
      ref?.current?.scrollTo(-770);
      setText(e);
    } else if (e == "password") {
      ref?.current?.scrollTo(-770);
      setText(e);
    }
  }, []);
  function handleSubmit() {
    if (!(warning && text == "email") && form.number.length == 14) {
      handleUpdate();
      ref?.current?.scrollTo(0);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView onTouchStart={()=>ref?.current?.scrollTo(0)} style={{ marginBottom: "15%" }}>
          <View
            style={[
              styles.recommendedView,
              {
                marginHorizontal: "5%",
                paddingBottom: "2%",
                justifyContent: "space-between",
              },
            ]}
          >
            <Content
              title={"Name"}
              info={`${data.firstName} ${data.lastName}`}
              onPress={() => onPress("name")}
            />
            <View
              style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 0.75 }}
            ></View>
            <Content
              title={"Email"}
              info={`${data.email}`}
              onPress={() => onPress("email")}
            />
            <View
              style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 0.75 }}
            ></View>
            <Content
              title={"Number"}
              info={`${data.phoneNumber}`}
              onPress={() => onPress("number")}
            />
            <View
              style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 0.75 }}
            ></View>
            <Content
              title={"Language"}
              info={`English`}
              onPress={() => onPress("language")}
            />
            <View
              style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 0.75 }}
            ></View>
          </View>
        </ScrollView>
        {/* <BottomSheet ref={ref}>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              paddingHorizontal: "5%",
              gap: 20,
            }}
          >
            {text == "name" && (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Your Name</Text>
                </View>
                <Input
                  text={"First Name"}
                  icon={<Ionicons name="person" size={24} color={"#aaa"} />}
                  textInputConfig={{
                    cursorColor: "#aaa",
                    value: form.firstName,
                    onChangeText: handleFormChange.bind(this, "firstName"),
                  }}
                />
                <Input
                  text={"Last Name"}
                  icon={<Ionicons name="person" size={24} color={"#aaa"} />}
                  textInputConfig={{
                    cursorColor: "#aaa",
                    value: form.lastName,
                    onChangeText: handleFormChange.bind(this, "lastName"),
                  }}
                />
                  <View
              style={[
                styles.recommendedView,
                { height: "20%", paddingTop: "25%" },
              ]}
            >
                 {!(form.lastName.length > 0 && form.firstName.length > 0) && (
              <Info
                text={`${'Provide your first and last name'}                                            `}
              />
            )}
              <FlexButton
                onPress={form.lastName.length > 0 && form.firstName.length > 0 ? handleSubmit : ()=>{} }
                background={
                  !(form.lastName.length > 0 && form.firstName.length > 0) ? "rgba(0,0,0,0.5)" : "#283618"
                }
              >
                <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
              </FlexButton>
            </View>
              </>
            )}
            {text == "email" && (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Your Email Address</Text>
                </View>
                <Input
                  text={"Email Address"}
                  icon={<MaterialIcons name="email" size={24} color="#aaa" />}
                  textInputConfig={{
                    cursorColor: "#aaa",
                    value: form.email,
                    onChangeText: handleFormChange.bind(this, "email"),
                  }}
                />
                 {warning && text == "email" && (
              <Info
                text={`${warning}                                            `}
              />
            )}
              <View
              style={[
                styles.recommendedView,
                { height: "20%", paddingTop: "25%" },
              ]}
            >
              <FlexButton
                onPress={text == 'language' ? ()=>{} : handleSubmit}
                background={
                  text == 'language' ? '"rgba(0,0,0,0.5)"' :
                  (warning && text == "email" ? "rgba(0,0,0,0.5)" : "#283618")
                }
              >
                <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
              </FlexButton>
            </View>
              </>
            )}
            {text == "number" && (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Your Number</Text>
                </View>
                <Input
                  text={"Contact Number"}
                  icon={<PhoneIcon />}
                  keyboard="number-pad"
                  length={14}
                  textInputConfig={{
                    cursorColor: "#aaa",
                    value: form.phoneNumber,
                    onChangeText: handleFormChange.bind(this, "phoneNumber"),
                  }}
                />
              </>
            )}
            {text == "language" && (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Preferred Language</Text>
                </View>
                <Input
                  text={"English (United States)"}
                  type="dropdown"
                  icon={
                    <View>
                      <Image
                        style={{
                          borderRadius: 4,
                          resizeMode: "cover",
                          width: 30,
                          height: 20,
                        }}
                        source={require("../assets/dsBuffer.bmp1.png")}
                      />
                    </View>
                  }
                  textInputConfig={{
                    cursorColor: "#aaa",
                    value: form.language,
                  }}
                />
              </>
            )}
            
           
            <View
              style={[
                styles.recommendedView,
                { height: "20%", paddingTop: "25%" },
              ]}
            >
              <FlexButton
                onPress={text == 'language' ? ()=>{} : handleSubmit}
                background={
                  text == 'language' ? '"rgba(0,0,0,0.5)"' :
                  (warning && text == "email" ? "rgba(0,0,0,0.5)" : "#283618")
                }
              >
                <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
              </FlexButton>
            </View>
          </View>
        </BottomSheet> */}
      </View>
    </GestureHandlerRootView>
  );
}
export default ProfileDisplay;

const styles = StyleSheet.create({
  catHead: {
    justifyContent: "space-between",
    gap: 19,
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20, color: "#aaa" },
  recommendedView: {},
});
                    