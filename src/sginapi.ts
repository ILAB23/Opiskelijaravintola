const apiURL = 'https://media1.edu.metropolia.fi/restaurant';

interface LoginResponse {
  message: string;
  token: string;
  data: {
    username: string;
    email: string;
    favouriteRestaurant: string;
    _id: string;
    role: string;
    avatar: string;
  };
}

export const login = async (
  username: string,
  password: string
): Promise<void> => {
  const loginData = {username, password};

  try {
    const response = await fetch(apiURL + '/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    if (response.ok) {
      const data: LoginResponse = await response.json();
      // Handle successful login
      console.log('Login successful', data);
      // Store the token and username for future requests
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.data.username);
      // Redirect to the main page
      window.location.href = 'index.html';
    } else {
      // Handle login error
      const errorData = await response.json();
      console.error('Login failed', errorData.message);
      window.location.href = '/create-profile.html';
    }
  } catch (error) {
    console.error('An error occurred during login', error);
  }
};

export const signup = async (
  username: string,
  password: string,
  email: string
): Promise<void> => {
  const signupData = {username, password, email};

  try {
    const response = await fetch(apiURL + '/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    if (response.ok) {
      const data = await response.json();
      // Handle successful signup
      console.log('Signup successful', data);
      // Store the token and username for future requests
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.data.username);
      // Redirect to the main page
      window.location.href = 'index.html';
    } else {
      // Handle signup error
      const errorData = await response.json();
      console.error('Signup failed', errorData.message);
    }
  } catch (error) {
    console.error('An error occurred during signup', error);
  }
};

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
// Check the user's preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  // Teeman vaihtopainikkeen kuuntelija
  const themeToggleBtn = document.getElementById('t-toggle');
  themeToggleBtn?.addEventListener('click', toggleTheme);

  // Tarkista käyttäjän viimeksi valitsema teema ja aseta oikea ikoni
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.getElementById('t-icon');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon?.classList.replace('fa-sun', 'fa-moon');
  }
});

// Funktio teeman vaihtamiseen
function toggleTheme() {
  const themeIcon = document.getElementById('t-icon');
  document.body.classList.toggle('dark-theme');

  // Vaihda ikoni teeman mukaan
  if (document.body.classList.contains('dark-theme')) {
    themeIcon?.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'dark'); // Tallenna pimeä teema localStorageen
  } else {
    themeIcon?.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'light'); // Tallenna vaalea teema localStorageen
  }
}
