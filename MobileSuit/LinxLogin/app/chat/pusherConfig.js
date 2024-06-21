// pusherConfig.js
import Pusher from 'pusher-js/react-native';
import NetInfo from '@react-native-community/netinfo';

const pusherConfig = {
    appId: "1822838",
    key: "1a3a0863e71503fd5928",
    secret: "748a130828f3a391a488",
    cluster: "eu",
    useTLS: true
};

const pusher = new Pusher(pusherConfig.key, {
  cluster: pusherConfig.cluster,
  encrypted: pusherConfig.encrypted,
});

NetInfo.addEventListener(state => {
  if (state.isConnected) {
    pusher.connect();
  } else {
    pusher.disconnect();
  }
});

export default pusher;
