import React, { useMemo } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
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
const showColorModeSwitcher = false;

interface DatabasesSidebarProps {}

export const DatabasesSidebar = ({}: DatabasesSidebarProps) => {
  return (
    <VStack spacing={2} paddingTop={1}>
      {showColorModeSwitcher && <ColorModeSwitcher justifySelf='flex-end' />}
      <IconButton aria-label='database' icon={<FaDatabase />} />
      <Text
        fontSize='xs'
        css={{
          'word-break': 'break-all',
          'white-space': 'normal',
        }}
      >
        users-api
      </Text>
      <Divider />
      <IconButton aria-label='database' icon={<FaDatabase />} />
      <Text
        fontSize='xs'
        padding='0 0.2rem'
        css={{
          'word-break': 'break-all',
          'white-space': 'normal',
        }}
      >
        products-api
      </Text>
      <Divider />
      <IconButton aria-label='database' icon={<FaDatabase />} />
      <Text
        fontSize='xs'
        padding='0 0.2rem'
        css={{
          'word-break': 'break-all',
          'white-space': 'normal',
        }}
      >
        prod_company_customer-service
      </Text>
    </VStack>
  );
};
