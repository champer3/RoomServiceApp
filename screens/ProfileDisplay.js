import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import BareButton from "../components/Buttons/BareButton";
import ProductAction from "../components/Product/ProductAction";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import Profile from "../components/Profile";
import Content from "../components/Content";
import FlexButton from "../components/Buttons/FlexButton";
import NavBar from "../components/NavBar";
function ProfileDisplay() {
  return (
    <View style ={{flex: 1}}>
       
        <View style = {{flex: 1}}>
        <ScrollView  style= {{marginBottom: '15%'}}>
        <View style={[styles.recommendedView,{marginHorizontal: '5%', paddingBottom: '2%',justifyContent: 'space-between'}]}>
            <Content title={'Name'} info={'Josh Brooks'} />
            <View style={{backgroundColor: 'rgba(0,0,0,0.05)', height: 0.75}}></View>
            <Content title={'Email'} info={'Joshbrooks@gmail.com'} />
            <View style={{backgroundColor: 'rgba(0,0,0,0.05)', height: 0.75}}></View>
            <Content title={'Number'} info={'+1 773 9874 262'}/>
            <View style={{backgroundColor: 'rgba(0,0,0,0.05)', height: 0.75}}></View>
            <Content title={'Language'} info={'English (United States)'} />
            <View style={{backgroundColor: 'rgba(0,0,0,0.05)', height: 0.75}}></View>
            <Content title={'Password'} info={'Change Account Password'} />
        </View>
        </ScrollView>
        </View>
        
       
    </View>
  );
}
export default ProfileDisplay

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20, color: '#aaa' },
  recommendedView: {
  }
})