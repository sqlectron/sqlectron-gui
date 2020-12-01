import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const theme = extendTheme({
  // config: {
  //   useSystemColorMode: true,
  //   initialColorMode: 'light',
  // },
  colors: {
    gray: {
      50: '#f2f2f2',
      100: '#d9d9d9',
      200: '#bfbfbf',
      300: '#a6a6a6',
      400: '#8c8c8c',
      500: '#737373',
      600: '#595959',
      700: '#404040',
      800: '#262626',
      900: '#0d0d0d',
    },

    darkThemeApp: {
      barCompoenentBg: '#232424',
      barCompoenentBorderColor: '#1A1B1B',
      sidebarPanelBg: '#1D1D1F',
      containerBg: '#151616',
      listHoverBg: '#2F3031',
    },
  },

  styles: {
    global: (props) => ({
      body: {
        bg: mode('white', '#151616')(props),
      },
    }),
  },
});
