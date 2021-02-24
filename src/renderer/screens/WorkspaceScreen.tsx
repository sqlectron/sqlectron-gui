import React, { useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import { Tab } from '../../shared/types/tab';
import { theme } from '../theme';
import { QueryContainer } from '../components/QueryContainer';
import { DatabaseListModal } from '../components/DatabaseListModal';
import { ConnectionSidebar } from '../components/ConnectionSidebar';
import { ConnectionTopbar } from '../components/ConnectionTopbar';
import { RecordForm } from '../components/RecordForm';
import {
  Grid,
  GridItem,
  CircularProgress,
  Center,
  useDisclosure,
} from '@chakra-ui/react';
import sqlectron from '../api';

function WorkspaceScreen() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(true);
  const [server, setServer] = useState<any>(null);
  const [database, setDatabase] = useState('');

  const serverId = server?.id;

  useEffect(() => {
    sqlectron.db.onConnection((event: string, serverId: string) => {
      console.log('****onConnection', { event, serverId });
      if (event === 'open') {
        sqlectron.db
          .connect(serverId, '', false, '')
          .then((res: any) => {
            console.log('**connect res', res);
            setServer(res.server);
            setDatabase(res.server.database);
            setLoading(false);
          })
          .catch((err: Error) => {
            setLoading(false);
            console.error(err);
          });
      }
    });
  }, []);

  const onDatabaseConnectClick = (databaseName: string) => {
    setLoading(true);
    setDatabase(databaseName);

    sqlectron.db
      .connect(server.id, databaseName, false, '')
      .then((res: any) => {
        console.log('**connect res', res);
        setLoading(false);
      })
      .catch((err: Error) => {
        setLoading(false);
        console.error(err);
      });
  };

  const [tabs, setTabs] = useState<Array<Tab>>([]);
  useEffect(() => {
    if (!serverId) {
      return;
    }

    sqlectron.tabStore
      .loadTabs(serverId, database)
      .then((tabs: Array<Tab>) => {
        console.log('***loaded tabs', tabs);
        setTabs(tabs);
      })
      .catch((err: Error) => console.error(err));
  }, [serverId, database]);

  const onSQLButtonClick = () => {
    //setLoading(true);

    sqlectron.tabStore
      .createTab(server.id, database, 'sql')
      .then((tab: Tab) => {
        console.log('**created tab', tab);
        //setLoading(false);
        setTabs(tabs.concat([tab]));
      })
      .catch((err: Error) => {
        //setLoading(false);
        console.error(err);
      });
  };

  const onTabCloseClick = (tab: Tab) => {
    //setLoading(true);

    sqlectron.tabStore
      .removeTab(tab)
      .then(() => sqlectron.tabStore.loadTabs(serverId, database))
      .then((tabs: Array<Tab>) => {
        console.log('**removed tab', tab);
        //setLoading(false);
        setTabs(tabs);
      })
      .catch((err: Error) => {
        //setLoading(false);
        console.error(err);
      });
  };

  if (isLoading) {
    return (
      <Center height='100vh'>
        <CircularProgress isIndeterminate color='green.300' />
      </Center>
    );
  }

  return (
    <>
      <Grid
        h='100vh'
        w='100vw'
        gap={0}
        templateColumns='min-content auto min-content'
        templateRows='min-content auto min-content'
      >
        <GridItem gridColumn='span 3'>
          <ConnectionTopbar
            server={server}
            database={database}
            onDatabaseButtonClick={onOpen}
            onSQLButtonClick={onSQLButtonClick}
          />
        </GridItem>
        <GridItem
          gridColumn='span 1'
          css={{
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <Resizable
            minWidth='100px'
            maxWidth='45vw'
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            defaultSize={{
              width: '250px',
              height: '100%',
            }}
            style={{
              background: theme.colors.darkThemeApp.sidebarPanelBg,
              borderRight: `1px solid ${theme.colors.darkThemeApp.barCompoenentBorderColor}`,
            }}
          >
            <ConnectionSidebar />
          </Resizable>
        </GridItem>
        <GridItem
          gridColumn='span 1'
          css={{
            overflow: 'hidden',
            height: '100%',
          }}
        >
          {tabs.length > 0 && (
            <QueryContainer
              serverId={server.id}
              databaseName={database}
              tabs={tabs}
              onTabCloseClick={onTabCloseClick}
            />
          )}
        </GridItem>
        <GridItem
          gridColumn='span 1'
          css={{
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <Resizable
            minWidth='100px'
            maxWidth='45vw'
            enable={{
              top: false,
              right: false,
              bottom: false,
              left: true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            defaultSize={{
              width: '250px',
              height: '100%',
            }}
            style={{
              background: theme.colors.darkThemeApp.sidebarPanelBg,
              borderLeft: `1px solid ${theme.colors.darkThemeApp.barCompoenentBorderColor}`,
            }}
          >
            <RecordForm />
          </Resizable>
        </GridItem>
      </Grid>
      <DatabaseListModal
        isOpen={isOpen}
        onClose={onClose}
        onDatabaseClick={onDatabaseConnectClick}
      />
    </>
  );
}

export default WorkspaceScreen;
