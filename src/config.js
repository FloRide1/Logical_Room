const config = {
    "colors": {
        "background": "#c0c0c0",
        "gates": {
            "and": {
                "line": "#000000",
                "back": "#ffffff"
            },
            "or": {
                "line": "#000000",
                "back": "#ffffff"
            }
        }
    },
    "gates": {
        "sizex": 30,
        "sizey": 30,
        "pinlength": 7,
        "delta": 0.80,
        "min_dist":20,
        },
    "equation": {
        "and":".",
        "or":"+"
    }
}

class Gate {
    constructor(name,type,inputs,position){
        this.name       = name;
        this.type       = type;
        this.inputs     = inputs;
        this.position   = position;
        this.pin = [{}];
    }

    getPos(){
        return this.position;
    }

    getPins(){
        return this.pin;
    }

    getPin(pin){
        return this.pin[pin]
    }
}

class ANDGate extends Gate {
    constructor(name,inputs,position){
        super(name,"AND",inputs,position);
        this.maxinputs = -1
        if (!(this.maxinputs == -1 || this.inputs < this.maxinputs)){
            console.log("Error")
        } else {
            this.draw()
        }
    }

    draw(){
        stroke(config.colors.gates.and.line);
        let sizex       = config.gates.sizex;
        let sizey       = config.gates.sizey;
        let pinlength   = config.gates.pinlength;
        let delta       = config.gates.delta

        let anchor      = this.position.anchor;
        let inputs      = this.inputs;

        let x = this.position.x;
        let y = this.position.y;
        if (anchor >= 1){
            x   += pinlength + sizex/2
            y   += sizey*delta*(1/2-anchor/(inputs+1))
        } else if (anchor == -1) {
            x   -= sizex/2+pinlength
        }
        
        //Draw Base
        stroke(config.colors.gates.and.line);
        fill(config.colors.gates.and.back);
        rect(x-sizex/2,y-sizey/2,sizex,sizey,0,90,90,0);

        //Draw Inputs Pins 
        
        let x_lc = x-sizex/2;
        let x_pin = x_lc-pinlength;
        let y_pin
        for (let i = 1; i < inputs+1; i++) {
            y_pin = y-sizey*delta*(1/2-i/(inputs+1))
            line(x_pin,y_pin,x_lc,y_pin)
            this.pin.push({
                x:x_pin,
                y:y_pin
            })
        }

        //Draw Output Pin
        x_pin = x+sizex/2+pinlength;
        line(x+sizex/2,y,x_pin,y)
        
        this.pin[0] = {
            x:x_pin,
            y:y
        }
    }
}

class ORGate extends Gate {
    constructor(name,inputs,position){
        super(name,"OR",inputs,position);
        this.maxinputs = -1
        if (!(this.maxinputs == -1 || this.inputs < this.maxinputs)){
            console.log("Error")
        } else {
            this.draw()
        }
    }

    draw(){
        stroke(config.colors.gates.and.line);
        let sizex       = config.gates.sizex;
        let sizey       = config.gates.sizey;
        let pinlength   = config.gates.pinlength;
        let delta       = config.gates.delta

        let anchor      = this.position.anchor;
        let inputs      = this.inputs;

        let x = this.position.x;
        let y = this.position.y;
        if (anchor >= 1){
            x   += pinlength + sizex/2
            y   += sizey*delta*(1/2-anchor/(inputs+1))
        } else if (anchor == -1) {
            x   -= sizex/2+pinlength
        }
        
        //Draw Base
        stroke(config.colors.gates.or.line);
        fill(config.colors.gates.or.back);
        let x_lc = x - sizex/2;
        let x_rc = x + sizex/2;
        let p1 = {x:x_rc,y:y};
        let p2 = {x:x_rc-sizex*2/3*cos(HALF_PI/2),y:y-sizey*2/3*sin(HALF_PI/2)};
        let p3 = {x:x_lc,y:y-sizey/2};
        let p4 = {x:x_lc,y:y-sizey/2};
        bezier(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y,p4.x,p4.y);
        bezier(p1.x,p1.y,p2.x,p2.y+2*(y-p2.y),p3.x,p3.y+2*(y-p3.y),p4.x,p4.y+2*(y-p4.y));
        noStroke()
        triangle(p3.x,p3.y,p3.x,p3.y+2*(y-p3.y),p1.x,p1.y)
        stroke(config.colors.gates.or.line)

        let distance = sqrt(sizex**2+sizey**2);
        let angle = atan(sizey/sizex);
        
        fill(config.colors.background)
        arc(x-sizex,y,distance,distance,-angle,angle,OPEN)
        //Draw Inputs Pins 
        let x_pin;
        let y_pin;
        let deltay;
        for (let i = 1; i < inputs+1; i++) {
            y_pin = y-sizey*delta*(1/2-i/(inputs+1))
            deltay = atan(abs(y-y_pin));
            x_pin = x - sizex + (distance/2-deltay)
            line(x_lc-pinlength,y_pin,x_pin,y_pin)
            this.pin.push({
                x:x_lc-pinlength,
                y:y_pin
            })
        }

        //Draw Output Pin
        x_pin = x+sizex/2+pinlength;
        line(x+sizex/2,y,x_pin,y)
        
        this.pin[0] = {
            x:x_pin,
            y:y
        }
    }
}
