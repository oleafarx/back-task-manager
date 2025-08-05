import * as functions from 'firebase-functions/v1';
import app from './app';

export const api = functions.https.onRequest(app);
