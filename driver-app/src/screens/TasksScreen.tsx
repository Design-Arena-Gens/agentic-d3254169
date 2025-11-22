import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchTasks, ApiOrder, heartbeat, pushStatus } from "../api";
import { TaskCard } from "../components/TaskCard";
import { DriverProfile } from "../hooks/useDriver";
import * as Location from "expo-location";

type Navigation = NativeStackNavigationProp<any>;

interface Props {
  driver: DriverProfile;
}

const STATUS_FLOW = [
  "accepted",
  "picked-up",
  "in-transit",
  "delivered",
  "returned"
] as const;

export function TasksScreen({ driver }: Props) {
  const navigation = useNavigation<Navigation>();
  const [tasks, setTasks] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusIndex, setStatusIndex] = useState<Record<string, number>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks(driver.id);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchTasks(driver.id);
      setTasks(data);
    } finally {
      setRefreshing(false);
    }
  }, [driver.id]);

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        refresh();
      }, 1000 * 60);

      return () => clearInterval(interval);
    }, [refresh])
  );

  const advanceStatus = async (order: ApiOrder) => {
    const index = statusIndex[order.id] ?? 0;
    const status = STATUS_FLOW[Math.min(index, STATUS_FLOW.length - 1)];
    await pushStatus({
      orderId: order.id,
      status,
      actorId: driver.id,
      cashCollected: status === "delivered" ? order.cashOnDelivery : undefined
    });
    setStatusIndex((current) => ({
      ...current,
      [order.id]: Math.min(index + 1, STATUS_FLOW.length - 1)
    }));
    refresh();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      await heartbeat(driver.id, {
        lat: coords.latitude,
        lng: coords.longitude
      });
    })();
  }, [driver.id]);

  return (
    <View className="flex-1 bg-slate-950">
      <View className="px-6 pt-14 pb-4">
        <Text className="text-xs uppercase text-slate-500">
          Welcome back
        </Text>
        <Text className="text-2xl font-semibold text-white">
          {driver.name}
        </Text>
        <Text className="mt-1 text-sm text-slate-400">
          {tasks.length} tasks assigned
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {loading && !tasks.length ? (
          <Text className="text-center text-slate-500">Loading tasks...</Text>
        ) : null}
        {tasks.map((order) => (
          <View key={order.id}>
            <TaskCard order={order} />
            <View className="mb-6 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-xl bg-blue-600 py-3"
                onPress={() => advanceStatus(order)}
              >
                <Text className="text-center text-xs font-semibold uppercase tracking-wide text-white">
                  Mark Next Stage
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-16 items-center justify-center rounded-xl border border-slate-700"
                onPress={() =>
                  navigation.navigate("Scanner", { orderId: order.id })
                }
              >
                <Text className="text-xs font-semibold uppercase text-slate-300">
                  Scan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
