
import React from "react";
import rosso from "../img/rosso.png";
import giallo from "../img/giallo.png";
import vuoto from "../img/vuoto.png";
import { useEffect, useState } from "react";

const DIM = 8; 

export const GameBoard = () => {
    const [board, setBoard] = useState<string[][] | null>(null);
    const [turn, setTurn] = useState<1 | 2>(Math.random() > 0.5 ? 1 : 2);
    const [win, setWin] = useState<0 | 1 | 2 | 3>(0);

    const initBoard = () => {
        const boardTemp: string[][] = [];
        for(let i=0;i<DIM;i++) boardTemp.push(Array.from({length: DIM}, () => vuoto))
        setBoard(boardTemp);
    }

    const renderBoard = () => {
        if(!board) return [];
        const newBoard = [];
        for(let i=0;i<DIM;i++){
            const arr = [];
            for(let j=0;j<DIM;j++){
                arr.push(<div className="box"><img src={board[j][i]} width={"100%"} height={"100%"} alt="..." /></div>);
            }
            newBoard.push(<div onClick={() => addDot(DIM-1, i)}>{React.Children.toArray(arr)}</div>);
        }
        return newBoard;
    }

    const addDot = (row: number, col: number) => {
        if(win !== 0) return;
        if(row === -1) alert("Full column...");
        else if(board && board[row][col] === vuoto) {
            board[row][col] = turn === 1 ? rosso : giallo;
            setBoard([...board]);
        }
        else addDot(row-1, col);
    }  

    const reset = () => {
        initBoard();
        setTurn(Math.random() > 0.5 ? 1 : 2);
        setWin(0);
    }

    const checkWin = () => {
        if(!board) return;
        for(let row=0;row<DIM;row++){
            for(let col=0;col<DIM;col++){
                if(board[row][col] !== vuoto){
                    //Row:
                    let tempArr = [];
                    for(let i=row+1;i<=row+3;i++){
                        try{
                            if((board[i][col] === board[row][col])) tempArr.push(board[i][col]);
                            else break;
                        } catch(e){};
                    }
                    if(tempArr.length === 3) board[row][col] === rosso ? setWin(1) : setWin(2);

                    //Col:
                    tempArr = [];
                    for(let i=col+1;i<=col+3;i++){
                        try{
                            if((board[row][i] === board[row][col])) tempArr.push(board[row][i]);
                            else break;
                        } catch(e){};
                    }
                    if(tempArr.length === 3) board[row][col] === rosso ? setWin(1) : setWin(2);

                    //Diagonal:
                    let d1 = [], d2 = [];
                    for(let i=1;i<=3;i++){
                        try{
                            if(board[row+i][col+i] && (board[row+i][col+i] === board[row][col])) d1.push(board[row+i][col+i]);
                        }catch(e){};
                        try{
                            if(board[row-i][col+i] && (board[row-i][col+i] === board[row][col])) d2.push(board[row-i][col+i]);
                        }catch(e){};
                    }
                    if(d1.length === 3 || d2.length === 3) board[row][col] === rosso ? setWin(1) : setWin(2);
                }
            }
        }
        if(board.flat(2).every((img) => img !== vuoto)) setWin(3);
    }

    useEffect(() => {
        initBoard();
    }, []);

    useEffect(() => {
        checkWin();
        setTurn(turn === 1 ? 2 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board]);

    useEffect(() => {
        if(win !== 0) {
            setTimeout(() => reset(), 3000);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [win]);

    return(
        <>
            <h1 className="fw-bold">Force 4 game</h1>
            <p className="fs-3">Player 1 use <span className="redDot">red</span> dot, Player 2 use <span className="yellowDot">yellow</span> dot</p>
            <p className="fs-3">Player {turn} it's your turn</p>
            {win === 1 || win === 2 ? <p className="fs-3">Player <span style={{color: win === 1 ? "#dc143c" : "yellow"}}>{win}</span> has won!</p> : win === 3 ? <p className="fs-3">Tie...</p> : null}
            <div className="game-board">
                {React.Children.toArray(renderBoard())}
            </div>
            <button type="button" className="btn btn-danger mt-3" onClick={() => reset()}>Reset</button>
        </>
    );
}