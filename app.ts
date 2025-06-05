// Types
interface Note {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    username: string;
}

interface User {
    username: string;
    password: string; // Insecure: storing plaintext passwords
}

// Insecure: Using localStorage for authentication
function login() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    
    // Insecure: Simple flag-based authentication
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        showNotes();
    } else {
        alert('Invalid credentials');
    }
}

function register() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    
    // Insecure: No password requirements or validation
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
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
    document.getElementById('auth-container')!.style.display = 'block';
    document.getElementById('notes-container')!.style.display = 'none';
}

function showNotes() {
    document.getElementById('auth-container')!.style.display = 'none';
    document.getElementById('notes-container')!.style.display = 'block';
    renderNotes();
}

// Insecure: Using innerHTML without sanitization
function renderNotes() {
    const notesList = document.getElementById('notes-list')!;
    const notes = JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
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
    const title = (document.getElementById('note-title') as HTMLInputElement).value;
    const content = (document.getElementById('note-content') as HTMLTextAreaElement).value;
    const currentUser = localStorage.getItem('currentUser');
    
    // TODO: sanitize this - vulnerable to XSS
    const notes = JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
    const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        timestamp: Date.now(),
        username: currentUser!
    };
    
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    
    (document.getElementById('note-title') as HTMLInputElement).value = '';
    (document.getElementById('note-content') as HTMLTextAreaElement).value = '';
    renderNotes();
}

function deleteNote(id: string) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
    const updatedNotes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    renderNotes();
}

// Insecure: CSV injection vulnerability
function exportAsCSV() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
    const currentUser = localStorage.getItem('currentUser');
    const userNotes = notes.filter(note => note.username === currentUser);
    
    // TODO: sanitize this - vulnerable to CSV injection
    const csvContent = userNotes.map(note => 
        `${note.title},${note.content},${new Date(note.timestamp).toLocaleString()}`
    ).join('\n');
    
    downloadFile(csvContent, 'notes.csv', 'text/csv');
}

function exportAsTXT() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
    const currentUser = localStorage.getItem('currentUser');
    const userNotes = notes.filter(note => note.username === currentUser);
    
    // TODO: sanitize this - vulnerable to XSS
    const txtContent = userNotes.map(note => 
        `Title: ${note.title}\nContent: ${note.content}\nDate: ${new Date(note.timestamp).toLocaleString()}\n\n`
    ).join('');
    
    downloadFile(txtContent, 'notes.txt', 'text/plain');
}

function downloadFile(content: string, filename: string, type: string) {
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
    } else {
        showAuth();
    }
}; 