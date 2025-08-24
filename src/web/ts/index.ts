import * as hipb from './hibp';
import * as zxcvbn from './zxcvbn';

const checkBlock = document.getElementById('checkBlock');
const checkForm = document.getElementById('checkForm');
const passwordInput = document.getElementById('password') as HTMLInputElement;
const togglePassword = document.getElementById('togglePassword');

const resultBlock = document.getElementById('resultBlock');
const complexityMessage = document.getElementById('complexityMessage');
const hibpCheckMessage = document.getElementById('hibpCheckMessage');
const scoreMessage = document.getElementById('scoreMessage');
const timeMessage = document.getElementById('timeMessage');

const complexityMessageAlert = document.getElementById('complexityMessageAlert');
const hibpCheckMessageAlert = document.getElementById('hibpCheckMessageAlert');
const scoreMessageAlert = document.getElementById('scoreMessageAlert');
const timeMessageAlert = document.getElementById('timeMessageAlert');

const resetButton = document.getElementById('resetButton');

/** Reset Result */
function resetResult() {
    passwordInput.value = '';
    complexityMessageAlert.classList.replace('alert-success', 'alert-info');
    complexityMessageAlert.classList.replace('alert-danger', 'alert-info');
    hibpCheckMessageAlert.classList.replace('alert-success', 'alert-info');
    hibpCheckMessageAlert.classList.replace('alert-danger', 'alert-info');
    scoreMessageAlert.classList.replace('alert-success', 'alert-info');
    scoreMessageAlert.classList.replace('alert-danger', 'alert-info');
    scoreMessageAlert.classList.replace('alert-warning', 'alert-info');
    timeMessageAlert.classList.replace('alert-success', 'alert-info');
    timeMessageAlert.classList.replace('alert-danger', 'alert-info');
    timeMessageAlert.classList.replace('alert-warning', 'alert-info');
    resultBlock.classList.add('d-none');
    checkBlock.classList.remove('d-none');
    if (passwordInput.type === 'text') {
        passwordInput.type = 'password';
        togglePassword.classList.replace('bi-eye-slash', 'bi-eye');
    }
}

/** Form handler */
async function checkFormHandler(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form));
    const password = formData.password as string;

    checkBlock.classList.add('d-none');
    resultBlock.classList.remove('d-none');

    const complexityResult = zxcvbn.isComplex(password);
    complexityMessage.textContent = complexityResult.message;
    complexityMessageAlert.classList.replace('alert-info', (complexityResult.result) ? 'alert-success' : 'alert-danger');

    const hibpResult = await hipb.check(password);
    hibpCheckMessage.textContent = hibpResult.message;
    hibpCheckMessageAlert.classList.replace('alert-info', (hibpResult.match) ? 'alert-danger' : 'alert-success');

    const zxResult = zxcvbn.check(password);
    scoreMessage.textContent = zxResult.scoreMessage;
    timeMessage.textContent = zxResult.timeMessage;

    let scoreAlert = '';
    switch (zxResult.score) {
        case 0: scoreAlert = 'alert-danger'; break;
        case 1: scoreAlert = 'alert-danger'; break;
        case 2: scoreAlert = 'alert-warning'; break;
        case 3: scoreAlert = 'alert-info'; break;
        case 4: scoreAlert = 'alert-success'; break;
        default: scoreAlert = 'alert-info';
    }
    scoreMessageAlert.classList.replace('alert-info', scoreAlert);

    let timeAlert = '';
    if (zxResult.timeMessage.includes('centuries')) { timeAlert = 'alert-success'; }
    if (zxResult.timeMessage.includes('year')) { timeAlert = 'alert-info'; }
    if (zxResult.timeMessage.includes('month')) { timeAlert = 'alert-warning'; }
    if (zxResult.timeMessage.includes('day')) { timeAlert = 'alert-danger'; }
    if (zxResult.timeMessage.includes('hour')) { timeAlert = 'alert-danger'; }
    if (zxResult.timeMessage.includes('minute')) { timeAlert = 'alert-danger'; }
    if (zxResult.timeMessage.includes('second')) { timeAlert = 'alert-danger'; }
    timeMessageAlert.classList.replace('alert-info', timeAlert);
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
if (checkForm) { checkForm.addEventListener('submit', checkFormHandler); }

/** Reset Button Handler */
if (resetButton) {
    resetButton.onclick = () => {
        resetResult();
    };
}

/** Password toggle handler */
function toggleClicked() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        togglePassword.classList.replace('bi-eye-slash', 'bi-eye');
    }
}
togglePassword.addEventListener('click', toggleClicked);

/**
 * Setup page on load
 */
window.onload = function loadPage() {
    try {
        return true;
    } catch (err) {
        console.error('Error loading page:', err);
        return false;
    }
};
