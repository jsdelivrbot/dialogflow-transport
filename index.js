var express = require('express')
const bodyParser = require("body-parser");
var request = require('request');
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Hello World!')
})

app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
})

/*
    Принимаем сообщение от Яндекс.Диалоги и переправляем в Dialogflow
*/
var handle_dialog_msg = function (req, res) {
    var message = req.body;

    console.log(message.request.original_utterance);
    var toDialogFlow = JSON.stringify({
        "contexts": [],
        "lang": message.meta.locale.split("-")[0],
        "query": message.request.original_utterance,
        "sessionId": message.session.session_id,
        "timezone": message.meta.timezone
    });
    console.log(toDialogFlow);

    request({
            uri: "https://api.dialogflow.com/v1/query?v=20180818",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Bearer 2071983881214c6db273cdeabcf0998b"
            },
            method: "POST",
            body: toDialogFlow,
        },
        function (error, response, body) {
            var body = JSON.parse(body);
            var feedback = "";
            if (!error && response.statusCode == 200) {
                feedback = body.result.fulfillment.speech;
            } else {
                feedback = body.status.errorDetails;
            }
            res.json({
                "response": {
                    "text": feedback,
                    "tts": feedback,
                    "buttons": [],
                    "end_session": false
                },
                "session": {
                    "session_id": message.session.session_id,
                    "message_id": message.session.message_id,
                    "user_id": message.session.user_id
                },
                "version": message.version
            });
        }
    )
    ;
};

app.route('/dialog')
    .post(handle_dialog_msg);

/*
var reqTimer = setTimeout(function wakeUp() {
    request("https://dialogflow-transport.herokuapp.com/", function() {
        console.log("WAKE UP DYNO");
    });
    return reqTimer = setTimeout(wakeUp, 1200000);
}, 1200000);
*/

/*

https://dialogflow-transport.herokuapp.com/dialog

Пример запроса

{
  "meta": {
    "locale": "ru-RU",
    "timezone": "Europe/Moscow",
    "client_id": "ru.yandex.searchplugin/5.80 (Samsung Galaxy; Android 4.4)"
  },
  "request": {
     "command": "где ближайшее отделение",
     "original_utterance": "Алиса спроси у Сбербанка где ближайшее отделение",
     "type": "SimpleUtterance",
     "markup": {
        "dangerous_context": true
     },
     "payload": {}
  },
  "session": {
    "new": true,
    "message_id": 4,
    "session_id": "2eac4854-fce721f3-b845abba-20d60",
    "skill_id": "3ad36498-f5rd-4079-a14b-788652932056",
    "user_id": "AC9WC3DF6FCE052E45A4566A48E6B7193774B84814CE49A922E163B8B29881DC"
  },
  "version": "1.0"
}

Пример ответа

{
  "response": {
    "text": "Здравствуйте! Это мы, хороводоведы.",
    "tts": "Здравствуйте! Это мы, хоров+одо в+еды.",
    "buttons": [
        {
            "title": "Надпись на кнопке",
            "payload": {},
            "url": "https://example.com/",
            "hide": true
        }
    ],
    "end_session": false
  },
  "session": {
    "session_id": "2eac4854-fce721f3-b845abba-20d60",
    "message_id": 4,
    "user_id": "AC9WC3DF6FCE052E45A4566A48E6B7193774B84814CE49A922E163B8B29881DC"
  },
  "version": "1.0"
}
*/