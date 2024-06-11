// evlngKHLvU4TuPcyEIo-k4:APA91bH6FvpvnMSSRcRKVw0wn0mCKmYIRo2-pV4zn9gU-tmT4aylJPIodmzTtjQJpG93U9OL1jR8vwRtm8kMfLn1p2evpwy-jOx4UFYCCrf1dMF4bayouGtBCLj73hs6jy8BSGErweyu

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MessagingService } from '../../src/messaging/messaging.service';
import { initializeFirebaseOnce } from '../initialize-firebase-once';


initializeFirebaseOnce();



describe('sendNotificationToTokens', () => {
    it('should send a notification to the tokens', async () => {
        const tokens = [
            // iOS Simulator - iPhone 15 Pro Max
            "evlngKHLvU4TuPcyEIo-k4:APA91bH6FvpvnMSSRcRKVw0wn0mCKmYIRo2-pV4zn9gU-tmT4aylJPIodmzTtjQJpG93U9OL1jR8vwRtm8kMfLn1p2evpwy-jOx4UFYCCrf1dMF4bayouGtBCLj73hs6jy8BSGErweyu",
            // Real device - iphone 11 pro max
            "dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT",

            // iOS Simulator - iPhone 15 SE
            "eoZwDT0zGkdYmmcFDOwr8g:APA91bEdsfxjir3TR-C1r5CbjPqLLOk9lSbQ14keL_R0Qb9vp3W_Bo4zPaa8aXRUIxznOAonqWIKfKg7cZ9FKhtKktBAga-k9hp3I_LMpLCX-7UZqlsDnrtb5_5uS7AVLvCrkMRhqKfC",
        ];
        const title = "title";
        const body = "body";


        const res = await MessagingService.sendNotificationToTokens({ tokens, title, body });
        console.log('res.length; ', (Object.keys(res)).length);
        expect(res).to.deep.equal({});
    });
});
