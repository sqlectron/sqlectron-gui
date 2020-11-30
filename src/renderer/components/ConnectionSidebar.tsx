import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import {
  FaTable,
  FaSearch,
  FaPlus,
  FaPlug,
  FaEdit,
  FaAngleDown,
  FaRedo,
  FaDatabase,
} from 'react-icons/fa';

import { BsTable } from 'react-icons/bs';

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
import { ChevronDownIcon } from '@chakra-ui/icons';

interface ConnectionSidebarProps {}

export const ConnectionSidebar = ({}: ConnectionSidebarProps) => {
  const [tables, setTables] = useState([]);
  const [selectedTableName, selectTableName] = useState('');

  useEffect(() => {
    // @ts-ignore
    window.sqlectron.db
      .listTables()
      .then((res: any) => setTables(res))
      .catch((err: Error) => console.error(err));
  }, []);
  console.log('**tables', tables);
  console.log('**selectedTableName', selectedTableName);

  return (
    <VStack spacing={2} align='left' height='100%'>
      <Box padding='0.5em'>
        <InputGroup size='sm'>
          <InputLeftElement
            pointerEvents='none'
            children={<FaSearch color='gray.300' />}
          />
          <Input type='text' placeholder='Filter' />
        </InputGroup>
      </Box>
      <Box
        marginTop='0'
        p='0 0.5em 0 0.5em'
        css={{
          'overflow-y': 'auto',
          'scrollbar-color': '#6C6C6F #232424',
        }}
      >
        <HStack spacin={0}>
          <ChevronDownIcon />
          <Text fontSize='sm'>Tables</Text>
        </HStack>
        <VStack align='left' spacing={0}>
          {tables.map((table: any) => (
            <Box
              as='button'
              borderRadius='5px'
              padding='0.1em .5em'
              borderWidth='1px'
              borderColor='#1D1D1F'
              _hover={{
                borderColor: theme.colors.darkThemeApp.barCompoenentBg,
              }}
              onClick={() => {
                console.log('***onClick', table);
                selectTableName(table.name);
              }}
              _active={{
                background: theme.colors.darkThemeApp.listHoverBg,
              }}
              background={
                selectedTableName === table.name
                  ? theme.colors.darkThemeApp.listHoverBg
                  : 'inherit'
              }
            >
              <HStack align='center'>
                <Icon as={BsTable} w={3} />
                <Text
                  fontSize='xs'
                  _hover={{
                    borderColor: 'red',
                  }}
                >
                  {table.name}
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};
