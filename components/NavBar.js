import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

function NavBar(){
    const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
    return <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%'}}>
            <Pressable onPressIn={() => handleSelect(0)}>
            <View style= {{alignItems: 'center', height: '100%', justifyContent: 'space-between'}}>
                <Octicons name="home" size={30} color={`${index == 0 ? '#BC6C25': 'black'}`} />
                <Text style={{color: index == 0 ? '#BC6C25': 'black', fontWeight: 'bold'}}>Home</Text>
            </View>
            </Pressable>
            <Pressable onPressIn={() => handleSelect(1)}>
            <View style= {{alignItems: 'center'}}>
                <Ionicons name="search-outline" size={30} color={`${index == 1 ? '#BC6C25': 'black'}`} />
                <Text style={{color: index == 1 ? '#BC6C25': 'black', fontWeight: 'bold'}}>Search</Text>
            </View>
            </Pressable>
            <Pressable onPressIn={() => handleSelect(2)}>
            <View style= {{alignItems: 'center', }}>
                <View style={{transform: 'rotateZ(45deg)',}}>
                    <MaterialCommunityIcons name="handshake-outline" size={30} color={`${index == 2 ? '#BC6C25': 'black'}`} />
                </View>
                    <Text style={{color: index == 2 ? '#BC6C25': 'black', fontWeight: 'bold'}} >Deals</Text>
                
            </View>
            </Pressable>
            <Pressable onPressIn={() => handleSelect(3)}>
            <View style= {{alignItems: 'center'}}>
            <Ionicons name="person-outline" size={30} color={`${index == 3 ? '#BC6C25': 'black'}`}/>
                <Text style={{color: index == 3 ? '#BC6C25': 'black', fontWeight: 'bold'}}>Account</Text>
            </View>
            </Pressable>
    </View>
}
export default NavBar