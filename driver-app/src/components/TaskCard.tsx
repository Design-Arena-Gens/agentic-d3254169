import { View, Text } from "react-native";
import { ApiOrder } from "../api";

interface Props {
  order: ApiOrder;
}

export function TaskCard({ order }: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <View className="flex-row justify-between">
        <View>
          <Text className="text-lg font-semibold text-white">
            {order.reference}
          </Text>
          <Text className="text-xs text-slate-400">{order.customerName}</Text>
        </View>
        <Text className="text-sm font-semibold text-emerald-300">
          ₹{order.cashOnDelivery}
        </Text>
      </View>
      <Text className="mt-3 text-sm text-slate-200">{order.address}</Text>
      {order.notes ? (
        <Text className="mt-2 text-xs text-amber-300">
          Note: {order.notes}
        </Text>
      ) : null}
    </View>
  );
}
