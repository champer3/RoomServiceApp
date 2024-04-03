import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Buttons/Button";
import Info from "../components/Info";
import Input from "../components/Inputs/Input";
import { MaterialIcons , AntDesign} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


function CreatePassword() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);
  const [form, setForm] = useState(data);
  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status

 

  const [checks, setChecks] = useState({'length': false, upper: false, lower: false, special: false, match: false, number : false})
  const [warning, setWarning] = useState();
  const profile = useSelector((state) => state.profileData.profile);
  const phoneNumberString = form.number.replace(/[^0-9]/g, '');
  const phoneNumber = "+1" + phoneNumberString
  const postData = {
    firstName: form.firstName,
    lastName: form.secondName,
    phoneNumber,
    email: form.email,
    password: form.password,
    passwordConfirm: form.password,
  };
  let authToken = '123';
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const navigation = useNavigation();
  async function pressHandler() {
    if ((checks.length && checks.lower && checks.upper && checks.match && checks.number && checks.special)){
      setIsLoading(true)
    try {
      handleUpdate();
      console.log(profile);
      await createAccount();
      // Call the function to save the token
      await saveTokenToAsyncStorage();
      setTimeout(() => {
        navigation.navigate('HomeTabs'); // Set loading status to false after some time (simulating app loading)
      }, 1000)
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }}
  }
  function handleFormChange(value) {
    p = validatePassword(value)
    setShow(!p)
    setForm((prev) => ({ ...prev, ["password"]: value }));
  }
  function validatePassword(password) {
    // At least 8 characters
    let m = true
    if (!show){
      setShow(true)
    }
    if (password.length < 8) {
        setChecks((prev)=>{return {...prev, ['length']: false}})
        m = false
    }
    else{
      setChecks((prev)=>{return {...prev, ['length']: true}})
    }
    
    // Contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        setChecks((prev)=>{return {...prev, ['upper']: false}})
        m = false
    }else{
      setChecks((prev)=>{return {...prev, ['upper']: true}})
    }

    // Contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setChecks((prev)=>{return {...prev, ['lower']: false}})
      m = false
    }else{
      setChecks((prev)=>{return {...prev, ['lower']: true}})
    }

    // Contains at least one digit
    if (!/\d/.test(password)) {
      setChecks((prev)=>{return {...prev, ['number']: false}})
      m = false
    }else{
      setChecks((prev)=>{return {...prev, ['number']: true}})
    }

    // Contains at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      setChecks((prev)=>{return {...prev, ['special']: false}})
      m = false
    }else{
      setChecks((prev)=>{return {...prev, ['special']: true}})
    }
    if (confirmPassword !== password ){
      m = false
    }
    setChecks((prev)=>{return {...prev, ['match']: confirmPassword === password}})
    return m;
}

  function handleUpdate() {
    dispatch(updateProfile({ id: form }));
  }
  const createAccount = async () => {
    try {
      const response = await axios.post(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/signup`,
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
  };
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (value) => {
    setPassword(value);
    // Check if passwords match
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    // Check if passwords match
    setChecks((prev)=>{return {...prev, ['match']: value === form.password}})
    setShow(!(value === form.password && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) && !/\d/.test(value) && !/[a-z]/.test(value) && !/[A-Z]/.test(value) && value.length >= 8))
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
  const [keyboardActive, setKeyboardActive] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardActive(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardActive(false);
      }
    );

    // Clean up event listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(()=>{validatePassword(form.password);handleConfirmPasswordChange('');return ()=> {}}
,[])
 
  return (
    <GestureRecognizer  onSwipeLeft={pressHandler}   style={{flex: 1}} >
    <KeyboardAvoidingView  behavior="height"  style={styles.container} >
    {isLoading ? (
        // Render loading indicator while loading
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (<>
          <View style={styles.welcomeView}>
            {!keyboardActive && <><Text style={styles.text}>Done,</Text>
            <Text style={styles.text}>Create A Password🤩</Text>
            <View style={styles.lineContainer}>
              <View style={styles.line}></View>
              <View style={styles.line}></View>
              <View style={styles.line}></View>
              <View
                style={[styles.line, { backgroundColor: "#283618" }]}
              ></View>
            </View></>}
            <View style={{ }}>
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
              textInputConfig={{
                cursorColor: "#aaa",
                value: confirmPassword,
                onChangeText: handleConfirmPasswordChange.bind(this),
              }}
            />
             {warning && (
              <Info
                text={`${warning}                                            `}
              />
            )}
            {show && <><View style={{marginVertical: 10}}></View>
            <View style={{flexDirection: 'row', gap: 10, marginVertical: 4}}>{checks.length ? <AntDesign name="checkcircle" size={24} color="#283618" /> : <MaterialIcons name="radio-button-unchecked" size={24} color="black" />}<Text style={{fontSize: 12, fontWeight: 800}}>Password should be at least eight characters long</Text></View>
            <View style={{flexDirection: 'row', gap: 10, marginVertical: 4}}>{checks.lower ? <AntDesign name="checkcircle" size={24}  color="#283618" /> : <MaterialIcons name="radio-button-unchecked" size={24} color="black" />}<Text style={{fontSize: 12, fontWeight: 800}}>Password should contain at least one lowercase </Text></View>
            <View style={{flexDirection: 'row', gap: 10, marginVertical: 4}}>{checks.upper ? <AntDesign name="checkcircle" size={24}  color="#283618" /> : <MaterialIcons name="radio-button-unchecked" size={24} color="black" />}<Text style={{fontSize: 12, fontWeight: 800}}>Password should contain at least one uppercase</Text></View>
            <View style={{flexDirection: 'row', gap: 10, marginVertical: 4}}>{checks.number ? <AntDesign name="checkcircle" size={24} color="#283618" /> : <MaterialIcons name="radio-button-unchecked" size={24} color="black" />}<Text style={{fontSize: 12, fontWeight: 800}}>Password should contain at least one numeric character</Text></View>
            <View style={{flexDirection: 'row', gap: 10, marginVertical: 4}}>{checks.special ? <AntDesign name="checkcircle" size={24}color="#283618" /> : <MaterialIcons name="radio-button-unchecked" size={24} color="black" />}<Text style={{fontSize: 12, fontWeight: 800}}>Password should contain at least one special character </Text></View>
            <View style={{flexDirection: 'row', gap: 10, marginVertical: 4}}>{checks.match ? <AntDesign name="checkcircle" size={24}  color="#283618" /> : <MaterialIcons name="radio-button-unchecked" size={24} color="black" />}<Text style={{fontSize: 12, fontWeight: 800}}>Password should match</Text></View></>}
            {!warning && <View style={{ marginTop: 20 }}>
              <Info text="Choose a strong and secure password to complete your account creation" />
            </View>}
          </View>
          </View>
          
          <View style={{marginTop: 20,justifyContent: "flex-end" }}>
            <View style={styles.buttonContainer}>
              <Button onPress={pressHandler} color={(checks.length && checks.lower && checks.upper && checks.match && checks.number && checks.special) ? '' : '#aaa'}>
                <Text style={{ fontSize: 16, color: "white" }}>
                  Create Password{" "}
                </Text>
                <Image
                  style={styles.vector}
                  source={require("../assets/Vector.png")}
                />
              </Button>
            </View>
          </View></>)}
          </KeyboardAvoidingView>
          </GestureRecognizer>
  );
}

export default CreatePassword;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: "5%",
    marginTop: height/35,
    // marginTop: 200
  },
  welcomeView: {
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
    height: 55,
    marginBottom: 20,
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
    marginTop:  height/35,
    justifyContent: "space-between",
  },
  line: {
    height: 2,
    width: "20%",
    backgroundColor: "#D9D9D9",
  },
});
