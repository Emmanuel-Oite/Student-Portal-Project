// Function to populate the student list with courses and grades
function populateStudentList() {
  const studentList = document.getElementById("student-list");
  studentList.innerHTML = ''; // Clear the existing list

  // Load the student data from the external JSON file
  fetch('students.json')
      .then(response => response.json())
      .then(data => {
          students = data;
          students.forEach((student, index) => {
              const studentCard = document.createElement("div");
              studentCard.classList.add("student");
              studentCard.innerHTML = `
                  <h2>Name: ${student.name}</h2>
                  <p>Age: ${student.age}</p>
                  <p>Major: ${student.major}</p>
                  <h3>Courses:</h3>
                  <ul>
                      ${student.courses.map((course, courseIndex) => `
                          <li>${course.courseName} (Grade: ${course.grade}) 
                          <button onclick="updateGrade(${index}, ${courseIndex})">Update Grade</button></li>`).join('')}
                  </ul>
                  <button onclick="editStudent(${index})">Edit</button>
                  <button onclick="deleteStudent(${index})">Delete</button>
              `;
              studentList.appendChild(studentCard);
          });
      })
      .catch(error => console.error('Error loading student data:', error));
}

// Function to update a student's grade
function updateGrade(studentIndex, courseIndex) {
  const newGrade = prompt("Enter the new grade:");

  if (newGrade) {
      students[studentIndex].courses[courseIndex].grade = newGrade;
      saveStudentData();
  }
}

// Function to add a new student
function addStudent() {
  const newName = prompt("Enter the name of the new student:");
  const newAge = prompt("Enter the age of the new student:");
  const newMajor = prompt("Enter the major of the new student:");

  if (newName && newAge && newMajor) {
      students.push({
          name: newName,
          age: newAge,
          major: newMajor,
          courses: []  // Initialize with an empty course array
      });
      saveStudentData();
  }
}

// Function to edit a student's information
function editStudent(index) {
  const updatedName = prompt("Enter the updated name:");
  const updatedAge = prompt("Enter the updated age:");
  const updatedMajor = prompt("Enter the updated major:");

  if (updatedName && updatedAge && updatedMajor) {
      students[index].name = updatedName;
      students[index].age = updatedAge;
      students[index].major = updatedMajor;
      saveStudentData();
  }
}

// Function to delete a student from the database
function deleteStudent(index) {
  students.splice(index, 1);
  saveStudentData();
}

// Function to save student data back to the JSON file
function saveStudentData() {
  // Save the updated student data to the external JSON file
  fetch('students.json', {
      method: 'POST',
      body: JSON.stringify(students),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(() => {
      populateStudentList(); // Refresh the student list with updated data
  })
  .catch(error => console.error('Error saving student data:', error));
}

// Call the function to populate the student list
populateStudentList();
