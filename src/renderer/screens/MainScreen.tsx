import React from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { ConnectionsList } from '../components/ConnectionsList';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';
import {
  IconButton,
  Stack,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  Heading,
  VStack,
  Grid,
  Flex,
  Center,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { Logo } from '../components/Logo';

function MainScreen() {
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

export default MainScreen;
