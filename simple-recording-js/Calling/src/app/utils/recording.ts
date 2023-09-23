export const startRecording = async (serverCallId: string): Promise<void> => {
    const response = await fetch('/recordings/:start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serverCallId })
    });

    console.log('Start recording for serverCallId:', serverCallId);
    console.log('Recording response status:', response.status);
}