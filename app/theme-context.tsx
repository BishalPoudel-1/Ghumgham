import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { Animated, Dimensions } from 'react-native';

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: (x: number, y: number) => void;
  backgroundColor: Animated.AnimatedInterpolation<string>;
  rippleStyle: Animated.WithAnimatedValue<{}>;
  startRipple: (x: number, y: number) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const rippleX = useRef(new Animated.Value(0)).current;
  const rippleY = useRef(new Animated.Value(0)).current;

  const screen = Dimensions.get('window');
  const maxRadius = Math.sqrt(screen.width ** 2 + screen.height ** 2);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F8F9EA', '#121212'],
  });

  const rippleSize = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxRadius * 2],
  });

  const rippleStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [
      { translateX: Animated.subtract(rippleX, Animated.divide(rippleSize, 2)) },
      { translateY: Animated.subtract(rippleY, Animated.divide(rippleSize, 2)) },
    ],
    width: rippleSize,
    height: rippleSize,
    borderRadius: maxRadius,
    backgroundColor: isDarkMode ? '#F8F9EA' : '#121212',
    opacity: ripple.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0],
    }),
  };

  const startRipple = (x: number, y: number) => {
    rippleX.setValue(x);
    rippleY.setValue(y);
    ripple.setValue(0);

    Animated.timing(ripple, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setIsDarkMode(prev => !prev);
      Animated.timing(animation, {
        toValue: isDarkMode ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const toggleTheme = (x: number, y: number) => {
    startRipple(x, y);
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, backgroundColor, rippleStyle, startRipple }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
