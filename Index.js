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

// Function to open the modal for adding or editing a student
function openStudentModal(studentId) {
    const modal = document.getElementById("edit-student-modal");
    modal.style.display = "block";

    // Get student data for editing
    const student = students[studentId];
    const studentNameInput = document.getElementById("edit-student-name");
    const studentAgeInput = document.getElementById("edit-student-age");
    const studentMajorInput = document.getElementById("edit-student-major");

    // Populate the modal with the student's current data
    studentNameInput.value = student.name;
    studentAgeInput.value = student.age;
    studentMajorInput.value = student.major;

    // Remove any existing course inputs
    const courseList = document.getElementById("edit-course-list");
    courseList.innerHTML = '';

    // Populate the modal with course inputs
    student.courses.forEach(course => {
        const courseInput = document.createElement("input");
        courseInput.type = "text";
        courseInput.value = course.courseName;
        courseList.appendChild(courseInput);
    });
    
    // ... Rest of the function for opening the modal ...
}

// Function to add a new course when editing or adding a student
function addNewCourse() {
    const courseList = document.getElementById("edit-course-list");
    const newCourseInput = document.createElement("input");
    newCourseInput.type = "text";
    newCourseInput.placeholder = "Course Name";
    courseList.appendChild(newCourseInput);
}

// Function to add a new student
function addStudent() {
    const studentId = prompt("Enter a unique Student ID:");
    if (studentId && !students.hasOwnProperty(studentId)) {
        const newStudent = {
            name: "",
            age: "",
            major: "",
            certification: "",
            year: "",
            courses: [] // Empty courses array for a new student
        };
        students[studentId] = newStudent;
        saveStudentData();
        populateStudentList();
    }
}

// Add an event listener to the "Add Student" button
document.getElementById("add-student-btn").addEventListener("click", addStudent);

// ... Rest of the JavaScript ...

// Initial population of the student list
populateStudentList();
