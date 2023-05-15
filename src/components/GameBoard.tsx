
import React from "react";
import redDot from "../img/rosso.png";
import yellowDot from "../img/giallo.png";
import voidDot from "../img/vuoto.png";
import redDotWin from "../img/rosso2.png";
import yellowDotWin from "../img/giallo2.png";
import { useEffect, useState } from "react";

const ROW = 6;
const COL = 7 

export const GameBoard = () => {
    const [board, setBoard] = useState<string[][] | null>(null);
    const [counterWin, setCounterWin] = useState<[number, number, number]>([0, 0, 0]);
    const [turn, setTurn] = useState<1 | 2>(Math.random() > 0.5 ? 1 : 2);
    const [win, setWin] = useState<0 | 1 | 2 | 3>(0);

    const initBoard = () => {
        const boardTemp: string[][] = [];
        for(let i=0;i<ROW;i++) boardTemp.push(Array.from({length: COL}, () => voidDot))
        setBoard(boardTemp);
    }

    const getItem = (img: string) => <div className="box" ><img src={img} width={"100%"} height={"100%"} alt="..." /></div>;

    const renderBoard = () => {
        if(!board) return [];
        const newBoard = [];
        for(let i=0;i<COL;i++){
            const arr = [];
            for(let j=0;j<ROW;j++){
                arr.push(getItem(board[j][i]));
            }
            newBoard.push(<div onClick={() => addDot(ROW-1, i)}>{React.Children.toArray(arr)}</div>);
        }
        return newBoard;
    }

    const addDot = (row: number, col: number) => {
        if(win !== 0 || row === -1) return;
        else if(board && board[row][col] === voidDot) {
            board[row][col] = turn === 1 ? redDot : yellowDot;
            setBoard([...board]);
        }
        else addDot(row-1, col);
    }  

    const reset = () => {
        initBoard();
        setTurn(Math.random() > 0.5 ? 1 : 2);
        setWin(0);
    }

    const setWinBoard = (win: 1 | 2 | 3, coordArr: number[][]) => {
        coordArr.forEach(([i, j]) => {
            board![i][j] = win === 1 ? redDotWin : yellowDotWin;
        });
        setWin(win);
        counterWin[win-1]++;
        setCounterWin([...counterWin]);
    }

    const checkWin = () => {
        if(!board) return;
        for(let row=0;row<ROW;row++){
            for(let col=0;col<COL;col++){
                if(board[row][col] !== voidDot){
                    //Row:
                    let coordArr = [[row, col]];
                    for(let i=row+1;i<=row+3;i++){
                        try{
                            if((board[i][col] === board[row][col])) coordArr.push([i, col]);
                            else break;
                        } catch(e){};
                    }
                    if(coordArr.length === 4) return board[row][col] === redDot ? setWinBoard(1, coordArr) : setWinBoard(2, coordArr);

                    //Col:
                    coordArr = [[row, col]];
                    for(let i=col+1;i<=col+3;i++){
                        try{
                            if((board[row][i] === board[row][col])) coordArr.push([row, i]);
                            else break;
                        } catch(e){};
                    }
                    if(coordArr.length === 4) return board[row][col] === redDot ? setWinBoard(1, coordArr) : setWinBoard(2, coordArr);

                    //Diagonal:
                    let coordD1 = [[row, col]], coordD2 = [[row, col]];
                    for(let i=1;i<=3;i++){
                        try{
                            if(board[row+i][col+i] && (board[row+i][col+i] === board[row][col])) coordD1.push([row+i, col+i]);
                        }catch(e){};
                        try{
                            if(board[row+i][col-i] && (board[row+i][col-i] === board[row][col])) coordD2.push([row+i, col-i]);
                        }catch(e){};
                    }
                    if(coordD1.length === 4) return board[row][col] === redDot ? setWinBoard(1, coordD1) : setWinBoard(2, coordD1);
                    if(coordD2.length === 4) return board[row][col] === redDot ? setWinBoard(1, coordD2) : setWinBoard(2, coordD2);
                }
            }
        }
        if(board.flat(2).every((img) => img !== voidDot)) {
            setWin(3);
            counterWin[2]++;
            setCounterWin([...counterWin]);
        }
    }

    const statusGame = () => {
        return (win === 1 || win === 2 ? <p className="fs-3 mt-2">Player <span style={{color: win === 1 ? "#dc143c" : "yellow"}}>{win}</span> has won!</p> 
                : win === 3 ? <p className="fs-3 mt-2">Tie...</p> 
                : <p className="fs-3">Player <span style={{color: turn === 1 ? "#dc143c" : "yellow"}}>{turn}</span> it's your turn</p>);
    }

    useEffect(() => {
        initBoard();
    }, []);

    useEffect(() => {
        checkWin();
        setTurn(turn === 1 ? 2 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board]);

    return(
        <div className="d-flex mb-5 ms-6">
            <div>
                <h1 className="fw-bold">Connect 4 game</h1>
                <p className="fs-3">Player 1 use <span className="redDot">red</span> dot, Player 2 use <span className="yellowDot">yellow</span> dot</p>
                {statusGame()}
                <div className="game-board">
                    {React.Children.toArray(renderBoard())}
                </div>
                {win !== 0 ? <button type="button" className="btn btn-success mt-2" onClick={() => reset()}>Play again</button> : 
                <button type="button" className="btn btn-danger mt-3" onClick={() => reset()}>Reset board</button>}
            </div>
            <div className="d-flex align-items-center justify-content-center flex-column ms-3">
                <div className="d-flex align-items-center">
                    <p className="fs-3">Counter win : </p>
                    <h2 className="fw-bold ms-2"> <span className="redDot">{counterWin[0]}</span> <span className="yellowDot">{counterWin[1]}</span> {counterWin[2]}</h2>
                </div>
                <button type="button" className="btn btn-danger mt-2" onClick={() => setCounterWin([0, 0, 0])}>Reset counter win</button>
            </div>
        </div>
    );
}