import React, { useMemo } from 'react';
import {
  FaPen,
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

interface RecordFormProps {}

const dataItem = {
  id: 1,
  name: 'Max Nunes',
  country: 'Brazil',
  city: 'Florianopolis',
  age: 30,
  createdAt: '2020-01-04',
  updatedAt: '2020-02-13',
  active: 'true',
};

function getColumnType(value: any) {
  return typeof value === 'string' ? 'VARCHAR' : 'INTEGER';
}

export const RecordForm = ({}: RecordFormProps) => {
  return (
    <VStack spacing={2} align='left' padding='0.2em'>
      {/*<HStack spacin={0}>
        <Icon as={FaPen} w={5} paddingLeft={2} />
        <Text fontSize='sm'>Selected Record</Text>
      </HStack>*/}
      <Box padding='0.2em'>
        <InputGroup size='sm'>
          <InputLeftElement
            pointerEvents='none'
            children={<FaSearch color='gray.300' />}
          />
          <Input type='text' placeholder='Column' />
        </InputGroup>
      </Box>
      <Box marginTop='0' p='0 0.2em 0 0.2em'>
        {Object.entries(dataItem).map(([column, value]) => (
          <FormControl id={column} padding='0.5rem 0'>
            <FormLabel size='xs' css={{ 'font-size': '0.85rem', margin: '0' }}>
              {column}
            </FormLabel>
            <Input
              size='xs'
              css={{ 'font-size': '0.8rem', padding: '0 0.2rem' }}
              defaultValue={value}
            />
            <FormHelperText
              size='xs'
              css={{ 'font-size': '0.6rem', margin: '0' }}
            >
              {getColumnType(value)}
            </FormHelperText>
          </FormControl>
        ))}
      </Box>
    </VStack>
  );
};
