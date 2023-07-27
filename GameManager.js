import { CopyValueWithoutReference, Lerp, Sleep } from "./Helper.js";

class GameManager{

    Marks = ["S", "O"];
    Turn = false;

    constructor(Container, WinCallBack){
        this.Container = Container;
        this.WinCallBack = WinCallBack;

        this.OnBoxClick = this.OnBoxClick.bind(this);
    }

    Setup(W, H){

        this.Container.innerHTML = "";

        this.W = W;
        this.H = H;
        for(var Height = 0; Height < this.H; Height++){
            var Row = document.createElement("div");
            Row.className = "row";
            for(var Width = 0; Width < this.W; Width++){
                var Box = document.createElement("div");
                Box.className = "box";
                Box.addEventListener("click", this.OnBoxClick);

                Row.append(Box);
            }
            this.Container.append(Row);
        }

        this.Canvas = document.createElement("canvas");
        this.Canvas.style.position = "absolute";
        this.Canvas.height = this.Container.offsetHeight;
        this.Canvas.width = this.Container.offsetWidth;

        this.Container.append(this.Canvas);
        this.Ctx = this.Canvas.getContext("2d");
    }

    DrawLine(X,Y, X2, Y2){
        var NewX = Lerp(X, X2, 0.1);
        var NewY = Lerp(Y, Y2, 0.1);

        this.Ctx.lineWidth = 5;
        this.Ctx.beginPath();
        this.Ctx.moveTo(X, Y);
        this.Ctx.lineTo(NewX, NewY);
        this.Ctx.stroke();
        if(X != X2 || Y != Y2) setTimeout(()=> this.DrawLine(NewX, NewY, X2, Y2), 1000/60);
    }

    IsPlayedBefore(Box){
        return Box.hasAttribute("played");
    }

    GetCurrentSymbol(){
        return this.Turn ? this.Marks[0] : this.Marks[1];
    }

    MarkBox(Box){
        Box.innerText = this.GetCurrentSymbol();
        Box.setAttribute("played", true);
    }

    UpdateTurn(){
        this.Turn = !this.Turn;
    }

    OnBoxClick(event){
        var Box = event.target;
        if(this.IsPlayedBefore(Box)) return;
        this.MarkBox(Box);
        this.CheckIfWin(Box);
        this.UpdateTurn();
    }

    GetBoxSymbol(Box){
        return Box.innerText == "" ? null : Box.innerText;
    }

    CheckIfWin(Box){
        var Data = [];

        var CurrentCord = [];

        var HeightCounter = 0;
        document.querySelectorAll(".row").forEach(x => {
            var WidthCounter = 0;
            var Row = [];
            x.querySelectorAll(".box").forEach(y=>{
                Row.push(y);
                if(Box === y){
                    CurrentCord = [WidthCounter, HeightCounter];
                }
                WidthCounter++;
            });
            Data.push(Row);
            HeightCounter++;
        });
        var Possibilities = [
            this.GetOneWay(CurrentCord, Data, true),
            this.GetOneWay(CurrentCord, Data, false),
            this.GetOneWayCross(CurrentCord, Data, [1, 1]),
            this.GetOneWayCross(CurrentCord, Data, [-1, 1]),
            this.GetOneWayCross(CurrentCord, Data, [1, -1]),
            this.GetOneWayCross(CurrentCord, Data, [-1, -1]),
        ];
        var Result = Possibilities.filter(x=> x != null);
        if(Result.length != 0){
            this.WinDraw(Result[0]);
        }
    }
    
    async WinDraw(Boxes){
        this.Canvas.classList.toggle("block");
        var First = Boxes[0].getBoundingClientRect();
        var Last = Boxes[2].getBoundingClientRect();
        var Rect = this.Container.getBoundingClientRect();
        new Audio("draw.mp3").play();
        this.DrawLine(First.x - Rect.x + 25, First.y - Rect.y + 25, Last.x - Rect.x + 25, Last.y - Rect.y + 25);   
        await Sleep(200);  
        var Boxes = this.Container.querySelectorAll(".box");
        for(var i = 0; i < Boxes.length; i++){
            var Box = Boxes[i];
            Box.classList.toggle("scale");
            await Sleep(200);
            Box.classList.toggle("scale");
        }
        await Sleep(500);
        this.WinCallBack();
    }

    GetOneWay(CurrentCord, Data, Horizantal){
        var TempCoord = CopyValueWithoutReference(CurrentCord);

        var Coords = Array.from(Array(Horizantal ? this.W : this.H).keys());
        Coords = Coords.map(x => Horizantal ? [x, TempCoord[1]] : [TempCoord[0], x]);
        var Coords = Coords.map(x=> Data[x[1]][x[0]]).map(x=> ({Symbol: this.GetBoxSymbol(x), Coord: x}));
        var Value = Coords.map(x=> x.Symbol ?? "_").join("");
        var Result = Value.match(Array.from(Array(3).keys()).map(()=> this.GetCurrentSymbol()).join(""));
        return Result != null ? [Coords[Result.index].Coord, Coords[Result.index + 1].Coord , Coords[Result.index + 2].Coord] : null;
    }

    GetOneWayCross(CurrentCord, Data, Direction){
        var TempCoord = CopyValueWithoutReference(CurrentCord);
        while(TempCoord[0] != this.W -1 && TempCoord[1] != this.H - 1 && TempCoord[0] != 0 && TempCoord[1] != 0){
            TempCoord[0] = TempCoord[0] - Direction[0];
            TempCoord[1] = TempCoord[1] - Direction[1];
        }

        var Coords = [];
        while(TempCoord[0] < this.W && TempCoord[1] < this.H && TempCoord[0] >= 0 && TempCoord[1] >= 0){
            Coords.push(CopyValueWithoutReference(TempCoord));
            TempCoord[0] = TempCoord[0] + Direction[0];
            TempCoord[1] = TempCoord[1] + Direction[1];
        }
        var Coords = Coords.map(x=> Data[x[1]][x[0]]).map(x=> ({Symbol: this.GetBoxSymbol(x), Coord: x}));
        var Value = Coords.map(x=> x.Symbol ?? "_").join("");
        console.log(Value);
        var Result = Value.match(Array.from(Array(3).keys()).map(()=> this.GetCurrentSymbol()).join(""));
        return Result != null ? [Coords[Result.index].Coord, Coords[Result.index + 1].Coord , Coords[Result.index + 2].Coord] : null;
    }
}


export default GameManager;