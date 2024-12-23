import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';  
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import CourseLibrary from './CourseLibrary'; 
import CourseDetail from './CourseDetail'; 
import Quiz from '../components/Quiz'; 
import { RootStackParamList } from './CourseLibrary';

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="CourseLibrary">
          <Stack.Screen
            name="CourseLibrary"
            component={CourseLibrary}
            options={{ title: 'Course Library' }}  
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetail}
            options={{ title: 'Course Detail' }}  
          />
          <Stack.Screen name="Quiz" component={Quiz} />
        </Stack.Navigator>

    </ThemeProvider>
  );
}
