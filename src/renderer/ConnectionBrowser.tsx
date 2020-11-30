import React, { useState } from 'react';
import { theme } from './theme';
import logo from './logo.svg';
import { QuerySection } from './components/QuerySection';
import { ConnectionSidebar } from './components/ConnectionSidebar';
import { ConnectionTopbar } from './components/ConnectionTopbar';
import { RecordForm } from './components/RecordForm';
import { Resizable } from 're-resizable';

//import mysqlLogo from './server-db-client-mysql.png';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
  Icon,
  Text,
  HStack,
  Tag,
  DarkMode,
  IconButton,
  Stack,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  StackDivider,
  Badge,
  Box,
  Heading,
  Link,
  VStack,
  Grid,
  Flex,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Divider,
} from '@chakra-ui/react';

// Styles
import './App.css';

const showColorModeSwitcher = false;

function App() {
  return (
    <Flex direction='column' height='100%'>
      <ConnectionTopbar />
      <Flex flex={1} css={{ height: 'calc(100vh - 41px)' }}>
        {/*<Box
          w='80px'
          borderRightWidth='1px'
          borderRightStyle='solid'
          borderRightColor='gray.700'
        >
          <DatabasesSidebar />
        </Box>*/}
        <Resizable
          maxWidth='30%'
          minWidth='5%'
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          style={{
            height: '100%',
            width: '250px',
            background: theme.colors.darkThemeApp.sidebarPanelBg,
            borderRight: `1px solid ${theme.colors.darkThemeApp.barCompoenentBorderColor}`,
          }}
        >
          <ConnectionSidebar />
        </Resizable>
        <Box display='flex' flex='1' height='100%'>
          <QuerySection />
        </Box>
        <Resizable
          maxWidth='30%'
          minWidth='5%'
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          style={{
            height: '100%',
            width: '250px',
            background: theme.colors.darkThemeApp.sidebarPanelBg,
            borderLeft: `1px solid ${theme.colors.darkThemeApp.barCompoenentBorderColor}`,
          }}
        >
          <RecordForm />
        </Resizable>
      </Flex>
    </Flex>
  );
}

export default App;
