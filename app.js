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

var botsay;

var flag;
var level;
var jobGrowName;

var helser = ['그란플로리스', '\t\t\t\t\t하늘성', '\t베히모스', '알프라이라', '노이어페라', '\t\t\t\t\t설산', '노스마이어', '\t\t아브노바', '\t\t멜트다운', '\t역천의 폭포', '\t안트베르 협곡', '\t\t\t\t해상열차', '\t\t시간의 문', '\t파워 스테이션', '\t노블스카이', '\t죽은자의 성', '\t메트로센터', '\t망자의 협곡', '\t\t이계 던전', '\t\t고대 던전', '\t\t마수 던전'];

function setBasicTalk() {
    botsay = '검색기 사용법\n[닉네임검색] : 1, 서버, 캐릭터\n[캐릭터정보] : 2, 서버, 캐릭터\n[경매장] : 3, 아이템명\n[아이템] : 4, 아이템명\n[헬추천] : 헬orㅎ';
}
function setErrorTalk() {
    botsay = '관리자에게 현재 화면을 보내주시면 감사하겠습니다!\nhcom0103@gmail.com';
}

function epicbeam(a) {
    return a[Math.floor(Math.random() * a.length)];
}

function epicbeam2(epicCH) {
    var x;
    switch (epicCH) {
        case '그란플로리스': x = Math.floor((Math.random() * 15) + 1); break;
        case '베히모스': x = Math.floor((Math.random() * 10) + 11); break;
        case '알프라이라': x = Math.floor((Math.random() * 5) + 1); break;
        case '노이어페라': x = Math.floor((Math.random() * 5) + 6); break;
        case '설산': x = Math.floor((Math.random() * 5) + 11); break;
        case '노스마이어': x = Math.floor((Math.random() * 5) + 16); break;
        case '아브노바': x = Math.floor((Math.random() * 5) + 16); break;
        case '역천의 폭포': x = Math.floor((Math.random() * 5) + 16); break;
        case '시간의 문': x = Math.floor((Math.random() * 10) + 11); break;
        case '파워 스테이션': x = Math.floor((Math.random() * 5) + 21); break;
        case '죽은자의 성': x = Math.floor((Math.random() * 5) + 11); break;
        case '메트로센터': x = Math.floor((Math.random() * 15) + 30); break;
        case '망자의 협곡': x = Math.floor((Math.random() * 5) + 21); break;
        case '고대 던전': x = Math.floor((Math.random() * 5) + 21); break;
        case '마수 던전': x = Math.floor((Math.random() * 20) + 30); break;

        default:
            x = Math.floor((Math.random() * 10) + 1); break;
            break;
    }

    return x;
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

    function lastCall() {
        setMsg(botsay);
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(answer));
    }


    function basicCharaterSearch() { //캐릭터검색
        wordType = 'full';
        botsay = '';
        url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=200&wordType=' + wordType + '&apikey=' + APIkey;
        request.get(url, function (error, res, body) {

            if (!error) {
                jsonData = JSON.parse(body)
                //console.log('jsonData= ' + jsonData);
                for (var key in jsonData.rows) {
                    objna = jsonData.rows[key];
                    characterName = decodeURIComponent(objna.characterName);
                    level = objna.level;
                    jobGrowName = objna.jobGrowName;
                    if (level = 90) {
                        botsay = botsay + 'ID: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobGrowName + '\n';

                    }
                }
                console.log('botsay= ' + botsay);
                lastCall();
            }
            else {
                setErrorTalk();
                lastCall();
            }
        }
        );
    }


    function infoCharaterSearch() { //캐릭터정보검색
        wordType = 'match';
        url = dnf + serverName + '/characters?characterName=' + characterName + '&limit=1&wordType=' + wordType + '&apikey=' + APIkey;

        request.get(url, function (error, res, body) {

            if (!error) {
                jsonData = JSON.parse(body);
                characterId = jsonData.rows[0].characterId;
                console.log(characterId);
            }
            else {
                setErrorTalk();
                lastCall();
            }
        }
        );

        url = dnf + serverName + '/characters/' + characterId + '?apikey=' + APIkey;
        console.log(url);
        request.get(url, function (error, res, body) {

            if (!error) {
                jsonData = JSON.parse(body);
                characterName = jsonData.characterName;
                level = jsonData.level;
                jobName = jsonData.jobName;
                adventureName = jsonData.adventureName;
                guildName = jsonData.guildName;

                botsay = '닉네임: ' + characterName + '\nLv: ' + level + '\n직업: ' + jobName + '\n모험단: ' + adventureName + '\n길드명: ' + guildName;
                console.log(botsay);
                lastCall();
            }
            else {
                setErrorTalk();
                lastCall();
            }
        }
        );
    }



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
            infoCharaterSearch()
            console.log('캐릭터정보검색 호출 끝');

        }
        else if (findex[0] == 3) {
            botsay = '경매장검색 호출 제작중 입니다.';
            afterCall();
        }
        else if (findex[0] == 4) {
            botsay = '아이템검색 호출 제작중 입니다.';
            afterCall();
        }
        else {
            setBasicTalk();
            lastCall();
        }
    } else if (content == '헬' || content == 'ㅎ') {
        var topMsg = '[ ★☆★☆ 에픽 등장 ☆★☆★ ]';
        var tempS = epicbeam(helser);
        var tempCH = epicbeam2(tempS);

        botsay = topMsg + '\n\t\t\t\t\t\t\t\t\t' + tempS + '\n\t\t\t\t\t\t\t\t\t\t\t\t\t' + tempCH + ' Ch\n' + topMsg;
        lastCall();
    }
    else {
        setBasicTalk();
        lastCall();
    }


    console.log('최종 answer: ' + answer);

});

app.listen(3000, function () {
    console.log('Connect 3000 port!')
});
