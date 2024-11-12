function generateHashes() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const token = document.getElementById('token').value;

    if (!username || !password || !token) {
        alert('Please fill in all fields');
        return;
    }

    const usernameHash = CryptoJS.SHA256(username).toString();
    const passwordHash = CryptoJS.SHA256(password).toString();
    const tokenHash = CryptoJS.MD5(token).toString();

    document.getElementById('usernameHash').textContent = usernameHash;
    document.getElementById('passwordHash').textContent = passwordHash;
    document.getElementById('tokenHash').textContent = tokenHash;
    document.getElementById('output').style.display = 'block';
}

function copyToClipboard(elementId) {
    const hashText = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(hashText);
    
    const noticeId = elementId + 'CopyNotice';
    const notice = document.getElementById(noticeId);
    notice.style.display = 'block';
    setTimeout(() => {
        notice.style.display = 'none';
    }, 2000);
}