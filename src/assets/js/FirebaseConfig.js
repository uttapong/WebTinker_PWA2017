var firebase = require('firebase')
// all 3 are optional and you only need to require them at the start
// require('firebase/auth')
// require('firebase/database')
// require('firebase/storage')

var config = {
  apiKey: 'AIzaSyD9_ksgcjjKLkpQZUdKsY9Djm7nkJjx2uw',
  authDomain: 'pwa-hackaton-2017.firebaseapp.com',
  databaseURL: 'https://pwa-hackaton-2017.firebaseio.com',
  storageBucket: 'pwa-hackaton-2017',
  messagingSenderId: '664566785963'
};

firebase.initializeApp(config);
export {firebase};