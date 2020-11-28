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

import {
  RiLayoutLeftLine,
  RiLayoutBottomLine,
  RiLayoutRightLine,
} from 'react-icons/ri';
import { DataGrid } from './DataGrid';
import { QueryTab } from './QueryTab';

//import mysqlLogo from './server-db-client-mysql.png';
import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  AvatarGroup,
  Avatar,
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

interface QuerySectionProps {}

const QueryContent = ({}) => {
  return (
    <>
      <Box textAlign='left' fontSize='xl' flex={1}>
        <Box bg='darkThemeApp.containerBg'>
          <Textarea
            border='0'
            height='500px'
            placeholder='Here is a sample placeholder'
            borderRadius='0'
          />
          <Flex
            padding='0.5em'
            bg='darkThemeApp.containerBg'
            borderBottomWidth='1px'
            borderBottomStyle='solid'
            borderBottomColor='gray.700'
            spacing={1}
            direction='row-reverse'
            align='center'
          >
            <Button colorScheme='gray' size='xs'>
              Run Current
            </Button>
          </Flex>
        </Box>
        <Box>
          <DataGrid />
        </Box>
      </Box>
      <Flex
        padding='0.5em'
        bg='darkThemeApp.barCompoenentBg'
        borderTopWidth='1px'
        borderTopStyle='solid'
        borderTopColor='gray.700'
        spacing={1}
        direction='row-reverse'
        align='center'
      >
        <IconButton
          size='xs'
          aria-label='Reresh connection'
          margin='0 .35em'
          icon={<RiLayoutRightLine />}
        />
        <IconButton
          size='xs'
          aria-label='Reresh connection'
          margin='0 .35em'
          icon={<RiLayoutBottomLine />}
        />
        <IconButton
          size='xs'
          aria-label='Reresh connection'
          margin='0 .35em'
          icon={<RiLayoutLeftLine />}
        />
      </Flex>
    </>
  );
};

export const QuerySection = ({}: QuerySectionProps) => {
  return (
    <Flex direction='column' flex={1}>
      <Tabs
        isFitted
        variant='unstyled'
        css={{ flex: '1', display: 'flex', 'flex-direction': 'column' }}
      >
        <TabList mb='sm'>
          <QueryTab index={0}>SQL</QueryTab>
          <QueryTab index={1}>Data Structure</QueryTab>
        </TabList>
        <TabPanels
          css={{ flex: '1', display: 'flex', 'flex-direction': 'column' }}
        >
          <TabPanel
            css={{
              flex: '1',
              display: 'flex',
              'flex-direction': 'column',
              padding: 0,
            }}
          >
            <QueryContent />
          </TabPanel>
          <TabPanel
            css={{
              flex: '1',
              display: 'flex',
              'flex-direction': 'column',
              padding: 0,
            }}
          >
            <QueryContent />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
