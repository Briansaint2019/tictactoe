let startBoard;
const humePlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]



const squares = document.querySelectorAll('.square');
startGame();

function startGame()
{
    document.querySelector(".endgame").style.display = "none";
    startBoard = Array.from(Array(9).keys());
    for (let i = 0; i < squares.length; i++)
    {
        squares[i].innerText = '';
        squares[i].style.removeProperty('background-color');
        squares[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square)
{
    if (typeof startBoard[square.target.id] == 'number')
    {
        turn(square.target.id, humePlayer)
        if (!checkWin(startBoard, humePlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player)
{
    startBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(startBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player)
{
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries())
    {
        if (win.every(elem => plays.indexOf(elem) > -1))
        {
            gameWon = {
                index: index,
                player: player
            };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon)
{
    for (let index of winCombos[gameWon.index])
    {
        document.getElementById(index).style.backgroundColor =
            gameWon.player === humePlayer ? "rgba(214, 224, 230, 0.9)" : "rgba(201, 177, 189, 0.9)";
        document.getElementById(index).style.borderRadius = "10%"
        document.getElementById(index).style.textShadow = " 4px 4px 5px rgba(150, 150, 150, 1)";
    }
    for (let i = 0; i < squares.length; i++)
    {
        squares[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === humePlayer ? "You win!" : "You lose.");
}

function declareWinner(who)
{
    document.querySelector(".endgame").style.display = "block";

    document.querySelector(".endgame .text").innerText = who;
}

function emptysquares()
{
    return startBoard.filter(s => typeof s === 'number');
}

function bestSpot()
{
    return minMax(startBoard, aiPlayer).index;
}

function checkTie()
{
    if (emptysquares().length === 0)
    {
        for (let i = 0; i < squares.length; i++)
        {
            squares[i].style.backgroundColor = "rgba(128, 145, 115, 0.9)";
            squares[i].removeEventListener('click', turnClick, false);
            squares[i].style.borderRadius = "10%";
            squares[i].style.textShadow = "4px 4px 5px rgba(150, 150, 150, 1)";
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minMax(newBoard, player)
{
    let availSpots = emptysquares();

    if (checkWin(newBoard, humePlayer))
    {
        return {
            score: -5
        };
    }
    else if (checkWin(newBoard, aiPlayer))
    {
        return {
            score: 5
        };
    }
    else if (availSpots.length === 0)
    {
        return {
            score: 0
        };
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++)
    {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer)
        {
            let result = minMax(newBoard, humePlayer);
            move.score = result.score;
        }
        else
        {
            let result = minMax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer)
    {
        let bstScore = -10000;
        for (let i = 0; i < moves.length; i++)
        {
            if (moves[i].score > bstScore)
            {
                bstScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else
    {
        let bstScore = 10000;
        for (let i = 0; i < moves.length; i++)
        {
            if (moves[i].score < bstScore)
            {
                bstScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}