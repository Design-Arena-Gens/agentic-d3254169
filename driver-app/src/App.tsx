import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SetupScreen } from "./screens/SetupScreen";
import { TasksScreen } from "./screens/TasksScreen";
import { ScannerScreen } from "./screens/ScannerScreen";
import { useDriverProfile } from "./hooks/useDriver";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const { profile, hydrated, save } = useDriverProfile();

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <Text className="text-slate-300">Loading profile...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#fff"
        }}
      >
        {profile ? (
          <>
            <Stack.Screen name="Tasks" options={{ headerShown: false }}>
              {() => <TasksScreen driver={profile} />}
            </Stack.Screen>
            <Stack.Screen name="Scanner" options={{ presentation: "modal" }}>
              {(props) => <ScannerScreen {...props} driver={profile} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Setup" options={{ headerShown: false }}>
            {(props) => (
              <SetupScreen
                onSave={save}
                onComplete={(profile) => {
                  props.navigation.replace("Tasks");
                }}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
