
<template>
  <div class="container h-100 d-flex flex-column justify-content-center align-items-center py-5">
    <div class="row w-100 g-lg-5 py-5 mt-2 justify-content-center">
      <div class="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
        <h1 class="display-4 fw-bold lh-1 mb-3">Will I be Pwned?</h1>
        <p class="col-lg-10 fs-4">Enter your password here to check how likely it is to get you Pwned</p>
      </div>
      <div class="col-md-10 mx-auto col-lg-5">
        <form @submit.prevent="checkPassword" class="p-4 border rounded-3 bg-light text-dark mb-4">
          <div class="input-group mb-3">
            <input type="password" class="form-control" v-model="password" placeholder="Enter a password" required />
            <span class="input-group-text" @click="togglePassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </span>
          </div>
          <button class="w-100 btn btn-lg btn-primary" type="submit">Check</button>
        </form>
        <div v-if="showResults" class="mb-4">
          <div class="alert" :class="complexityAlert" role="alert">
            <strong>Complexity Check: </strong>{{ complexityMessage }}
          </div>
          <div class="alert" :class="hibpAlert" role="alert">
            <strong>Well-known Password Check: </strong>{{ hibpMessage }}
          </div>
          <div class="alert" :class="scoreAlert" role="alert">
            <strong>Guessability Rating: </strong>{{ scoreMessage }}
          </div>
          <div class="alert" :class="timeAlert" role="alert">
            <strong>Brute Force Time Estimate: </strong>{{ timeMessage }}
          </div>
          <button class="btn btn-primary btn-lg mt-2" @click="resetForm">Check Another</button>
        </div>
      </div>
    </div>
    <div class="container mt-5">
      <hr class="mb-4" />
      <div class="row">
        <div class="col-12">
          <h2 class="section-heading">What does it all mean?</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p class="lead">Complexity Check</p>
          <p>This is the standard complexity check applied by many websites and other password policies. It is <strong>not</strong> actually an indicator of password strength, and is provided here for illustration only. You will notice if you try a few passwords that is easy to create one that will pass the complexity check but fail all of the more relevant password strength checks.</p>
          <p>The specific settings used here are minimum 8 characters, at least one uppercase, one lowercase, one number and one symbol.</p>
          <p class="lead">Well-Known Password Check</p>
          <p>This check uses the Have I Been Pwned (HIBP) database to check if the password has appeared in a hack or breach. HIBP tracks and stores the data from password dumps found on the internet and dark web. If your password is found here you can be sure that a brute force attack will crack it quickly. The score indicates how many times it appears in the hacked password lists, which gives you some indication of how many other people used it as their own.</p>
          <p>Note the HIBP API uses a clever technique that means we do not send your password itself for checking - we are only sending a partial hash of the password and your secret stays safe right here.</p>
          <p>You can find more information and check if your own personal data is included in the HIBP database <a class="link-secondary" href="https://haveibeenpwned.com/" target="_blank">here</a>.</p>
        </div>
        <div class="col-md-6">
          <p class="lead">Guessability Rating</p>
          <p>This check gives you some indication of the actual complexity of your password. It uses an algorithm and lists of common words and phrases, as well as common combinations of characters and symbols used in passwords.</p>
          <p>The check uses the zxcvbn tool, originally created by the Dropbox team and then shared with the world as an Open Source project. For the technically minded you can find more information <a class="link-secondary" href="https://dropbox.tech/security/zxcvbn-realistic-password-strength-estimation" target="_blank">here</a>.</p>
          <p class="lead">Brute Force Time Estimate</p>
          <p>This check uses the same zxcvbn tool and provides you with some estimate of how long it might take to crack your password using commonly available brute-force cracking tools. You will notice if you try a few passwords that extending the length is far more important than trying to add complexity.</p>
          <p>The time to crack stolen passwords is also dependent on how they are stored. If they are stored in plaintext there is no need to crack at all. If they are stored using old school hashing techniques brute-force cracking is relatively simple, and if they are stored using more secure hashing and salting then brute-force cracking is significantly more difficult. A useful explanation is provided <a class="link-secondary" href="https://medium.com/@markilott/password-storage-basics-2aa9e1586f98" target="_blank">here</a>.</p>
        </div>
      </div>
      <hr class="mb-4" />
      <div class="row">
        <div class="col-12 col-md">
          <h5>Learning Links</h5>
          <ul class="list-unstyled text-small">
            <li><a class="link-secondary" href="https://markilott.medium.com/how-most-password-policies-make-us-less-secure-69476ca9fe92" target="_blank">Medium: How Most Password Policies Make us Less Secure</a></li>
            <li><a class="link-secondary" href="https://medium.com/@markilott/password-storage-basics-2aa9e1586f98" target="_blank">Medium: Password Hashing Basics</a></li>
            <li><a class="link-secondary" href="https://pages.nist.gov/800-63-3/sp800-63b.html#sec5" target="_blank">NIST Password Recommendations</a></li>
          </ul>
        </div>
        <div class="col-12 col-md">
          <h5>Technical Resources</h5>
          <ul class="list-unstyled text-small">
            <li><a class="link-secondary" href="https://github.com/markilott/password-checker" target="_blank">GitHub Source Code</a></li>
            <li><a class="link-secondary" href="https://haveibeenpwned.com/API/v3" target="_blank">Have I Been Pwned API</a></li>
            <li><a class="link-secondary" href="https://zxcvbn-ts.github.io/zxcvbn/guide/" target="_blank">zxcvbn Documentation</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const password = ref('');
const showPassword = ref(false);
const showResults = ref(false);

const complexityMessage = ref('');
const complexityAlert = ref('alert-info');
const hibpMessage = ref('');
const hibpAlert = ref('alert-info');
const scoreMessage = ref('');
const scoreAlert = ref('alert-info');
const timeMessage = ref('');
const timeAlert = ref('alert-info');

function togglePassword() {
  showPassword.value = !showPassword.value;
  const input = document.querySelector('input[type="password"], input[type="text"]') as HTMLInputElement;
  if (input) {
    input.type = showPassword.value ? 'text' : 'password';
  }
}

function resetForm() {
  password.value = '';
  showResults.value = false;
  complexityMessage.value = '';
  hibpMessage.value = '';
  scoreMessage.value = '';
  timeMessage.value = '';
  complexityAlert.value = 'alert-info';
  hibpAlert.value = 'alert-info';
  scoreAlert.value = 'alert-info';
  timeAlert.value = 'alert-info';
}

function isComplex(pw: string) {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number, one symbol
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
  const result = regex.test(pw);
  return {
    result,
    message: result
      ? 'This password meets typical complexity requirements (which does not mean it is secure)'
      : 'This password does not meet typical complexity requirements (which does not mean it is insecure)',
  };
}

async function checkHIBP(pw: string) {
  // Use k-anonymity API
  const sha1 = await sha1Hash(pw);
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();
  const match = text.split('\n').find((line) => line.startsWith(suffix));
  const frequency = match ? Number(match.split(':')[1]) : 0;
  return {
    match: !!match,
    frequency,
    message: match
      ? `The password appears ${frequency} times in well known data leaks`
      : 'The password was not found in well known data leaks',
  };
}

async function sha1Hash(str: string) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('').toUpperCase();
}

function checkPassword() {
  showResults.value = true;
  // Complexity check
  const complexity = isComplex(password.value);
  complexityMessage.value = complexity.message;
  complexityAlert.value = complexity.result ? 'alert-success' : 'alert-danger';

  // HIBP check
  checkHIBP(password.value).then((hibp) => {
    hibpMessage.value = hibp.message;
    hibpAlert.value = hibp.match ? 'alert-danger' : 'alert-success';
  });

  // zxcvbn check
  zxcvbnOptions.setOptions({
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    translations: zxcvbnEnPackage.translations,
  });
  const { crackTimesDisplay, score } = zxcvbn(password.value);
  let scoreMsg = '';
  switch (score) {
    case 0: scoreMsg = 'too guessable'; break;
    case 1: scoreMsg = 'very guessable'; break;
    case 2: scoreMsg = 'somewhat guessable'; break;
    case 3: scoreMsg = 'safely unguessable'; break;
    case 4: scoreMsg = 'very unguessable'; break;
    default: scoreMsg = 'impossible to analyse';
  }
  scoreMessage.value = `Password is ${scoreMsg}`;
  scoreAlert.value =
    score === 0 || score === 1 ? 'alert-danger'
    : score === 2 ? 'alert-warning'
    : score === 3 ? 'alert-info'
    : score === 4 ? 'alert-success'
    : 'alert-info';

  const { offlineFastHashing1e10PerSecond, offlineSlowHashing1e4PerSecond } = crackTimesDisplay;
  timeMessage.value =
    offlineFastHashing1e10PerSecond === offlineSlowHashing1e4PerSecond
      ? `If your password hash is stolen it will take ${offlineFastHashing1e10PerSecond} to crack`
      : `If your password hash is stolen, it will take between ${offlineFastHashing1e10PerSecond} and ${offlineSlowHashing1e4PerSecond} to crack depending on the methods used to store the password.`;
  // Time alert
  if (timeMessage.value.includes('centuries')) timeAlert.value = 'alert-success';
  else if (timeMessage.value.includes('year')) timeAlert.value = 'alert-info';
  else if (timeMessage.value.includes('month')) timeAlert.value = 'alert-warning';
  else if (timeMessage.value.includes('day')) timeAlert.value = 'alert-danger';
  else if (timeMessage.value.includes('hour')) timeAlert.value = 'alert-danger';
  else if (timeMessage.value.includes('minute')) timeAlert.value = 'alert-danger';
  else if (timeMessage.value.includes('second')) timeAlert.value = 'alert-danger';
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');
</style>
