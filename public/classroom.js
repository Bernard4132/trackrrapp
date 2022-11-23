//Global Varibales
let schname = localStorage.getItem("schoolName");
let schoolid = localStorage.getItem("schoolID");
let userid = localStorage.getItem("userID");

//Ceate Classroom
let createClassroomForm = document.querySelector("#createClassroomForm");
let createCButton = document.querySelector("#createCButton");
let sumbitLoader = document.querySelector("#sumbitLoader");

createCButton.addEventListener("click", (e) => {
  e.preventDefault();
  var cname = createClassroomForm.cName.value;
  var cdescription = createClassroomForm.cDescription.value;
  if (cname == "" || cdescription == "") {
    alert("Kindly enter all details");
  } else {
    console.log("Can Submit!");
    createCButton.classList.add("disabled");
    sumbitLoader.style = "display: block";
    var classroomid = generateUniqueFirestoreId();
    let classroomOBJ = {
      name: cname,
      description: cdescription,
      school_id: schoolid,
      classroom_id: classroomid,
      owner: userid,
    };
    db.collection("classrooms")
      .doc(classroomid)
      .set(classroomOBJ)
      .then(() => {
        createCButton.classList.remove("disabled");
        sumbitLoader.style = "display: none; margin-top: 10px;";
        createClassroomForm.cName.value = "";
        createClassroomForm.cDescription.value = "";
        alert("Classroom Successfully Created.");
      })
      .catch((error) => {});
  }
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
