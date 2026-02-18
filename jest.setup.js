jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const SafeAreaInsetsContext = React.createContext({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const SafeAreaFrameContext = React.createContext({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
  };
});
