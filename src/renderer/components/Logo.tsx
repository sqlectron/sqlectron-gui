import * as React from 'react';
import {
  chakra,
  keyframes,
  ImageProps,
  forwardRef,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import logo from './Logo.png';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Logo = forwardRef<ImageProps, 'img'>((props, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} 1 0.75s ease-in-out`;

  return <chakra.img animation={animation} src={logo} ref={ref} {...props} />;
});
