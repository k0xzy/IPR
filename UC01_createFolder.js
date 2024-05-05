import http from 'k6/http';
import { check, sleep } from 'k6';
import { getRandomValue, authid, Test2023, Default } from './util.js';

const credentialsData = JSON.parse(open('./logins.json'));

export default function () {

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

    const randomValue = getRandomValue();

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
        // console.log("Response body:", resToken.body)
// Отправка запроса на создание рандомной папки
    const resFolder = http.post('https://e.mail.ru/api/v1/folders/add', {
        folders: JSON.stringify([{
            name: "Folder#" + randomValue,
            id: null,
            system: false,
            type: "",
            parent: -1,
            open: true,
            security: false,
            messages_total: 0,
            messages_unread: 0,
            child: false,
            children: false,
            archive: false,
            collapse: false,
            only_web: false
        }]),
            email: credential.login,
            htmlencoded: 'false',
            token: token,
        });
        check(resFolder, {
            'status is 200': (r) => r.status === 200,
        });

        console.log("Folder#", randomValue)
//Выход из аккаунта
    const res3 = http.get('https://auth.mail.ru/cgi-bin/logout?next=1&lang=ru_RU&page=https%3A%2F%2Fmail.ru%2F%3Ffrom%3Dlogout');
    check(res3, {
        'status is 200': (r) => r.status === 200,
        });

    sleep(50)
    
    };