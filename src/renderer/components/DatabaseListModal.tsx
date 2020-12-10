import React, { useState, useEffect } from 'react';
import { ListItem } from './ListItem';
import { FaSearch } from 'react-icons/fa';
import { FaDatabase } from 'react-icons/fa';
import {
  VStack,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import sqlectron from '../api';

interface DatabaseListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatabaseClick: (databaseName: string) => void;
}

const FilterDatabase = () => {
  return (
    <Box padding='0.5em'>
      <InputGroup size='sm'>
        <InputLeftElement
          pointerEvents='none'
          children={<FaSearch color='gray.300' />}
        />
        <Input type='text' placeholder='Filter' />
      </InputGroup>
    </Box>
  );
};

const DatabaseList = ({
  databases,
  openDatabase,
}: {
  databases: any;
  openDatabase: (name: string) => void;
}) => {
  return (
    <VStack spacing={0} align='left' height='100%'>
      {databases.map(({ name }: { name: string }, index: number) => (
        <ListItem
          key={index}
          name={name}
          selectedName={''}
          icon={FaDatabase}
          onClick={() => {
            openDatabase(name);
          }}
        />
      ))}
    </VStack>
  );
};

export const DatabaseListModal = ({
  isOpen,
  onClose,
  onDatabaseClick,
}: DatabaseListModalProps) => {
  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    console.log('**fetching dbs');
    sqlectron.db
      .listDatabases()
      .then((res: any) => setDatabases(res))
      .catch((err: Error) => console.error(err));
  }, []);
  console.log('**databases', databases);

  const bg = '#151616';
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background={bg}>
        <ModalHeader
          borderBottomWidth='1px'
          borderBottomStyle='solid'
          borderBottomColor='#393A3A'
          padding='.5rem 1rem'
        >
          <Text fontSize='sm'>Databases</Text>
        </ModalHeader>
        <ModalBody padding='.1rem 1rem 1rem 1rem'>
          <FilterDatabase />
          <DatabaseList
            databases={databases}
            openDatabase={(name: string) => {
              onClose();
              onDatabaseClick(name);
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
