class Ball {
    constructor(position, direction, radius, speed, skin) 
    {         
        this.skin = skin;       
        this.skin.style.transition = "transform 0.0s";
        this.position = position;
        this.direction = direction;
        this.radius = radius;
        this.speed = speed;
        this.skin.style.transform = "translateX(0%)";
        this.skin.style.transition = "transform 0.1s";
    }

    move()
    {
        this.position = this.position.add(this.direction.multiply(this.speed));
    }

    draw() 
    {
        this.skin.style.left = `${this.position.x}px`;
        this.skin.style.top = `${this.position.y}px`;
        this.skin.style.width = `${this.radius * 2}px`;
        this.skin.style.height = `${this.radius * 2}px`;
    }

    checkCollision(containerWidth, containerHeight, endlinePosition, platform) 
    {
        if (this.position.x <= 0 || this.position.x + this.radius * 2 >= containerWidth) 
        {
            this.direction.x *= -1;
        }
    
        if (this.position.y <= 0) 
        {
            this.direction.y *= -1;
        }
    

        if (this.position.y + this.radius * 2 >= platform.position.y && 
            this.position.x + this.radius >= platform.position.x &&
            this.position.x <= platform.position.x + platform.width) 
        {
            let hitPoint = (this.position.x + this.radius - platform.position.x) / platform.width;

            if (hitPoint < 0.3) {
                this.direction.x = -Math.abs(this.direction.x);
            } else if (hitPoint > 0.7) 
            {
                this.direction.x = Math.abs(this.direction.x);
            } else {
                this.direction.x = this.direction.x;
            }
    
            if(this.position.y + this.radius * 2 >= platform.position.y && 
               this.position.y + this.radius * 2 <= platform.position.y + 5) 
            {
                this.direction.y *= -1;
            }
        }
    
        if (this.position.y > endlinePosition) {
            return true;
        }
    }
}

export { Ball };
