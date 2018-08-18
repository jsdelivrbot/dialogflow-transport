var express = require('express')
const bodyParser = require("body-parser");
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

/*
Принимаем сообщение от Яндекс.Диалоги и переправляем в Dialogflow
*/
var handle_dialog_msg = function(req, res) {
  var message = req.body;
  console.log(message);
  message.request.original_utterance;
  res.json({
			  "response": {
			    "text": "Здравствуйте! Это мы, хороводоведы.",
			    "tts": "Здравствуйте! Это мы, хоров+одо в+еды.",
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
};

app.route('/dialog')
		.post(handle_dialog_msg);




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