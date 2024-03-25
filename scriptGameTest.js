setTimeout(titre, 1000);

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
        }
        this.healPointBar = document.getElementById('healPointsBar');
        this.dealerHealPoints = document.getElementById('dealerHealPoints');
        this.playerHealPoints = document.getElementById('playerHealPoints');

        this.roundNameItem = document.getElementById('roundName');
        this.firstRoundItem = document.getElementById('firstRound');
        this.secondRoundItem = document.getElementById('secondRound');
        this.deadRoundItem = document.getElementById('deadRound')

        this.gameRoom = document.getElementById('gameRoom');
        this.whiteWindow = document.getElementById('whiteWindow');

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

        this.roundActive = '';
        this.roundNumber = 0;

        this.turnsTitre = document.getElementById('turnsTitre');
    }

    loadSounds() {
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
            }, 2000);
            setTimeout(() => {
                this.setBullets();
            }, 4000);
            setTimeout(() => {
                this.roundStart();
            }, 9000);
        }

        if(this.roundActive == 'firstRound' && this.roundNumber == 2) {
            setTimeout(() => {
                this.showTitre('Хорошо держишься, усложним игру.')
            }, 2000);
            this.secondRound();
        }
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
        this.roundActive = 'secondRound';
        this.roundNumber = 1;

        this.bullets.bulletsArr = [];
        this.bullets.true = 3;
        this.bullets.false = 5;
        this.pushBullets(3,5);

        this.healPoints.dealer = 4;
        this.healPoints.player = 4;


        this.setRound(this.secondRoundItem, 'second', false, true)
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
            this.dealerHealPoints.appendChild(healpoint);
        }
    
        for(let i = 0; i < this.healPoints.player; i++) {
            const healpoint = document.createElement('img');
            healpoint.src = './images/healPoint.svg';
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
            },3000);
        }

        if(showTitre) {
            if(roundName === 'first') {
                setTimeout(()=> {
                    this.roundStart();
                },3000)
            }
        }
        
    }

    roundStart() {
        this.showTitre('Я заряжаю патроны в случайном порядке...')
        this.randomSortBullets();
        this.bulletsPushed = 0;
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
            this.choiceShot();
        },6000);
    }

    choiceShot() {
        this.gameRoom.style.backgroundImage = "url('./images/choiceShot.png')";

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
                        this.healPoints.dealer -= 1;
                        this.playerTrueShotDealer();
                    }else if(bullet == 2){
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
                        this.healPoints.player -= 1;
                        this.playerTrueShotYourSelf();
                    }else if(bullet == 2){
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
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
        },100);

        setTimeout(()=>{
            this.whiteWindow.style.display = 'none';
            this.healPointsUpdate();
            this.buckShotReload.play();
            if(this.checkStatus()) {

            }else {
                setTimeout(() => {
                    this.dealerChoiceShot();
                }, 2000);
            }
        },6000);
    }

    playerTrueShotDealer() {
        this.bullets.bulletsArr.shift();
        this.trueShot.play();

        setTimeout(()=>{
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
        },2000);

        setTimeout(()=> {
            this.healPointsUpdate();
            this.buckShotReload.play();
            if(this.checkStatus()) {

            }else{
                setTimeout(() => {
                    this.dealerChoiceShot();
                }, 2000);
            }
        },4000);
    }

    playerFalseShotYourSelf() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();
        setTimeout(()=> {
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
        },2000);

        setTimeout(()=> {
            if(this.checkStatus()) {

            }else{
                setTimeout(() => {
                    this.choiceShot();
                }, 2000);
            }
        },4000);
    }

    playerFalseShotDealer() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();
        setTimeout(()=> {
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
            if(this.checkStatus()) {

            }else{
                setTimeout(() => {
                    this.dealerChoiceShot();
                }, 2000);
            }
        },2000);
    }

    checkStatus() {
        if(this.healPoints.player == 0) {
            console.log('end game');
        }

        if(this.bullets.bulletsArr.length == 0 || this.healPoints.dealer == 0) {
            this.setNewRound();
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
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
        },100);
    
        setTimeout(()=>{
            this.whiteWindow.style.display = 'none';
            this.healPointsUpdate();
            this.buckShotReload.play();
            if(this.checkStatus()) {
    
            }else {
                setTimeout(() => {
                    this.choiceShot();
                }, 2000);
            }
        },6000);
    }

    dealerTrueShotHimSelf() {
        this.bullets.bulletsArr.shift();
        this.trueShot.play();
        setTimeout(()=>{
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
            this.healPointsUpdate();
            this.buckShotReload.play();
            if(this.checkStatus()) {

            }else {
                setTimeout(() => {
                    this.choiceShot();
                }, 2000);
            }
        },1000);
    }

    dealerFalseShotPlayer() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();
        setTimeout(()=> {
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
            if(this.checkStatus()) {

            }else{
                setTimeout(() => {
                    this.choiceShot();
                }, 2000);
            }
        },2000);
    }

    dealerFalseShotHimSelf() {
        this.bullets.bulletsArr.shift();
        this.falseShot.play();
        setTimeout(()=> {
            this.gameRoom.style.backgroundImage = "url('./images/Screenshot_2.png')"
        },2000);

        setTimeout(()=> {
            if(this.checkStatus()) {

            }else{
                setTimeout(() => {
                    this.dealerChoiceShot();
                }, 2000);
            }
        },4000);
    }

}

var player = new Game();
