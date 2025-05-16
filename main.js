let events = JSON.parse(localStorage.getItem('events') || '[]');

function save() {
  localStorage.setItem('events', JSON.stringify(events));
}

function sortEvents() {
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function notify(event) {
  if (Notification.permission === "granted") {
    new Notification(`⏰ ${event.icon || ''} "${event.name}" is coming soon!`);
  }
}

function renderEvents() {
  sortEvents();
  const now = new Date();
  document.getElementById('events').innerHTML = events.map((e, i) => {
    const diff = new Date(e.date) - now;
    if (!e.completed && diff < 8.64e7 && !e.notified && diff > 0) { // less than 24h
      notify(e);
      e.notified = true;
      save();
    }
    if (!e.completed && diff < 0) e.completed = true;
    const d = Math.floor(diff / 8.64e7), h = Math.floor(diff / 3.6e6) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    return `<div class="event${e.completed ? ' completed' : ''}">
      <span style="font-size:2em">${e.icon || '⏳'}</span>
      <span>
        <b>${e.name}</b><br>
        ${e.completed ? "Completed!" : `${d}d ${h}h ${m}m ${s}s`}
        <br><small>${e.date.replace('T', ' ')}</small>
      </span>
      <span class="actions">
        <button onclick="toggleDone(${i})">${e.completed ? 'Undo' : 'Done'}</button>
        <button onclick="delEvent(${i})">Delete</button>
      </span>
    </div>`;
  }).join('');
}
function addEvent() {
  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const icon = document.getElementById('icon').value.trim();
  if (!name || !date) return alert('Fill all fields!');
  events.push({ name, date, icon, completed: false, notified: false });
  save(); renderEvents();
}
function delEvent(i) {
  events.splice(i, 1); save(); renderEvents();
}
function toggleDone(i) {
  events[i].completed = !events[i].completed; save(); renderEvents();
}
function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : '');
}
setInterval(renderEvents, 1000);
window.onload = () => {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
  if (Notification && Notification.permission !== "granted") Notification.requestPermission();
  renderEvents();
};
