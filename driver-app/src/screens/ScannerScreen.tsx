import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { pushStatus } from "../api";
import { DriverProfile } from "../hooks/useDriver";

interface Props {
  route: { params: { orderId: string } };
  navigation: any;
  driver: DriverProfile;
}

export function ScannerScreen({ route, navigation, driver }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const orderId = route.params?.orderId;

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => {
      setHasPermission(status === "granted");
    });
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    await pushStatus({
      orderId,
      status: "picked-up",
      actorId: driver.id,
      note: `Barcode scanned: ${data}`
    });
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <Text className="text-slate-300">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <Text className="text-slate-300">
          No camera access. Enable permissions to scan packages.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      {scanned && (
        <TouchableOpacity
          onPress={() => setScanned(false)}
          className="absolute bottom-12 left-8 right-8 rounded-xl bg-blue-600 py-4"
        >
          <Text className="text-center text-sm font-semibold uppercase tracking-wide text-white">
            Tap to Scan Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
