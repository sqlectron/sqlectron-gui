import { ipcRenderer, shell } from 'electron';
import React, { useEffect, useState } from 'react';

const EVENT_KEY = 'sqlectron:update-available';
const repo = global.SQLECTRON_CONFIG.repository.url.replace('https://github.com/', '');
const LATEST_RELEASE_URL = `https://github.com/${repo}/releases/latest`;

const UpdateChecker = () => {
  const [isVisible, setIsVisible] = useState(false);

  const updateAvailable = () => {
    setIsVisible(true);
  };

  const onClick = (event) => {
    event.preventDefault();
    shell.openExternal(LATEST_RELEASE_URL);
  };

  useEffect(() => {
    ipcRenderer.on(EVENT_KEY, updateAvailable);
    ipcRenderer.send('sqlectron:check-upgrade');

    return () => {
      ipcRenderer.removeListener(EVENT_KEY, updateAvailable);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <a className="ui green label" onClick={onClick}>
          <i className="cloud download icon">Update available</i>
        </a>
      )}
    </>
  );
};

UpdateChecker.displayName = 'UpdateChecker';

export default UpdateChecker;
