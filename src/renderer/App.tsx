import React, { useState } from 'react';
import logo from './logo.svg';
import ConnectionBrowser from './ConnectionBrowser';
import { Counter } from './features/counter/Counter';
import { PopupWindow } from './components/PopupWindow';
import { ConnectionsList } from './components/ConnectionsList';
import { FaSearch, FaPlus, FaPlug, FaEdit } from 'react-icons/fa';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
//import mysqlLogo from './server-db-client-mysql.png';

import {
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
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import { Logo } from './components/Logo';

// Styles
import './App.css';

const hideContent = true;
function App() {
  if (window.location.search.includes('connection=true')) {
    return (
      <ChakraProvider theme={theme}>
        <ConnectionBrowser />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <Flex css={{ height: '100vh' }}>
        <Center w='250px' bg='teal.500'>
          <VStack spacing={8}>
            <ColorModeSwitcher justifySelf='flex-end' />
            <Logo h='20vmin' pointerEvents='none' />
            <Heading fontSize='xl' color='white'>
              SQLECTRON
            </Heading>
            <Stack spacing={4} direction='row' align='center'>
              <Button colorScheme='teal' size='xs'>
                Settings
              </Button>
            </Stack>
          </VStack>
        </Center>
        <Box flex='1'>
          <Box textAlign='left' fontSize='xl'>
            <Grid py={3}>
              <Box
                p={3}
                paddingTop={0}
                borderBottomWidth='1px'
                borderBottomStyle='solid'
                borderBottomColor='#393A3A'
              >
                <Stack spacing={4} direction='row' align='center'>
                  <InputGroup size='sm'>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<FaSearch color='gray.300' />}
                    />
                    <Input type='text' placeholder='Connection' />
                  </InputGroup>
                  <IconButton
                    size='sm'
                    aria-label='New connection'
                    icon={<FaPlus />}
                  />
                </Stack>
              </Box>
              <ConnectionsList />
            </Grid>
          </Box>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
/*<div className='App'>
        <button onClick={openWindow}>Open Window</button>
        <button onClick={() => setEditOpen(true)}>Open Window Portal</button>
        {isEditOpen && (
          <PopupWindow close={() => {}}>Portal Window</PopupWindow>
        )}
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <Counter />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <span>
            <span>Learn </span>
            <a
              className='App-link'
              href='https://reactjs.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              React
            </a>
            <span>, </span>
            <a
              className='App-link'
              href='https://redux.js.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Redux
            </a>
            <span>, </span>
            <a
              className='App-link'
              href='https://redux-toolkit.js.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Redux Toolkit
            </a>
            ,<span> and </span>
            <a
              className='App-link'
              href='https://react-redux.js.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              React Redux
            </a>
          </span>
        </header>
      </div>
    */
