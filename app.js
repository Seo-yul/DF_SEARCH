r app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());


app.get('/keyboard', function (req, res) {
        let keyboard = {
                    "type": "text"
                };
        res.send(keyboard);
});

app.post('/message', function (req, res) {
        let user_key = decodeURIComponent(req.body.user_key); // user's key
        let type = decodeURIComponent(req.body.type); // message type
        let content = decodeURIComponent(req.body.content); // user's message
        console.log(user_key);
        console.log(type);
        console.log(content);

        let botsay;

        if ("캐릭터" == content) {
                    botsay = "캐릭터호출";
                } else if ("경매장" == content) {
                            botsay = "경매장호출";
                        } else if ("아이템" == content) {
                                    botsay = "아이템호출";
                                } else {
                                            botsay = "검색기 설명을 보시려면 [캐릭터], [경매장], [아이템] 중 하나를 말씀해주세요";
                                        }
        let answer = {
                    "message": {
                                    "text": botsay
                                }
                }
        res.send(answer);

});

app.listen(3000, function () {
        console.log('Connect 3000 port!')
});
