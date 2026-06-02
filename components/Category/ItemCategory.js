import { StyleSheet, View } from "react-native"
import Item from "../Item/Item"

function ItemCategory({ items, onPress, color, show, hideBottomBorder, style }) {
    return (
        <View style={[styles.wrap, hideBottomBorder && styles.wrapNoDivider, style]}>
            {items.map((item, index) => (
                <Item
                    key={item.id || item.slug || `${item.text}-${index}`}
                    color={color}
                    text={item.text}
                    image={item.image}
                    show={show}
                    onPress={onPress ? () => onPress(item) : undefined}
                />
            ))}
        </View>
    )
}

export default ItemCategory

const styles = StyleSheet.create({
    wrap: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
        gap: 10,
        paddingHorizontal: 20,
        backgroundColor: "transparent",
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderColor: "rgba(17, 24, 39, 0.07)"
    },
    wrapNoDivider: {
        borderBottomWidth: 0,
        paddingBottom: 8,
    },
})
