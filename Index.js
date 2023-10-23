// Sample JSON data for students
let students = [];

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
// Function to add a new course to a student's course list
function addCourse(studentIndex) {
  const newCourseName = document.getElementById("new-course-name").value;

  if (newCourseName) {
      students[studentIndex].courses.push({
          courseName: newCourseName,
          grade: "N/A" // Initialize with "N/A" grade
      });
      saveStudentData();
      populateStudentList();
      document.getElementById("new-course-name").value = ''; // Clear the input field
  }
}

// Function to remove a course from a student's course list
function removeCourse(studentIndex, courseIndex) {
  students[studentIndex].courses.splice(courseIndex, 1);
  saveStudentData();
  populateStudentList();
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
    const modal = document.getElementById('edit-student-modal');
    modal.style.display = 'block';

    // Fill the edit form with the current student data
    const nameInput = document.getElementById('edit-student-name');
    nameInput.value = students[index].name;

    const ageInput = document.getElementById('edit-student-age');
    ageInput.value = students[index].age;

    const majorInput = document.getElementById('edit-student-major');
    majorInput.value = students[index].major;

    // Save the edited data on "Save" button click
    const saveButton = document.getElementById('save-edit-btn');
    saveButton.onclick = () => {
        students[index].name = nameInput.value;
        students[index].age = ageInput.value;
        students[index].major = majorInput.value;
        saveStudentData();
        modal.style.display = 'none';
    };

    // Close the modal on "x" click
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };
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
