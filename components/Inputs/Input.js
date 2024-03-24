import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useImperativeHandle } from 'react';

import { useState } from "react";
import FlexButton from "../Buttons/FlexButton";

const  Input = ({
  text,
  length,
  icon,
  type = "none",
  secured = false,
  keyboard = "default",
  buttonText,
  children,
  color,
  textInputConfig,
  onPress, 
  onInteract
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  let content = (
    <TextInput
      style={[styles.input, {color: color, height: 40, fontSize: 16}]}
      placeholder={text}
      autoComplete="address-line1"
      cursorColor={"rgba(0,0,0,0.5)"}
      maxLength={length}
      autoCapitalize="words"
      keyboardType={keyboard}
      placeholderTextColor={color}
      {...textInputConfig}
    />
  );
  if (secured) {
    content = (
      <TextInput
        style={[styles.input, {color: color,  height: 40, fontSize: 16}]}
        placeholder={text}
        autoComplete="address-line1"
        cursorColor={"rgba(0,0,0,0.5)"}
        maxLength={length}
        secureTextEntry={!showPassword}
        keyboardType={keyboard}
        placeholderTextColor={color}
        {...textInputConfig}
      />
    );
  }
  let width = 347;
  if (length) {
    width /= 7 / length;
  }
  return (
    <Pressable
      onPress={onInteract}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'

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
              <Pressable onPress={onPress} style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                <Octicons name="location" size={24} color="#BC6C25" />
                <Text style={{ color: "#BC6C25" }}>Get location</Text>
              </Pressable>
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
            {type == 'dropdown' && (<Ionicons name="chevron-down-outline" size={24} color="#aaa" />)}
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
    </Pressable>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.03)",
    // backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
    paddingHorizontal: 16,
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
    paddingTop: -20,
    // flex: 1,
    color: "white"
  },
});
