import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import {Input} from './components/Inputs/Input'
import Product from "./components/Product/Product";
import BoxItemCategory from "./components/Category/BoxItemCategory";

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <BoxItemCategory items={[{text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         {text: 'Snacks', image: require('./assets/dsBuffer.bm.png')},
         ]}/>
        <Product/>
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
});
