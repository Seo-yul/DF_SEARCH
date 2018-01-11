var express = require('express');
var app = express();
var request = require('request')
var bodyParser = require('body-parser');
const appKeyValue = require('./mykey');

app.use(bodyParser.json());

let APIkey = appKeyValue.appkey();
let dnf = 'https://api.neople.co.kr/df/servers/';
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

let botsay = '검색기 사용법 \n [캐릭터] : 1, 서버명, 캐릭터명 \n [경매장] : 2, 아이템명 \n [아이템] : 3, 아이템명';


var level;
var jobGrowName;

function sleep(ms) {
    ts1 = new Date().getTime() + ms;
    do ts2 = new Date().getTime(); while (ts2 < ts1);
}

function basicCharaterSearch(name) {
    wordType = 'full';
    characterName = encodeURIComponent(name);
    url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=200&wordType=' + wordType + '&apikey=' + APIkey;

    request(url, function (error, res, json) {

        var jsonData = JSON.parse(json)
        botsay = '';
        for (key in jsonData.rows) {
            objna = jsonData.rows[key];
            characterName = decodeURIComponent(objna.characterName);
            level = objna.level;
            jobGrowName = objna.jobGrowName;
            if (level > 85) {
                console.log(objna);
                botsay = botsay + 'ID: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobGrowName + '\n';

            } if (error) { throw error }
        }
        console.log(botsay);
        return botsay;
    }
    );
}

function infoCharaterSearch(name) {
    wordType = 'match';
    characterName = encodeURIComponent(name);
    url = dnf + serverName + '/characters?characterName=' + characterName + '&wordType=' + wordType + '&apikey=' + APIkey;
    request(url, function (error, res, json) {

        var jsonData = JSON.parse(json)
        characterId = jsonData.rows.characterId;
    });
    url = dnf + serverName + '/characters/' + characterId + '?apikey=' + APIkey;
    request(url, function (error, res, json) {

        var jsonData = JSON.parse(json)
        //여기 돌려보고
    });
}

function setServer(server) {
    switch (server) {
        case '안톤': serverName = 'anton'; break;
        case '바칼': serverName = 'bakal'; break;
        case '카인': serverName = 'cain'; break;
        case '카시야스': serverName = 'casillas'; break;
        case '카시': serverName = 'casillas'; break;
        case '디레지에': serverName = 'diregie'; break;
        case '디레': serverName = 'diregie'; break;
        case '힐더': serverName = 'hillder'; break;
        case '프레이': serverName = 'prey';
        case '프레': serverName = 'prey'; break;
        case '시로코': serverName = 'siroco'; break;

        default:
            break;
    }
}





app.get('/keyboard', function (req, res) {
    let keyboard = {
        'type': 'text'
    };
    res.send(keyboard);
});

app.post('/message', function (req, res) {
    let user_key = decodeURIComponent(req.body.user_key); // user's key
    let type = decodeURIComponent(req.body.type); // message type
    let content = decodeURIComponent(req.body.content); // user's message

    function sendMsg() {
        let answer = {
            'message': {
                'text': botsay
            }
        }

        res.send(answer);
    }

    function async1() {
        return new Promise(function (resolve, reject) {
            setServer(findex[1]);
            basicCharaterSearch(findex[2]);
        });
    }
    function async2() {

        return new Promise(function (resolve, reject) {
            setServer(findex[1]);
            infoCharaterSearch(findex[2]);
        });
    }
    function async3() {
        return new Promise(function (resolve, reject) {
            //
        });
    }
    function async4() {
        return new Promise(function (resolve, reject) {
            //
        });
    }
    function async5() {
        return new Promise(function (resolve, reject) {
            //
        });
    }


    console.log(user_key);
    console.log(type);
    console.log(content);
    if (content.indexOf(',') != -1) {
        let findex = content.split(',');

        if (findex[0] == 1) {
            //botsay = '캐릭터검색 호출'
            async1().then(sendMsg());

        }
        else if (findex[0] == 2) {
            // botsay = 캐릭터정보 호출'
            async2();
        }
        else if (findex[0] == 3) { botsay = '경매장검색 호출' }
        else if (findex[0] == 4) { botsay = '아이템검색 호출' }
        else {
            botsay = '검색기 사용법 \n [닉네임검색] : 1, 서버, 캐릭터\n [캐릭터정보] : 2, 서버, 캐릭터 \n [경매장] : 3, 아이템명 \n [아이템] : 4, 아이템명';
            sendMsg();
        }
    } else {
        botsay = '검색기 사용법 \n [닉네임검색] : 1, 서버, 캐릭터\n [캐릭터정보] : 2, 서버, 캐릭터 \n [경매장] : 3, 아이템명 \n [아이템] : 4, 아이템명';
        sendMsg();
    }

    // {
    //     'rows':
    //     [
    //         {
    //             'characterId': 'e88bfdbf0567b737d4a8970a42ca37b0',
    //             'characterName': '하얀우산',
    //             'level': 90,
    //             'jobId': '41f1cdc2ff58bb5fdc287be0db2a8df3',
    //             'jobGrowId': '80ec67d0356defa46a989914caca5820',
    //             'jobName': '귀검사(남)',
    //             'jobGrowName': '검신'
    //         }
    //     ]
    // }
    //console.log(log);

});

app.listen(3000, function () {
    console.log('Connect 3000 port!')
});
