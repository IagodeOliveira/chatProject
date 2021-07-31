let userInput = document.getElementById('username');

document.addEventListener('DOMContentLoaded', () => {
  treatment();
});

// Sending login data / Fetching token / Setting localStorage
document.addEventListener('submit', (e) => {
  e.preventDefault();
  let username = userInput.value;
  let password = document.getElementById('password').value;
  let room = document.getElementById('room').value;
  let obj = { username, password, room };
  const URL = 'https://chat-teste1.herokuapp.com/login';
  const options = {
    method: 'POST',
    headers: new Headers({ 'Content-type': 'application/json' }),
    body: JSON.stringify(obj),
  };

  fetch(URL, options).then(
    (res) => {
      if (res.status == 200) {
        let token = res.headers.get('authorization-token');
        localStorage.setItem('authorization-token', token);
        location.href = 'https://chat-teste1.herokuapp.com/chat.html';
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

// Handles unexisting pages / Checks if user is already logged in
function treatment() {
  if (location.href == 'https://chat-teste1.herokuapp.com/#404') {
    let modal = document.getElementsByClassName('modal')[0];
    let mCont = document.getElementsByClassName('modal-content')[0];
    let btn = document.getElementsByTagName('span')[0];
    modal.style.display = 'block';
    btn.addEventListener('click', () => {
      mCont.style.animationName = 'hide';
      modal.style.animationName = 'unfade';
      setTimeout(() => {
        modal.style.display = 'none';
        location.href = '/';
      }, 1000);
    });
    setTimeout(() => {
      modal.style.display = 'none';
      location.href = '/';
    }, 5000);
  }

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
      let expired = localStorage.getItem('expired');
      document.body.style.display = 'block';
      userInput.focus();

      if (expired !== null) {
        let exp = document.getElementsByClassName('expire')[0];
        exp.style.display = 'block';
        localStorage.removeItem('expired');
      }
    }
  });
}
