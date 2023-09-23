import * as express from 'express';

import { CallAutomationClient, CallLocator, RecordingStateResult } from '@azure/communication-call-automation';
import { getResourceConnectionString } from '../lib/envHelper';

const router = express.Router();

const handleStartRecording = async (serverCallId: string): Promise<RecordingStateResult> => {
  console.log('starting recording for serverCallId:', serverCallId);

  const client = new CallAutomationClient(getResourceConnectionString());

  const locator: CallLocator = {
    id: serverCallId,
    kind: 'serverCallLocator'
  };

  const result = await client.getCallRecording().start({ callLocator: locator });

  return result;
}

router.post('/:start', async (req, res) => {
  const result = await handleStartRecording(req.body.serverCallId);

  console.log('started recording:');
  console.log(result);
  res.send(result);
})

export default router;