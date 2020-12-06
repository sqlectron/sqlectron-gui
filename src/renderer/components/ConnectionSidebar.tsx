import React, { useState, useEffect } from 'react';
import { ListItem } from './ListItem';
import { FaSearch } from 'react-icons/fa';
import { BsTable } from 'react-icons/bs';
import {
  Text,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  VStack,
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
        paddingBottom='1em'
        className='scrollable'
        css={{
          'overflow-y': 'auto',
        }}
      >
        <HStack spacin={0} paddingLeft='0.5em'>
          <ChevronDownIcon />
          <Text fontSize='sm'>Tables</Text>
        </HStack>
        <VStack align='left' spacing={0}>
          {tables.map(({ name }: { name: string }) => (
            <ListItem
              name={name}
              selectedName={selectedTableName}
              icon={BsTable}
              onClick={() => {
                selectTableName(name);
              }}
            />
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};
