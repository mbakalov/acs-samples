// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';

import issueToken from './routes/issueToken';
import refreshToken from './routes/refreshToken';
import recordings from './routes/recordings';
import eventgrid from './routes/eventgrid';

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'build')));


/**
 * route: /refreshToken
 * purpose: Calling: get a new token
 */
app.use('/refreshToken', cors(), refreshToken);

/**
 * route: /token
 * purpose: Calling: get ACS token with the given scope
 */
app.use('/token', cors(), issueToken);

/**
 * route: /recordings
 * purpose: Recording: start and stop recordings
 */
app.use('/recordings', cors(), recordings);

/**
 * route: /userConfig
 * purpose: Recording: receive EventGrid notifications
 */
app.use('/eventgrid', cors(), eventgrid);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
