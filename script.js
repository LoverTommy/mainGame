var adminPanel = document.getElementById('adminPanel');
var loginBar = document.getElementById('loginBar');
var userForm = document.forms.userForm;
userForm.addEventListener('submit', (eo)=>{
    eo.preventDefault();

    if(loginBarTitle.innerHTML == 'Вход') {
        doLogIn = true;
        apiRead();
        console.log('Вход');
    }else if(loginBarTitle.innerHTML == 'Регистрация') {
        apiLockGet();
        console.log('Регистрация');
    }
});

var loginBarTitle = document.getElementById('loginBarTitle');
var loginOrSignIn = document.getElementById('loginOrSignIn');
var nameInput = userForm.userName;
var passwordInput = userForm.password;
var stayLogIn = userForm.stayLogin;
var loginBarButton = document.getElementById('button');

var logInButton = document.getElementById('logIn');
logInButton.addEventListener('click', (eo)=>{
    setLogInBar();
});

var signInButton = document.getElementById('signIn');
signInButton.addEventListener('click', (eo)=>{
    setSignInBar();
});

var loginBarButton = document.getElementById('button');

var apiName = 'PROLAT_USERSDATA_API';
var apiUrl = 'https://fe.it-academy.by/AjaxStringStorage2.php';
var setApiPassword;

var apiCallResult;
var newUserInfo;
var doLogIn = false;
var updateUserGamesInfo = false;
var userGamesNumber;


var userBar = document.getElementById('userBar');
var userBarName = document.getElementById('userBarName');
var userBarGames = document.getElementById('gameStatistic');
var loginOrSignIn = document.getElementById('loginOrSignIn');
var userStatus = document.getElementById('status');
var logOutButton = document.getElementById('logOut')
logOutButton.addEventListener('click', ()=>{
    delete localStorage.user;
    userBar.style.display = 'none';
    loginOrSignIn.style.display = 'flex';
    adminPanel.style.display = 'none';
});

var localLogInCheck = false;


function setLogInBar() {
    loginBarTitle.innerHTML = 'Вход';
    loginBarButton.innerHTML = 'Войти';
    loginBar.style.cssText = 'animation-name: show; animation-duration: 1s; animation-fill-mode: forwards';
    loginBar.style.display = 'flex';
}

function setSignInBar() {
    loginBarTitle.innerHTML = 'Регистрация';
    loginBarButton.innerHTML = 'Зарегистрироваться';
    loginBar.style.cssText = 'animation-name: show; animation-duration: 1s; animation-fill-mode: forwards';
    loginBar.style.display = 'flex';
}

function apiRead() {
    $.ajax({
        url: apiUrl, type: 'POST', cache: false, dataType: 'json',
        data: { f: 'READ', n: apiName},
        success: apiReadSuccess, error: apiError,
    });
}

function apiReadSuccess(callResult) {
    apiCallResult = JSON.parse(callResult.result);

    if(localLogInCheck) {
        if(localStorage.user in apiCallResult) {
            console.log()
            localLogIn();
            localLogInCheck = false;
        }
    }

    if(doLogIn) {
        if(nameInput.value in apiCallResult) {
            if(passwordInput.value == apiCallResult[nameInput.value].password) {
                logIn();
            }else {
                alert('неверный пароль');
            }
        }else {
            alert('неверное имя пользователя');
        }
    }
}

function logIn() {
    doLogIn = false;
    loginBar.style.animation = 'none';
    setTimeout(() => {
        loginBar.style.display = 'none';
        userBar.style.display = 'flex';
        loginOrSignIn.style.display = 'none';
    }, 1000);

    userBarName.innerHTML = nameInput.value;
    userBarGames.innerHTML = apiCallResult[nameInput.value].gamesnumber;
    userStatus.innerHTML = apiCallResult[nameInput.value].status;

    if(userStatus.innerHTML == 'Admin') {
        adminPanel.style.display = 'flex';
    }
    
    if(stayLogIn.checked) {
        localStorage.setItem('user', nameInput.value);
        
        console.log(localStorage.getItem('user'));
    }
}

function localLogIn() {
    userBar.style.display = 'flex';
    loginOrSignIn.style.display = 'none';

    setTimeout(() => {
        userBarName.innerHTML = localStorage.user;
        userBarGames.innerHTML = apiCallResult[localStorage.user].gamesnumber;
        userStatus.innerHTML = apiCallResult[localStorage.user].status;
        if(userStatus.innerHTML == 'Admin') {
            adminPanel.style.display = 'flex';
        }
    }, 2000);

}


function apiLockGet() {
    setApiPassword = Math.random();
    apiRead();

    setTimeout(() => {
        if(nameInput.value in apiCallResult) {
            alert('Такой пользователь уже существует.');
        }else if(nameInput.value.length < 5 || passwordInput.value.length < 5) {
            alert('Пароль и никнейм не должны быть меньше 5 символов.');
        }else {
            $.ajax( {
                url : apiUrl, type : 'POST', cache : false, dataType:'json',
                data : { f: 'LOCKGET', n: apiName, p: setApiPassword },
                success: lockGetSuccess, error: apiError
            }
        );
        }
    }, 1000);
}

function updateUserInfo() {
    setApiPassword = Math.random();
    apiRead();

    setTimeout(() => {
            $.ajax( {
                url : apiUrl, type : 'POST', cache : false, dataType:'json',
                data : { f: 'LOCKGET', n: apiName, p: setApiPassword },
                success: updateUserGames, error: apiError
            }
        );

    }, 1000);
}

function lockGetSuccess(callResult) {
    apiCallResult = JSON.parse(callResult.result);

    apiCallResult[nameInput.value] = {'password': `${passwordInput.value}`, 'gamesnumber': 0, 'status': 'Player'};
            
    $.ajax({
            url : apiUrl, type : 'POST', cache : false, dataType:'json',
            data : { f: 'UPDATE', n: apiName, v: JSON.stringify(apiCallResult), p: setApiPassword },
            success: updateSuccess, error: apiError
        }
    );
}



function updateUserGames(callResult) {
    if(userBarName.innerHTML) {
        apiCallResult = JSON.parse(callResult.result);
        userGamesNumber = parseInt(userBarGames.innerHTML)
        apiCallResult[userBarName.innerHTML] = {'password': `${apiCallResult[userBarName.innerHTML].password}`, 'gamesnumber': `${userGamesNumber + 1}`, 'status': `${apiCallResult[userBarName.innerHTML].status}`};
    
        $.ajax({
            url : apiUrl, type : 'POST', cache : false, dataType:'json',
            data : { f: 'UPDATE', n: apiName, v: JSON.stringify(apiCallResult), p: setApiPassword },
            success: updateUserBar, error: apiError
        })
    }
}

function updateUserBar() {
    userBarGames.innerHTML = userGamesNumber + 1;
    updateUserGamesInfo = false;
}

function updateSuccess(callResult) {
    loginBar.style.animation = 'none';
    setTimeout(() => {
        loginBar.style.display = 'none';
        userBar.style.display = 'flex';
        loginOrSignIn.style.display = 'none';
    }, 1000);

    userBarName.innerHTML = nameInput.value;
    userBarGames.innerHTML = 0;
    userStatus.innerHTML = 'Player';

    if(userStatus.innerHTML == 'Admin') {
        adminPanel.style.display = 'flex';
    }

    if(stayLogIn.checked) {
        localStorage.setItem('user', nameInput.value);
        
        console.log(localStorage.getItem('user'));
    }

    console.log('updateSuccess');
}

function apiError() {
    console.log('error');
}


function checkStayLogIn() {
    if(localStorage.user) {
        localLogInCheck = true;
        console.log('localStorageTrue')
        apiRead();
    }
}

checkStayLogIn();




const play = document.getElementById('play');
play.addEventListener('click', startGame);
const menu = document.getElementById('menu');

const startPlay = document.getElementById('start')
const startSound = document.getElementById('startSound')



function startGame(eo) {
    menu.style.cssText = 'animation-name: closeMenu; animation-duration: 4s; animation-fill-mode: forwards';
    startSound.volume = '0.004';
    startSound.autoplay = 'autoplay';
    startSound.loop = 'loop';
    startSound.play();
    setTimeout(startGameOpen, 4000);
    function startGameOpen() {
        menu.style.display = 'none';
        startPlay.style.cssText = 'animation-name: openStart; animation-duration: 1s; animation-fill-mode: forwards';
        startPlay.style.display = 'flex';
    }
}

const gameRoom = document.getElementById('gameRoom');
const startButton = document.getElementById('startWalk')
const doorOpenSound = document.getElementById('walkOpen');
const warning = document.getElementById('warningQ')
startButton.addEventListener('click', walkToGameRoom);

function walkToGameRoom(eo) {
    startPlay.style.cssText = 'animation-name: closeStartRoom; animation-duration: 1s; animation-fill-mode: forwards';
    
    player.loadSounds();

    setTimeout(doorOpen, 1000);

    function doorOpen() {
        startPlay.style.display = 'none';
        doorOpenSound.volume = '0.05';
        doorOpenSound.play();
        setTimeout(startSoundVolumeMore, 800);
        function startSoundVolumeMore() {
            startSound.volume = '0.02';
        }

        setTimeout(() => {
            warning.style.cssText = 'animation-name: show; animation-duration: 1s; animation-fill-mode: forwards';
            warning.style.display = 'flex';
        }, 1000);

        setTimeout(() => {
            warning.style.display = 'none';
        }, 6000);

        setTimeout(startGameWalk, 7000);
        function startGameWalk() {
            startSound.volume = '0.004';
            gameRoom.style.cssText = 'animation-name: openStartGameRoom; animation-duration: 1.5s; animation-fill-mode: forwards'
            gameRoom.style.display = 'flex';
            setTimeout(titre, 1000);
        }
    }
}

function titre() {
    const titre = document.getElementById('titre');
    titre.style.cssText = 'animation-name: titreUp; animation-duration: 1s; animation-fill-mode: forwards; animation-timing-function: ease-out';
    titre.style.display = 'flex';

    setTimeout(firstTitre, 1000);

    function firstTitre() {
        titre.innerHTML = '';
        const titreText = 'Приступим.'
        const titreLetters = titreText.split('');
        let letterIndex = 0;

        const addLetters = setInterval(addLetter, 50);
        function addLetter() {
            titre.innerHTML += titreLetters[letterIndex];
            letterIndex += 1;
            if(letterIndex >= titreLetters.length) {
                clearInterval(addLetters);

                setTimeout(start, 1000);
                function start() {
                    player.firstRound();
                }
            }
        }
    }
}


class Game {
    constructor() {
        this.bulletsBar = document.getElementById('bulletsBar');
        this.titre = document.getElementById('titre');
        this.bullets = {
            true: 0,
            false: 0,
            bulletsArr: []
        };

        this.healPoints = {
            dealer: 0,
            player: 0,
            maxPlayerHP: 0,
        }

        this.dealerActiveItems = {
            blockMove: false,
            knife: false,
        };

        this.playerActiveItems = {
            blockMove: false,
            knife: false,
        };

        this.roundNumAfterBlockMove = 0;

        this.healPointBar = document.getElementById('healPointsBar');
        this.dealerHealPoints = document.getElementById('dealerHealPoints');
        this.playerHealPoints = document.getElementById('playerHealPoints');

        this.roundNameItem = document.getElementById('roundName');
        this.firstRoundItem = document.getElementById('firstRound');
        this.secondRoundItem = document.getElementById('secondRound');
        this.deadRoundItem = document.getElementById('deadRound');

        this.gameRoom = document.getElementById('gameRoom');
        this.whiteWindow = document.getElementById('whiteWindow');

        this.roundActive = '';
        this.roundNumber = 0;

        this.turnsTitre = document.getElementById('turnsTitre');

        this.setItemsBox = document.getElementById('setItemsBox');
        this.itemsPack = document.getElementById('itemsPack');
        this.maxItems = 0;
        this.itemGet = 0;

        this.choiceGun = document.getElementById('choiceGun');
        this.choiceGun.addEventListener('mouseover', ()=>{
            this.choiceGun.innerHTML = 'Выстрел';
        });

        this.choiceGun.addEventListener('mouseout', ()=>{
            this.choiceGun.innerHTML = '';
        });

        this.choiceGun.addEventListener('click', this.startChoiceShot);

        this.menu = document.getElementById('menu');

        this.firstRoundSound = document.getElementById('startSound');

        this.moveToMenuButton = document.getElementById('moveToMenu');
    }

    loadSounds() {
        this.pushBullet = new Audio();
        this.pushBullet.src = './sounds/pushBullet.mp3';
        this.pushBullet.volume = '0.5';
        this.pushBullet.play();
        this.pushBullet.pause();
    
        this.buckShotReload = new Audio();
        this.buckShotReload.src = './sounds/reload.mp3';
        this.buckShotReload.volume = '0.1';
        this.buckShotReload.play();
        this.buckShotReload.pause();
    
        this.falseShot = new Audio();
        this.falseShot.src = './sounds/falseShot.mp3';
        this.falseShot.volume = '0.5';
        this.falseShot.play();
        this.falseShot.pause();
        
        this.trueShot = new Audio();
        this.trueShot.src = './sounds/trueShot.mp3';
        this.trueShot.volume = '0.1';
        this.trueShot.play();
        this.trueShot.pause();
    
        this.heart = new Audio();
        this.heart.src = './sounds/heart.mp3';
        this.heart.volume = '0.3';
        this.heart.play();
        this.heart.pause();

        this.secondRoundSound = new Audio();
        this.secondRoundSound.src = './sounds/secondRoundMusic.mp3';
        this.secondRoundSound.volume = '0.004';
        this.secondRoundSound.autoplay = 'autoplay';
        this.secondRoundSound.loop = 'loop';
        this.secondRoundSound.play();
        this.secondRoundSound.pause();

        this.deadRoundSound = new Audio();
        this.deadRoundSound.src = './sounds/deadRoundMusic.mp3';
        this.deadRoundSound.volume = '0.004';
        this.deadRoundSound.autoplay = 'autoplay';
        this.deadRoundSound.loop = 'loop';
        this.deadRoundSound.play();
        this.deadRoundSound.pause();

        this.winSound = new Audio();
        this.winSound.src = './sounds/winMusic.mp3';
        this.winSound.volume = '0.009';
        this.winSound.play();
        this.winSound.pause();


        this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
        window.addEventListener('beforeunload', (eo)=>{
            eo.preventDefault();
        });
    }

    deleteSounds() {
        this.pushBullet.pause();
        this.pushBullet.currentTime = 0;
        
        this.buckShotReload.pause();
        this.buckShotReload.currentTime = 0;

        this.falseShot.pause();
        this.falseShot.currentTime = 0;

        this.trueShot.pause();
        this.trueShot.currentTime = 0;

        this.heart.pause();
        this.heart.currentTime = 0;

        this.secondRoundSound.pause();
        this.secondRoundSound.currentTime = 0;

        this.deadRoundSound.pause();
        this.deadRoundSound.currentTime = 0;

        this.firstRoundSound.pause();
        this.firstRoundSound.currentTime = 0;

        this.winSound.pause();
        this.winSound.currentTime = 0;
    }

    randomNumber(n,m) {
        return Math.floor(Math.random()*(m-n+1))+n;
    }

    pushBullets(trueBullets, falseBullets) {
        for(let i = 0; i < trueBullets; i++) {
            this.bullets.bulletsArr.push(1);
        }

        for(let i = 0; i < falseBullets; i++) {
            this.bullets.bulletsArr.push(2);
        }
    }

    randomSort() {
        return Math.random() - 0.5;
    }

    randomSortBullets() {
        this.bullets.bulletsArr.sort(this.randomSort);
    }

    setNewRound() {
        if(this.roundActive == 'firstRound' && this.roundNumber == 1) {
            setTimeout(() => {
                this.showTitre('Отлично, продолжим...')
                this.roundNumber = 2;
                this.bullets.bulletsArr = [];
                this.bullets.true = 2;
                this.bullets.false = 4;
                this.pushBullets(2,4);
            }, 1000);

            setTimeout(() => {
                this.setBullets();
            }, 5000);

            setTimeout(() => {
                this.roundStart();
            }, 10000);
        }

        if(this.roundActive == 'firstRound' && this.roundNumber == 2) {
            setTimeout(() => {
                this.showTitre('Хорошо держишься, усложним игру.')
            }, 2000);

            setTimeout(() => {
                this.secondRound();
            }, 4000);
        }

        if(this.roundActive == 'secondRound' && this.roundNumber == 1) {
            setTimeout(() => {
                this.showTitre('Патроны кончились, продолжим...')
                this.roundNumber = 2;
                this.bullets.bulletsArr = [];
                this.bullets.true = 3;
                this.bullets.false = 3;
                this.pushBullets(3,3);
            }, 1000);

            setTimeout(() => {
                this.setBullets();
            }, 5000);

            setTimeout(() => {
                this.setItems();
            }, 10000);
        }

        if(this.roundActive == 'secondRound' && this.roundNumber == 2) {
            setTimeout(() => {
                this.showTitre('Патроны кончились, новая партия...')
                this.roundNumber = 3;
                this.bullets.bulletsArr = [];
                this.bullets.true = 4;
                this.bullets.false = 6;
                this.pushBullets(4,6);
            }, 1000);

            setTimeout(() => {
                this.setBullets();
            }, 5000);

            setTimeout(() => {
                this.setItems();
            }, 10000);
        }

        if(this.roundActive == 'secondRound' && this.roundNumber == 3) {
            setTimeout(() => {
                this.deadRound();
            }, 2000);
        }

        if(this.roundActive == 'deadRound' && this.roundNumber == 1) {
            setTimeout(() => {
                this.showTitre('Патроны кончились, продолжим...')
                this.roundNumber = 2;
                this.bullets.bulletsArr = [];
                this.bullets.true = 4;
                this.bullets.false = 3;
                this.maxItems = 2;
                this.pushBullets(4,3);
            }, 1000);

            setTimeout(() => {
                this.setBullets();
            }, 5000);

            setTimeout(() => {
                this.setItems();
            }, 10000);
        }

        if(this.roundActive == 'deadRound' && this.roundNumber == 2) {
            setTimeout(() => {
                this.showTitre('Патроны кончились, продолжим...')
                this.roundNumber = 3;
                this.bullets.bulletsArr = [];
                this.bullets.true = 5;
                this.bullets.false = 8;
                this.pushBullets(5,4);
            }, 1000);

            setTimeout(() => {
                this.setBullets();
            }, 6000);

            setTimeout(() => {
                this.setItems();
            }, 10000);
        }
    }

    endGame() {
        this.deleteSounds();

        this.gameRoom.style.display = 'none';

        setTimeout(() => {
            this.endGameText = document.createElement('h2');
            this.endGameText.innerHTML = 'Мёртв';
            this.endGameText.style.cssText = 'font-size: 100px; font-family: "disc"; position: absolute; left: 44%; top: 42%; color: rgba(255, 164, 164, 0.644); animation-name: show; animation-duration: 1s; animation-fill-mode: forwards';
            document.body.appendChild(this.endGameText);
        }, 1000);

        setTimeout(() => {
            this.endGameText.style.cssText = 'font-size: 60px; font-family: "disc"; position: absolute; left: 44%; top: 44%; color: rgba(255, 164, 164, 0.644); animation-name: hide; animation-duration: 1s; animation-fill-mode: forwards';
            document.body.removeChild(this.endGameText);
        }, 3000);
        setTimeout(() => {
            this.menu.style.cssText = 'animation-name: show; animation-duration: 1s; animation-fill-mode: forwards';
            this.menu.style.display = 'flex';
        }, 5000);

        window.removeEventListener('beforeunload', (eo)=>{
            eo.preventDefault();
        });
    }

    winGame() {
        this.gameRoom.style.backgroundImage = "url('./images/afterTrueShotDealer.jpeg')"
        this.deadRoundSound.pause();
        this.winSound.play();
        this.gameRoom.style.animation = 'none';

        setTimeout(() => {
            this.gameRoom.style.animationName = 'hide';
            this.gameRoom.style.animationDuration = '12s';
            this.gameRoom.style.animationFillMode = 'forwards';
            this.winSound.play();
        }, 2000);

        setTimeout(() => {
            this.moveToMenuButton.style.animationName = 'show';
            this.moveToMenuButton.style.animationDuration = '4s';
            this.moveToMenuButton.style.animationFillMode = 'forwards';
            this.moveToMenuButton.style.display = 'block';
            this.moveToMenuButton.addEventListener('click', ()=>{
                this.moveToMenuButton.style.display = 'none';
                this.gameRoom.style.display = 'none';
                this.gameRoom.style.animation = 'none';
                this.menu.style.animationName = 'show';
                this.menu.style.animationDuration = '4s';
                this.menu.style.animationFillMode = 'forwards';
                this.menu.style.display = 'flex';
                this.deleteSounds();
            })
        }, 10000);

        window.removeEventListener('beforeunload', (eo)=>{
            eo.preventDefault();
        });

        updateUserGamesInfo = true;
        updateUserInfo()
    }
    
    firstRound() {
        this.roundActive = 'firstRound';
        this.roundNumber = 1;
        this.bullets.true = 0;
        this.bullets.false = 0;

        this.bullets.true = 1;
        this.bullets.false = 2;
        this.pushBullets(1,2);

        this.healPoints.dealer = 2;
        this.healPoints.player = 2;

        this.setRound(this.firstRoundItem, 'first', false, true)
        setTimeout(()=> {
            this.setBullets()
        },3000);
        setTimeout(()=> {
            this.showTitre(`Колличество дефибриляторов: Диллер - ${this.healPoints.dealer}, Игрок - ${this.healPoints.player}.`,null,this.healPointsUpdate());
        },8000)
        setTimeout(()=> {
            this.setRound(this.firstRoundItem, 'first', true, false)
        }, 10000);
    }

    showTurnDealerTitre() {
        this.turnsTitre.style.cssText = 'animation-name: hideShow; animation-duration: 3s; animation-fill-mode: forwards';
        this.turnsTitre.style.display = 'flex';

        setTimeout(() => {
            this.turnsTitre.style.display = 'none';
            this.turnsTitre.style.cssText = 'animation: none';
        }, 4000);
    }

    secondRound() {
        this.secondRoundSound.play();
        this.roundActive = 'secondRound';
        this.roundNumber = 1;

        this.bullets.bulletsArr = [];
        this.bullets.true = 3;
        this.bullets.false = 4;
        this.pushBullets(3,4);

        this.healPoints.dealer = 6;
        this.healPoints.player = 4;
        this.healPoints.maxPlayerHP = 4;

        this.maxItems = 2;

        this.setRound(this.secondRoundItem, 'second', false, true)
        setTimeout(()=> {
            this.setBullets()
        },3000);
        setTimeout(()=> {
            this.showTitre(`Колличество дефибриляторов: Диллер - ${this.healPoints.dealer}, Игрок - ${this.healPoints.player}.`,null,this.healPointsUpdate());
        },8000)

        setTimeout(() => {
            this.setItems();
        }, 14000);
    }

    deadRound() {
        this.secondRoundSound.pause();
        this.deadRoundSound.play();
        this.roundActive = 'deadRound';
        this.roundNumber = 1;

        this.bullets.bulletsArr = [];
        this.bullets.true = 3;
        this.bullets.false = 3;
        this.pushBullets(3,3);

        this.healPoints.dealer = 7;
        this.healPoints.player = 4;
        this.healPoints.maxPlayerHP = 4;

        this.maxItems = 4;

        while(this.itemsPack.firstChild) {
            this.itemsPack.removeChild(this.itemsPack.firstChild);
        }

        this.setRound(this.deadRoundItem, 'dead', false, true)

        setTimeout(() => {
            this.showTitre('Наконец. Мы подошли к финальной схватке.');
        }, 3000);

        setTimeout(() => {
            this.showTitre('Сейчас. Я и Ты. Мы танцуем на грани жизни и смерти.')
        }, 8000);
        
        setTimeout(()=> {
            this.setBullets()
        },13000);
        
        setTimeout(()=> {
            this.showTitre(`Колличество дефибриляторов: Диллер - ${this.healPoints.dealer}, Игрок - ${this.healPoints.player}.`,null,this.healPointsUpdate());
        },18000)

        setTimeout(() => {
            this.setItems();
        }, 24000);
    }

    roundAdminPanel(roundName, roundNum) {
        this.roundActive = `${roundName}`;
        this.roundNumber = roundNum;
        this.loadSounds();
        if(roundName == 'firstRound') {
            this.firstRoundSound.volume = '0.004';
            this.firstRoundSound.autoplay = 'autoplay';
            this.firstRoundSound.loop = 'loop';
            this.firstRoundSound.play();
        }else if(roundName == 'secondRound') {
            this.secondRoundSound.volume = '0.004';
            this.secondRoundSound.autoplay = 'autoplay';
            this.secondRoundSound.loop = 'loop';
            this.secondRoundSound.play();
            this.maxItems = 2;
        }else if(roundName == 'deadRound') {
            this.deadRoundSound.volume = '0.004';
            this.deadRoundSound.autoplay = 'autoplay';
            this.deadRoundSound.loop = 'loop';
            this.deadRoundSound.play();
            this.maxItems = 4;
        }

        this.menu.style.display = 'none';
        this.gameRoom.style.display = 'flex';
        this.setNewRound();
    }

    setItems() {
        this.showTitre(`${this.maxItems} предмета.`);
        this.itemGet = 0;
        this.setItemsBox.style.cssText = 'animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards';
        this.setItemsBox.style.display = 'flex';
        this.setItemsBox.addEventListener('click', this.getRandomItemListener);
    }

    getRandomItemListener() {
        player.getRandomItem();
    }

    getRandomItem() {
        this.randomItem = this.randomNumber(1,4);
        console.log(this.randomItem);

        if(this.randomItem == 1) {
            this.itemGet += 1;
            this.setItemsBox.removeEventListener('click', this.getRandomItemListener);
            this.setItemLupa();
        }

        if(this.randomItem == 2) {
            this.itemGet += 1;
            this.setItemsBox.removeEventListener('click', this.getRandomItemListener);
            this.setItemCigarettes();
        }

        if(this.randomItem == 3) {
            this.itemGet += 1;
            this.setItemsBox.removeEventListener('click', this.getRandomItemListener);
            this.setItemBlockMove();
        }

        if(this.randomItem == 4) {
            this.itemGet += 1;
            this.setItemsBox.removeEventListener('click', this.getRandomItemListener);
            this.setItemKnife();
        }
    }

    setItemLupa() {
        this.lupaItem = document.createElement('div');
        this.lupaImg = document.createElement('img');
        this.lupaImg.src = './images/lupa.png';
        this.lupaImg.style.cssText = 'width: 95%; height: 95%; object-fit: contain; filter:contrast(0%)'
        this.lupaItem.appendChild(this.lupaImg);
        this.lupaItem.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 80px; height: 80px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards; cursor: pointer'
        this.lupaItem.id = `lupa`;
        this.itemsPack.appendChild(this.lupaItem);
        this.setItemsBox.addEventListener('click', this.getRandomItemListener);

        if(this.itemGet === this.maxItems) {
            setTimeout(() => {
                this.setItemsBox.style.cssText = 'animation-name: hide; animation-duration: 0.5s; animation-fill-mode: forwards'
                this.setItemsBox.style.display = 'none';
                this.setRound(this.secondRoundItem, 'second', true, false)
            }, 300);
        }
    }

    setItemCigarettes() {
        this.cigarettesItem = document.createElement('div');
        this.cigarettesImg = document.createElement('img');
        this.cigarettesImg.src = './images/cigarettes.png';
        this.cigarettesImg.style.cssText = 'width: 95%; height: 95%; object-fit: contain; filter:contrast(0%)'
        this.cigarettesItem.appendChild(this.cigarettesImg);
        this.cigarettesItem.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 80px; height: 80px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards; cursor: pointer'
        this.cigarettesItem.id = `cigarettes`;
        this.itemsPack.appendChild(this.cigarettesItem);
        this.setItemsBox.addEventListener('click', this.getRandomItemListener);

        if(this.itemGet === this.maxItems) {
            setTimeout(() => {
                this.setItemsBox.style.cssText = 'animation-name: hide; animation-duration: 0.5s; animation-fill-mode: forwards'
                this.setItemsBox.style.display = 'none';
                this.setRound(this.secondRoundItem, 'second', true, false)
            }, 300);
        }
    }

    setItemBlockMove() {
        this.roundNumAfterBlockMove = 0;
        this.blockMoveItem = document.createElement('div');
        this.blockMoveImg = document.createElement('img');
        this.blockMoveImg.src = './images/blockMove.png';
        this.blockMoveImg.style.cssText = 'width: 95%; height: 95%; object-fit: contain; filter:contrast(0%)'
        this.blockMoveItem.appendChild(this.blockMoveImg);
        this.blockMoveItem.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 80px; height: 80px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards; cursor: pointer'
        this.blockMoveItem.id = `blockMove`;
        this.itemsPack.appendChild(this.blockMoveItem);
        this.setItemsBox.addEventListener('click', this.getRandomItemListener);

        if(this.itemGet === this.maxItems) {
            setTimeout(() => {
                this.setItemsBox.style.cssText = 'animation-name: hide; animation-duration: 0.5s; animation-fill-mode: forwards'
                this.setItemsBox.style.display = 'none';
                this.setRound(this.secondRoundItem, 'second', true, false)
            }, 300);
        }
    }

    setItemKnife() {
        this.knifeItem = document.createElement('div');
        this.knifeImg = document.createElement('img');
        this.knifeImg.src = './images/knife.png';
        this.knifeImg.style.cssText = 'width: 95%; height: 95%; object-fit: contain; filter:contrast(0%)'
        this.knifeItem.appendChild(this.knifeImg);
        this.knifeItem.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 80px; height: 80px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards; cursor: pointer';
        this.knifeItem.id = `knife`;
        this.itemsPack.appendChild(this.knifeItem);
        this.setItemsBox.addEventListener('click', this.getRandomItemListener);

        if(this.itemGet === this.maxItems) {
            setTimeout(() => {
                this.setItemsBox.style.cssText = 'animation-name: hide; animation-duration: 0.5s; animation-fill-mode: forwards'
                this.setItemsBox.style.display = 'none';
                this.setRound(this.secondRoundItem, 'second', true, false)
            }, 300);
        }
    }

    getItemInfo(eo) {
        console.log(eo.currentTarget)
        player.useItems(eo.currentTarget);
    }

    useItems(target) {
        console.log('выбран:' + target);
        console.log('id:' + target.id);
        if(target.id == 'lupa') {
            this.itemsPack.removeChild(target);
            target.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 150px; height: 150px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; position: absolute; left: 45%; top: 40%; animation: shake 0.5s; animation-iteration-count: infinite;';
            this.gameRoom.appendChild(target);

            setTimeout(() => {
                this.gameRoom.removeChild(target);
                this.useLupa();
            }, 1500);
        }

        if(target.id == 'cigarettes') {
            this.itemsPack.removeChild(target);
            target.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 150px; height: 150px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; position: absolute; left: 45%; top: 40%; animation: shake 0.5s; animation-iteration-count: infinite;';
            this.gameRoom.appendChild(target);

            setTimeout(() => {
                this.gameRoom.removeChild(target);
                this.useCigarettes();
            }, 1500);
        }

        if(target.id == 'blockMove') {
            this.itemsPack.removeChild(target);
            target.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 150px; height: 150px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; position: absolute; left: 45%; top: 40%; animation: shake 0.5s; animation-iteration-count: infinite;';
            this.gameRoom.appendChild(target);

            setTimeout(() => {
                this.gameRoom.removeChild(target);
                this.useBlockMove();
            }, 1500);
        }

        if(target.id == 'knife') {
            this.itemsPack.removeChild(target);
            target.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 150px; height: 150px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; position: absolute; left: 45%; top: 40%; animation: shake 0.5s; animation-iteration-count: infinite;';
            this.gameRoom.appendChild(target);

            setTimeout(() => {
                this.gameRoom.removeChild(target);
                this.useKnife();
            }, 1500);
        }
    }

    useLupa() {
        this.img = '';
        if(this.bullets.bulletsArr[0] == 1) {
            this.img = './images/trueBullet.svg';
        }else {
            this.img = './images/falseBullet.svg';
        }
        this.lupaDiv = document.createElement('div');
        this.lupaDiv.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 150px; height: 150px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; position: absolute; left: 45%; top: 40%; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards';
        this.lupaImg = document.createElement('img')
        this.lupaImg.style.cssText = 'width: 95%; height: 95%; object-fit: contain';
        this.lupaImg.src = this.img;
        this.lupaDiv.appendChild(this.lupaImg);
        this.gameRoom.appendChild(this.lupaDiv);

        setTimeout(() => {
            this.gameRoom.removeChild(this.lupaDiv);
        }, 1500);
    }

    useCigarettes() {
        if(this.healPoints.player == this.healPoints.maxPlayerHP) {
            return
        }else {
            this.healPoints.player += 1;
            this.healPointsUpdate();
        }
    }

    useBlockMove() {
        this.dealerActiveItems.blockMove = true;
        this.blockMoveText = document.createElement('div');
        this.blockMoveText.id = 'blockMoveText';
        this.blockMoveText.innerHTML = 'В наручниках';
        this.blockMoveText.style.cssText = 'font-size: 40px; color: rgba(255, 164, 164, 0.644); font-family: "konst"; position: absolute; left: 46%; top: 20px; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards';
        this.gameRoom.appendChild(this.blockMoveText);
    }

    useKnife() {
        this.playerActiveItems.knife = true;
        this.knifeTitre = document.createElement('div');
        this.knifeTitre.style.cssText = 'color: rgba(255, 164, 164, 0.644); font-size: 50px; font-family: "konst"; display: flex; justify-content: center; align-items: center; width: 150px; height: 150px; background-color: rgba(0, 0, 0, 0.514); border-radius: 5px; border: 1px, rgba(255, 255, 255, 0.521), solid; position: absolute; left: 45%; top: 40%; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards';
        this.knifeTitre.innerHTML = 'x2 Урон';
        this.gameRoom.appendChild(this.knifeTitre);
        setTimeout(() => {
            this.gameRoom.removeChild(this.knifeTitre);
        }, 1500);
    }

    setBullets() {
        while (this.bulletsBar.firstChild) {
            this.bulletsBar.removeChild(this.bulletsBar.firstChild);
        }

        for(let i = 0; i < this.bullets.true; i++) {
            const bullet = document.createElement('img');
            bullet.src = './images/trueBullet.svg';
            this.bulletsBar.appendChild(bullet);
        }
    
        for(let i = 0; i < this.bullets.false; i++) {
            const bullet = document.createElement('img');
            bullet.src = './images/falseBullet.svg';
            this.bulletsBar.appendChild(bullet);
        }

        this.titreText = `Колличество патрон на раунд: ${this.bullets.true} - настоящих, ${this.bullets.false} - пустых.`;
        this.showTitre(this.titreText, this.bulletsBar);
    }

    showTitre(text, target, setting) {
        this.titre.innerHTML = '';
        this.titre.style.cssText = 'animation-name: titreUp; animation-duration: 1.5s; animation-fill-mode: forwards';
        this.titre.style.display = 'flex';
        if(target) {
            target.style.cssText = 'animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards';
            target.style.display = 'flex';
        }
        this.titreLetters = text.split('');
        this.letterIndex = 0;

        this.addLetters = setInterval(() => {
            this.titre.innerHTML += this.titreLetters[this.letterIndex];
            this.letterIndex += 1;
            
            if(this.letterIndex >= this.titreLetters.length) {
                clearInterval(this.addLetters);
                setTimeout(()=> {
                    this.titre.style.display = 'none';
                    if(target) {
                        target.style.display = 'none';
                        target.style.cssText = 'animation: none';
                    }
                }, 2000)
            }
        }, 50);

    }

    healPointsUpdate() {
        while (this.dealerHealPoints.firstChild) {
            this.dealerHealPoints.removeChild(this.dealerHealPoints.firstChild);
        }

        while (this.playerHealPoints.firstChild) {
            this.playerHealPoints.removeChild(this.playerHealPoints.firstChild);
        }

        for(let i = 0; i < this.healPoints.dealer; i++) {
            const healpoint = document.createElement('img');
            healpoint.src = './images/healPoint.svg';
            healpoint.id = 'healPointSVG';
            this.dealerHealPoints.appendChild(healpoint);
        }
    
        for(let i = 0; i < this.healPoints.player; i++) {
            const healpoint = document.createElement('img');
            healpoint.src = './images/healPoint.svg';
            healpoint.id = 'healPointSVG';
            this.playerHealPoints.appendChild(healpoint);
        }


        this.healPointBar.style.cssText = 'top: 40%; right: 42%; animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards';
        setTimeout(()=> {
            this.healPointBar.style.cssText = 'top: 10px; right: 10px';
        },2000);
        this.playerHealPoints.style.cssText = 'animation-name: hideShowToggle; animation-duration: 1s; animation-fill-mode: forwards';
        setTimeout(()=> {
            this.playerHealPoints.style.cssText = 'animation: none';
        },3000);
        this.dealerHealPoints.style.cssText = 'animation-name: hideShowToggle; animation-duration: 1s; animation-fill-mode: forwards';
        setTimeout(()=> {
            this.dealerHealPoints.style.cssText = 'animation: none';
        },3000);
    }

    setRound(round, roundName, showTitre, showRoundItem) {
        if(showRoundItem) {
            this.roundNameItem.style.cssText = 'animation-name: show; animation-duration: 0.5s; animation-fill-mode: forwards';
            this.roundNameItem.style.display = 'flex';
            round.style.cssText = 'animation-name: hideShowToggle; animation-duration: 1s; animation-fill-mode: forwards';
            setTimeout(()=> {
                this.roundNameItem.style.display = 'none';
                this.roundNameItem.style.cssText = 'animation: none';
                round.style.cssText = 'animation: none';
            },3000);
        }

        if(showTitre) {
            setTimeout(() => {
                this.roundStart();
            }, 3000);
        }
        
    }

    roundStart() {
        this.showTitre('Я заряжаю патроны в случайном порядке...')
        this.randomSortBullets();
        console.log(this.bullets.bulletsArr);

        this.bulletsPushed = 0;
        this.gameRoom.style.backgroundImage = "url('./images/pushBullets.png')";

        this.push = setInterval(()=> {
            this.pushBullet.play();
            this.bulletsPushed += 1;
            if(this.bulletsPushed == 5) {
                setTimeout(()=> {
                    this.buckShotReload.play();
                },1000);
                clearInterval(this.push);
            }
        },800);

        setTimeout(()=> {
            this.choiceMove();
        },6000);
    }

    choiceMove() {
        if(this.dealerActiveItems.blockMove && this.roundNumAfterBlockMove == 1) {
            this.dealerActiveItems.blockMove = false;
            this.gameRoom.removeChild(this.blockMoveText);
        }else if(this.dealerActiveItems.blockMove && this.roundNumAfterBlockMove != 1){
            this.roundNumAfterBlockMove = 1;
        }

        this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')";
        this.choiceGun.style.display = 'flex';

        this.items = this.itemsPack.childNodes;
        for(let i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener('click', this.getItemInfo);
        }
    }

    startChoiceShot(eo) {
        player.choiceShot();
    }

    choiceShot() {
        for(let i = 0; i < this.items.length; i++) {
            this.items[i].removeEventListener('click', this.getItemInfo);
        }

        this.gameRoom.style.backgroundImage = "url('./images/choiceShot.png')";
        this.choiceGun.style.display = 'none';

        this.choiceDealer = document.createElement('div');
        this.choiceDealer.style.cssText = 'position: absolute; top: 10px; left: 44%; width: 220px; height: 80px; background-color: rgba(0, 0, 0, 0.473); border: 1px white solid; border-radius: 10px; display: flex; justify-content: center; align-items: center; color: white; font-size: 40px; cursor: pointer';
        this.choiceDealer.innerHTML = 'Диллер';
        this.choiceDealer.id = 'dealer';
        this.choiceDealer.addEventListener('click',this.startShot);
        this.gameRoom.appendChild(this.choiceDealer);

        this.choicePlayer = document.createElement('div');
        this.choicePlayer.style.cssText = 'position: absolute; bottom: 10px; left: 44%; width: 220px; height: 80px; background-color: rgba(0, 0, 0, 0.473); border: 1px white solid; border-radius: 10px; display: flex; justify-content: center; align-items: center; color: white; font-size: 40px; cursor: pointer';
        this.choicePlayer.innerHTML = 'Игрок';
        this.choicePlayer.id = 'player';
        this.choicePlayer.addEventListener('click',this.startShot);
        this.gameRoom.appendChild(this.choicePlayer);
    }

    startShot(eo) {
        player.shot(eo.target.id,'player');
    }

    shot(target, targetTurn) {
        this.choicePlayer.style.display = 'none';
        this.choiceDealer.style.display = 'none';
        if(targetTurn == 'player') {
            if(target == 'dealer') {
                console.log('выбран диллер')
                this.gameRoom.style.backgroundImage = "url('./images/toDealer.png')";
                
                setTimeout(()=> {
                    const bullet = this.bullets.bulletsArr[0];

                    if(bullet == 1) {
                        if(this.playerActiveItems.knife) {
                            this.healPoints.dealer -= 2;
                            this.playerActiveItems.knife = false;
                        }else {
                            this.healPoints.dealer -= 1;
                        }
                        this.playerTrueShotDealer();
                    }else if(bullet == 2){
                        if(this.playerActiveItems.knife) {
                            this.playerActiveItems.knife = false;
                        }
                        this.playerFalseShotDealer();
                    }
                },2000);
            }
    
            if(target == 'player') {
                console.log('выбран игрок');
                this.gameRoom.style.backgroundImage = "url('./images/toYourSelf.png')";

                setTimeout(()=> {
                    const bullet = this.bullets.bulletsArr[0];

                    if(bullet == 1) {
                        if(this.playerActiveItems.knife) {
                            this.healPoints.player -= 2;
                            this.playerActiveItems.knife = false;
                        }else {
                            this.healPoints.player -= 1;
                        }
                        this.playerTrueShotYourSelf();
                    }else if(bullet == 2){
                        if(this.playerActiveItems.knife) {
                            this.playerActiveItems.knife = false;
                        }
                        this.playerFalseShotYourSelf();
                    }
                },2000);
            }
        }

        if(targetTurn == 'dealer') {
            this.showTurnDealerTitre();
            if(target == 'player') {
                console.log('выбран игрок')

                setTimeout(() => {
                    this.gameRoom.style.backgroundImage = "url('./images/dealerToPlayer.png')";
                }, 4000);
                
                setTimeout(()=>{
                    const bullet = this.bullets.bulletsArr[0];

                    if(bullet == 1) {
                        this.healPoints.player -= 1;
                        this.dealerTrueShotPlayer();
                    }else if(bullet == 2) {
                        this.dealerFalseShotPlayer();
                    }
                },5000);
            }

            if(target == 'dealer') {
                console.log('выбран диллер')

                setTimeout(() => {
                    this.gameRoom.style.backgroundImage = "url('./images/dealerToHimSelf.png')";
                }, 4000);
                
                setTimeout(()=>{
                    const bullet = this.bullets.bulletsArr[0];

                    if(bullet == 1) {
                        this.healPoints.dealer -= 1;
                        this.dealerTrueShotHimSelf();
                    }else if(bullet == 2) {
                        this.dealerFalseShotHimSelf();
                    }
                },5000);
            }
        }

    }

    playerTrueShotYourSelf() {
        this.bullets.bulletsArr.shift();
        this.trueShot.play();
        this.whiteWindow.style.cssText = 'animation-name: whiteWindowAnimation; animation-duration: 6s; animation-fill-mode: forwards';
        this.whiteWindow.style.display = 'flex';

        setTimeout(()=>{
            this.heart.play();
            this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
        },100);

        setTimeout(() => {
            this.whiteWindow.style.display = 'none';
            this.buckShotReload.play();
            setTimeout(() => {
                this.healPointsUpdate();
            }, 1000);
        }, 5000);


        if(this.checkStatus()) {

        }else if(this.dealerActiveItems.blockMove){
            setTimeout(() => {
                this.choiceMove();
            }, 6000);
        }else {
            setTimeout(() => {
                this.dealerChoiceShot();
            }, 8000);
        }
    }

    playerTrueShotDealer() {
        this.bullets.bulletsArr.shift();
        this.trueShot.play();
        this.gameRoom.style.backgroundImage = "url('./images/afterTrueShotDealer.jpeg')"

        if(!this.checkStatus()) {
            setTimeout(()=>{
                this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
                this.healPointsUpdate();
                this.buckShotReload.play();
            },2000);

            if(this.dealerActiveItems.blockMove) {
                setTimeout(() => {
                    this.choiceMove(); 
                }, 5000);
            }else {
                setTimeout(() => {
                    this.dealerChoiceShot();
                }, 5000);
            }
        }
    }

    playerFalseShotYourSelf() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();
        setTimeout(()=> {
            this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
        },2000);

        if(!this.checkStatus()) {
            setTimeout(() => {
                this.choiceMove();
            }, 3000);
        }
    }

    playerFalseShotDealer() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();
        setTimeout(()=> {
            this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"

            if(this.checkStatus()) {

            }else if(this.dealerActiveItems.blockMove){
                this.choiceMove();
            }else {
                this.dealerChoiceShot();
            }
        },2000);
    }

    checkStatus() {
        if(this.roundActive == 'deadRound' && this.healPoints.dealer <= 0) {
            setTimeout(() => {
                this.winGame();      
            }, 2000);
            return true;
        }

        if(this.healPoints.player == 0) {
            setTimeout(() => {
                this.endGame();
            }, 2000);
            return true;
        }

        if(this.bullets.bulletsArr.length == 0 || this.healPoints.dealer <= 0) {
            setTimeout(() => {
                this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
                this.setNewRound();
            }, 4000);
            return true;
        }

    }

    dealerChoiceShot() {
        this.randomMove = this.randomNumber(2,3);

        if(this.randomMove == 2) {
            this.shot('player','dealer');
        }else if(this.randomMove == 3) {
            this.shot('dealer','dealer');
        }
    }

    dealerTrueShotPlayer() {
        this.bullets.bulletsArr.shift();
        this.trueShot.play();
        this.whiteWindow.style.cssText = 'animation-name: whiteWindowAnimation; animation-duration: 6s; animation-fill-mode: forwards';
        this.whiteWindow.style.display = 'flex';
    
        setTimeout(()=>{
            this.heart.play();
            this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
        },100);

        if(!this.checkStatus()) {
            setTimeout(() => {
                this.buckShotReload.play();
            }, 3000);

            setTimeout(() => {
                this.healPointsUpdate();
            }, 4000);
            setTimeout(() => {
                this.whiteWindow.style.display = 'none';
                this.choiceMove();
            }, 6000);
        }
    
        setTimeout(()=>{
            this.whiteWindow.style.display = 'none';
            this.healPointsUpdate();
            this.buckShotReload.play();
            if(this.checkStatus()) {
    
            }else {
                this.choiceMove();
            }
        },6000);
    }

    dealerTrueShotHimSelf() {
        this.bullets.bulletsArr.shift();
        this.trueShot.play();
        this.gameRoom.style.backgroundImage = "url('./images/afterTrueShotDealer.jpeg')"

        if(!this.checkStatus()) {
            setTimeout(() => {
                this.buckShotReload.play();
            }, 1000);
            setTimeout(() => {
                this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
                this.healPointsUpdate();
            }, 2000);
            setTimeout(() => {
                this.choiceMove();
            }, 5000);
        }
    }

    dealerFalseShotPlayer() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();

        if(!this.checkStatus()) {
            setTimeout(() => {
                this.choiceMove();
            }, 2000);
        }
    }

    dealerFalseShotHimSelf() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();
        setTimeout(()=> {
            this.gameRoom.style.backgroundImage = "url('./images/defaultBG.jpeg')"
        },2000);

        if(!this.checkStatus()) {
            setTimeout(() => {
                this.dealerChoiceShot();
            }, 4000);
        }
    }

}

var player = new Game();

const roundOne = document.getElementById('roundOne');
roundOne.addEventListener('click', ()=>{
    gameRoom.style.display = 'flex';
    menu.style.display = 'none';
    player.loadSounds();
    player.firstRound();
});

const roundTwo = document.getElementById('roundTwo');
roundTwo.addEventListener('click', ()=>{
    gameRoom.style.display = 'flex';
    menu.style.display = 'none';
    player.loadSounds();
    player.secondRound();
});

const deadRound = document.getElementById('deadRoundLink');
deadRound.addEventListener('click', ()=>{
    gameRoom.style.display = 'flex';
    menu.style.display = 'none';
    player.loadSounds();
    player.deadRound();
});

const winGame = document.getElementById('winGame');
winGame.addEventListener('click', ()=>{
    gameRoom.style.display = 'flex';
    menu.style.display = 'none';
    player.loadSounds();
    player.winGame();
});

const firstRoundTwo = document.getElementById('firstRoundTwo');
firstRoundTwo.addEventListener('click', ()=>{
    player.roundAdminPanel('firstRound', 1)
});

const secondRoundTwo = document.getElementById('secondRoundTwo');
secondRoundTwo.addEventListener('click', ()=>{
    player.roundAdminPanel('secondRound', 1)
});

const secondRoundThree = document.getElementById('secondRoundThree');
secondRoundThree.addEventListener('click', ()=>{
    player.roundAdminPanel('secondRound', 2)
});

const deadRoundTwo = document.getElementById('deadRoundTwo');
deadRoundTwo.addEventListener('click', ()=>{
    player.roundAdminPanel('deadRound', 1)
});

const deadRoundThree = document.getElementById('deadRoundThree');
deadRoundThree.addEventListener('click', ()=>{
    player.roundAdminPanel('deadRound', 2)
});

