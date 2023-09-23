// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommonCallAdapter, CallComposite, CallCompositeOptions, CustomCallControlButtonCallbackArgs, CustomCallControlButtonProps } from '@azure/communication-react';

import { Spinner } from '@fluentui/react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { useIsMobile } from '../utils/useIsMobile';
import React, { useEffect } from 'react';

export type CallCompositeContainerProps = { 
  adapter?: CommonCallAdapter
};

export const CallCompositeContainer = (props: CallCompositeContainerProps): JSX.Element => {
  const { adapter } = props;
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const isMobileSession = useIsMobile();

  // Dispose of the adapter in the window's before unload event.
  // This ensures the service knows the user intentionally left the call if the user
  // closed the browser tab during an active call.
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  const callInvitationUrl: string | undefined = window.location.href;

  const options: CallCompositeOptions = {
    callControls: {
      onFetchCustomButtonProps: [
        (_args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
          return {
            showLabel: true,
            iconName: 'Record2',
            text: 'Record',
            'placement': 'overflow',
            onItemClick: () => {
              alert('Recording started!')
            }
          }
        }
      ]
    }
  }

  return (
    <CallComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      callInvitationUrl={callInvitationUrl}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
      options={options}
    />
  );
};
