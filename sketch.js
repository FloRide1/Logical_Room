var seed = 1;
var equation = "S=a*c+d*b+e*f*g+h";
let params = {
    Distance: config.gates.sizey,
    DistanceMin:-config.gates.sizey,
    DistanceMax:2*config.gates.sizey,
    DistanceStep:0.5,
    Couleurs: true,
    Lettres: true
};

function setup() {
    createCanvas(displayWidth, displayHeight);
    console.log(math.parse(equation).toString({parenthesis: 'all'}))
    var gui = createGui("Edit")
    gui.addObject(params);
}

function draw() {
    //windowResized()
    seed = 1;
    background(config.colors.background);
    console.log()
    let equation_render = parseEquation(equation,params.Distance);
    let inputsWire = drawCircuit(equation,equation_render,params.Lettres,params.Couleurs)
    drawAllBox(inputsWire)
}

function drawAllBox(inputsWire){
    let sizex = config.gates.sizex;
    let sizey = config.gates.sizey;

    S = inputsWire["S"]
    drawBox(S.x+sizex/2,S.y,sizex,sizey,"S",{i:"#808080"},{i:"#000000",h:"#ffffff"})
    let key = Object.keys(inputsWire);
    let x_i = 30;
    let y_i = 30;
    let y_mul = (S.y-y_i)*2/(key.length-1)
    for (let i = 0; i < key.length; i++) {
        x = x_i;
        y = y_i + i * y_mul;
        if (key[i] != "S"){
            drawBox(x,y,sizex,sizey,key[i],{i:"#808080"},{i:"#000000",h:"#ffffff"})
            //console.log(inputsWire[key[i]])
            for (let j = 0; j < inputsWire[key[i]].length; j++) {
                stroke(inputsWire[key[i]][j].color)
                drawLine(x+sizex/2,y,inputsWire[key[i]][j].x,inputsWire[key[i]][j].y,Math.abs(i*5+(j+1)*1))                
            }
        }        
    }
}

function drawBox(x,y,sizex,sizey,message,fill_p,stroke_p){
    let fill_inactive = fill_p.i;
    let stroke_inactive = stroke_p.i;
    let stroke_hover = stroke_p.h

    fill(fill_inactive);
    if (mouseX > x - sizex/2 && mouseX < x + sizex/2 && mouseY > y - sizey/2 && mouseY < y + sizey/2){
        stroke(stroke_inactive);
    } else {
        stroke(stroke_hover);
    }
    
    rect(x-sizex/2,y-sizey/2,sizex,sizey);
    textAlign(CENTER, CENTER);
    text(message,x,y)
}

function drawCircuit(equation,equation_render,lettersAreDisplay,colorised){
    let outputs = listUpperCase(equation);
    let inputs = listLowerCase(equation);
    var inputsWire = {}
    if (equation.indexOf("=") != -1){
        equation = equation.split("=")[1]
    }
    equation = math.parse(equation)
    let maxLevel = equation_render.length;
    let width_delta = displayWidth/(maxLevel*1.5);
    let x = displayWidth-140;
    let y = (displayHeight-equation_render[maxLevel-1][0])/2;
    let Node_Size = config.gates.sizey
    let Gates = {}
    for (let i = 0; i < maxLevel; i++) {
        let calibre
        if (i<maxLevel) {
            calibre = (equation_render[maxLevel-1][0]-equation_render[i][0])/2
        } else {
            calibre = 0
        }
        for (let j = 0; j < pow(2,i); j++) {
            let x_dot = x - width_delta*i
            let y_dot = y+(equation_render[i][1]+Node_Size)*j+calibre
            let arg = equation
            let path = findPath(i,j)
            for (let k = 0; k < path.length; k++) {
                if (arg != undefined){
                    arg = arg.args
                    if (arg != undefined){
                        arg = arg[path[k]];
                    }    
                }
                
            }
            if (arg != undefined){
                if (arg.op != undefined){
                    let gate;
                    if (arg.op == "+"){
                        gate = new ORGate("OR",2,{x:x_dot,y:y_dot});
                    } else {
                        gate = new ANDGate("AND",2,{x:x_dot,y:y_dot});
                    }
                    let GName = "g" + path.join("")
                    let lastChar = path[path.length-1];
                    Gates[GName] = gate;
                    let upperGate = Gates[GName.substring(0, GName.length - 1)]
                    if (upperGate != undefined){
                        let pinOut = gate.getPin(0);
                        let pinIn  = upperGate.getPin(lastChar+1);
                        let color = "#000000";
                        if (colorised) {
                            color = getRandomColor();
                        }
                        stroke(color)
                        drawLine(pinOut.x,pinOut.y,pinIn.x,pinIn.y);
                    }
                    if (GName == "g"){
                        inputsWire["S"] = gate.getPin(0);
                    }                 
                }
                if (arg.name != undefined){
                    fill("#000000");
                    stroke("#000000")
                    if (lettersAreDisplay){
                        text(arg.name,x_dot-10,y_dot-10);
                    }
                    let GName = "g" + path.join("")
                    let lastChar = path[path.length-1];
                    let upperGate = Gates[GName.substring(0, GName.length - 1)]
                    let color = "#000000";
                    if (colorised) {
                        color = getRandomColor();
                    }
                    if (upperGate != undefined){
                        let pinIn  = upperGate.getPin(lastChar+1)
                        stroke(color)
                        drawLine(x_dot,y_dot,pinIn.x,pinIn.y);
                    }
                    if (inputsWire[arg.name] == undefined){
                        inputsWire[arg.name] = []
                    }
                    inputsWire[arg.name].push({x:x_dot,y:y_dot,color:color});
                }
            }
        }
    }
    return inputsWire
}

function findPath(level,index){
    let path = []
    let i = index
    while (level > 0){
        if (level <= 1){
            path[0] = i
            level = -1;
        } else {
            path[level-1] = i%2
            i = Math.floor(i/2)
            level--;
        }
    }
    return path
}

function parseEquation(equation,Node_Space){
    if (equation.indexOf("=") != -1){
        equation = equation.split("=")[1]
    }
    equation = math.parse(equation)
    maxLevel = findMaxLevel(equation.args,1)-1
    let Node_Size = config.gates.sizey
    let distance;
    let array = []
    for (let i = maxLevel; i >= 0; i--) {
        distance = (i==maxLevel)?pow(2,maxLevel)*Node_Size+(pow(2,maxLevel)-1)*Node_Space:distance-(Node_Size+Node_Space)
        Node_Space = (i==maxLevel)?Node_Space:Node_Size+Node_Space*2
        array[i] = [distance,Node_Space]
    }
    return array;
}

function findMaxLevel(args,level){
    let maxLevel = level;
    if (args != undefined){
        args.forEach(element => {
            let lvl = findMaxLevel(element,level+1)
            if (lvl > maxLevel){
                maxLevel = lvl;
            }
        });
    }
    return maxLevel
}

function listUpperCase(str) {
    let count=0,len=str.length,list = [];
    for(let i=0;i<len;i++) {
        if(/[A-Z]/.test(str.charAt(i)) && list.indexOf(str[i]) == -1){
            list.push(str[i])
        };
    };   
    return list;
}

function listLowerCase(str) {
    let count=0,len=str.length,list = [];
    for(let i=0;i<len;i++) {
        if(/[a-z]/.test(str.charAt(i)) && list.indexOf(str[i]) == -1){
            list.push(str[i])
        };
    };   
    return list;
}

function drawLine(x_a,y_a,x_b,y_b,percent){
    if (percent == undefined){
        percent = 50
    }
    let x_ab = percent*(x_a+x_b)/100
    line(x_a,y_a,x_ab,y_a)
    line(x_ab,y_a,x_ab,y_b)
    line(x_b,y_b,x_ab,y_b)
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(randomSeedColor() * 16)];
    }
    return color;
}


function randomSeedColor() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}