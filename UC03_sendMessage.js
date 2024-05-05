import http from 'k6/http';
import { check, sleep } from 'k6';
import { getRandomIds, getSequentialMessages, underArrays, themesArrays, offsetTime, authid, Test2023, Default } from './util.js';

const credentialsData = JSON.parse(open('./logins.json'));

export default function () {
    let offsetTimes = offsetTime;

const vuIndex = __VU - 1; // Индекс виртуального пользователя
const credential = credentialsData[vuIndex]; // Логин и пароль для текущего VU

//Открытие Mail.ru
    const res = http.get('https://mail.ru/');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'title is correct': (r) => r.body.includes('<title>Mail.ru: почта, поиск в интернете, новости, игры</title>'),
    });
    const actTokenRegExp = /act=(.*?);/;
    const actTokenMatches = res.headers['Set-Cookie'].match(actTokenRegExp);
    const actToken = actTokenMatches && actTokenMatches.length > 1 ? actTokenMatches[1] : null;
    console.log('actToken:', actToken);
    
    const resDwsplit = http.get('https://account.mail.ru/login/?mode=simple&v=2.10.0&account_host=account.mail.ru&type=login&allow_external=1&app_id_mytracker=58519&success_redirect=https%3A%2F%2Fe.mail.ru%2Fmessages%2Finbox%3Fback%3D1&project=home&source=mailbox&from=navi&parent_url=https%3A%2F%2Fmail.ru%2F&responsive=compact"')
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
    const splitRegExp = /"split":"(.*?)"/; 
    const splitMatches = resDwsplit.body.match(splitRegExp);
    let dwhsplit = null;
    if (splitMatches && splitMatches.length > 1) {
        dwhsplit = splitMatches[1]; 
        console.log('dwhsplit:', dwhsplit);
    } else {
        console.log('dwhsplit not found');
    }      

// Отправка запроса на аутентификацию
    const res2 = http.post('https://auth.mail.ru/cgi-bin/auth?from=navi', {
        username: credential.login,
        Login: credential.login,
        password: credential.password,
        Password: credential.password,
        saveauth: '1',
        new_auth_form: '1',
        FromAccount: 'opener=account&allow_external=1&twoSteps=1',
        act_token: actToken,
        page: `https://e.mail.ru/messages/inbox?app_id_mytracker=58519&authid=${authid}&back=1&dwhsplit=${dwhsplit}&from=login&x-login-auth=1`,
        back: '1',
        lang: 'ru_RU',
    });
    check(res2, {
        'status is 200': (r) => r.status === 200,
    });
    console.log(credential.login, credential.password)



    let tokens;
    if (credential.login.includes("test2023-01")) {
        tokens = Test2023;
    } else {
        tokens = Default;
    }
    console.log(tokens);

    // Отправка запроса на получение токена
        const resToken = http.post('https://e.mail.ru/api/v1/user/short', {
            email: credential.login,
            htmlencoded: 'false',
            token: tokens,
        });
        check(resToken, {
            'status is 200': (r) => r.status === 200,
        });

// Извлечение токена из тела ответа
        const tokenRegExp = /"token":"(.*?)"/;
        const tokenMatches = resToken.body.match(tokenRegExp);
        const token = tokenMatches && tokenMatches.length > 1 ? tokenMatches[1] : null;
        console.log('token:', token);
        console.log(getRandomIds())

// Отправка письма
        const resSend = http.post('https://e.mail.ru/api/v1/k8s/messages/send', {
            ATTACHMENTS_RESTORE: true,
            ATTACHMENTS_EXPIRATION_TIME: 14400000,
            id: getRandomIds(),
            source: '{"draft":"","reply":"","forward":"","schedule":""}',
            headers: "{}",
            template: 0,
            sign: 0,
            remind: 0,
            receipt: false,
            subject: themesArrays,
            priority: 3,
            send_date: "",
            body: JSON.stringify({
                html: `<div>${getSequentialMessages()}_offsetTime-${offsetTimes}</div><div>&nbsp;</div><div>--<br>${underArrays}</div>`,
                text: `${getSequentialMessages()}_${underArrays}`
            }),
            from: `K D <${credential.login}>`,
            correspondents: `{"to":"koxzy22@gmail.com"}`, 
            email: credential.login,
            htmlencoded: 'false',
            token: token, // Используем извлеченный token
        });
        console.log(offsetTimes);

        // Проверяем статус и наличие "status: 200"
        check(resSend, {
            'status is 200': (r) => r.status === 200,
            'contains "status: 200"': (r) => r.body.includes('"status":200'),
        });

//Выход из аккаунта
    const res3 = http.get('https://auth.mail.ru/cgi-bin/logout?next=1&lang=ru_RU&page=https%3A%2F%2Fmail.ru%2F%3Ffrom%3Dlogout');
    check(res3, {
        'status is 200': (r) => r.status === 200,
        });

    sleep(50);
    };