import React, { useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
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
  chakra,
  useTab,
  useStyles,
  useStyleConfig,
} from '@chakra-ui/react';

// @ts-ignore
const StyledTab = chakra('button', { themeKey: 'Tabs.Tab' });

export const QueryTab = React.forwardRef((props: any, ref: any) => {
  const [isShown, setIsShown] = useState(false);

  // 2. Reuse the `useTab` hook
  const tabProps = useTab(props);
  const isSelected = !!tabProps['aria-selected'];

  // 3. Hook into the Tabs `size`, `variant`, props
  const styles = useStyles();
  const customStyles: any = { ...styles.tab };
  customStyles.padding = '0.1rem';
  customStyles.background = 'darkThemeApp.barCompoenentBg';
  if (props.index > 0) {
    customStyles['border-left-width'] = '1px';
    customStyles['border-left-style'] = 'solid';
    customStyles['border-left-color'] = '#404040';
  }

  if (isSelected || isShown) {
    customStyles['background'] = '#404040';
  }

  return (
    <StyledTab
      __css={customStyles}
      {...tabProps}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <Flex>
        <Box flex={1}>
          <Text
            fontSize='xs'
            isTruncated
            flex={1}
            css={{ display: 'inline-flex', 'vertical-align': 'middle' }}
          >
            {tabProps.children}
          </Text>
        </Box>
        <Box as='span' css={{ visibility: isShown ? 'visible' : 'hidden' }}>
          <IconButton
            aria-label='Reresh connection'
            margin='0 .35em'
            css={{ background: 'none', 'border-radius': '0.1rem' }}
            size='xs'
            minWidth='1rem'
            h='1rem'
            p='0.5rem 0'
            icon={<CloseIcon w={2} h={2} />}
          />
        </Box>
      </Flex>
    </StyledTab>
  );
});
