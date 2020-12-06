import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import { FaSearch } from 'react-icons/fa';
import { BsTable } from 'react-icons/bs';
import {
  Icon,
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

const Item = ({
  name,
  selectedName,
  onClick,
}: {
  name: string;
  selectedName: string;
  onClick: () => void;
}) => {
  const bgDefault = 'inherit';
  const bgSelected = '#2C639E';
  const bgHover = theme.colors.darkThemeApp.listHoverBg;
  const isSelected = selectedName === name;

  return (
    <Box
      as='button'
      padding='0.1em 1em'
      borderWidth='1px'
      borderColor='#1D1D1F'
      _hover={{
        background: isSelected ? bgSelected : bgHover,
      }}
      onClick={onClick}
      background={isSelected ? bgSelected : bgDefault}
    >
      <HStack align='center'>
        <Icon as={BsTable} w={3} />
        <Text
          fontSize='xs'
          _hover={{
            borderColor: 'red',
          }}
        >
          {name}
        </Text>
      </HStack>
    </Box>
  );
};

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
        css={{
          'overflow-y': 'auto',
          'scrollbar-color': '#6C6C6F #232424',
        }}
      >
        <HStack spacin={0} paddingLeft='0.5em'>
          <ChevronDownIcon />
          <Text fontSize='sm'>Tables</Text>
        </HStack>
        <VStack align='left' spacing={0}>
          {tables.map(({ name }: { name: string }) => (
            <Item
              name={name}
              selectedName={selectedTableName}
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
