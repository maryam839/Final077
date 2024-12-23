import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';  
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import ProductDetail from './ProductDetail'; 
import AuthenticationScreen from './AuthenticationScreen';
import ProductPage, { RootStackParamList } from './ProductPage';
import { CartProvider } from './CartContext';
import CartScreen from './Cart';
import UpdateProfile from './UpdateProfile';
import ProfileSetup from './UpdateProfile';

const Stack = createStackNavigator<RootStackParamList>();  

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CartProvider>
      <RootLayoutNav />
    </CartProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="AuthenticationScreen">
        <Stack.Screen
            name="AuthenticationScreen"
            component={AuthenticationScreen}
            options={{ title: 'Authentication Screen' }}  
          />
          <Stack.Screen
            name="ProductPage"
            component={ProductPage}
            options={{ title: 'Product Page' }}  
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{ title: 'ProductDetail' }}  
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: 'Cart' }}  
          />
          <Stack.Screen
            name="UpdateProfile"
            component={ProfileSetup}
            options={{ title: 'UpdateProfile' }}  
          />
        </Stack.Navigator>

    </ThemeProvider>
  );
}
