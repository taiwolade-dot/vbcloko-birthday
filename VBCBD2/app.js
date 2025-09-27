// ✅ Sample celebrants list (replace later with Google Sheets / Firebase)
let celebrants = [
  {
    name: "John Doe",
    dob: "1990-09-25",
    verse: "Jeremiah 29:11",
    blessing: "May your life be filled with God’s peace and joy.",
    photo: "https://via.placeholder.com/80x80.png?text=John"
  },
  {
    name: "Mary Smith",
    dob: "1992-03-14",
    verse: "Psalm 23:1",
    blessing: "The Lord bless you and keep you always.",
    photo: "https://via.placeholder.com/80x80.png?text=Mary"
  }
];

// ✅ Populate month dropdown
function populateMonths() {
  const monthSelect = document.getElementById("monthSelect");
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  months.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = m;
    monthSelect.appendChild(opt);
  });
}

// ✅ Format celebrants into display
function formatCelebrants(list) {
  if (list.length === 0) return "No celebrants found.";
  return list.map((c, i) => 
    `✨ ${c.name} (${c.dob})
📖 ${c.verse}
🙏 ${c.blessing}
🖼️ ${c.photo ? c.photo : "No photo"}
[ Edit | Delete ]`
  ).join("\n\n");
}

// ✅ Render all celebrants
function renderAll() {
  const box = document.getElementById("allBox");
  if (celebrants.length === 0) {
    box.innerText = "No celebrants yet.";
    return;
  }

  box.innerHTML = "";
  celebrants.forEach((c, i) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <strong>${c.name}</strong> 🎂 ${c.dob}<br>
      📖 ${c.verse}<br>
      🙏 ${c.blessing}<br>
      ${c.photo ? `<img src="${c.photo}" alt="Photo" width="60">` : ""}
      <br>
      <button onclick="editCelebrant(${i})">✏️ Edit</button>
      <button onclick="deleteCelebrant(${i})">🗑️ Delete</button>
    `;
    box.appendChild(div);
  });
}

// ✅ Add / Edit celebrant
function saveCelebrant(event) {
  event.preventDefault();
  const index = document.getElementById("editIndex").value;
  const newCelebrant = {
    name: document.getElementById("name").value,
    dob: document.getElementById("dob").value,
    verse: document.getElementById("verse").value,
    blessing: document.getElementById("blessing").value,
    photo: document.getElementById("photo").value
  };

  if (index) {
    celebrants[index] = newCelebrant; // edit
  } else {
    celebrants.push(newCelebrant); // add new
  }

  document.getElementById("celebrantForm").reset();
  document.getElementById("editIndex").value = "";
  renderAll();
  checkTodaysBirthdays();
}

// ✅ Edit celebrant
function editCelebrant(i) {
  const c = celebrants[i];
  document.getElementById("editIndex").value = i;
  document.getElementById("name").value = c.name;
  document.getElementById("dob").value = c.dob;
  document.getElementById("verse").value = c.verse;
  document.getElementById("blessing").value = c.blessing;
  document.getElementById("photo").value = c.photo;
  window.scrollTo(0, document.getElementById("celebrantForm").offsetTop);
}

// ✅ Delete celebrant
function deleteCelebrant(i) {
  if (confirm("Are you sure you want to delete this celebrant?")) {
    celebrants.splice(i, 1);
    renderAll();
    checkTodaysBirthdays();
  }
}

// ✅ Show today’s celebrants
function checkTodaysBirthdays() {
  const today = new Date();
  const m = today.getMonth();
  const d = today.getDate();

  const list = celebrants.filter(c => {
    const dob = new Date(c.dob);
    return dob.getMonth() === m && dob.getDate() === d;
  });

  document.getElementById("todayBox").innerText =
    list.length > 0 ? formatCelebrants(list) : "No birthdays today 🎂";
}

// ✅ Search by month
function searchByMonth() {
  const month = parseInt(document.getElementById("monthSelect").value, 10);
  const list = celebrants.filter(c => new Date(c.dob).getMonth() === month);
  document.getElementById("monthBox").innerText = formatCelebrants(list);
}

// ✅ Init
window.onload = () => {
  populateMonths();
  renderAll();
  checkTodaysBirthdays();
};
// Replace with your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbyRnXoR-em4n9zS_jewBieeddLa7fT7JLiRQ1-HQf5U62CW9TeRpjiJujCSUXcufqaS/exec";

// ✅ Load all celebrants
async function loadAll() {
  const res = await fetch(`${API_URL}?action=getAll`);
  const json = await res.json();
  return json.data || [];
}

// ✅ Render all celebrants
async function renderAll() {
  const celebrants = await loadAll();
  const box = document.getElementById("allBox");

  if (celebrants.length === 0) {
    box.innerText = "No celebrants yet.";
    return;
  }

  box.innerHTML = "";
  celebrants.forEach((c, i) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <strong>${c.name}</strong> 🎂 ${c.dob}<br>
      📖 ${c.verse}<br>
      🙏 ${c.blessing}<br>
      ${c.photo ? `<img src="${c.photo}" width="60">` : ""}
      <br>
      <button onclick="editCelebrant(${i}, '${c.name}', '${c.dob}', '${c.verse}', '${c.blessing}', '${c.photo}')">✏️ Edit</button>
      <button onclick="deleteCelebrant(${i})">🗑️ Delete</button>
    `;
    box.appendChild(div);
  });
}

// ✅ Add or Edit celebrant
async function saveCelebrant(event) {
  event.preventDefault();
  const index = document.getElementById("editIndex").value;
  const params = new URLSearchParams({
    action: index ? "edit" : "add",
    index: index,
    name: document.getElementById("name").value,
    dob: document.getElementById("dob").value,
    verse: document.getElementById("verse").value,
    blessing: document.getElementById("blessing").value,
    photo: document.getElementById("photo").value
  });

  await fetch(`${API_URL}?${params.toString()}`);
  document.getElementById("celebrantForm").reset();
  document.getElementById("editIndex").value = "";
  renderAll();
  checkTodaysBirthdays();
}

// ✅ Edit celebrant (load into form)
function editCelebrant(i, name, dob, verse, blessing, photo) {
  document.getElementById("editIndex").value = i;
  document.getElementById("name").value = name;
  document.getElementById("dob").value = dob;
  document.getElementById("verse").value = verse;
  document.getElementById("blessing").value = blessing;
  document.getElementById("photo").value = photo;
  window.scrollTo(0, document.getElementById("celebrantForm").offsetTop);
}

// ✅ Delete celebrant
async function deleteCelebrant(i) {
  if (confirm("Are you sure you want to delete this celebrant?")) {
    await fetch(`${API_URL}?action=delete&index=${i}`);
    renderAll();
    checkTodaysBirthdays();
  }
}

// ✅ Today’s birthdays
async function checkTodaysBirthdays() {
  const res = await fetch(`${API_URL}?action=getTodays`);
  const json = await res.json();
  const list = json.data || [];
  document.getElementById("todayBox").innerText = 
    list.length > 0 ? list.map(c => `${c.name} 🎂 (${c.dob})`).join("\n") : "No birthdays today 🎂";
}

// ✅ Search by month
async function searchByMonth() {
  const month = parseInt(document.getElementById("monthSelect").value, 10);
  const all = await loadAll();
  const list = all.filter(c => new Date(c.dob).getMonth() === month);
  document.getElementById("monthBox").innerText = 
    list.length > 0 ? list.map(c => `${c.name} 🎂 (${c.dob})`).join("\n") : "No birthdays this month 🎂";
}

// ✅ Populate months
function populateMonths() {
  const monthSelect = document.getElementById("monthSelect");
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  months.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = m;
    monthSelect.appendChild(opt);
  });
}

// ✅ Init
window.onload = () => {
  populateMonths();
  renderAll();
  checkTodaysBirthdays();
};
