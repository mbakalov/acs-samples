import * as express from 'express';

const router = express.Router();

const handleStartRecording = async (serverCallId: string): Promise<void> => {
    console.log('recording started for serverCallId', serverCallId);
}

router.post('/:start', async (req, res, next) => {
    await handleStartRecording(req.body.serverCallId);

    res.send('Started');
})

export default router;