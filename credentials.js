// Data & DOM Elements
let credentials = {};
const savedCredentials = document.getElementById('savedCredentials');
const credentialModal = document.getElementById('credentialModal');
const addCredentialBtn = document.getElementById('addCredentialBtn');
const updateCredentialBtn = document.getElementById('updateCredentialBtn');
const closeCredentialModal = document.getElementById('closeCredentialModal');

// Load/Save to localStorage
const loadCredentials = () => {
    try {
        credentials = JSON.parse(localStorage.getItem('credentials')) || {};
    } catch (e) {
        console.error('Error loading credentials:', e);
        credentials = {};
    }
};

const saveCredentials = () => {
    try {
        localStorage.setItem('credentials', JSON.stringify(credentials));
    } catch (e) {
        alert('Unable to save credentials. Storage might be full/disabled.');
        console.error('Error saving credentials:', e);
    }
};

// Render credentials list
const renderCredentials = () => {
    if (!Object.keys(credentials).length) {
        savedCredentials.innerHTML = '<p>No saved credentials. Add some above.</p>';
        return;
    }

    savedCredentials.innerHTML = Object.keys(credentials).sort().map(service => `
        <div class="credential-card">
            <h3>${service}</h3>
            <p><strong>Username:</strong> ${credentials[service].username}</p>
            <p><strong>Password:</strong> ${'•'.repeat(8)}</p>
            ${credentials[service].notes ? `<p><strong>Notes:</strong> ${credentials[service].notes}</p>` : ''}
            <div class="credential-actions">
                <button class="action-btn view-btn" data-service="${service}">View</button>
                <button class="action-btn edit-btn" data-service="${service}">Edit</button>
                <button class="action-btn delete-btn" data-service="${service}">Delete</button>
            </div>
        </div>
    `).join('');

    // Event listeners for credential actions
    ['view', 'edit', 'delete'].forEach(action => {
        document.querySelectorAll(`.${action}-btn`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const service = e.target.dataset.service;
                const cred = credentials[service];

                if (action === 'view') {
                    alert(`Service: ${service}\nUsername: ${cred.username}\nPassword: ${cred.password}\nNotes: ${cred.notes || 'None'}`);
                } else if (action === 'edit') {
                    ['ServiceName', 'Username', 'Password', 'Notes'].forEach(field => {
                        document.getElementById(`edit${field}`).value = field === 'Notes' ? (cred.notes || '') : 
                            field === 'ServiceName' ? service : cred[field.toLowerCase()];
                    });
                    credentialModal.style.display = 'flex';
                } else if (action === 'delete' && confirm(`Delete credentials for "${service}"?`)) {
                    delete credentials[service];
                    saveCredentials();
                    renderCredentials();
                }
            });
        });
    });
};

// Event Handlers
addCredentialBtn.addEventListener('click', () => {
    const fields = ['serviceName', 'username', 'password', 'notes'].map(id => ({
        id,
        value: document.getElementById(id).value.trim()
    }));

    if (!fields[0].value || !fields[1].value || !fields[2].value) {
        alert('Please fill required fields (service, username, password).');
        return;
    }

    credentials[fields[0].value] = {
        username: fields[1].value,
        password: fields[2].value,
        notes: fields[3].value
    };

    saveCredentials();
    renderCredentials();
    fields.forEach(field => document.getElementById(field.id).value = '');
});

updateCredentialBtn.addEventListener('click', () => {
    const fields = ['ServiceName', 'Username', 'Password', 'Notes'].map(field => ({
        field,
        value: document.getElementById(`edit${field}`).value.trim()
    }));

    if (!fields[0].value || !fields[1].value || !fields[2].value) {
        alert('Please fill all required fields.');
        return;
    }

    credentials[fields[0].value] = {
        username: fields[1].value,
        password: fields[2].value,
        notes: fields[3].value
    };

    saveCredentials();
    renderCredentials();
    credentialModal.style.display = 'none';
});

closeCredentialModal.addEventListener('click', () => credentialModal.style.display = 'none');

// Initialize
loadCredentials();

export { renderCredentials, loadCredentials };