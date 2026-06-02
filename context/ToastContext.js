import React, { createContext, useContext, useState } from "react";
import { View } from "react-native";
import RoomServiceToast from "../components/RoomServiceToast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (options) => {
    setToast(options);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast && (
          <RoomServiceToast
            {...toast}
            onDismissed={() => setToast(null)}
          />
        )}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
