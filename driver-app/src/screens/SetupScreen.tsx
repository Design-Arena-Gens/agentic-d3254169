import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { DriverProfile } from "../hooks/useDriver";

interface Props {
  onComplete(profile: DriverProfile): void;
  onSave(profile: DriverProfile): Promise<void>;
}

export function SetupScreen({ onComplete, onSave }: Props) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: ""
  });

  const submit = async () => {
    if (!form.id || !form.name) {
      return;
    }

    await onSave(form);
    onComplete(form);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-950"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-white">
          Lekya Driver Setup
        </Text>
        <Text className="mt-2 text-sm text-slate-400">
          Enter your driver ID to sync assigned deliveries.
        </Text>

        <View className="mt-8 space-y-4">
          <View>
            <Text className="text-xs font-semibold uppercase text-slate-400">
              Driver ID
            </Text>
            <TextInput
              placeholder="drv-01"
              value={form.id}
              onChangeText={(text) => setForm((prev) => ({ ...prev, id: text }))}
              autoCapitalize="none"
              className="mt-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white"
            />
          </View>
          <View>
            <Text className="text-xs font-semibold uppercase text-slate-400">
              Name
            </Text>
            <TextInput
              placeholder="Full Name"
              value={form.name}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, name: text }))
              }
              className="mt-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white"
            />
          </View>
          <View>
            <Text className="text-xs font-semibold uppercase text-slate-400">
              Phone
            </Text>
            <TextInput
              placeholder="+91 "
              value={form.phone}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, phone: text }))
              }
              keyboardType="phone-pad"
              className="mt-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={submit}
          className="mt-8 rounded-xl bg-blue-600 py-4"
        >
          <Text className="text-center text-sm font-semibold uppercase tracking-wide text-white">
            Save and Continue
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
