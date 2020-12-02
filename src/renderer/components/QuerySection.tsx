import React, { useState, useRef } from 'react';
//import PerfectScrollbar from 'react-perfect-scrollbar';
//import 'react-perfect-scrollbar/dist/css/styles.css';
import { QueryResult } from '../types/queryResult';

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
import { QueryEditor } from './QueryEditor';
import { DataGrid } from './DataGrid';
import { QueryTab } from './QueryTab';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

//import mysqlLogo from './server-db-client-mysql.png';
import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Textarea,
  IconButton,
  Button,
  Box,
  Grid,
  Flex,
} from '@chakra-ui/react';

interface QuerySectionProps {}

const QueryContent = ({}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [queryResult, setQueryResult] = useState([]);

  const executeQuery = () => {
    const model = editorRef.current?.getModel();
    const query = model?.getValue();
    console.log('***query', query);

    // @ts-ignore
    window.sqlectron.db
      .executeQuery(query)
      .then((res: any) => {
        console.log('***query result', query, res);
        setQueryResult(res);
      })
      .catch((err: Error) => console.error(err));
  };

  return (
    <>
      <Grid
        gap={0}
        templateColumns='1fr'
        templateRows='min-content auto'
        height='100%'
        css={{ overflow: 'hidden' }}
      >
        <Box bg='darkThemeApp.containerBg'>
          <QueryEditor ref={editorRef} />
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
            <Button colorScheme='gray' size='xs' onClick={() => executeQuery()}>
              Run Current
            </Button>
          </Flex>
        </Box>
        <Box css={{ overflow: 'auto' }}>
          {queryResult.map((queryResult: QueryResult, i: number) => (
            <DataGrid key={i} queryResult={queryResult} />
          ))}
        </Box>
      </Grid>
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
    <Flex direction='column' flex={1} height='100%'>
      <Tabs
        isFitted
        variant='unstyled'
        css={{
          flex: '1',
          display: 'flex',
          'flex-direction': 'column',
          height: '100%',
        }}
      >
        <TabList mb='sm'>
          <QueryTab index={0}>SQL</QueryTab>
          <QueryTab index={1}>Data Structure</QueryTab>
        </TabList>
        <TabPanels
          css={{
            flex: '1',
            display: 'flex',
            'flex-direction': 'column',
            height: 'calc(100% - 19px)',
          }}
        >
          <TabPanel
            css={{
              height: '100%',
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
              height: '100%',
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
