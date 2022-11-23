let schname = localStorage.getItem("schoolName");
let schoolid = localStorage.getItem("schoolID");
let userid = localStorage.getItem("userID");

let logMeOut = document.querySelector("#logMeOut");
let shoolName = document.querySelector("#shoolName");
let classesNumber = document.querySelector("#classesNumber");
let classroomList = document.querySelector("#classroomList");
//let logMeOut = document.querySelector("#logMeOut");

let holdAttendance = document.querySelector("#holdAttendance");

shoolName.textContent = schname;

// List Classrooms
db.collection("classrooms")
  .where("school_id", "==", schoolid)
  .get()
  .then((querySnapshot) => {
    console.log("Classrooms num: " + querySnapshot.size);
    classesNumber.textContent = "Number of Classrooms: " + querySnapshot.size;
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      let bigcol = document.createElement("div");
      let bighold = document.createElement("div");
      let p = document.createElement("p");
      let alink = document.createElement("a");
      bigcol.classList.add("col-6");
      bighold.classList.add("holdclassMe");
      p.textContent = doc.data().name;
      alink.href = "showclassroom.html?classroom_id=" + doc.id;
      alink.text = "Open Class";
      alink.style = "color: #ffffff; font-size: 13px";
      p.style = "margin-bottom: 5px";
      bighold.appendChild(p);
      bighold.appendChild(alink);
      bigcol.appendChild(bighold);
      classroomList.appendChild(bigcol);
    });
  })
  .catch((error) => {});

// Show Attendance
db.collection("attendance")
  .where("schoolid", "==", schoolid)
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

logMeOut.addEventListener("click", (e) => {
  e.preventDefault();
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User Signed Out");
      window.location.href = "signin.html";
    });
});

// I'm told you are very interested in startups and I'm thinking we could have a converstaion about the whole industry and where I think the upsides will be over the next decade.
