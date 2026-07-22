function toggleAuth(targetMode) {
    const isSignin = (targetMode === 'signin');
    const signinView = document.getElementById('signin-form');
    const signupView = document.getElementById('signup-form');
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');

    displayMessage("", "");

    signinView.style.display = isSignin ? 'block' : 'none';
    signupView.style.display = isSignin ? 'none' : 'block';

    signinTab.classList.toggle('active', isSignin);
    signupTab.classList.toggle('active', !isSignin);
}

function displayMessage(text, color) {
    const message = document.getElementById('message');
    if (message) {
        message.style.color = color;
        message.innerText = text;
    }
}

function signupUser() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const againPassword = document.getElementById('signUpAgainPassword').value;
    const signupForm = document.getElementById('signupForm');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!strongPassword(password)) {
        displayMessage("הסיסמה צריכה לכלול לפחות שמונה תווים, ולכלול אות גדולה, קטנה, מספר, ותו.", "#f87171");
        return;
    }
    if (password != againPassword) {
        displayMessage("הסיסמה אינה תואמת, נסה שנית.", "#f87171");
        return;
    }
    if (isAppeareUser(users, email)) {
        displayMessage("שגיאה בתהליך הרישום. נסה שנית.", "#f87171");
        signupForm.reset();
        return;
    }
    users.push({ name: name, email: email, password: password, CleverKnightWins: 0 });
    localStorage.setItem('users', JSON.stringify(users));

    displayMessage(`נרשמת בהצלחה, ${name}! מעביר אותך להתחברות...`, "#4ade80");
    setTimeout(() => {
        signupForm.reset();
        toggleAuth('signin');
    }, 2500);
}

function isAppeareUser(users, email) {
    return users.find(u => u.email === email);
}

function signinUser() {
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    const signinForm = document.getElementById('signinForm');
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        displayMessage("אחד מפרטי הזיהוי אינו נכון.", "#f87171");
        signinForm.reset();
        return;
    }

    if (!sessionStorage.getItem('player1')) {
        sessionStorage.setItem('player1', JSON.stringify(user));
        displayMessage(`ברוך הבא, ${user.name}! שחקן 1 מחובר. שחקן 2, תורך...`, "#549b52");
        signinForm.reset();

        setTimeout(() => {
            if (!sessionStorage.getItem('player2')) {
                displayMessage("עברו 20 דקות ללא שחקן שני. המערכת מתאפסת.", "#FFFF00");
                sessionStorage.clear();
                window.location.href = "../home.html";
            }
        }, 1200000);
    } else {
        const p1 = JSON.parse(sessionStorage.getItem('player1'));
        if (p1.email === email) {
            displayMessage("משתמש זה כבר מחובר כשחקן 1!", "#f87171");
            signinForm.reset();
            return;
        }

        sessionStorage.setItem('player2', JSON.stringify(user));
        displayMessage(`ברוך הבא, ${user.name}! שני השחקנים מחוברים. ממשיכים למשחק!`, "#539b52");
        setTimeout(() => {
            sessionStorage.setItem("ALLOW_GAME", "true");
            window.location.replace("CleverKnightInstructions.html");
        }, 2500);

    }
}

function strongPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
}

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        signupUser();
    });
}

const signinForm = document.getElementById('signinForm');
if (signinForm) {
    signinForm.addEventListener('submit', (event) => {
        event.preventDefault();
        signinUser();
    });
}