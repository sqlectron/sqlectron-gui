import React from 'react';
import { theme } from '../theme';

import { Box, HStack, Icon, Text } from '@chakra-ui/react';

export interface ListItemProps {
  icon: React.ElementType;
  name: string;
  selectedName: string;
  onClick: () => void;
}

export const ListItem = ({
  icon,
  name,
  selectedName,
  onClick,
}: ListItemProps) => {
  const bgDefault = 'inherit';
  const bgSelected = '#2C639E';
  const bgHover = theme.colors.darkThemeApp.listHoverBg;
  const isSelected = selectedName === name;

  return (
    <Box
      as='button'
      padding='0.1em 1em'
      _hover={{
        background: isSelected ? bgSelected : bgHover,
      }}
      onClick={onClick}
      background={isSelected ? bgSelected : bgDefault}
    >
      <HStack align='center'>
        <Icon as={icon} w={3} />
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
