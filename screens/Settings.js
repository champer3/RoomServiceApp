import { useState } from "react";
import Content from "../components/Content";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { StyleSheet, View, Alert, ScrollView, Image, Dimensions, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function Settings() {
    const data = useSelector((state) => state.profileData.profile);
    console.log(data)
    const handleNo = () => {
        // Perform action when user selects "No"
        console.log('User selected No');
      };
      async function deleteHandler() {
        console.log("here")
        console.log(data.email)
        try {
          const token = await retrievePrivateTokenFromAsyncStorage();
          console.log(token)
          await axios.delete(
            `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/${data.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                // "Content-Type": "application/json",
              },
            }
          );
          console.log("done")
          await AsyncStorage.removeItem('authToken')
          console.log("item removed")
        } catch (error) {
          console.error('Error deleting item:', error);
        }
        try {
          await AsyncStorage.removeItem('profile')
          console.log("item removed")
          navigation.replace("Authentication", { screen: "NumberLogin" });
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      }
    const showAlert = () => {
        Alert.alert(
          'Confirmation',
          'Are you sure you want to delete your account?',
          [
            {
              text: 'No',
              onPress: handleNo,
              style: 'cancel'
            },
            {
              text: 'Yes',
              onPress: deleteHandler
            }
          ],
          { cancelable: false }
        );
      };
    async function logoutHandler() {
        try {
          await AsyncStorage.removeItem('authToken')
          console.log("item removed")
        } catch (error) {
          console.error('Error deleting item1:', error);
        }
        try {
          await AsyncStorage.removeItem('profile')
          console.log("item removed")
          navigation.replace("Authentication", { screen: "NumberLogin" });
        } catch (error) {
          console.error('Error deleting item2:', error);
        }
      }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ScrollView style={{ marginBottom: "15%" }}>
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
                            title={"Logout"}
                            info={''}
                            onPress={logoutHandler}
                        />
                        <View
                            style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 0.75 }}
                        ></View>
                        <Content
                            title={"Delete Account"}
                            info={''}
                            onPress={showAlert}
                            
                        />
                        <View
                            style={{ backgroundColor: "rgba(0,0,0,0.05)", height: 0.75 }}
                        ></View>
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
}
export default Settings;

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19,
    },
    text: { fontWeight: "600", fontSize: 20, marginBottom: 20, color: "#aaa" },
    recommendedView: {},
});
