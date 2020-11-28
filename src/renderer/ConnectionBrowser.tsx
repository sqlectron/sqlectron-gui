import React, { useState } from 'react';
import logo from './logo.svg';
import { QuerySection } from './components/QuerySection';
import { ConnectionSidebar } from './components/ConnectionSidebar';
import { ConnectionTopbar } from './components/ConnectionTopbar';
import { RecordForm } from './components/RecordForm';

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
      <Flex flex={1}>
        {/*<Box
          w='80px'
          borderRightWidth='1px'
          borderRightStyle='solid'
          borderRightColor='gray.700'
        >
          <DatabasesSidebar />
        </Box>*/}
        <Box
          w='250px'
          bg='darkThemeApp.barCompoenentBg'
          borderRightWidth='1px'
          borderRightStyle='solid'
          borderRightColor='darkThemeApp.barCompoenentBorderColor'
        >
          <ConnectionSidebar />
        </Box>
        <Box display='flex' flex='1'>
          <QuerySection />
        </Box>
        <Box
          w='250px'
          bg='darkThemeApp.barCompoenentBg'
          borderLeftWidth='1px'
          borderLeftStyle='solid'
          borderRightColor='darkThemeApp.barCompoenentBorderColor'
        >
          <RecordForm />
        </Box>
      </Flex>
    </Flex>
  );
}

export default App;
