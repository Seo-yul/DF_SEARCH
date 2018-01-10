var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

let APIkey = "";

let serverName; //서버영문명칭
let characterId; //캐릭터 고유 코드
let characterName; //캐릭터 명칭(URL 인코딩필요)
let wordType; //검색타입 동일 단어(match), 앞 단어 검색(front), 전문 검색(full)
let limit; //반환 Row 수
let sort; //가격별 정렬

let itemId; //아이템 고유 코드
let itemName //아이템 명칭(URL 인코딩 필요)
let q; //검색 관련 요청 변수
let auctionNo //경매장 등록 번호


var koserver = ['안톤', '바칼', '카인', "카시야스", "디레지에", "힐더", "프레이", "시로코"];
var enserver = ['anton', 'bakal', 'cain', 'casillas', 'diregie', 'hillder', 'prey', 'siroco'];



const qs = require('querystring'); //인코딩용     //`https://api.neople.co.kr/df/items?&apikey=<APIKey>&itemName=${qs.escape(itemName)}`;
let url;

function basicCharaterSearch(server, name) {
    wordType = "match";

}

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
    if (content.indexOf(",") != -1) {
        let findex = content.split(",");

        if (findex[0] == 1) { }
        else if (findex[0] == 2) { }
        else if (findex[0] == 3) { }
    }
    let botsay = "검색기 사용법 \n 캐릭터 검색: 1, [서버명], [캐릭터명] \n 경매장 검색: 2, [아이템명] \n 아이템 검색: 3, [아이템명]";

    if ("캐릭터" == content) {
        botsay = "1, [서버], [캐릭터명]";
    } else if ("경매장" == content) {
        botsay = "2, [아이템명]";
    } else if ("아이템" == content) {
        botsay = "3, [아이템명]";
    } else {
        break;
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
