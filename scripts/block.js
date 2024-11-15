class Block {
    constructor(position, width, height, greenPercent, yellowPercent, redPercent, contgame)
    {
        this.position = position;
        this.width = width;
        this.height = height;
        this.skin = document.createElement('div');
        this.hp = 1;
        this.value = 5;        
        this.greenPercent = greenPercent;
        this.yellowPercent = yellowPercent;
        this.redPercent = redPercent;
        this.contgame = contgame;
        this.createElement();

    }

    getRandomColorHex() {
        const totalPercent = this.greenPercent + this.yellowPercent + this.redPercent;
        if (totalPercent !== 100) {
            throw new Error("Сума відсотків повинна дорівнювати 100");
        }
    
        const colors = {
            darkGreen: '#4C8B2B',
            darkYellow: '#B3A300',
            darkRed: '#B22222',
            darkGreenBorder: '#3A6A20',
            darkYellowBorder: '#8A7B00',
            darkRedBorder: '#8B1A1A'
        };
    
        const random = Math.random() * 100;
    
        if (random < this.greenPercent) {
            this.hp = 1;
            return { background: colors.darkGreen, border: colors.darkGreenBorder, shadow: colors.darkGreen };
        } else if (random < this.greenPercent + this.yellowPercent) {
            this.hp = 2;
            this.value = 10;
            return { background: colors.darkYellow, border: colors.darkYellowBorder, shadow: colors.darkYellow };
        } else {
            this.hp = 3;
            this.value = 15;
            return { background: colors.darkRed, border: colors.darkRedBorder, shadow: colors.darkRed };
        }
    }

    createElement() {
        const colors = this.getRandomColorHex();
        this.skin.style.backgroundColor = colors.background;
        this.skin.style.borderColor = colors.border;
        this.skin.style.boxShadow = `0 0 15px ${colors.shadow}`;
        this.skin.className = 'block';
        this.skin.style.width = `${this.width}px`;
        this.skin.style.height = `${this.height}px`;
        document.getElementById(this.contgame).appendChild(this.skin);
        this.draw();
    }

    draw() {
        this.skin.style.left = `${this.position.x}px`;
        this.skin.style.top = `${this.position.y}px`;

        if (this.hp === 3) {
            this.skin.style.backgroundColor = '#B22222';
            this.skin.style.borderColor = '#8B1A1A';
            this.skin.style.boxShadow = `0 0 15px #8B1A1A`;
        } else if (this.hp === 2) {
            this.skin.style.backgroundColor = '#B3A300';
            this.skin.style.borderColor = '#8A7B00';
            this.skin.style.boxShadow = `0 0 15px #8A7B00`;
        } else if (this.hp === 1) {
            this.skin.style.backgroundColor = '#4C8B2B';
            this.skin.style.borderColor = '#3A6A20';
            this.skin.style.boxShadow = `0 0 15px #3A6A20`;
        }
    }
}

export { Block };
