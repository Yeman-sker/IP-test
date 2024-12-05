document.querySelector('button').addEventListener('click', async function (e) {
    e.preventDefault();

    const email = document.querySelector('input[type="text"]').value;
    const name = document.querySelectorAll('input[type="text"]')[1].value;

    if (email && name) {
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name })
            });

            const data = await response.json();

            if (response.ok) {
                // alert('登录成功！');
                window.location.href = 'home.html';
            } else {
                alert('登录失败：' + data.detail);
            }
        } catch (error) {
            alert('连接服务器失败');
            console.error('Error:', error);
        }
    } else {
        alert('请填写所有字段！');
    }
});

// 时间显示
const clockElement = document.getElementById('clock');
const timeElement = clockElement.querySelector('.time');
const dateElement = clockElement.querySelector('.date');

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function zeroPadding(num, digit) {
    let zero = '';
    for (let i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

function updateTime() {
    const cd = new Date();
    const time = zeroPadding(cd.getHours(), 2) + ':' +
        zeroPadding(cd.getMinutes(), 2) + ':' +
        zeroPadding(cd.getSeconds(), 2);
    const date = zeroPadding(cd.getFullYear(), 4) + '-' +
        zeroPadding(cd.getMonth() + 1, 2) + '-' +
        zeroPadding(cd.getDate(), 2) + ' ' +
        week[cd.getDay()];

    timeElement.textContent = time;
    dateElement.textContent = date;
}

updateTime();
setInterval(updateTime, 1000);