var firebase = require('firebase')
// all 3 are optional and you only need to require them at the start
// require('firebase/auth')
// require('firebase/database')
// require('firebase/storage')

var config = {
  apiKey: 'AIzaSyByQ7Fg9I90RDKbpPj8GqQzVvkRSnfHfxY',
  authDomain: 'webtinker-c0bd8.firebaseapp.com',
  databaseURL: 'https://webtinker-c0bd8.firebaseio.com',
  storageBucket: 'webtinker-c0bd8.appspot.com',
  projectId: 'webtinker-c0bd8',
  messagingSenderId: '707028811007'
}

firebase.initializeApp(config)
export { firebase }
