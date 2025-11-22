import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "lekya-driver-profile";

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
}

export function useDriverProfile() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((value) => {
      if (value) {
        setProfile(JSON.parse(value));
      }
      setHydrated(true);
    });
  }, []);

  const save = async (next: DriverProfile) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    setProfile(next);
  };

  const clear = async () => {
    await AsyncStorage.removeItem(KEY);
    setProfile(null);
  };

  return {
    profile,
    save,
    clear,
    hydrated
  };
}
