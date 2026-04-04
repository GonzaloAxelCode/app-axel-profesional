import React, { useCallback, useRef, useState } from "react";
import {
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

type OptionItem = {
    value: string;
    label: string;
};

interface DropDownProps {
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
    placeholder: string;
}

export default function Dropdown({ data, onChange, placeholder }: DropDownProps) {
    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState("");

    const buttonRef = useRef<View>(null);
    const [top, setTop] = useState(0);

    const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

    const onSelect = useCallback(
        (item: OptionItem) => {
            onChange(item);
            setValue(item.label);
            setExpanded(false);
        },
        [onChange]
    );

    return (
        <View
            ref={buttonRef}
            onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                const topOffset = layout.y;
                const heightOfComponent = layout.height;
                const finalValue =
                    topOffset + heightOfComponent + (Platform.OS === "android" ? -32 : 3);
                setTop(finalValue);
            }}
        >
            {/* Botón del dropdown */}
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={toggleExpanded}
            >
                <Text style={styles.text}>{value || placeholder}</Text>
                <Text style={styles.caret}>▼</Text>
            </TouchableOpacity>

            {/* Modal con opciones */}
            {expanded && (
                <Modal visible={expanded} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
                        <View style={styles.backdrop}>
                            <View style={[styles.options, { top }]}>
                                <FlatList
                                    keyExtractor={(item) => item.value}
                                    data={data}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={styles.optionItem}
                                            onPress={() => onSelect(item)}
                                        >
                                            <Text style={styles.optionText}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingVertical: 5 }}
                                    style={{ maxHeight: 250 }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)", // Fondo semitransparente
    },
    button: {
        height: 50,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        // Elevación / sombra
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    text: {
        fontSize: 16,
        color: "#333",
    },
    caret: {
        fontSize: 14,
        color: "#888",
    },
    options: {
        position: "absolute",
        left: 16,
        right: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 8,
        // Elevación / sombra
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    optionText: {
        fontSize: 15,
        color: "#333",
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 2,
    },
});