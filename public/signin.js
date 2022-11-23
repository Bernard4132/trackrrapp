const login = document.querySelector("#loginteacher");
const loginform = document.querySelector("#teachersignin");
const buttonloader = document.querySelector("#buttonloadersi");

login.addEventListener("click", (e) => {
  e.preventDefault();
  login.classList.add("disabled");
  login.textContent = "Signing in..";
  buttonloader.style = "display: block;";
  var email = loginform.email.value;
  var password = loginform.password.value;
  var emailstring = email.toString();
  var passwordstring = password.toString();
  console.log(emailstring + " | " + passwordstring);

  firebase
    .auth()
    .signInWithEmailAndPassword(emailstring, passwordstring)
    .then(function (firebaseUser) {
      // Success
      console.log(firebaseUser.user.uid);
      var firbaseuid = firebaseUser.user.uid;
      db.collection("users")
        .doc(firbaseuid)
        .get()
        .then((doc) => {
          var schholname = doc.data().schoolname;
          var schoolid = doc.data().school_id;
          var user_id = doc.data().user_id;
          var user_type = doc.data().user_type;
          if (user_type == "school") {
            localStorage.setItem("schoolID", schoolid);
            localStorage.setItem("schoolName", schholname);
            localStorage.setItem("userID", user_id);
            localStorage.setItem("userType", user_type);
            location.href = "homepage.html";
          }
          if (user_type == "parent") {
            localStorage.setItem("schoolID", schoolid);
            localStorage.setItem("schoolName", schholname);
            localStorage.setItem("userID", user_id);
            localStorage.setItem("userType", user_type);
            location.href = "parenthome.html";
          }
        })
        .catch((error) => {});
    })
    .catch(function (error) {
      // Error Handling
      console.log("Unable to login");
      login.classList.remove("disabled");
      buttonloader.style = "display: none;";
    });

  // function signinuser(){
  //     firebase.auth().onAuthStateChanged(function(user) {
  //     if (user) {
  //         // User is signed in.
  //         console.log(user.uid);
  //     } else {
  //         // No user is signed in.
  //     }
  //     });
  // }
});
