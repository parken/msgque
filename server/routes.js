/**
 * Main application routes
 */

import path from 'path';

import errors from './components/errors';
import logger from './components/logger';

import user from './api/user';
import sms from './api/sms';
import senderId from './api/senderId';
import company from './api/company';
import contact from './api/contact';
import group from './api/group';
import template from './api/template';
import campaign from './api/campaign';
import route from './api/route';

export default function (app) {
  // Insert routes below
  app.use('/api/users', user);
  app.use('/api/sms', sms);
  app.use('/api/senderId', senderId);
  app.use('/api/company', company);
  app.use('/api/contacts', contact);
  app.use('/api/routes', route);
  app.use('/api/groups', group);
  app.use('/api/templates', template);
  app.use('/api/campaigns', campaign);
  app.use('/api', route);

  // errors passed using next(err)
  app.use((e, req, res, next) => {
    const err = e;
    const { body, headers, user } = req;

    logger.error(err.message, err, {
      url: req.originalUrl,
      body,
      headers,
      user,
    });

    return res.status(500).json({ message: err.message, stack: err.stack });
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
