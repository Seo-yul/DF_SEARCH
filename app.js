var express = require('express');
var app = express();
var request = require('request')
var bodyParser = require('body-parser');
const appKeyValue = require('./mykey');

var jquery = require('jquery');
var $ = jquery.create();


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

var jsonData;
var url;
var answer;
var objna;

var botsay = '검색기 사용법\n[닉네임검색] : 1, 서버, 캐릭터\n[캐릭터정보] : 2, 서버, 캐릭터\n[경매장] : 3, 아이템명\n[아이템] : 4, 아이템명\n헬';

var flag;
var level;
var jobGrowName;

function sleep(ms) {
    ts1 = new Date().getTime() + ms;
    do ts2 = new Date().getTime(); while (ts2 < ts1);
}

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

    ////////////////////////////////////////////
    function dnfcall(callback) {
        wordType = 'full';
        url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=200&wordType=' + wordType + '&apikey=' + APIkey;

        var temp = $.getJSON(url, args, function (data) {
            //execute the callback, passing it the data
            callback(data);
        });
    }

    //when you call dnfcall, it get's back the result:
    function dnfcallBefore() {

        //get our JSON
        dnfcall(function (data) {

            //when we get our data, evaluate
            if (data.rows != null) {

                jsonData = data.rows;

                for (key in jsonData) {
                    objna = jsonData[key];
                    characterName = decodeURIComponent(objna.characterName);
                    level = objna.level;
                    jobGrowName = objna.jobGrowName;
                    if (level = 90) {
                        botsay = botsay + 'ID: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobGrowName + '\n';
                    }
                }
                check = true;
                console.log(characterName);
                afterCall();
            } else {
                jsonData = "NaN"
            }
        });
        console.log('i am executed before anything else');
    }

    function afterCall() {
        setMsg(botsay);
        res.send(answer);
        console.log('after end');
    }
    //////////////////////////////////////////


    /*
        function basicCharaterSearch(name) { //캐릭터검색
            wordType = 'full';
            characterName = encodeURIComponent(name[2]);
            url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=200&wordType=' + wordType + '&apikey=' + APIkey;
            request(url, function (error, res, json) {
    
                jsonData = JSON.parse(json)
                for (key in jsonData.rows) {
                    objna = jsonData.rows[key];
                    characterName = decodeURIComponent(objna.characterName);
                    level = objna.level;
                    jobGrowName = objna.jobGrowName;
                    if (level = 90) {
                        botsay = botsay + 'ID: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobGrowName + '\n';
    
                    } if (error) { throw error }
                }
            }
            );
    
            setMsg(botsay);
            res.send(answer);
        }*/
    /*
        function infoCharaterSearch(name) { //캐릭터정보검색
            wordType = 'match';
            characterName = encodeURIComponent(name[2]);
            setServer(name[1]);
            var characterId;
            url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=1&wordType=' + wordType + '&apikey=' + APIkey;
            request(url, function (error, res, json) {
    
                jsonData = JSON.parse(json);
                characterId = jsonData.rows[0].characterId;
    
                url = dnf + serverName + '/characters/' + characterId + '?apikey=' + APIkey;
                request(url, function (error, res, json) {
                    jsonData = JSON.parse(json);
                    characterName = jsonData.characterName;
                    level = jsonData.level;
                    jobName = jsonData.jobName;
                    adventureName = jsonData.adventureName;
                    guildName = jsonData.guildName;
                    botsay = '닉네임: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobName + '\n모험단: ' + adventureName + '\n길드명: ' + guildName;
                    console.log(botsay);
                });
            });
    
        }



    function async1(param) {
        return new Promise(function (resolve, reject) {
            if (param) {
                serverName = setServer(param[1]);
                // basicCharaterSearch(param[2]);
                resolve('ok');
            }
            else {
                reject(console.log("anync1"))
            }
        });
    }

*/







    if (content.indexOf(',') != -1) {
        var findex = content.split(',');

        if (findex[0] == 1) {
            //botsay = '캐릭터검색 호출'
            serverName = setServer(findex[1]);
            characterName = encodeURIComponent(findex[2]);
            // async1(findex);
            dnfcallBefore();
            console.log('캐릭터검색 호출 끝');
            // console.log(answer);

        }
        else if (findex[0] == 2) {
            serverName = setServer(findex[1]);
            characterName = encodeURIComponent(findex[2]);
            afterCall();
            //infoCharaterSearch(findex);

        }
        else if (findex[0] == 3) { botsay = '경매장검색 호출'; afterCall(); }
        else if (findex[0] == 4) { botsay = '아이템검색 호출'; afterCall(); }
        else {
            botsay = '검색기 사용법\n[닉네임검색] : 1, 서버, 캐릭터\n[캐릭터정보] : 2, 서버, 캐릭터\n[경매장] : 3, 아이템명\n[아이템] : 4, 아이템명\n헬';
            afterCall();
        }
    } else if (content == '헬') {
        botsay = '영곶해제 기원'; afterCall();
    }
    else {
        botsay = '검색기 사용법\n[닉네임검색] : 1, 서버, 캐릭터\n[캐릭터정보] : 2, 서버, 캐릭터\n[경매장] : 3, 아이템명\n[아이템] : 4, 아이템명\n헬';
        afterCall();
    }


    console.log('최종 answer: ' + answer.message);

});

app.listen(3000, function () {
    console.log('Connect 3000 port!')
});
