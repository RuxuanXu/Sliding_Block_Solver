var canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d");

function getUrlValue() {
    var num = location.search.substring(1).split("&");
    var temp = num[0].split("=");
    arr1 = unescape(temp[1]);
    temp = num[1].split("=");
    arr2 = unescape(temp[1]);
    return [arr1, arr2];
}
var size = getUrlValue(),
    B_SIZE = size[0] * size[1],
    B_LEN = 50; //grid size in pixel

document.getElementById("form1").value = size[0];
document.getElementById("form2").value = size[1];

canvas.width = size[0] * B_LEN;
canvas.height = size[1] * B_LEN;

var preBtn = document.getElementById("button1");
var nextBtn = document.getElementById("button2");

var radioValue = "0";
var algoValue = "0";

function getRadioValue(id) {
    radioValue = document.getElementById(id).value;
}

function getAlgoValue(id) {
    algoValue = document.getElementById(id).value;
}

var blockArr = new Array(B_SIZE),
    selected = new Array(B_SIZE),
    colors = new Array(B_SIZE),
    blockNum = new Array(B_SIZE);

function arrInit() {
    for (var i = 0; i < this.length; i++) this[i] = 0;
}

arrInit.call(blockArr);
arrInit.call(selected);
arrInit.call(colors);
arrInit.call(blockNum);

//mouse events
var isMouseDown = false;
canvas.addEventListener("mousedown", function(e) { isMouseDown = true });
canvas.addEventListener("mouseup", function(e) { isMouseDown = false });
canvas.addEventListener("mouseout", function(e) { isMouseDown = false });
canvas.addEventListener("mousedown", drawGrid);
canvas.addEventListener("mousemove", drawGrid);
canvas.addEventListener("mousemove", selectGrid);

var drawNum = 0,
    targetNum = -1,
    goalNum = -1,
    moveNum = 0;

function drawGrid(event) {
    var mouseX = event.clientX - canvas.getBoundingClientRect().left,
        mouseY = event.clientY - canvas.getBoundingClientRect().top;
    var deleted = 0;
    if (isMouseDown) {
        for (i = 0; i < size[1]; i++)
            for (p = 0; p < size[0]; p++)
                if (mouseX >= p * B_LEN && mouseX <= p * B_LEN + B_LEN &&
                    mouseY >= i * B_LEN && mouseY <= i * B_LEN + B_LEN)
                    switch (radioValue) {
                        case "0":
                            if (!drawNum)
                                for (var a = 1; a < blockNum.length; a++)
                                    if (!blockNum[a])
                                        drawNum = a,
                                        blockNum[drawNum] = true,
                                        a = blockNum.length;
                            if (drawNum && !blockArr[i * size[0] + p])
                                blockArr[i * size[0] + p] = drawNum;
                            break;
                        case "1":
                            for (var a = 1; a < blockNum.length; a++)
                                if (blockArr[i * size[0] + p] == a)
                                    deleted = a,
                                    blockNum[a] = false;
                            break;
                        case "2":
                            for (var a = 1; a < blockNum.length; a++)
                                if (blockArr[i * size[0] + p] == a)
                                    targetNum = a;
                            break;
                        case "3":
                            goalNum = i * size[0] + p;
                    }
    } else drawNum = 0;
    for (i = 0; i < size[1]; i++)
        for (p = 0; p < size[0]; p++)
            if (blockArr[i * size[0] + p] == deleted)
                blockArr[i * size[0] + p] = 0;
}

function selectGrid(event) {
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;
    for (i = 0; i < size[1]; i++)
        for (p = 0; p < size[0]; p++)
            if (mouseX >= p * B_LEN && mouseX < p * B_LEN + B_LEN &&
                mouseY >= i * B_LEN && mouseY <= i * B_LEN + B_LEN)
                selected[i * size[0] + p] = 1;
            else selected[i * size[0] + p] = 0;
}

function drawBG() {
    for (i = 0; i < size[1]; i++)
        for (p = 0; p < size[0]; p++) {
            if ((i + p) % 2 == 0) this.fillStyle = "#E0E0E0";
            else this.fillStyle = "#989898";
            this.fillRect(B_LEN * p, B_LEN * i, B_LEN, B_LEN);
        }
}

function drawBlocks() {
    for (i = 0; i < size[1]; i++)
        for (p = 0; p < size[0]; p++) {
            if (!colors[blockArr[i * size[0] + p]] && blockArr[i * size[0] + p])
                colors[blockArr[i * size[0] + p]] = '#' + Math.random().toString(16).substr(-6),
                ctx.fillStyle = colors[blockArr[i * size[0] + p]],
                ctx.fillRect(B_LEN * p, B_LEN * i, B_LEN, B_LEN);
            else if (blockArr[i * size[0] + p])
                ctx.fillStyle = colors[blockArr[i * size[0] + p]],
                ctx.fillRect(B_LEN * p, B_LEN * i, B_LEN, B_LEN);
        }
}

function drawStroke() {
    for (i = 0; i < size[1]; i++)
        for (p = 0; p < size[0]; p++) {
            ctx.lineWidth = 5;
            if (blockArr[i * size[0] + p] == targetNum)
                ctx.strokeStyle = "red",
                ctx.strokeRect(B_LEN * p, B_LEN * i, B_LEN, B_LEN);
        }
    for (i = 0; i < size[1]; i++)
        for (p = 0; p < size[0]; p++) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "yellow";
            if ((i * size[0] + p) == goalNum) {
                var aTar = -1,
                    bTar = -1;
                for (a = 0; a < size[1]; a++)
                    for (b = 0; b < size[0]; b++)
                        if (blockArr[a * size[0] + b] == targetNum) {
                            if (aTar == -1 && bTar == -1)
                                aTar = a, bTar = b,
                                moveNum = (i * 4 + p) - (a * 4 + b);
                            ctx.strokeRect(B_LEN * (b - bTar + p), B_LEN * (a - aTar + i), B_LEN, B_LEN);
                        }
            }
        }
}

function drawSelectedBlock() {
    for (i = 0; i < size[1]; i++)
        for (p = 0; p < size[0]; p++)
            if (selected[i * size[0] + p])
                ctx.strokeStyle = "RED",
                ctx.lineWidth = 3,
                ctx.strokeRect(B_LEN * p, B_LEN * i, B_LEN, B_LEN);
}

//Turn array into 32bits unsigned int
function toBinary() {
    var data = new Array(B_SIZE);
    var goal = 0,
        target = 0;
    var realLength = 0;
    for (var i = 0; i < data.length; i++)
        data[i] = "000000000000";
    if (size[0] <= 4 && size[1] <= 4)
        for (var b = 0; b < blockNum.length; b++)
            for (i = 0; i < 4; i++)
                for (p = 0; p < 4; p++) {
                    if (p >= size[0] || i >= size[1]) data[b] += '0';
                    else if (blockArr[i * size[0] + p] == b) data[b] += '1';
                    else data[b] += '0';
                }
    for (var i = 0; i < data.length; i++)
        data[i] += "0000",
        data[i] = parseInt(data[i], 2) >>> 0;
    for (var i = 1; i < data.length; i++) {
        if (!(0 | data[i])) data[i] = -1;
        else realLength++;
        if (i == targetNum) {
            target = data[i];
            if (moveNum > 0) goal = data[i] >>> moveNum;
            else goal = data[i] << (0 - moveNum);
        }
    }
    if (realLength > 0) {
        var realData = new Array(realLength - 1);
        var count = 0;
        for (var i = 1; i < data.length; i++) {
            if (data[i] != -1 && data[i] != target)
                realData[count] = data[i], count++;
        }
        realData.sort(function(a, b) { return a - b });
        realData.splice(0, 0, data[0]);
        realData.splice(0, 0, target);
        return [goal, realData];
    }
}

function Node(len) {
    this.number = 0; //block number
    this.path = 0;
    this.data = new Array(len); //real data length
}

function setWall() {
    wall = "111111111111";
    for (i = 0; i < 4; i++)
        for (p = 0; p < 4; p++) {
            if (p <= size[0] && i <= size[1]) wall += '0';
            else wall += '1';
        }
    wall += "1111";
    wall = parseInt(wall, 2) >>> 0;
    return wall;
}

function setBound() {
    var R_BOUND = "000000000000",
        L_BOUND = "000000000000";
    for (i = 0; i < 4; i++)
        for (p = 0; p < 4; p++) {
            if (!p) L_BOUND += '1';
            else L_BOUND += '0';
            if (p == size[0] - 1) R_BOUND += '1';
            else R_BOUND += '0';
        }
    R_BOUND += "0000";
    L_BOUND += "0000";
    R_BOUND = parseInt(R_BOUND, 2) >>> 0;
    L_BOUND = parseInt(L_BOUND, 2) >>> 0;
    this[0] = R_BOUND, this[1] = L_BOUND;
}

function isGoal(t, g) {
    return (t == g);
}

function updateSpace(z, s, e) {
    return ((z | s) & ~e);
}

function isBump(z, s, e) {
    return ((e & wall) | (e & ~z & ~s));
}

var data = toBinary();
var wall = setWall();
var bound = new Array(2);
setBound.call(bound);

function move(z, p, t) {
    switch (p) {
        case 0:
            if (!isBump(z, t, t << 1) && !(t & bound[1]))
                z = updateSpace(z, t, t << 1),
                t = t << 1;
            else return false;
            break;
        case 1:
            if (!isBump(z, t, t << 4))
                z = updateSpace(z, t, t << 4),
                t = t << 4;
            else return false;
            break;
        case 2:
            if (!isBump(z, t, t >>> 1) && !(t & bound[0]))
                z = updateSpace(z, t, t >>> 1),
                t = t >>> 1;
            else return false;
            break;
        case 3:
            if (!isBump(z, t, t >>> 4))
                z = updateSpace(z, t, t >>> 4),
                t = t >>> 4;
            else return false;
            break;
        default:
            return false;
    }
    return [z, t];
}

function shape(t) {
    var count = 0;
    while (t) count++, t &= (t - 1);
    return count;
}

function visitHistory(arr) {
    var hasVisited;
    for (var i = 0; i < this.length; i++)
        if (this[i][0] == arr[0] && this[i][1] == arr[1]) {
            hasVisited = true;
            if (algoValue == "1") {
                for (var q = 1; q < arr.length; q++)
                    if (shape(arr[q]) != 1 && this[i][q] != arr[q]) hasVisited = false, q = arr.length;
            } else {
                for (var q = 1; q < arr.length; q++)
                    if (this[i][q] != arr[q]) hasVisited = false, q = arr.length;
            }
            if (hasVisited) return false;
        }
    this.splice(this.length, 0, arr);
    //console.log("history: " + this.length);*/
    return true;
}

function idsSearch(d, data, goal, visited) {

    var moveArr = new Array(d + 1);
    for (var i = 0; i < moveArr.length; i++) moveArr[i] = new Node(data.length);
    for (var i = 0; i < data.length; i++) moveArr[0].data[i] = data[i];

    var i = 0;
    if (isGoal(moveArr[0].data[0], goal)) {
        return moveArr;
    }

    for (i = 0; i < d; i++) { //at depth
        do {
            if (moveArr[i].number == 1) moveArr[i].number++; //skip the space
            if ((moveArr[i].number > data.length - 1) || (i == d - 1 && moveArr[i].number > 0)) {
                //Test only target at depth  
                while (moveArr[i].number > data.length - 1) {
                    moveArr[i].number = 0;
                    moveArr[i].path = 0;
                    i--;
                    if (i < 0) return false;
                    if (moveArr[i].path + 1 > 3) moveArr[i].number++;
                    else moveArr[i].path++;
                }
            }
            temp = move(moveArr[i].data[1], moveArr[i].path, moveArr[i].data[moveArr[i].number]);
            if (temp) {
                var tempArr = new Array(data.length);
                for (var q = 0; q < data.length; q++)
                    tempArr[q] = moveArr[i].data[q];
                tempArr[moveArr[i].number] = temp[1];
                tempArr[1] = temp[0];
                if (!visitHistory.call(visited, tempArr)) temp = false;
            }
            if (!temp && moveArr[i].path < 3) moveArr[i].path++;
            else if (!temp && moveArr[i].path >= 3) moveArr[i].path = 0, moveArr[i].number++;
        }
        while (!temp);

        for (var q = 0; q < data.length; q++)
            moveArr[i + 1].data[q] = moveArr[i].data[q];
        moveArr[i + 1].data[moveArr[i].number] = temp[1];
        moveArr[i + 1].data[1] = temp[0];

        if (i == d - 1) {
            //Check goal
            if (isGoal(moveArr[i + 1].data[0], goal)) {
                //console.log("Find at depth:" + i);
                return moveArr;
            }
            var find = false;
            while (!find) {
                if (moveArr[i].path + 1 <= 3) {
                    moveArr[i].path++;
                    //改變方向
                    find = true;
                    i--;
                } else if (moveArr[i].number + 1 <= data.length - 1) {
                    moveArr[i].path = 0;
                    moveArr[i].number++;
                    if (moveArr[i].number == 1) moveArr[i].number++;
                    find = true;
                    //改變節點 
                    if (moveArr[i].number > data.length - 1) find = false, moveArr[i].path = 0, moveArr[i].number = 0;
                    i--;
                    if (i < 0) return false;
                } else if (i - 1 >= 0) {
                    moveArr[i].path = 0;
                    moveArr[i].number = 0;
                    i--;
                    //回到上一層
                } else return false;
            }
        }
    }
    return false;
}

function search(maxDepth, data, goal) {
    var moveArr;
    for (var i = 0; i < maxDepth; i++) {
        var visited = new Array(1);
        visited[0] = new Array(data.length);
        for (var a = 0; a < data.length; a++) {
            visited[0][a] = data[a];
        }
        moveArr = idsSearch(i, data, goal, visited);
        if (moveArr) return moveArr;
    }
    return false;
}
var step = 0;
var stepNum = 0;
var initArr = new Array(B_SIZE);
var startTime = 0;
var endTime = 0;

function calc() {
    var temp = toBinary();
    var goal = temp[0];
    var data = temp[1];
    var moveArr = 0;

    for (var i = 0; i < blockArr.length; i++) {
        initArr[i] = blockArr[i];
    }
    if (targetNum == -1 || goalNum == -1) alert("請選取目標積木與目標位置");
    else {
        startTime = new Date().getTime();
        moveArr = search(200, data, goal);
        endTime = new Date().getTime();
    }
    if (moveArr) {
        preBtn.style.display = "inline";
        nextBtn.style.display = "inline";
        c.log("移動步數: " + (moveArr.length - 1));
        c.log("運算時間: " + ((endTime - startTime) / 1000) + "sec");
        step = moveArr;
    }
}

function toStep(id) {

    temp = document.getElementById(id).value;
    var way = 0;
    var num;
    switch (temp) {
        case "上一步":
            if (!stepNum) return stepNum;
            var path = step[stepNum - 1].path;
            num = step[stepNum - 1].number;
            switch (path) {
                case 0:
                    path = 2;
                    break;
                case 1:
                    path = 3;
                    break;
                case 2:
                    path = 0;
                    break;
                case 3:
                    path = 1;
            }
            stepNum--;
            break;
        case "下一步":
            if (stepNum == step.length - 1) return stepNum;
            var path = step[stepNum].path;
            num = step[stepNum].number;
            stepNum++;
    }

    var tar = -1;
    var count = step[0].data.length;
    var saved = new Array(count);
    arrInit.call(saved);
    for (i = 0; i < size[1]; i++) {
        for (p = 0; p < size[0]; p++) {
            if (initArr[i * size[0] + p]) {
                if (initArr[i * size[0] + p] != targetNum) {
                    var meet = false;
                    for (var z = 0; z < saved.length; z++) {
                        if (saved[z] == initArr[i * size[0] + p]) meet = true, z = saved.length;
                    }
                    if (!meet) {
                        count--;
                        for (var z = 0; z < saved.length; z++) {
                            if (!saved[z]) saved[z] = initArr[i * size[0] + p], z = saved.length;
                        }
                    }
                } else if (!num && initArr[i * size[0] + p] == targetNum) {
                    count = 0;
                }
            }
            if (count == num) {
                tar = initArr[i * size[0] + p];
                p = size[0], i = size[1];
            }
        }
    }

    switch (path) {
        case 0:
            for (i = 0; i < size[1]; i++)
                for (p = 1; p < size[0]; p++)
                    if (blockArr[i * size[0] + p] == tar) {
                        blockArr[i * size[0] + p - 1] = blockArr[i * size[0] + p];
                        blockArr[i * size[0] + p] = 0;
                    }
            break;
        case 1:
            for (i = 1; i < size[1]; i++)
                for (p = 0; p < size[0]; p++)
                    if (blockArr[i * size[0] + p] == tar) {
                        blockArr[(i - 1) * size[0] + p] = blockArr[i * size[0] + p];
                        blockArr[i * size[0] + p] = 0;
                    }
            break;
        case 2:
            for (i = size[1] - 1; i > -1; i--)
                for (p = size[0] - 2; p > -1; p--)
                    if (blockArr[i * size[0] + p] == tar) {
                        if (blockArr[i * size[0] + p + 1] != tar) blockArr[i * size[0] + p + 1] = blockArr[i * size[0] + p];
                        blockArr[i * size[0] + p] = 0;
                    }
            break;
        case 3:
            for (i = size[1] - 1; i > -1; i--)
                for (p = size[0] - 1; p > -1; p--)
                    if (blockArr[i * size[0] + p] == tar) {
                        if (blockArr[(i + 1) * size[0] + p] != tar) blockArr[(i + 1) * size[0] + p] = blockArr[i * size[0] + p];
                        blockArr[i * size[0] + p] = 0;
                    }
            break;

    }
    return stepNum;
}

//Main Loop
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBG.call(ctx);
    drawBlocks.call(ctx);
    drawSelectedBlock.call(ctx);
    drawStroke.call(ctx);
}

setInterval(render, 30);

function createMessage(str) {
    var newMessage = document.createElement('li').innerHTML = str;
    var list = document.getElementById("list");
    list.insertBefore(newNode, list.childNodes[0]);
}

/*console.log function from: http://www.kobashicomputing.com/send-your-console-output-to-the-result-pane-in-jsfiddle*/
var c = function() {
    return ({
        log: function(msg) {
            consoleDiv = document.getElementById('console');
            para = document.createElement('p');
            text = document.createTextNode(msg);
            para.appendChild(text);
            consoleDiv.appendChild(para);
        }
    });
}();