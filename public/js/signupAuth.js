// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {getDatabase, set, ref, update} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import { getAuth,signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyAKMv09AYbmmB9C75v_VdoBufavjDOeHN0",
authDomain: "walkover-docs-platform.firebaseapp.com",
databaseURL: "https://walkover-docs-platform-default-rtdb.firebaseio.com",
projectId: "walkover-docs-platform",
storageBucket: "walkover-docs-platform.appspot.com",
messagingSenderId: "298736667390",
appId: "1:298736667390:web:916c963ccc86a659d973af"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();
  
  signup.addEventListener('click',(e) => {
    
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var username = document.getElementById('name').value;
  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
     // Signed in 
    const user = userCredential.user;
  
    set(ref(database,'users/'+ user.uid),{
      username: username,
      email: email
    });
  
    alert('user created!');
    async function registerUser() {
      // event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const username = document.getElementById("name").value;
      var details = {
        'userName': username,
        'password': password,
        'email': email,
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      const option = {
        method: "POST",
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody
      }


      let fetchData = await fetch("/api/register", option).then((res) => res.json());
      console.log(fetchData);
    }
    registerUser();
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
   
    if(new String(errorMessage).valueOf() == ("Error (auth/email-already-in-use)."))
      window.location.href = 'login.ejs';
      else		alert(errorMessage);

    // ..
    });
  
  });

