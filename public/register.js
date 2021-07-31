let userInput = document.getElementById('username');

document.addEventListener('DOMContentLoaded', () => {
  treatment();
});

// Handles data from new user
document.addEventListener('submit', (e) => {
  e.preventDefault();
  let username = userInput.value;
  let password = document.getElementById('password').value;
  let obj = { username, password };
  const URL = 'https://chat-teste1.herokuapp.com/register';
  const options = {
    method: 'POST',
    headers: new Headers({ 'Content-type': 'application/json' }),
    body: JSON.stringify(obj),
  };

  fetch(URL, options).then(
    (res) => {
      if (res.status == 200) {
        window.location.href = 'https://chat-teste1.herokuapp.com';
      } else {
        res.text().then((data) => {
          alert(data);
        });
      }
    },
    (error) => {
      error.message;
    }
  );
});

// Checks if user is already logged in
function treatment() {
  let store = localStorage.getItem('authorization-token');
  const url = 'https://chat-teste1.herokuapp.com/chat';
  const options = {
    method: 'POST',
    headers: new Headers({ 'authorization-token': store }),
  };

  fetch(url, options).then((res) => {
    if (res.status == 200) {
      location.href = 'https://chat-teste1.herokuapp.com/chat.html';
    } else {
      document.body.style.display = 'block';
      userInput.focus();
    }
  });
}
