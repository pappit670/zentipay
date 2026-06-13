import { router, Tabs } from 'expo-router';
import { Clock, Home, PiggyBank, Plus, Wallet } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../lib/theme-context';

/** Center Pay action — opens the pay modal (Inspo 15 core pay engine). */
function PayButton() {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => router.push('/pay')}
      style={{ top: -16, flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: colors.green,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: colors.green,
          shadowOpacity: 0.5,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <Plus color="#000" size={28} strokeWidth={2.6} />
      </View>
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.t3,
        tabBarStyle: {
          backgroundColor: colors.s1,
          borderTopColor: colors.sep,
          height: 86,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Home color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', tabBarIcon: ({ color }) => <Clock color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="pay"
        options={{ title: '', tabBarButton: () => <PayButton /> }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: 'Wallet', tabBarIcon: ({ color }) => <Wallet color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="savings"
        options={{ title: 'Savings', tabBarIcon: ({ color }) => <PiggyBank color={color} size={22} /> }}
      />
    </Tabs>
  );
}
