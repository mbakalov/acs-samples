import { AcsRecordingFileStatusUpdatedEventData, SubscriptionValidationEventData } from '@azure/eventgrid';
import * as express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('EventGrid handler called, payload:');
  console.log(req.body);

  const eventGridEvents = req.body;
  for (const eventGridEvent of eventGridEvents) {
    if (eventGridEvent.eventType == "Microsoft.EventGrid.SubscriptionValidationEvent") {
      const subscriptionValidationEventData: SubscriptionValidationEventData = eventGridEvent.data;
      if (subscriptionValidationEventData.validationCode) {
          res.json({ validationResponse: subscriptionValidationEventData.validationCode });
          return;
      }
    }

    if (eventGridEvent.eventType == "Microsoft.Communication.RecordingFileStatusUpdated") {
      const statusUpdated: AcsRecordingFileStatusUpdatedEventData = eventGridEvent.data;
      const contentLocation = statusUpdated.recordingStorageInfo.recordingChunks[0].contentLocation;
      const deleteLocation = statusUpdated.recordingStorageInfo.recordingChunks[0].deleteLocation;

      console.log('Recording file status updated:');
      console.log('contentLocation:', contentLocation);
      console.log('deleteLocation', deleteLocation);
      return res.status(200).send();
    }
  }
})

export default router;