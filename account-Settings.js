// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {
        darkMode: false,
        fontSize: 'medium',
        animations: true
    };
    applySettings(settings);
    return settings;
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    applySettings(settings);
}

// Apply settings to the page
function applySettings(settings) {
    // Dark mode toggle
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Update toggle switches to match current settings
    document.getElementById('darkModeToggle').checked = settings.darkMode;
    document.getElementById('fontSizeSelect').value = settings.fontSize;
    document.getElementById('animationsToggle').checked = settings.animations;

    // Apply font size
    document.body.className = document.body.className.replace(/\bfont-size-\S+/g, '');
    document.body.classList.add(`font-size-${settings.fontSize}`);

    // Apply animations setting
    if (settings.animations) {
        document.body.classList.remove('no-animations');
    } else {
        document.body.classList.add('no-animations');
    }
}

// Initialize settings on page load
let currentSettings = loadSettings();

// Event Listeners
document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    currentSettings.darkMode = e.target.checked;
    saveSettings(currentSettings);
});

document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
    currentSettings.fontSize = e.target.value;
    saveSettings(currentSettings);
});

document.getElementById('animationsToggle').addEventListener('change', (e) => {
    currentSettings.animations = e.target.checked;
    saveSettings(currentSettings);
});

// Save button handler
document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    saveSettings(currentSettings);
    showNotification('Settings saved successfully!');
});

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Reset settings
document.getElementById('resetSettingsBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        currentSettings = {
            darkMode: false,
            fontSize: 'medium',
            animations: true
        };
        saveSettings(currentSettings);
        showNotification('Settings reset to default!');
    }
});

// Check login status
function checkLogin() {
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
    }
}

// Initialize
checkLogin();
loadSettings();

//Must make this work across all pages or else