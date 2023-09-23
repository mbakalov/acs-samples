// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';

import {
  CallAdapterLocator,
  CallAdapterState,
  createAzureCommunicationCallAdapter,
  CallAdapter,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';

import React, { useEffect, useRef, useState } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { CallCompositeContainer } from './CallCompositeContainer';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;

  callLocator: CallAdapterLocator;
  displayName: string;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, callLocator, displayName } = props;
  const callIdRef = useRef<string>();

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    const createAdapter = async (): Promise<void> => {

      const credential = createAutoRefreshingCredential(
        toFlatCommunicationIdentifier(userId),
        token);
      
      const locator = callLocator;
      const adapter = await createAzureCommunicationCallAdapter({
        userId,
        displayName,
        credential,
        locator});

      adapter.on('error', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });

      adapter.onStateChange((state: CallAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${WEB_APP_TITLE}`;
  
        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });

      setCallAdapter(adapter);
    }

    createAdapter();
  }, [token]);

  console.log('Rendering callcompositecontaier, adapter is undefined=', !callAdapter);

  return <CallCompositeContainer adapter={callAdapter} />;
};

const convertPageStateToString = (state: CallAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'leftCall':
      return 'end call';
    case 'removedFromCall':
      return 'end call';
    default:
      return `${state.page}`;
  }
};
