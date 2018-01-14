var express = require('express');
var app = express();
var request = require('request')
var bodyParser = require('body-parser');
const appKeyValue = require('./mykey');

app.use(bodyParser.json());

var APIkey = appKeyValue.appkey();
var dnf = 'https://api.neople.co.kr/df/servers/';

var serverName; //서버영문명칭
var characterId; //캐릭터 고유 코드
var characterName; //캐릭터 명칭(URL 인코딩필요)
var wordType; //검색타입 동일 단어(match), 앞 단어 검색(front), 전문 검색(full)
var limit; //반환 Row 수
var sort; //가격별 정렬

var itemId; //아이템 고유 코드
var itemName; //아이템 명칭(URL 인코딩 필요)
var q; //검색 관련 요청 변수
var auctionNo; //경매장 등록 번호
var adventureName; //모험단명
var guildName; //길드명

var jsonData; //JSON 파싱받은 데이터
var url; //JSON 파싱 url
var answer;
var objna;

var botsay = '검색기 사용법\n[닉네임검색] : 1, 서버, 캐릭터\n[캐릭터정보] : 2, 서버, 캐릭터\n[경매장] : 3, 아이템명\n[아이템] : 4, 아이템명\n헬';

var flag;
var level;
var jobGrowName;


function setServer(server) {
    var engServer;
    switch (server) {
        case '안톤': engServer = 'anton'; break;
        case '바칼': engServer = 'bakal'; break;
        case '카인': engServer = 'cain'; break;
        case '카시야스': engServer = 'casillas'; break;
        case '카시': engServer = 'casillas'; break;
        case '디레지에': engServer = 'diregie'; break;
        case '디레': engServer = 'diregie'; break;
        case '힐더': engServer = 'hillder'; break;
        case '프레이': engServer = 'prey';
        case '프레': engServer = 'prey'; break;
        case '시로코': engServer = 'siroco'; break;

        default:
            engServer = 'unknown'
            break;
    }
    return engServer;
}

app.get('/keyboard', function (req, res) {
    var keyboard = {
        'type': 'text'
    };
    res.send(keyboard);
});

app.post('/message', function (req, res) {
    var user_key = decodeURIComponent(req.body.user_key); // user's key
    var type = decodeURIComponent(req.body.type); // message type
    var content = decodeURIComponent(req.body.content); // user's message

    console.log(user_key);
    console.log(type);
    console.log(content);

    function setMsg(msg) {
        answer = {
            'message': {
                'text': msg
            }
        }
    }

    function lastCall() {
        setMsg(botsay);
        res.send(answer);
    }


    function basicCharaterSearch() { //캐릭터검색
        wordType = 'full';
        url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=200&wordType=' + wordType + '&apikey=' + APIkey;
        request.post(url, function (error, res, json) {

            if (!error && res.statusCode == 200) {
                jsonData = JSON.parse(json)
                for (key in jsonData.rows) {
                    objna = jsonData.rows[key];
                    characterName = decodeURIComponent(objna.characterName);
                    level = objna.level;
                    jobGrowName = objna.jobGrowName;
                    if (level = 90) {
                        botsay = botsay + 'ID: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobGrowName + '\n';

                    }
                }
                lastCall();
            }
            else {
                botsay = '관리자에게 현재 화면을 보내주세요!';
                lastCall();
            }
        }
        );
    }


    // function infoCharaterSearch(name) { //캐릭터정보검색
    //     wordType = 'match';


    //     url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=1&wordType=' + wordType + '&apikey=' + APIkey;
    //     request(url, function (error, res, json) {

    //         jsonData = JSON.parse(json);
    //         characterId = jsonData.rows[0].characterId;

    //         url = dnf + serverName + '/characters/' + characterId + '?apikey=' + APIkey;
    //         request(url, function (error, res, json) {
    //             jsonData = JSON.parse(json);
    //             characterName = jsonData.characterName;
    //             level = jsonData.level;
    //             jobName = jsonData.jobName;
    //             adventureName = jsonData.adventureName;
    //             guildName = jsonData.guildName;
    //             botsay = '닉네임: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobName + '\n모험단: ' + adventureName + '\n길드명: ' + guildName;
    //             console.log(botsay);
    //         });
    //     });

    // }



    if (content.indexOf(',') != -1) {
        var findex = content.split(',');

        if (findex[0] == 1) {
            //botsay = '캐릭터검색 호출'
            serverName = setServer(findex[1]);
            characterName = encodeURIComponent(findex[2]);
            basicCharaterSearch();
            console.log('캐릭터검색 호출 끝');

        }
        else if (findex[0] == 2) {
            serverName = setServer(findex[1]);
            characterName = encodeURIComponent(findex[2]);
            lastCall();
            console.log('캐릭터정보검색 호출 끝');

        }
        else if (findex[0] == 3) {
            botsay = '경매장검색 호출';
            afterCall();
        }
        else if (findex[0] == 4) {
            botsay = '아이템검색 호출';
            afterCall();
        }
        else {
            botsay = '검색기 사용법\n[닉네임검색] : 1, 서버, 캐릭터\n[캐릭터정보] : 2, 서버, 캐릭터\n[경매장] : 3, 아이템명\n[아이템] : 4, 아이템명\n[헬추천] : 헬orㅎ';
            lastCall();
        }
    } else if (content == '헬' || content == 'ㅎ') {
        botsay = '영곶해제 기원';
        lastCall();
    }
    else {
        botsay = '검색기 사용법\n[닉네임검색] : 1, 서버, 캐릭터\n[캐릭터정보] : 2, 서버, 캐릭터\n[경매장] : 3, 아이템명\n[아이템] : 4, 아이템명\n헬';
        lastCall();
    }


    console.log('최종 answer: ' + answer[0]);

});

app.listen(3000, function () {
    console.log('Connect 3000 port!')
});
