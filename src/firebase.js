import firebase from "firebase/app";
import 'firebase/firestore'

var fireBaseConfig = {
    apiKey: "AIzaSyCC3-QPnNk7v6JdG3eqeUAOUm6gxew-H8M",
    authDomain: "final-35789.firebaseapp.com",
    databaseURL: "https://final-35789.firebaseio.com",
    projectId: "final-35789",
    storageBucket: "final-35789.appspot.com",
    messagingSenderId: "224357659092",
    appId: "1:224357659092:web:79a7f45a375bec844fe641",
    measurementId: "G-EPP4NKZ92P"
}

firebase.initializeApp(fireBaseConfig);

export default firebase;