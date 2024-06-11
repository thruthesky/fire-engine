// evlngKHLvU4TuPcyEIo-k4:APA91bH6FvpvnMSSRcRKVw0wn0mCKmYIRo2-pV4zn9gU-tmT4aylJPIodmzTtjQJpG93U9OL1jR8vwRtm8kMfLn1p2evpwy-jOx4UFYCCrf1dMF4bayouGtBCLj73hs6jy8BSGErweyu

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MessagingService } from '../../src/messaging/messaging.service';
import { initializeFirebaseOnce } from '../initialize-firebase-once';


initializeFirebaseOnce();



describe('sendNotificationToTokens', () => {
    it('should send a notification to the tokens', async () => {
        const tokens = ["evlngKHLvU4TuPcyEIo-k4:APA91bH6FvpvnMSSRcRKVw0wn0mCKmYIRo2-pV4zn9gU-tmT4aylJPIodmzTtjQJpG93U9OL1jR8vwRtm8kMfLn1p2evpwy-jOx4UFYCCrf1dMF4bayouGtBCLj73hs6jy8BSGErweyu"];
        const title = "title";
        const body = "body";


        const res = await MessagingService.sendNotificationToTokens({ tokens, title, body });
        console.log('res; ', res);
        expect(res).to.deep.equal({});
    });
});
