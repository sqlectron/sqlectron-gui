import React, { useMemo } from 'react';
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
import { AiOutlineConsoleSql } from 'react-icons/ai';

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

interface ConnectionTopbarProps {}

export const ConnectionTopbar = ({}: ConnectionTopbarProps) => {
  return (
    <Box
      padding='0.5em'
      css={{ 'justify-content': 'center', display: 'flex' }}
      bg='darkThemeApp.barCompoenentBg'
      borderBottomWidth='1px'
      borderBottomStyle='solid'
      borderBottomColor='darkThemeApp.barCompoenentBorderColor'
    >
      <IconButton
        bg='none'
        size='xs'
        aria-label='New  connection'
        margin='0 .35em'
        icon={<Icon as={FaPlug} />}
        title='Open a new connection'
      />
      <IconButton
        bg='none'
        size='xs'
        aria-label='Databases'
        margin='0 .35em'
        icon={<Icon as={FaDatabase} />}
        title='Open a new database'
      />
      <Button
        bg='none'
        size='xs'
        aria-label='SQL'
        margin='0 .35em'
        title='Open a new SQL editor'
      >
        SQL
      </Button>
      <HStack
        spacing={1}
        align='center'
        css={{ width: '400px' }}
        bg='tomato'
        borderWidth='1px'
        borderStyle='solid'
        borderColor='red'
        borderRadius='sm'
        padding='0 0.25em'
      >
        <Text fontSize='xs' fontWeight='bold'>
          PRODUCTION
        </Text>
        <Divider orientation='vertical' />
        <Text fontSize='xs' fontWeight='bold'>
          MySQL
        </Text>
        <Divider orientation='vertical' />
        <Text fontSize='xs' fontWeight='bold'>
          users-api
        </Text>
      </HStack>
      <IconButton
        size='xs'
        aria-label='Reresh connection'
        margin='0 .35em'
        bg='none'
        icon={<Icon as={FaRedo} />}
        title='Refresh connection'
      />
    </Box>
  );
};
