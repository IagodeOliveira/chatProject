
// Sending login data
// Fetching token and setting localStorage with it
document.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let room = document.getElementById('room').value;
    let obj = { username, password, room };
    // const URL = 'http://localhost:5000/login';
    const URL = 'http://192.168.0.14:5000/login';
    const options = {
        method: 'POST',
        headers: new Headers({'Content-type': 'application/json'}),
        body: JSON.stringify(obj)
    }

    fetch(URL, options).then(res => {
        if(res.status == 200) {
            let token = res.headers.get('authorization-token');
            localStorage.setItem("authorization-token", token);
            // window.location.href = 'http://localhost:5000/chat.html';
            window.location.href = 'http://192.168.0.14:5000/chat.html';
        } else {
            res.text().then(data => {
                alert(data);
            });
        }
    }, (error) => {
        error.message;
    });
});

// if(location.href == 'http://localhost:5000/#404') {
    if(location.href == 'http://192.168.0.14:5000/#404') {
    let modal = document.getElementsByClassName("modal")[0];
    let mCont = document.getElementsByClassName("modal-content")[0];
    let btn = document.getElementsByTagName("span")[0];
    modal.style.display = "block";
    btn.addEventListener('click', () => {
        mCont.style.animationName = "hide";
        modal.style.animationName = "unfade";
        setTimeout(() => {
            modal.style.display = "none";
            location.href = '/';
        }, 1000);
    });
    setTimeout(() => {
        modal.style.display = "none";
        location.href = '/';
    }, 5000);
}


