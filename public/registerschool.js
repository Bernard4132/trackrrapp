let registerSchoolForm = document.querySelector("#registerSchoolForm");
let buttonSubmitSRegistration = document.querySelector(
  "#buttonSubmitSRegistration"
);
const buttonloader = document.querySelector("#buttonloadersi");

buttonSubmitSRegistration.addEventListener("click", (e) => {
  e.preventDefault();
  let regName = registerSchoolForm.regName.value;
  let regEmail = registerSchoolForm.regEmail.value;
  let regPnum = registerSchoolForm.regPnum.value;
  let regUserRole = registerSchoolForm.regUserRole.value;
  let regSchoolName = registerSchoolForm.regSchoolName.value;
  let regSchoolPop = registerSchoolForm.regSchoolPop.value;
  let regSchoolRegion = registerSchoolForm.regSchoolRegion.value;
  let regSchoolDistrict = registerSchoolForm.regSchoolDistrict.value;
  let regPopType = registerSchoolForm.regPopType.value;
  let regPassword = registerSchoolForm.regPassword.value;
  let regPasswordConfirmation =
    registerSchoolForm.regPasswordConfirmation.value;

  if (
    regName == "" ||
    regEmail == "" ||
    regPassword == "" ||
    regPnum == "" ||
    regUserRole == "" ||
    regSchoolPop == "" ||
    regSchoolRegion == "" ||
    regSchoolDistrict == "" ||
    regPopType == "" ||
    regPassword == "" ||
    regPasswordConfirmation == "" ||
    regSchoolName == ""
  ) {
    alert("Fill the form completely");
  } else {
    buttonSubmitSRegistration.classList.add("disabled");
    buttonloader.style = "display: block";
    console.log("Create Account");
    firebase
      .auth()
      .createUserWithEmailAndPassword(regEmail, regPassword)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        var userid = user.uid;
        var schoolID = generateUniqueFirestoreId();
        const userObj = {
          user_id: userid,
          name: regName,
          phonenumber: regPnum,
          schoolname: regSchoolName,
          roleatschool: regUserRole,
          user_type: "school",
          school_id: schoolID,
        };

        db.collection("users")
          .where("user_id", "==", userid)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
              alert("Account already exists");
            } else {
              //Create Object
              db.collection("users")
                .doc(userid)
                .set(userObj)
                .then(() => {
                  //  console.log("USERID: " + docRef);

                  var schoolOBJ = {
                    school_id: schoolID,
                    name: regSchoolName,
                    region: regSchoolRegion,
                    district: regSchoolDistrict,
                    population: regSchoolPop,
                    poptype: regPopType,
                    creatorid: userid,
                  };
                  db.collection("schools")
                    .doc(schoolID)
                    .set(schoolOBJ)
                    .then(() => {
                      //  console.log("SCHOOLID: " + docRef1);
                      buttonSubmitSRegistration.classList.remove("disabled");
                      buttonloader.style = "display: none";
                      location.href = "homepage.html";
                      localStorage.setItem("schoolID", schoolID);
                      localStorage.setItem("schoolName", regSchoolName);
                      localStorage.setItem("userID", userid);
                    })
                    .catch((error) => {
                      alert(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  }
});

function generateUniqueFirestoreId() {
  // Alphanumeric characters
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return autoId;
}
