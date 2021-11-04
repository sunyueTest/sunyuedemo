function sendBroadcast(type, data) {
    for (let i = 0; i < frames.length; i++) {
        var iframe = frames[i];
        try {
            iframe.onReceive(type, data);
        } catch (e) {
            // console.log(e)
        }
    }
}