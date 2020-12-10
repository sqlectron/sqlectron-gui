import React from 'react';
import { FaPlug, FaRedo, FaDatabase } from 'react-icons/fa';

import {
  Icon,
  Text,
  HStack,
  IconButton,
  Button,
  Box,
  Divider,
} from '@chakra-ui/react';

interface ConnectionTopbarProps {
  onDatabaseButtonClick: () => void;
  server: any;
  database: string;
}

export const ConnectionTopbar = ({
  onDatabaseButtonClick,
  server,
  database,
}: ConnectionTopbarProps) => {
  return (
    <Box
      padding='0.5em'
      css={{ justifyContent: 'center', display: 'flex' }}
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
        onClick={onDatabaseButtonClick}
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
          {server.client}
        </Text>
        <Divider orientation='vertical' />
        <Text fontSize='xs' fontWeight='bold'>
          {database || server.database}
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
