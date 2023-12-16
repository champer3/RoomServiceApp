import { StyleSheet, Text, View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

import { useState } from "react";
import FlexButton from "../Buttons/FlexButton";

function Input({
  text,
  length,
  icon,
  type = "none",
  secured = false,
  keyboard = "default",
  buttonText,
  children,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  let content = (
    <TextInput
      style={styles.input}
      placeholder={text}
      autoComplete="address-line1"
      cursorColor={"rgba(0,0,0,0.5)"}
      maxLength={length}
      autoCapitalize="words"
      keyboardType={keyboard}
    />
  );
  if (secured) {
    content = (
      <TextInput
        style={styles.input}
        placeholder={text}
        autoComplete="address-line1"
        cursorColor={"rgba(0,0,0,0.5)"}
        maxLength={length}
        secureTextEntry={!showPassword}
        keyboardType={keyboard}
      />
    );
  }
  let width = 347;
  if (length) {
    width /= 7 / length;
  }
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 25,
        gap: 5,
      }}
    >
      <View style={styles.container}>
        <View style={[styles.subContainer, { flex: 1 , paddingVertical: 4,}]}>
          {icon}
          {content}
        </View>
        <View
          style={[
            styles.subContainer,
            { justifyContent: "flex-end", flexShrink: 1 },
          ]}
        >
          <View
            style={[
              styles.subContainer,
              { justifyContent: "flex-end", flexShrink: 1 },
            ]}
          >
            {type == "address" && (
              <>
                <Octicons name="location" size={24} color="#BC6C25" />
                <Text style={{ color: "#BC6C25" }}>Get location</Text>
              </>
            )}
            {type == "password" && (
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowPassword}
              />
            )}
            {buttonText && (
              <View style={{ height: 50 }}>
                <FlexButton
                  background="#283618"
                  color="#283618"
                  opacity={1}
                  borderRadius={10}
                >
                  <Text style={{ color: "white" }}>{buttonText}</Text>
                </FlexButton>
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 4,
          justifyContent: "flex-start",
        }}
      >
        {children}
      </View>
    </View>
  );
}
export default Input;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
    padding: 16,
    // marginVertical: -6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    // minWidth: "22.5%",
    width: "100%",
    flex: 1,
  },
});
