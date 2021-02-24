import React, { useState, useRef, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { theme } from '../theme';
import ReactResizeDetector from 'react-resize-detector';
import { QueryResult } from '../types/queryResult';
import { Tab } from '../../shared/types/tab';
import sqlectron from '../api';

import {
  RiLayoutLeftLine,
  RiLayoutBottomLine,
  RiLayoutRightLine,
} from 'react-icons/ri';
import { QueryEditor } from './QueryEditor';
import { DataGrid } from './DataGrid';
import { QueryTab } from './QueryTab';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  IconButton,
  Button,
  Box,
  Grid,
  GridItem,
  Flex,
} from '@chakra-ui/react';

const onSplitPanelResize = (
  source: string,
  width: number,
  height: number,
  selectedTabId: string,
) => {
  const event = new CustomEvent('queryEditorResize', {
    detail: { source, width, height, selectedTabId },
  });
  window.dispatchEvent(event);
};

interface QueryContentProps {
  tab: Tab;
  selectedTabId: string;
}

const QueryContent = ({ tab, selectedTabId }: QueryContentProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [queryContent, setQueryContent] = useState('');
  const [queryResult, setQueryResult] = useState([]);
  console.log('***QueryContent', { queryContent, queryResult });

  useEffect(() => {
    sqlectron.tabStore
      .loadTabContent(tab)
      .then((content: string | undefined) => {
        console.log('***loaded tab content', content);
        setQueryContent(content || '');
      })
      .catch((err: Error) => console.error(err));
  }, [tab]);

  const recordTabStateOnQueryChange = (content: string) => {
    console.log('***recordTabStateOnQueryChange', tab);
    sqlectron.tabStore.saveTabContent(tab, content);
  };

  const executeQuery = () => {
    const model = editorRef.current?.getModel();
    const query = model?.getValue() as string;
    console.log('***query', query);

    sqlectron.db
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
        templateRows='min-content auto min-content'
        height='100%'
        css={{ overflow: 'hidden' }}
      >
        <GridItem
          bg='darkThemeApp.containerBg'
          borderBottomWidth='1px'
          borderBottomStyle='solid'
          borderBottomColor='gray.700'
        >
          <Resizable
            defaultSize={{
              width: '100%',
              height: '50vh',
            }}
            onResizeStop={(e, direction, ref, d) => {
              onSplitPanelResize(
                'vertical-resize',
                ref.clientWidth,
                ref.clientHeight,
                selectedTabId,
              );
            }}
            enable={{
              top: false,
              right: false,
              bottom: true,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            style={{
              background: theme.colors.darkThemeApp.containerBg,
            }}
          >
            <Flex direction='column' height='100%'>
              <Box flex={1}>
                <QueryEditor
                  ref={editorRef}
                  tabId={tab.id}
                  value={queryContent}
                  onChange={recordTabStateOnQueryChange}
                />
              </Box>
              <Flex
                padding='0.5em'
                spacing={1}
                direction='row-reverse'
                align='center'
              >
                <Button
                  colorScheme='gray'
                  size='xs'
                  onClick={() => executeQuery()}
                >
                  Run Current
                </Button>
              </Flex>
            </Flex>
          </Resizable>
        </GridItem>
        <GridItem>
          <Box css={{ overflow: 'auto' }}>
            {queryResult.map((queryResult: QueryResult, i: number) => (
              <DataGrid key={i} queryResult={queryResult} />
            ))}
          </Box>
        </GridItem>
        <GridItem>
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
        </GridItem>
      </Grid>
    </>
  );
};

interface QueryContainerProps {
  serverId: string;
  databaseName: string;
  tabs: Array<Tab>;
  onTabCloseClick: (tab: Tab) => void;
}

export const QueryContainer = ({
  serverId,
  databaseName,
  tabs,
  onTabCloseClick,
}: QueryContainerProps) => {
  const [selectedTabId, setSelectedTabId] = useState(
    tabs.length > 0 ? tabs[0].id : '',
  );
  console.log(
    '***QueryContainer selectedTabId',
    selectedTabId,
    tabs.length > 0 ? tabs[0].id : '',
  );

  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      refreshMode='debounce'
      refreshRate={100}
      onResize={(width: number, height: number) =>
        onSplitPanelResize('horizontal-resize', width, height, selectedTabId)
      }
    >
      {({ targetRef }: { targetRef: any }) => (
        <Flex direction='column' flex={1} height='100%' ref={targetRef}>
          <Tabs
            isFitted
            variant='unstyled'
            css={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <TabList mb='sm'>
              {tabs.map((tab: Tab, index: number) => (
                <QueryTab
                  key={tab.id}
                  id={tab.id}
                  index={index}
                  onTabSelect={(id: string) => setSelectedTabId(tab.id)}
                  onTabCloseClick={() => onTabCloseClick(tab)}
                >
                  {tab.name}
                </QueryTab>
              ))}
            </TabList>
            <TabPanels
              css={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 19px)',
              }}
            >
              {tabs.map((tab: Tab, index: number) => (
                <TabPanel
                  key={tab.id}
                  css={{
                    height: '100%',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                  }}
                >
                  <QueryContent tab={tab} selectedTabId={selectedTabId} />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Flex>
      )}
    </ReactResizeDetector>
  );
};
