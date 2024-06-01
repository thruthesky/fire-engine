/**
 * Test for sendPushNotifications
 * 
 * This file is not for testing on a local emulator, but for testing on actual server functions
 * after deployment with Extensions.
 */
import axios, { AxiosError } from "axios";
import "mocha";
import { expect } from "chai";

const url = "https://us-central1-withcenter-test-3.cloudfunctions.net/ext-fff-sendPushNotifications";

describe('sendPushNotifications', () => {

    it('Token undefined', async () => {
        try {
            await axios.get(url + '?title=t&body=b');
            expect.fail('Must be 500 error');
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                expect(data.code).to.equal('fireflutter-messaging/missing-tokens');
            } else {
                console.error(e);
            }
        }
    });
    it('Title undefined', async () => {
        try {
            await axios.get(url + '?tokens=a,b,c&body=b');
            expect.fail('Must be 500 error');
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                expect(data.code).to.equal('fireflutter-messaging/missing-title');
            } else {
                console.error(e);
            }
        }
    });
    it('Body undefined', async () => {
        try {
            await axios.get(url + '?tokens=a,b,c&title=t');
            expect.fail('Must be 500 error');
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                expect(data.code).to.equal('fireflutter-messaging/missing-body');
            } else {
                console.error(e);
            }
        }
    });
    it('Send failure', async () => {
        try {
            await axios.get(url + '?tokens=a,b,c&title=t&body=b');
            expect.fail('Must be 500 error');
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                expect(data.code).to.equal('fireflutter-messaging/send-error');
            } else {
                console.error(e);
            }
        }
    });
    it('Send success', async () => {
        try {
            await axios.get(url + '?tokens=dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT,b,c&title=t&body=b' + new Date().toISOString());
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                console.log('details', data.error.details);
            } else {
                console.error(e);
            }
            expect.fail('Oops! This test must sucess');
        }
    });
});




