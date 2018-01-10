var express = require('express');
var app = express();
var request = require('request')
var bodyParser = require('body-parser');

app.use(bodyParser.json());

let APIkey;

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
let url;

let objna;
let koserver = ['안톤', '바칼', '카인', "카시야스", "디레지에", "힐더", "프레이", "시로코"];
let enserver = ['anton', 'bakal', 'cain', 'casillas', 'diregie', 'hillder', 'prey', 'siroco'];
let botsay = "검색기 사용법 \n [캐릭터] : 1, 서버명, 캐릭터명 \n [경매장] : 2, 아이템명 \n [아이템] : 3, 아이템명";

var level;
var jobGrowName;

function basicCharaterSearch(name) {
    wordType = "match";
    characterName = encodeURIComponent(name);
    url = 'https://api.neople.co.kr/df/servers/' + serverName + '/characters?characterName=' + characterName + '&wordType=' + wordType + '&apikey=' + APIkey;

}

function setServer(server) {
    switch (server) {
        case "안톤":
            serverName = "anton"
            break;
        case "바칼":
            serverName = "bakal"
            break;
        case "카인":
            serverName = "cain"
            break;
        case "카시야스":
            serverName = "casillas"
            break;
        case "디레지에":
            serverName = "diregie"
            break;
        case "힐더":
            serverName = "hillder"
            break;
        case "프레이":
            serverName = "prey"
            break;
        case "시로코":
            serverName = "siroco"
            break;

        default:
            break;
    }
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

        if (findex[0] == 1) {
            //botsay = "캐릭터검색 호출"
            setServer(findex[1]);
            basicCharaterSearch(findex[2]);
            request(url, function (error, res, json) {

                var jsonData= JSON.parse(json)
                 objna = jsonData.rows[0];
                var characterName = decodeURIComponent(objna.characterName);
                var level = objna.level;
                var jobGrowName = objna.jobGrowName;

            botsay = "ID: " + characterName + "\n Lv: " + level + "\n 직업: " + jobGrowName;
                if (error) { throw error }


                console.log(objna.level);
                console.log(objna.jobGrowName);
            }
            )
        }
        else if (findex[0] == 2) { botsay = "경매장검색 호출" }
        else if (findex[0] == 3) { botsay = "아이템검색 호출" }
        else { botsay = "검색기 사용법 \n [캐릭터] : 1, 서버명, 캐릭터명 \n [경매장] : 2, 아이템명 \n [아이템] : 3, 아이템명"; }
    }


    // {
    //     "rows":
    //     [
    //         {
    //             "characterId": "e88bfdbf0567b737d4a8970a42ca37b0",
    //             "characterName": "하얀우산",
    //             "level": 90,
    //             "jobId": "41f1cdc2ff58bb5fdc287be0db2a8df3",
    //             "jobGrowId": "80ec67d0356defa46a989914caca5820",
    //             "jobName": "귀검사(남)",
    //             "jobGrowName": "검신"
    //         }
    //     ]
    // }



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
