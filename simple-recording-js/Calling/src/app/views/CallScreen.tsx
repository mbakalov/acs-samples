// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';

import {
  CallAdapterLocator,
  CallAdapterState,
  createStatefulCallClient,
  createAzureCommunicationCallAdapterFromClient,
  CallAdapter,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';

import React, { useEffect, useRef, useState } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { startRecording } from '../utils/recording';
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
  const [serverCallId, setServerCallId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const createAdapter = async (): Promise<void> => {

      const credential = createAutoRefreshingCredential(
        toFlatCommunicationIdentifier(userId),
        token);
      
      const locator = callLocator;

      const callClient = createStatefulCallClient({
        userId
      });

      const callAgent = await callClient.createCallAgent(
        credential,
        { displayName }
      );

      const adapter = await createAzureCommunicationCallAdapterFromClient(
        callClient,
        callAgent,
        locator);

      adapter.on('error', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });

      adapter.onStateChange((state: CallAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${WEB_APP_TITLE}`;
  
        if (state.call?.state == 'Connected') {
          const isNewCall = state?.call?.id && callIdRef.current !== state?.call?.id;
          
          if (isNewCall) {
            const thisCall = callAgent.calls.find(c => c.id == state?.call?.id);
            thisCall?.info.getServerCallId().then((serverCallId) => {
              setServerCallId(serverCallId);
              console.log('Server call Id:', serverCallId);
            });

            callIdRef.current = state?.call?.id;
            console.log(`Call Id: ${callIdRef.current}`);
          }
        }
      });

      setCallAdapter(adapter);
    }

    createAdapter();
  }, [token]);

  const handleRecordClicked = async (): Promise<void> => {
    if (serverCallId) {
      await startRecording(serverCallId);
    }
  }

  return <CallCompositeContainer adapter={callAdapter} onRecordButtonClicked={handleRecordClicked} />;
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
