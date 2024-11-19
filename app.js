const form = document.getElementById("student-form");
const studentsList = document.getElementById("students-list");
const searchInput = document.getElementById("search-input");

let students = JSON.parse(localStorage.getItem("students")) || [];

// Bugungi sana
function getCurrentDate() {
    return new Date().toISOString().split("T")[0];
}

// 1 oy qo'shish
function addOneMonth(date) {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate.toISOString().split("T")[0];
}

// Render talaba ro'yxati
function renderStudents(filter = "") {
    studentsList.innerHTML = "";

    students.forEach((student, index) => {
        if (
            !student.name.toLowerCase().includes(filter.toLowerCase()) &&
            !student.surname.toLowerCase().includes(filter.toLowerCase()) &&
            !student.phone.includes(filter)
        ) {
            return;
        }

        const today = getCurrentDate();
        const isLate = new Date(student.nextPaymentDate) < new Date(today);

        const studentDiv = document.createElement("div");
        studentDiv.innerHTML = `
            <strong>${student.name} ${student.surname}</strong> (${student.phone})
            <br /> Kurs: ${student.course} | Ustoz: ${student.teacher}
            <br /> To'lov summasi: ${student.paymentAmount} so'm
            <br /> Keyingi to'lov muddati: 
            <span class="${isLate ? "alert" : ""}">${student.nextPaymentDate}</span>
            <br />
            <button onclick="deleteStudent(${index})">O'chirish</button>
        `;

        studentsList.appendChild(studentDiv);
    });
}

// Ma'lumotlarni saqlash
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Talaba qo'shish
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("student-name").value;
    const surname = document.getElementById("student-surname").value;
    const phone = document.getElementById("student-phone").value;
    const course = document.getElementById("student-course").value;
    const teacher = document.getElementById("student-teacher").value;
    const paymentAmount = document.getElementById("payment-amount").value;

    const today = getCurrentDate();
    const nextPaymentDate = addOneMonth(today);

    students.push({ name, surname, phone, course, teacher, paymentAmount, nextPaymentDate });

    saveStudents();
    renderStudents();
    form.reset();
});

// Talabani o'chirish
function deleteStudent(index) {
    students.splice(index, 1);
    saveStudents();
    renderStudents();
}

// Qidiruv funksiyasi
searchInput.addEventListener("input", () => {
    renderStudents(searchInput.value);
});

// Boshlang'ich render
renderStudents();
