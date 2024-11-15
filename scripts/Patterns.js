class Patterns {
    constructor() {
        this.patterns = [
            [0, 0, 0, 0, 0], // 0
            [0, 0, 0, 0, 1], // 1
            [0, 0, 0, 1, 0], // 2
            [0, 0, 0, 1, 1], // 3
            [0, 0, 1, 0, 0], // 4
            [0, 0, 1, 0, 1], // 5
            [0, 0, 1, 1, 0], // 6
            [0, 0, 1, 1, 1], // 7
            [0, 1, 0, 0, 0], // 8
            [0, 1, 0, 0, 1], // 9
            [0, 1, 0, 1, 0], // 10
            [0, 1, 0, 1, 1], // 11
            [0, 1, 1, 0, 0], // 12
            [0, 1, 1, 0, 1], // 13
            [0, 1, 1, 1, 0], // 14
            [0, 1, 1, 1, 1], // 15
            [1, 0, 0, 0, 0], // 16
            [1, 0, 0, 0, 1], // 17
            [1, 0, 0, 1, 0], // 18
            [1, 0, 0, 1, 1], // 19
            [1, 0, 1, 0, 0], // 20
            [1, 0, 1, 0, 1], // 21
            [1, 0, 1, 1, 0], // 22
            [1, 0, 1, 1, 1], // 23
            [1, 1, 0, 0, 0], // 24
            [1, 1, 0, 0, 1], // 25
            [1, 1, 0, 1, 0], // 26
            [1, 1, 0, 1, 1], // 27
            [1, 1, 1, 0, 0], // 28
            [1, 1, 1, 0, 1], // 29
            [1, 1, 1, 1, 0], // 30
            [1, 1, 1, 1, 1], // 31
        ];
    }

    getPattern()
    {
        let randomNumber = Math.floor(Math.random() * 32);
        return this.patterns[randomNumber];
    }

    createUniquePattern(width, height)
    {
        let pattern = []
        for(let i = 0; i < height; i++)
        {
            let row = [];
            let patt = this.getPattern();
            for(let j = 0; j < width; j += 5)
            {
                if(width - 5 > j)
                {
                    row.push(...patt);   
                }
                else
                {
                    for(let k = 0; k < width - j; k++)
                    {
                        row.push(patt[k]);
                    }
                }
            }
            pattern.push(row);
        }
        return pattern;
    }

    createPyramidPattern(width) {
        const pattern = [];
        for(let i = 0; i < width-i; i++)
        {
            const row = new Array(width).fill(1, i, width-i);
            pattern.push(row);
        }
        return pattern;
    }

    createRectanglePattern(width, height) 
    {
        return Array.from({ length: height }, () => new Array(width).fill(1));
    }

    createColumnPattern(width, heightcol, widthcol, space)
    {
        const pattern = [];

        for (let j = 0; j < heightcol; j++) {
            let row = new Array(width).fill(0);
            
            for (let i = 0; i < width; i += space + widthcol) {

                for (let k = 0; k < widthcol; k++) {
                    if (i + k < width) {
                        row[i + k] = 1;
                    }
                }

                for (let k = 0; k < space; k++) {
                    if (i + widthcol + k < width) {
                        row[i + widthcol + k] = 0;
                    }
                }
            }
            
            pattern.push(row);
        }
        return pattern;
    }

    createZigzagPattern(width, widthrow, numrow, space) 
    {
        const pattern = [];

        for(let i = 0;  i < numrow; i++)
        {
            for(let k = 0; k < space; k++)
            {
                let row = new Array(width).fill(0);
                pattern.push(row);
            }

            for(let k = 0; k < widthrow; k++)
            {
                let row = new Array(width).fill(1);
                pattern.push(row);
            }
        }
        return pattern;
    }
}

export{Patterns};