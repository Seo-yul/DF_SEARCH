var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

let serverName; //서버영문명칭
let characterId; //캐릭터 고유 코드
let characterName; //캐릭터 명칭(URL 인코딩필요)
let wordType; //검색타입
let limit; //반환 Row 수
let sort=unitPrice; //가격별 정렬

let itemId; //아이템 고유 코드
let itemName //아이템 명칭(URL 인코딩 필요)
let q=; //검색 관련 요청 변수
let auctionNo //경매장 등록 번호






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
