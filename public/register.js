document.addEventListener('DOMContentLoaded', () => {
  treatment();
});


document.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let obj = { username, password };
    // const URL = 'http://localhost:5000/register';
    // const URL = 'http://192.168.0.14:5000/register';
    const URL = 'https://chat-teste1.herokuapp.com/register';
    const options = {
        method: 'POST',
        headers: new Headers({'Content-type': 'application/json'}),
        body: JSON.stringify(obj)
    }

    fetch(URL, options).then(res => {
        if(res.status == 200) {
            // window.location.href = 'http://localhost:5000';
            // window.location.href = 'http://192.168.0.14:5000';
            window.location.href = 'https://chat-teste1.herokuapp.com';
        } else {
            res.text().then(data => {
                alert(data);
            });
        }
    }, (error) => {
        error.message;
    });
});

function treatment() {
  let store = localStorage.getItem('authorization-token');
    // const url = 'http://localhost:5000/chat';
    // const url = 'http://192.168.0.14:5000/chat';
    const url = 'https://chat-teste1.herokuapp.com/chat';
    const options = {
        method: 'POST',
        headers: new Headers( { 'authorization-token': store } ),
    }

    fetch(url, options).then(res => {
      if(res.status == 200) {
        location.href = 'https://chat-teste1.herokuapp.com/chat.html';
      } else {
        document.body.style.display = 'block'; 
      }
    });

}