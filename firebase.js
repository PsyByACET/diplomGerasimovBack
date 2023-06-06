// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyBGtDibpC9g1JUAOGWHaO6Edd52KiLe5GQ",
    authDomain: "testproject-42150.firebaseapp.com",
    projectId: "testproject-42150",
    storageBucket: "testproject-42150.appspot.com",
    messagingSenderId: "359509321271",
    appId: "1:359509321271:web:651baf0f0c13c8e11181b2",
    measurementId: "G-729ZTWDLRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
module.exports = app