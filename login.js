(function() {
    const validCredentials = [
        {
            //mm
            username: '03f85b1b2fa92f565476f39436ad6a8e2c891e9fef041265a79dabc39013e8c8',
            password: 'af6c38ed1bcc3fb4cf6b111d73d9bdfc8a19a68b85c793b5f1545a3e1b18e1f2',
            token: '0582ff3da09fbdd60e8ee6f51eb90f45'
        },
        {
            //round
            username: '10dd2c536b6300f0ee1498908ce1441607c19bcd63c3587d10d4fe0f3245727c',
            password: 'f9ad1b89e952860bbbaabe5493c82aca3ba103e32dbcb06a47de5395a70412f0',
            token: 'e10b8cb6e733a469e74653bdfbf581a8'
        },
        {   
            //pzcax
            username: 'df82e5741ef9607067de5839133701301c50402ef261a140e2dde0983dc12a2c',
            password: 'a5ff9441267be420773352909edf74b0913e4323a41c96fef1b38e23627a1317',
            token: 'e10b8cb6e733a469e74653bdfbf581a8'
        },
    ];

    window.handleLogin = function(event) {
        event.preventDefault();
        
        const inputFields = document.querySelectorAll('.input-field');
        const errorMessage = document.getElementById('errorMessage');

        // Hash the input values
        const hashedUsername = CryptoJS.SHA256(document.getElementById('username').value).toString();
        const hashedPassword = CryptoJS.SHA256(document.getElementById('password').value).toString();
        const hashedToken = CryptoJS.MD5(document.getElementById('token').value).toString();

        // Check against all valid credentials
        const isValidCredentials = validCredentials.some(cred => 
            cred.username === hashedUsername && 
            cred.password === hashedPassword && 
            cred.token === hashedToken
        );

        if (isValidCredentials) {
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = "home.html";
        } else {
            errorMessage.style.display = 'block';
            
            inputFields.forEach(field => {
                field.classList.add('shake');
                setTimeout(() => field.classList.remove('shake'), 400);
            });

            document.getElementById('password').value = '';
            document.getElementById('token').value = '';
        }
    };

    // Hide error message when user starts typing
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            document.getElementById('errorMessage').style.display = 'none';
        });
    });
})();