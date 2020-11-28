import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PopupWindowProps {
  close: () => void;
  children: any;
}

export const PopupWindow = ({ children, close }: PopupWindowProps) => {
  const [containerEl] = useState(document.createElement('div'));

  useEffect(
    () => {
      let externalWindow: Window | null = window.open(
        '',
        'NewWindowComponent',
        `width=600,height=400,left=200,top=200`,
      );

      externalWindow?.document.body.appendChild(containerEl);
      externalWindow?.addEventListener('beforeunload', () => {
        close();
      });
      console.log('Created Popup Window');
      return function cleanup() {
        console.log('Cleaned up Popup Window');
        externalWindow?.close();
        externalWindow = null;
      };
    },
    // Only re-renders this component if the variable changes
    // eslint-disable-next-line
    [],
  );

  return createPortal(children, containerEl);
};
