// Insecure: Using localStorage for authentication
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Insecure: Simple flag-based authentication
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        showNotes();
    }
    else {
        alert('Invalid credentials');
    }
}
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Insecure: No password requirements or validation
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username)) {
        alert('Username already exists');
        return;
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful');
}
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showAuth();
}
function showAuth() {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('notes-container').style.display = 'none';
}
function showNotes() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('notes-container').style.display = 'block';
    renderNotes();
}
// Insecure: Using innerHTML without sanitization
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const currentUser = localStorage.getItem('currentUser');
    const userNotes = notes.filter(note => note.username === currentUser);
    // TODO: sanitize this - vulnerable to XSS
    notesList.innerHTML = userNotes.map(note => `
        <div class="note">
            <h3>${note.title}</h3>
            <div>${note.content}</div>
            <button onclick="deleteNote('${note.id}')">Delete</button>
        </div>
    `).join('');
}
function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const currentUser = localStorage.getItem('currentUser');
    // TODO: sanitize this - vulnerable to XSS
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const newNote = {
        id: Date.now().toString(),
        title,
        content,
        timestamp: Date.now(),
        username: currentUser
    };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    renderNotes();
}
function deleteNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const updatedNotes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    renderNotes();
}
// Insecure: CSV injection vulnerability
function exportAsCSV() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const currentUser = localStorage.getItem('currentUser');
    const userNotes = notes.filter(note => note.username === currentUser);
    // TODO: sanitize this - vulnerable to CSV injection
    const csvContent = userNotes.map(note => `${note.title},${note.content},${new Date(note.timestamp).toLocaleString()}`).join('\n');
    downloadFile(csvContent, 'notes.csv', 'text/csv');
}
function exportAsTXT() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const currentUser = localStorage.getItem('currentUser');
    const userNotes = notes.filter(note => note.username === currentUser);
    // TODO: sanitize this - vulnerable to XSS
    const txtContent = userNotes.map(note => `Title: ${note.title}\nContent: ${note.content}\nDate: ${new Date(note.timestamp).toLocaleString()}\n\n`).join('');
    downloadFile(txtContent, 'notes.txt', 'text/plain');
}
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
// Check login status on page load
window.onload = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showNotes();
    }
    else {
        showAuth();
    }
};
