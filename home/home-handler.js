

// Navigation Buttons
const navButtons = document.querySelectorAll('.nav-btn');
const addAccountSection = document.getElementById('addAccountSection');
const manageAccountsSection = document.getElementById('manageAccountsSection');
const banOptionsSection = document.getElementById('banOptionsSection');
const unbanAccountsSection = document.getElementById('unbanAccountsSection');

// Action Buttons
const addAccountBtn = document.getElementById('addAccountBtn');
const manageAccountsBtn = document.getElementById('manageAccountsBtn');
const accountButtons = document.getElementById('accountButtons');
const cubecraftBtn = document.getElementById('cubecraftBtn');
const hiveBtn = document.getElementById('hiveBtn');
const lifeboatBtn = document.getElementById('lifeboatBtn');
const customBanBtn = document.getElementById('customBanBtn');
const banStatusEl = document.getElementById('banStatus');
const newAccountName = document.getElementById('newAccountName');

// Account Selection Elements
const accountSelect = document.getElementById('accountSelect');
const selectedAccountDisplay = document.getElementById('selectedAccountDisplay');
const serverSelect = document.getElementById('serverSelect');
const unbanList = document.getElementById('unbanList');

// Modal Elements
const customBanModal = document.getElementById('customBanModal');
const closeModal = document.getElementById('closeModal');
const customBanName = document.getElementById('customBanName');
const customBanDuration = document.getElementById('customBanDuration');
const startCustomBanBtn = document.getElementById('startCustomBanBtn');

const accountManagerSection = document.getElementById('accountManagerSection');
const addCredentialBtn = document.getElementById('addCredentialBtn');
const savedCredentials = document.getElementById('savedCredentials');
const credentialModal = document.getElementById('credentialModal');
const closeCredentialModal = document.getElementById('closeCredentialModal');
const updateCredentialBtn = document.getElementById('updateCredentialBtn');

// Ban Durations (in milliseconds)
const cubecraftBanDuration = 30 * 24 * 60 * 60 * 1000;
const hiveBanDuration = 7 * 24 * 60 * 60 * 1000;
const lifeboatBanDuration = 30 * 24 * 60 * 60 * 1000;



// Data Storage
let accounts = {};
let selectedAccount = null;

// Add to your existing data storage
let credentials = {};

// Load accounts from localStorage
function loadAccounts() {
    try {
        const savedAccounts = localStorage.getItem('accounts');
        accounts = savedAccounts ? JSON.parse(savedAccounts) : {};
    } catch (e) {
        console.error('Error loading accounts:', e);
        accounts = {};
    }
}

// Load credentials from localStorage
function loadCredentials() {
    try {
        const savedCredentials = localStorage.getItem('credentials');
        credentials = savedCredentials ? JSON.parse(savedCredentials) : {};
    } catch (e) {
        console.error('Error loading credentials:', e);
        credentials = {};
    }
}

// Save credentials to localStorage
function saveCredentials() {
    try {
        localStorage.setItem('credentials', JSON.stringify(credentials));
    } catch (e) {
        alert('Unable to save credentials. Local storage might be full or disabled.');
        console.error('Error saving credentials:', e);
    }
}

// Save Accounts to localStorage
function saveAccounts() {
    try {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    } catch (e) {
        alert('Unable to save accounts. Local storage might be full or disabled.');
        console.error('Error saving accounts:', e);
    }
}

// Render saved credentials
function renderCredentials() {
    savedCredentials.innerHTML = '';
    
    if (Object.keys(credentials).length === 0) {
        savedCredentials.innerHTML = '<p>No saved credentials. Add some above.</p>';
        return;
    }

    Object.keys(credentials).sort().forEach(service => {
        const credentialCard = document.createElement('div');
        credentialCard.className = 'credential-card';
        
        const credential = credentials[service];
        credentialCard.innerHTML = `
            <h3>${service}</h3>
            <p><strong>Username:</strong> ${credential.username}</p>
            <p><strong>Password:</strong> ${'•'.repeat(8)}</p>
            ${credential.notes ? `<p><strong>Notes:</strong> ${credential.notes}</p>` : ''}
            <div class="credential-actions">
                <button class="action-btn view-btn" data-service="${service}">View</button>
                <button class="action-btn edit-btn" data-service="${service}">Edit</button>
                <button class="action-btn delete-btn" data-service="${service}">Delete</button>
            </div>
        `;

        savedCredentials.appendChild(credentialCard);
    });

    // Add event listeners for credential actions
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            const credential = credentials[service];
            alert(`Service: ${service}\nUsername: ${credential.username}\nPassword: ${credential.password}\nNotes: ${credential.notes || 'None'}`);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            const credential = credentials[service];
            
            document.getElementById('editServiceName').value = service;
            document.getElementById('editUsername').value = credential.username;
            document.getElementById('editPassword').value = credential.password;
            document.getElementById('editNotes').value = credential.notes || '';
            
            credentialModal.style.display = 'flex';
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            if (confirm(`Are you sure you want to delete credentials for "${service}"?`)) {
                delete credentials[service];
                saveCredentials();
                renderCredentials();
            }
        });
    });
}

// Add new credentials
addCredentialBtn.addEventListener('click', () => {
    const service = document.getElementById('serviceName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!service || !username || !password) {
        alert('Please fill in all required fields (service, username, and password).');
        return;
    }

    credentials[service] = { username, password, notes };
    saveCredentials();
    renderCredentials();

    // Clear inputs
    document.getElementById('serviceName').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('notes').value = '';
});

// Update credentials
updateCredentialBtn.addEventListener('click', () => {
    const service = document.getElementById('editServiceName').value.trim();
    const username = document.getElementById('editUsername').value.trim();
    const password = document.getElementById('editPassword').value.trim();
    const notes = document.getElementById('editNotes').value.trim();

    if (!service || !username || !password) {
        alert('Please fill in all required fields.');
        return;
    }

    credentials[service] = { username, password, notes };
    saveCredentials();
    renderCredentials();
    credentialModal.style.display = 'none';
});

// Close credential modal
closeCredentialModal.addEventListener('click', () => {
    credentialModal.style.display = 'none';
});




// Save selected account
function saveSelectedAccount() {
    try {
        localStorage.setItem('selectedAccount', selectedAccount || '');
    } catch (e) {
        console.error('Error saving selected account:', e);
    }
}

// Load selected account
function loadSelectedAccount() {
    try {
        selectedAccount = localStorage.getItem('selectedAccount');
        if (selectedAccount === 'null' || selectedAccount === 'undefined') {
            selectedAccount = null;
        }
        if (selectedAccount) {
            updateBanStatus();
            highlightSelectedAccount();
            updateSelectedAccountDisplay();
        }
    } catch (e) {
        console.error('Error loading selected account:', e);
        selectedAccount = null;
    }
}

// Update account dropdown
function updateAccountDropdown() {
    accountSelect.innerHTML = '<option value="">Select an account</option>';
    Object.keys(accounts).sort().forEach(accountName => {
        const option = document.createElement('option');
        option.value = accountName;
        option.textContent = accountName;
        if (accountName === selectedAccount) {
            option.selected = true;
        }
        accountSelect.appendChild(option);
    });
}

// Update selected account display
function updateSelectedAccountDisplay() {
    selectedAccountDisplay.textContent = selectedAccount || 'None';
}

// Calculate Remaining Time
function calculateRemainingTime(endTime) {
    const now = Date.now();
    const remaining = endTime - now;
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
}

// Update Ban Status Display
function updateBanStatus() {
    if (selectedAccount && accounts[selectedAccount]) {
        const accountBans = accounts[selectedAccount];
        const banStatuses = Object.entries(accountBans)
            .filter(([_, endTime]) => endTime > Date.now() || endTime === 0)
            .map(([ban, endTime]) => {
                const status = endTime ? calculateRemainingTime(endTime) : `No ${ban}`;
                return `${ban}: ${status}`;
            });
        
        banStatusEl.textContent = banStatuses.length > 0 
            ? banStatuses.join(" | ")
            : 'No active bans';
    } else {
        banStatusEl.textContent = 'Select an account to view ban status.';
    }
}

// Get unbanned accounts for server
function getUnbannedAccounts(server) {
    return Object.keys(accounts).filter(account => {
        const banKey = `${server} Ban`;
        return !accounts[account][banKey] || accounts[account][banKey] < Date.now();
    });
}

// Update unban list
function updateUnbanList() {
    const server = serverSelect.value;
    if (!server) {
        unbanList.textContent = 'Select a server to view unbanned accounts.';
        return;
    }

    const unbannedAccounts = getUnbannedAccounts(server);
    if (unbannedAccounts.length === 0) {
        unbanList.textContent = `No unbanned accounts for ${server}.`;
        return;
    }

    unbanList.innerHTML = unbannedAccounts
        .map(account => `<div class="unban-account">${account}</div>`)
        .join('');
}

// Render Account Buttons
function renderAccountButtons() {
    accountButtons.innerHTML = '';
    if (Object.keys(accounts).length === 0) {
        accountButtons.innerHTML = '<p>No accounts available. Please add an account.</p>';
        return;
    }
    
    Object.keys(accounts).sort().forEach(accountName => {
        const button = document.createElement('button');
        button.className = 'account-btn';
        button.textContent = accountName;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove Account';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteAccount(accountName);
        });

        button.appendChild(removeBtn);
        button.addEventListener('click', () => {
            selectedAccount = accountName;
            saveSelectedAccount();
            updateBanStatus();
            highlightSelectedAccount();
            updateSelectedAccountDisplay();
            accountSelect.value = accountName;
        });

        accountButtons.appendChild(button);
    });
    
    highlightSelectedAccount();
}

// Highlight Selected Account
function highlightSelectedAccount() {
    const buttons = document.querySelectorAll('.account-btn');
    buttons.forEach(btn => {
        if (btn.textContent.replace('×', '').trim() === selectedAccount) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Add New Account
addAccountBtn.addEventListener('click', () => {
    const accountName = newAccountName.value.trim();
    if (accountName === '') {
        alert('Account name cannot be empty.');
        return;
    }
    if (accounts[accountName]) {
        alert('Account already exists.');
        return;
    }
    accounts[accountName] = {};
    saveAccounts();
    renderAccountButtons();
    updateAccountDropdown();
    newAccountName.value = '';
    updateUnbanList();
});

// Add account on Enter key
newAccountName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addAccountBtn.click();
    }
});

// Delete Account
function deleteAccount(accountName) {
    if (confirm(`Are you sure you want to delete the account "${accountName}"?`)) {
        delete accounts[accountName];
        saveAccounts();
        if (selectedAccount === accountName) {
            selectedAccount = null;
            saveSelectedAccount();
        }
        renderAccountButtons();
        updateAccountDropdown();
        updateSelectedAccountDisplay();
        updateBanStatus();
        updateUnbanList();
    }
}

// Apply Ban
function applyBan(banType, duration) {
    if (!selectedAccount) {
        alert('Please select an account first.');
        return;
    }
    const endTime = Date.now() + duration;
    accounts[selectedAccount][banType] = endTime;
    saveAccounts();
    updateBanStatus();
    updateUnbanList();
}

// Clean expired bans
function cleanExpiredBans() {
    let changed = false;
    Object.keys(accounts).forEach(account => {
        Object.entries(accounts[account]).forEach(([ban, endTime]) => {
            if (endTime && endTime < Date.now()) {
                delete accounts[account][ban];
                changed = true;
            }
        });
    });
    if (changed) {
        saveAccounts();
        updateBanStatus();
        updateUnbanList();
    }
}

// Account dropdown change handler
accountSelect.addEventListener('change', (e) => {
    selectedAccount = e.target.value;
    saveSelectedAccount();
    updateBanStatus();
    highlightSelectedAccount();
    updateSelectedAccountDisplay();
});

// Server select change handler
serverSelect.addEventListener('change', updateUnbanList);

// Event Listeners for Ban Buttons
cubecraftBtn.addEventListener('click', () => applyBan('Cubecraft Ban', cubecraftBanDuration));
hiveBtn.addEventListener('click', () => applyBan('Hive Ban', hiveBanDuration));
lifeboatBtn.addEventListener('click', () => applyBan('Lifeboat Ban', lifeboatBanDuration));
customBanBtn.addEventListener('click', () => {
    if (!selectedAccount) {
        alert('Please select an account first.');
        return;
    }
    customBanModal.style.display = 'flex';
    customBanName.focus();
});

// Close Modal
closeModal.addEventListener('click', () => {
    customBanModal.style.display = 'none';
    customBanName.value = '';
    customBanDuration.value = '';
});

// Start Custom Ban
startCustomBanBtn.addEventListener('click', () => {
    const banName = customBanName.value.trim();
    const durationDays = parseInt(customBanDuration.value);

    if (banName === '') {
        alert('Please enter a ban name.');
        return;
    }
    if (isNaN(durationDays) || durationDays <= 0 || durationDays > 365) {
        alert('Please enter a valid duration between 1 and 365 days.');
        return;
    }

    const durationMs = durationDays * 24 * 60 * 60 * 1000;
    applyBan(banName, durationMs);

    customBanName.value = '';
    customBanDuration.value = '';
    customBanModal.style.display = 'none';
});

// Navigation Button Functionality
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.content-section').forEach(section => 
            section.classList.add('hidden')
        );

        const target = btn.getAttribute('data-target');
        switch (target) {
            case 'addAccount':
                addAccountSection.classList.remove('hidden');
                break;
            case 'manageAccounts':
                manageAccountsSection.classList.remove('hidden');
                break;
            case 'banOptions':
                banOptionsSection.classList.remove('hidden');
                break;
            case 'unbanAccounts':
                unbanAccountsSection.classList.remove('hidden');
                updateUnbanList();
                break;
            case 'accountManager':
                accountManagerSection.classList.remove('hidden');
                renderCredentials();
                break;
            default:
                console.error(`Unknown target: ${target}`);
        }
    });
});



// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === customBanModal) {
        customBanModal.style.display = 'none';
        customBanName.value = '';
        customBanDuration.value = '';
    }
});

// Submit custom ban on Enter key
customBanDuration.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startCustomBanBtn.click();
    }
});

// Check login status immediately and on page load
function checkLogin() {
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = '/login/login.html';
    }
}

function toggleDropdown() {
    document.getElementById('accountDropdown').classList.toggle('show');
}

function signOut() {
    sessionStorage.removeItem('loggedIn');
    window.location.href = '/login/login.html';
}

// Close dropdown when clicking outside
window.onclick = function(e) {
    if (!e.target.matches('.account-btn')) {
        var dropdown = document.getElementById('accountDropdown');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}

// Check login on page load
checkLogin();

// Initialize
loadAccounts();
renderAccountButtons();
loadSelectedAccount();
updateAccountDropdown();
updateBanStatus();
updateUnbanList();
cleanExpiredBans();
loadCredentials();

// Set up periodic updates
setInterval(updateBanStatus, 1000);
setInterval(cleanExpiredBans, 60000);
setInterval(updateUnbanList, 1000);