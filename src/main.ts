import '../public/main.css';
import {signup, login} from './sginapi.ts';
import {apiURL} from './variables.ts';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signUpbtn')?.addEventListener('click', showSignUp);
  document.getElementById('signInbtn')?.addEventListener('click', showSignIn);
  document.getElementById('')?.addEventListener('click', showAbout);
  document
    .getElementById('toggle-form-link')
    ?.addEventListener('click', toggleFeedbackForm);
  checkLoginStatus();
});

document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('aihe');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  // Teeman vaihtopainikkeen kuuntelija
  const themeToggleBtn = document.getElementById('t-toggle');
  themeToggleBtn?.addEventListener('click', toggleTheme);

  // Tarkista käyttäjän viimeksi valitsema teema ja aseta oikea ikoni
  const savedTheme = localStorage.getItem('aihe');
  const themeIcon = document.getElementById('t-icon');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon?.classList.replace('fa-sun', 'fa-moon');
  }
});

// Funktio teeman vaihtamiseen
function toggleTheme() {
  console.log('theme clicked');

  const themeIcon = document.getElementById('t-icon');
  console.log(themeIcon);
  console.log(themeIcon?.classList);

  // document.body.classList.toggle('dark-theme');

  // Vaihda ikoni teeman mukaan
  if (document.body.classList.contains('dark-theme')) {
    themeIcon?.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('aihe', 'dark'); // Tallenna pimeä teema localStorageen
  } else {
    themeIcon?.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('aihe', 'light'); // Tallenna vaalea teema localStorageen
  }
}

function showSignUp() {
  console.log('Sign Up button clicked'); // Debugging log
  const content = document.getElementById('authcontent');
  if (content) {
    content.innerHTML = `
      <h2>Sign Up</h2>
      <form id="signup-form">
        <label for="signup-username">Username:</label>
        <input type="text" id="signup-username" name="username" required />
        <label for="signup-password">Password:</label>
        <input type="password" id="signup-password" name="password" required />
        <label for="signup-email">Email:</label>
        <input type="email" id="signup-email" name="email" required />
        <button type="submit" id="submit">Sign Up</button>
      </form>
    `;
    document
      .getElementById('signup-form')
      ?.addEventListener('submit', handleSignup);
  }
}

function showSignIn() {
  console.log('Sign In button clicked'); // Debugging log
  const content = document.getElementById('authcontent');
  if (content) {
    content.innerHTML = `
      <h2>Sign In</h2>
      <form id="signin-form">
        <label for="signin-username">Username:</label>
        <input type="text" id="signin-username" name="username" required />
        <label for="signin-password">Password:</label>
        <input type="password" id="signin-password" name="password" required />
        <button type="submit" id="submit">Sign In</button>
      </form>
    `;
    document
      .getElementById('signin-form')
      ?.addEventListener('submit', handleSignIn);
  }
}

function showAbout() {
  const content = document.getElementById('content');
  if (content) {
    content.innerHTML = `
      
    `;
  }
}

// Palaute-lomakkeen togglaustoiminto
function toggleFeedbackForm(event: Event) {
  event.preventDefault(); // Estetään linkin oletustoiminta
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    if (
      feedbackForm.style.display === 'none' ||
      feedbackForm.style.display === ''
    ) {
      feedbackForm.style.display = 'block'; // Näytetään lomake
    } else {
      feedbackForm.style.display = 'none'; // Piilotetaan lomake
    }
  }
}

function handleSignup(event: Event) {
  event.preventDefault();

  const username = (
    document.getElementById('signup-username') as HTMLInputElement
  ).value;
  const email = (document.getElementById('signup-email') as HTMLInputElement)
    .value;
  const password = (
    document.getElementById('signup-password') as HTMLInputElement
  ).value;

  if (!username || !email || !password) {
    alert('All fields are required.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  signup(username, password, email);
}

function handleSignIn(event: Event) {
  event.preventDefault();
  console.log('Signup form submitted');
  const username = (
    document.getElementById('signin-username') as HTMLInputElement
  ).value;
  const password = (
    document.getElementById('signin-password') as HTMLInputElement
  ).value;

  if (!username || !password) {
    alert('All fields are required.');
    return;
  }

  login(username, password);
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function checkLoginStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    fetch(apiURL + '/api/v1/auth/login', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User data', data);
        // Update the UI with user data
        displayLoggedInMessage(data.username);
      })
      .catch((error) => {
        console.error('Error fetching user data', error);
        displayLoggedInMessage();
      });
  } else {
    // Display message if no user is logged in
    displayLoggedInMessage();
  }
}

function displayLoggedInMessage(username?: string) {
  const messageElement = document.getElementById('logged-in-message');
  if (messageElement) {
    const storedUsername = username || localStorage.getItem('username');
    if (storedUsername) {
      messageElement.textContent = `User ${storedUsername} is logged in.`;
    } else {
      messageElement.textContent = 'No user is logged in.';
    }
  }
}
