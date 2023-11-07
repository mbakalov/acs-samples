import { CreateRoomOptions, RoomsClient } from '@azure/communication-rooms';
import { getResourceConnectionString } from './../lib/envHelper';

import * as express from 'express';
import { CommunicationUserIdentifier } from '@azure/communication-common';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Creating a Room');

  const userId = req.body.userId;

  const user: CommunicationUserIdentifier = { communicationUserId: userId };

  const roomsClient = new RoomsClient(getResourceConnectionString());

  const validFrom = new Date(Date.now());
  let validForDays = 10;
  let validUntil = new Date(validFrom.getTime());
  validUntil.setDate(validFrom.getDate() + validForDays);

  // options payload to create a room
  const createRoomOptions: CreateRoomOptions = {
    validFrom,
    validUntil,
    participants: [
      {
        id: user,
        role: "Attendee",
      },
    ],
  };

  // create room
  const room = await roomsClient.createRoom(createRoomOptions);

  console.log(room.id);

  return res.status(200).json({roomId: room.id});
})

export default router;