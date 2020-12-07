import React from 'react';
import MainScreen from './screens/MainScreen';
import WorkspaceScreen from './screens/WorkspaceScreen';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

// Styles
import './App.css';

function getScreen() {
  if (window.location.search.includes('connectionWorkspace')) {
    return <WorkspaceScreen />;
  }
  return <MainScreen />;
}

function App() {
  return <ChakraProvider theme={theme}>{getScreen()}</ChakraProvider>;
}

export default App;
