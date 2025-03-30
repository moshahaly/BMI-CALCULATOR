const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const app = express();

// Configure VAPID keys (generate these once)
const vapidKeys = {
  publicKey: 'YOBAa31EENDPBJzbXiYi0uhK6Hk0R0JGYuX8F1msSuoYFxyjKMJ1IEcrQKTOo46ZzMqfNxPLoDBxu_X96yRBjDOF4',
  privateKey: 'Zzcy6Txy-0gAx7JuVTYRD7aykhygsQm5qvTokKx_wJw'
};

webpush.setVapidDetails(
  'mailto:mdsh09@yahoo.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(bodyParser.json());
app.use(express.static('public')); // Serve your PWA files

let subscriptions = [];

// Save subscription
app.post('/api/save-subscription', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Send notification to all subscribers
app.post('/api/send-notification', (req, res) => {
  const notificationPayload = {
    title: req.body.title || 'BMI Calculator',
    body: req.body.body || 'New notification from BMI Calculator',
    icon: 'icon-192.png',
    data: {
      url: req.body.url || '/'
    }
  };

  const promises = subscriptions.map(sub => 
    webpush.sendNotification(sub, JSON.stringify(notificationPayload))
  );

  Promise.all(promises)
    .then(() => res.status(200).json({message: 'Notifications sent'}))
    .catch(err => {
      console.error('Error sending notification:', err);
      res.status(500).json({error: 'Error sending notification'});
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));