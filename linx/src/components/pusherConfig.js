import Pusher from 'pusher-js';

const pusherConfig = {
  key: '1a3a0863e71503fd5928',
  cluster: 'eu',
  encrypted: true,
};

const pusher = new Pusher(pusherConfig.key, {
  cluster: pusherConfig.cluster,
  encrypted: pusherConfig.encrypted,
});

export default pusher;