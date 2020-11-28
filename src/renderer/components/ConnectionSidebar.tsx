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
  return (
    <VStack spacing={2} align='left'>
      <Box padding='0.5em'>
        <InputGroup size='sm'>
          <InputLeftElement
            pointerEvents='none'
            children={<FaSearch color='gray.300' />}
          />
          <Input type='text' placeholder='Filter' />
        </InputGroup>
      </Box>
      <Box marginTop='0' p='0 0.5em 0 0.5em'>
        <HStack spacin={0}>
          <ChevronDownIcon />
          <Text fontSize='sm'>Tables</Text>
        </HStack>
        <VStack align='left' spacing={0}>
          <HStack padding='0.1em .5em' align='center'>
            <Icon as={BsTable} w={3} />
            <Text fontSize='xs'>users</Text>
          </HStack>
          <HStack padding='0.1em .5em' align='center'>
            <Icon as={BsTable} w={3} />
            <Text fontSize='xs'>users</Text>
          </HStack>
          <HStack padding='0.1em .5em' align='center'>
            <Icon as={BsTable} w={3} />
            <Text fontSize='xs'>users</Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};
