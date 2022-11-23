// GLobal Vars
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const classroom_id = urlParams.get("classroom_id");
let schname = localStorage.getItem("schoolName");
let schoolid = localStorage.getItem("schoolID");
let userid = localStorage.getItem("userID");

// Show Class Details
let classroomName = document.querySelector("#classroomName");
let classroomDescription = document.querySelector("#classroomDescription");
let createClassMembersBtn = document.querySelector("#createClassMembersBtn");

let holdusers = document.querySelector("#holdusers");

let holdAttendance = document.querySelector("#holdAttendance");

db.collection("students")
  .where("classroomid", "==", classroom_id)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      let trow = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      let alink = document.createElement("a");
      td1.textContent = doc.data().name;
      td2.textContent = doc.data().uniq_uid;
      alink.href = "genstudentqr.html?stud_id=" + doc.id;
      alink.textContent = "Genrate QR";
      td3.appendChild(alink);
      trow.appendChild(td1);
      trow.appendChild(td2);
      trow.appendChild(td3);
      holdusers.appendChild(trow);
    });
  })
  .catch((error) => {});

db.collection("classrooms")
  .doc(classroom_id)
  .get()
  .then((doc) => {
    classroomName.textContent = doc.data().name;
    classroomDescription.textContent = doc.data().description;
  })
  .catch((error) => {
    console.log(error);
  });

// Show Attendance
db.collection("attendance")
  .where("classid", "==", classroom_id)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      let trow = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      var date = doc.data().date.toDate();
      td1.textContent = doc.data().studentname;
      td2.textContent = doc.data().parentname;
      td3.textContent = date.toDateString();
      trow.appendChild(td1);
      trow.appendChild(td2);
      trow.appendChild(td3);
      holdAttendance.appendChild(trow);
    });
  })
  .catch((error) => {});

createClassMembersBtn.addEventListener("click", (e) => {
  e.preventDefault();
  var file_to_read = document.getElementById("get_the_file").files[0];
  var fileread = new FileReader();
  fileread.onload = function (e) {
    var content = e.target.result;
    // console.log(content);
    var intern = JSON.parse(content); // Array of Objects.
    // console.log(intern); // You can index every object

    intern.forEach((userObj) => {
      var userid = generateUniqueFirestoreId();
      var uniqUserID = generateUniqueUID();
      var newStudent = { ...userObj, uniq_uid: uniqUserID, user_id: userid };
      console.log(newStudent);
      db.collection("students").doc(newStudent.user_id).set(newStudent);
    });
  };
  fileread.readAsText(file_to_read);
});

// Utility Functions

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

function generateUniqueUID() {
  // Alphanumeric characters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let autoId = "";
  for (let i = 0; i < 7; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return autoId;
}
