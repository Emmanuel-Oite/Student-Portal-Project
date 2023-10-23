// Sample JSON data for students
let students = {};

// Function to populate the student list with courses and grades
function populateStudentList() {
    const studentList = document.getElementById("student-list");
    studentList.innerHTML = ''; // Clear the existing list

    const certificationFilter = document.getElementById("certification-filter").value;
    const yearFilter = document.getElementById("year-filter").value;

    // Load the student data from the external JSON file
    fetch('students.json')
        .then(response => response.json())
        .then(data => {
            students = data;
            for (const studentId in students) {
                const student = students[studentId];

                // Apply certification and year filters
                if (
                    (certificationFilter === '' || student.certification === certificationFilter) &&
                    (yearFilter === '' || student.year === yearFilter)
                ) {
                    const studentCard = document.createElement("div");
                    studentCard.classList.add("student");
                    studentCard.innerHTML = `
                        <h2>Name: ${student.name}</h2>
                        <p>Age: ${student.age}</p>
                        <p>Major: ${student.major}</p>
                        <p>Certification: ${getCertificationName(student.certification)}</p>
                        <p>Year: ${student.year}</p>
                        <h3>Courses:</h3>
                        <ul>
                            ${student.courses.map((course, courseIndex) => `
                                <li>${course.courseName} (Grade: ${course.grade}) 
                                <button onclick="updateGrade('${studentId}', ${courseIndex})">Update Grade</button>
                                <button onclick="removeCourse('${studentId}', ${courseIndex})">Remove Course</button></li>`).join('')}
                        </ul>
                        <button onclick="editStudent('${studentId}')">Edit</button>
                        <button onclick="deleteStudent('${studentId}')">Delete</button>
                    `;
                    studentList.appendChild(studentCard);
                }
            }
        })
        .catch(error => console.error('Error loading student data:', error));
}

// Function to convert certification codes to readable names
function getCertificationName(certification) {
    switch (certification) {
        case "CLT":
            return "Certificate in Leather Technology";
        case "CFT":
            return "Certificate in Footwear Design and Technology";
        case "DLT":
            return "Diploma in Leather Technology";
        default:
            return "Unknown";
    }
}

// Function to update a student's grade
function updateGrade(studentId, courseIndex) {
    const newGrade = prompt("Enter the new grade:");

    if (newGrade) {
        students[studentId].courses[courseIndex].grade = newGrade;
        saveStudentData();
        populateStudentList();
    }
}
// Function to add a new course to a student's course list
function addCourse(studentId) {
    const newCourseName = document.getElementById("new-course-name").value;

    if (newCourseName) {
        students[studentId].courses.push({
            courseName: newCourseName,
            grade: "N/A"
        });
        saveStudentData();
        populateStudentList();
        document.getElementById("new-course-name").value = ''; // Clear the input field
    }
}

// Function to remove a course from a student's course list
function removeCourse(studentId, courseIndex) {
    students[studentId].courses.splice(courseIndex, 1);
    saveStudentData();
    populateStudentList();
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

// Function to add a new student
function addStudent() {
    const newName = prompt("Enter the name of the new student:");
    const newAge = prompt("Enter the age of the new student:");
    const newMajor = prompt("Enter the major of the new student:");

    if (newName && newAge && newMajor) {
        const uniqueId = `student_${Date.now()}`;
        students[uniqueId] = {
            name: newName,
            age: newAge,
            major: newMajor,
            courses: []
        };
        saveStudentData();
    }
}

// Function to edit a student's information
function editStudent(studentId) {
    const modal = document.getElementById('edit-student-modal');
    modal.style.display = 'block';

    // Fill the edit form with the current student data
    const nameInput = document.getElementById('edit-student-name');
    nameInput.value = students[studentId].name;

    const ageInput = document.getElementById('edit-student-age');
    ageInput.value = students[studentId].age;

    const majorInput = document.getElementById('edit-student-major');
    majorInput.value = students[studentId].major;

    // Clear and populate the course list
    const courseList = document.getElementById('edit-course-list');
    courseList.innerHTML = '';
    students[studentId].courses.forEach((course, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="text" id="course-name-${index}" value="${course.courseName}">
            <button onclick="updateCourseName('${studentId}', ${index})">Update Name</button>`;
        courseList.appendChild(listItem);
    });

    // Save the edited data on "Save" button click
    const saveButton = document.getElementById('save-edit-btn');
    saveButton.onclick = () => {
        students[studentId].name = nameInput.value;
        students[studentId].age = ageInput.value;
        students[studentId].major = majorInput.value;
        saveStudentData();
        modal.style.display = 'none';
    };

    // Close the modal on "x" click
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };
}

// Function to update a course name
function updateCourseName(studentId, courseIndex) {
    const newName = document.getElementById(`course-name-${courseIndex}`).value;
    students[studentId].courses[courseIndex].courseName = newName;
    saveStudentData();
}

// Function to delete a student from the database
function deleteStudent(studentId) {
    delete students[studentId];
    saveStudentData();
}

// Call the function to populate the student list
populateStudentList();
