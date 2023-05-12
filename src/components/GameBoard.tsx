
import React from "react";
import rosso from "../img/rosso.png";
import giallo from "../img/giallo.png";
import vuoto from "../img/vuoto.png";
import { useEffect, useState } from "react";

const DIM = 8; 
//Todo: add check win for col and diagonal, change result win, add random turn;
export const GameBoard = (props: any) => {
    const [board, setBoard] = useState<string[][] | null>(null);
    const [turn, setTurn] = useState<1 | 2>(1);
    const [win, setWin] = useState<0 | 1 | 2 | 3>(0);

    const initBoard = () => {
        const boardTemp: string[][] = [];
        for(let i=0;i<DIM;i++) boardTemp.push(Array.from({length: DIM}, () => vuoto))
        setBoard(boardTemp);
    }

    const addDot = (row: number, col: number) => {
        if(col === -1) alert("Full column...");
        else if(board && board[row][col] === vuoto) {
            board[row][col] = turn === 1 ? rosso : giallo;
            setBoard([...board]);
        }
        else addDot(row, col-1);
    }  

    const reset = () => {
        initBoard();
    }

    const checkWin = () => {
        if(!board) return;
        for(let row=0;row<DIM;row++){
            for(let col=0;col<DIM;col++){
                if(board[row][col] !== vuoto){
                    //Row:
                    const tempArr = [];
                    for(let i=row+1;i<=row+3;i++){
                        try{
                            if((board[i][col] === board[row][col])) tempArr.push(board[i][col]);
                            else break;
                        } catch(e){};
                    }
                    if(tempArr.length === 3) board[row][col] === rosso ? alert("Player 1 win") : alert("Player 2 win");
                    
                    for(let i=row-1;i<=row-3;i--){
                        try{
                            if(board[i][col] && (board[i][col] === board[row][col])) tempArr.push(board[i][col]);
                            else break;
                        } catch(e){};
                    }
                    if(tempArr.length === 3) board[row][col] === rosso ? alert("Player 1 win") : alert("Player 2 win");
                }
            }
        }
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
        <>
            <h1 className="fw-bold">Force 4 game</h1>
            <p className="fs-3">Player 1 use <span className="redDot">red</span> dot, Player 2 use <span className="yellowDot">yellow</span> dot</p>
            <p className="fs-3">Player {turn} it's your turn</p>
            <div className="game-board">
                {React.Children.toArray(board?.map((arr, index) => {
                    return <div onClick={() => addDot(index, DIM-1)}>{React.Children.toArray(arr.map((img) => <div className="box" ><img src={img} width={"100%"} height={"100%"} alt="..." /></div>))}</div>
                }))}
            </div>
            <button type="button" className="btn btn-danger mt-3" onClick={() => reset()}>Reset</button>
        </>
    );
}