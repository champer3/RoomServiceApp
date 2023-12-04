import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import StartScreen from "./screens/StartScreen";
import BareButton from "./components/Buttons/BareButton";
import Button from "./components/Buttons/Button";
import { SimpleLineIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Input from "./components/Inputs/Input";
import Pin from "./components/Inputs/Pin";
import Item from "./components/Item/Item";
import PhoneIcon from "./components/PhoneIcon";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  // return <StartScreen />
  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* <ScrollView style={styles.scroll} > */}
        <Text>Open up App.js to start working on your app!</Text>
        <Text>New Code</Text>
        {/* ......................BUTTON COMPONENTS ........................... */}
        {/* <View style={styles.cart}>
          <BareButton borderRadius={12} ><Feather name="shopping-cart" size={12} color="black" /><Text style={{fontSize: 12}}>  Add to cart</Text></BareButton>
        </View>
        <View style={styles.button}>
          <BareButton color="red"><SimpleLineIcons name="logout" size={24} color="red" /><Text style={{color: "red"}}>  Logout</Text></BareButton>
        </View>
        <View style={styles.button}>
          <BareButton color="#EEEEEE"><Image style={styles.image} source={require("./assets/google.png")} /></BareButton>
        </View>
        <View style={styles.button}>
          <BareButton color="black"><Text >Add new address </Text></BareButton>
        </View>
        <View style={styles.button}>
          <Button><Text style={{color: "white", fontSize: 16}}>Continue </Text><Ionicons name="ios-arrow-forward-circle" size={24} color="white" /></Button>
        </View>
        <View style={styles.button}>
          <Button color="#F9F9F9"><Text style={{color: "black", fontSize: 16}}>Order Receipt </Text></Button>
        </View>
        <View style={styles.button}>
          <Button opacity={0.5}><Text style={{color: "white", fontSize: 16}}>Continue </Text><Ionicons name="ios-arrow-forward-circle" size={24} color="white" /></Button>
        </View>
        <View style={styles.payment}>
          <Button><AntDesign name="creditcard" size={24} color="white" /><Text style={{color: "white", fontSize: 16}}>  Make Payment</Text></Button>
        </View> */}

        {/* ...............................INPUT COMPONENTS....................................... */}
        <Input text="Email" icon={<MaterialIcons name="email" size={24} color="#aaa" />}></Input>
        <Input text="Password" type="password" icon={<FontAwesome name="lock" size={24} color="#aaa" />} secured={true}></Input>
        <Input text="Address" type="address" icon={<MaterialIcons name="email" size={24} color="#aaa" />}></Input>
        <Input icon={<PhoneIcon/>} text='Number'/>
        <Input text='Search' icon={<Ionicons name="search-outline" size={24} color="black" />}><Text>x Cancel</Text></Input>
        <Input text='Enter Coupon'  buttonText='Apply code'></Input>
        <Input text='CVV' length={3} keyboard="numeric" secured={true}></Input>


        {/* ...............................PRODUCT COMPONENTS....................................... */}
        {/* <Item/> */}
        <StatusBar style="auto" />
        {/* </ScrollView> */}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  payment: {
    height: 96,
    width: "50%",
    alignSelf: 'flex-start',
    marginLeft: 45
  },
  cart: {
    width: "40%",
    height: 75
  },
  button: {
    height: 100,
    width: "80%"
  },
  image: {
    resizeMode: "contain",
    width: "80%",
    opacity: 1
  },
  google: {

  }
});
