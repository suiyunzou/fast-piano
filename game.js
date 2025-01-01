var tileHolder = [];
var config = {
    playing: false,
    isGameOver: false,
    cols: 4, // cordas
    rows: 5, // 
    width: window.innerWidth,
    height: window.innerHeight,
    speed: 6,
    tile: {
        border: 1,
        color: {
            default: "#FFF",
            clicked: "rgba(255, 255, 255, 0.5)",
            unclicked: "#000",
            wrong: "#ff5757"
        }
    },
    gameInterval: null,
    score: 0,
    maxScore: 0,
    accent: "#18f3ad",
    font: "bold 30px monospace",
    fontNormal: "bold 20px monospace",
    intervalTime: 40,
    incrementSpeedAfterTile: 15,
    speedIncrement: 0.4
};

function tileObject() {
    this.width = config.width / config.cols;
    this.height = config.height / config.rows;
    this.x = 0;
    this.y = 0;
    this.bgColor = config.tile.color.default;
    this.borderColor = "#000";
    this.border = 1;
    this.clickable = false;
    this.isClicked = false;
    this.row = 0;
    this.col = 0;
    this.className = '';
}

function _(id) {
    return document.getElementById(id);
}

function init() {
    tileHolder = [];

    // estica canvas
    var canvas = _('gameCanvas');
    canvas.width = config.width;
    canvas.height = config.height;
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';

    var halfRow = Math.round(config.rows / 2);
    var startTile = null;
    for (var i = 0; i < config.rows + 2; i++) {
        var selectedRandomTile = false;
        for (var j = 0; j < (config.cols); j++) {
            var tile = new tileObject();
            tile.x = tile.width * j;
            tile.y = config.height - tile.height * i;
            tile.row = i;
            tile.col = j;
            if (!selectedRandomTile) {

                if (
                    (Math.ceil(Math.random() * 5) == 2)
                        ||
                        j == config.cols - 1
                        ) {

                    selectedRandomTile = true;
                    /*
                     * Make starting some tile unclickable for game
                     */
                    if (i >= halfRow) {

                        if (startTile == null) {
                            startTile = tile;
                        }

                        makeTileClickable(tile);
                    }

                }
            }

            tileHolder.push(tile);
        }
    }
    draw();
    drawStartTile(startTile);

    // 添加分数显示元素
    if (!document.getElementById('score')) {
        var scoreElement = document.createElement('div');
        scoreElement.id = 'score';
        scoreElement.className = 'score';
        scoreElement.textContent = '0';
        document.body.appendChild(scoreElement);
    }
}

function drawStartTile(tile) {
    var c = _("gameCanvas").getContext('2d');
    c.font = config.fontNormal;
    c.fillStyle = config.tile.color.default;
    c.textAlign = "center";
    c.textBaseline = "middle";
    var x = tile.x + tile.width / 2;
    var y = tile.y + tile.height / 2;
    c.fillText("Start", x, y);
}


function startGame() {
    config.playing = true;
    config.gameInterval = setInterval(draw, 50);
}

function draw() {
    
    if (config.playing) {
        moveToNextFrame();
    }
    var c = _("gameCanvas").getContext('2d');
    c.clearRect(0, 0, config.width, config.height);
    for (var i = 0; i < tileHolder.length; i++) {
        var tempTile = tileHolder[i];
        drawTile(tempTile);
    }
    drawText(c);
    controleSpeed();

}

function drawTile(tempTile) {
    var c = _("gameCanvas").getContext('2d');
    
    // 保存当前上下文状态
    c.save();
    
    // 设置阴影效果
    c.shadowColor = 'rgba(0, 0, 0, 0.3)';
    c.shadowBlur = 5;
    c.shadowOffsetY = 2;
    
    // 绘制按键背景
    c.fillStyle = tempTile.bgColor;
    c.beginPath();
    c.roundRect(
        tempTile.x + tempTile.border,
        tempTile.y + tempTile.border,
        tempTile.width - tempTile.border * 2,
        tempTile.height - tempTile.border * 2,
        4  // 圆角半径
    );
    c.fill();
    
    // 添加渐变效果
    var gradient = c.createLinearGradient(
        tempTile.x,
        tempTile.y,
        tempTile.x,
        tempTile.y + tempTile.height
    );
    
    if (tempTile.bgColor === config.tile.color.default) {
        // 白键渐变
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.75, '#eeeeee');
        gradient.addColorStop(1, '#dddddd');
    } else if (tempTile.bgColor === config.tile.color.unclicked) {
        // 黑键渐变
        gradient.addColorStop(0, '#333333');
        gradient.addColorStop(1, '#000000');
    } else if (tempTile.bgColor === config.tile.color.clicked) {
        // 点击效果渐变 - 改为半透明效果
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');  // 较亮的半透明
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');  // 较暗的半透明
    }
    
    c.fillStyle = gradient;
    c.fill();
    
    // 添加高光效果
    if (tempTile.bgColor === config.tile.color.default) {
        var highlight = c.createLinearGradient(
            tempTile.x,
            tempTile.y,
            tempTile.x,
            tempTile.y + 20
        );
        highlight.addColorStop(0, 'rgba(255,255,255,0.8)');
        highlight.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = highlight;
        c.fill();
    }
    
    // 恢复上下文状态
    c.restore();
}

function drawText(c) {
    // 更新分数显示
    var scoreElement = document.getElementById('score');
    if (scoreElement) {
        if (scoreElement.textContent !== config.score.toString()) {
            scoreElement.textContent = config.score;
            scoreElement.classList.add('changed');
            
            // 移除动画类，让分数回到原始大小
            setTimeout(() => {
                scoreElement.classList.remove('changed');
            }, 200);  // 200ms 后恢复原始大小
        }
    }
}

function controleSpeed() {
    var num = config.incrementSpeedAfterTile;
    if (config.score % num == num - 1) {
        var newSpeed = config.speed + config.speedIncrement;
        if (newSpeed < 12) {
            config.speed = newSpeed;
            console.log("Speed increased to -> " + config.speed);
        }
    }
}

function makeTileClickable(tile) {
    tile.clickable = true;
    tile.isClicked = false;
    tile.bgColor = config.tile.color.unclicked;
}

function moveToNextFrame() {
    var len = tileHolder.length;
    var maxPosition = getMaxRowPosition();
    var tempTileHolder = [];
    for (var i = 0; i < len; i++) {
        var tempTile = tileHolder[i];

        if (tempTile.clickable) {
            if (!tempTile.isClicked) {
                if (tempTile.y + tempTile.height + config.speed >= config.height) {
                    tempTile.bgColor = config.tile.color.wrong;
                    gameOver();
                }
            }
        }

        if (tempTile.y > config.height) {
            tempTile.y = maxPosition - tempTile.height;
            resetTileExceptXYPosition(tempTile);
            tempTileHolder.push(tempTile);
        }
        
        tempTile.y += config.speed;
    }

    if (tempTileHolder.length > 0) {
        var randomeNumber = Math.ceil(Math.random() * config.cols - 1);
        console.log("Randome Number ->" + randomeNumber);
        makeTileClickable(tempTileHolder[randomeNumber]);
    }

}
function getMaxRowPosition() {
    var len = tileHolder.length;
    var maxTile = null;
    for (var i = 0; i < len; i += config.cols) {
        var tempTile = tileHolder[i];
        if (maxTile == null) {
            maxTile = tempTile;
        } else if (maxTile.y > tempTile.y) {
            maxTile = tempTile;
        }
    }
    return maxTile.y;
}

function stopGame() {
    clearInterval(config.gameInterval);
}

function gameMouseClick(e) {

    var x = e.clientX - _("gameCanvas").offsetLeft + window.scrollX;
    var y = e.clientY - _("gameCanvas").offsetTop + window.scrollY;
    console.log('x',x,'y',y);

    var leftButton = x < window.innerWidth/2 && y > window.innerHeight/2;


    if (config.isGameOver) {
        init();

    if(leftButton)
        showMusics();

        config.isGameOver = false;
        return;
    } else {

        if (!config.playing) {

            startGame();
        }
    }

    
    var clickedTile = getTileInPosition({x: x, y: y});

    if (clickedTile != null) {
        if (clickedTile.clickable) {
            if (!clickedTile.isClicked) {
                console.log("Nice!");
                clickedTile.isClicked = true;
                clickedTile.bgColor = config.tile.color.clicked;
                config.score++;

tock();

            } else {
                clickedTile.bgColor = config.tile.color.wrong;
//                            clickedTile.y += config.speed;
                drawTile(clickedTile);
                console.log("Wrong Tile. Game Over");
                gameOver();
            }
        } else {
            clickedTile.bgColor = config.tile.color.wrong;
//                        clickedTile.y += config.speed;
            drawTile(clickedTile);
            console.log("Wrong Tile. Game OVER")
            gameOver();
        }
    } else {
        console.log("Tile Not Found");
    }
}

function getTileInPosition(coords) {
    var x = coords.x;
    var y = coords.y;
    var len = tileHolder.length;

    for (var i = 0; i < len; i++) {
        var tempTile = tileHolder[i];
        if (x > tempTile.x && x < tempTile.x + tempTile.width) {
            if (y > tempTile.y && y < tempTile.y + tempTile.height) {
                return tempTile;
            }
        }
    }
    return null;

}

function resetTileExceptXYPosition(tile) {
    var y = tile.y;
    var x = tile.x;
    var tempTile = new tileObject();
    for (var k in tempTile) {
        tile[k] = tempTile[k];
    }
    tile.y = y;
    tile.x = x;
}

function gameOver() {
    config.isGameOver = true;
    config.playing = false;
    config.score = 0;
    clearInterval(config.gameInterval);
    
    var scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = '0';
    }
    
    var c = _("gameCanvas").getContext('2d');
    c.font = config.font;
    c.fillStyle = config.accent;
    c.textAlign = "center";
    c.fillText("Game Over", config.width / 2, 150);
}

init();

function showMusics(){

    var menuContainer = _('menuContainer');
    menuContainer.classList.remove('invisible');
    menuContainer.classList.toggle('visible');

    var gameContainer = _('gameContainer');
    gameContainer.classList.remove('visible');
    gameContainer.classList.toggle('invisible');


}

function selectSong(index){
    // 隐藏轮播控制按钮
    document.getElementById('carousel-controls').style.display = 'none';
    // 显示游戏控制按钮
    document.getElementById('game-controls').style.display = 'block';
    // 显示分数
    document.getElementById('score').style.display = 'block';

    var menuContainer = _('menuContainer');
    menuContainer.classList.remove('visible');
    menuContainer.classList.toggle('invisible');

    var gameContainer = _('gameContainer');
    gameContainer.classList.remove('invisible');
    gameContainer.classList.toggle('visible');

    playSong(index);
}

function backToMenu() {
    // 显示轮播控制按钮
    document.getElementById('carousel-controls').style.display = 'block';
    // 隐藏游戏控制按钮
    document.getElementById('game-controls').style.display = 'none';
    // 隐藏分数
    document.getElementById('score').style.display = 'none';

    var menuContainer = _('menuContainer');
    menuContainer.classList.remove('invisible');
    menuContainer.classList.toggle('visible');

    var gameContainer = _('gameContainer');
    gameContainer.classList.remove('visible');
    gameContainer.classList.toggle('invisible');
}

function restartGame() {
    init();
    config.isGameOver = false;
    config.score = 0;
    startGame();
}