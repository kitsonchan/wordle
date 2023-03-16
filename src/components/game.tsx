import { useEffect, useState } from "react"

interface keyboardProps {
  letterClick: (letter: string) => void
  enterClick: () => void
  deleteClick: () => void
}

interface restartProps {
  restartClick: () => void
}

enum statusName {
  green = "green",
  yellow = "yellow",
  gray = "gray",
  none = "none"
}

export default function Game() {
  const [solution, setSolution] = useState("")
  const [turn, setTurn] = useState(0)
  const [win, setWin] = useState(false)
  const [rowFilled, setRowFilled] = useState(0)
  const [status, setStatus] = useState<(statusName)[][]>([
    [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
    [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
    [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
    [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
    [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
    [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none]
  ])
  const [attempts, setAttempts] = useState<string[][]>([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
  ])

  const Grid = () => {
    return (
      <div>
        <div className="mb-4">
          {attempts.map((row, rowIdx) => (<div key={rowIdx} className="mb-4 last:mb-0 flex justify-center gap-4">{row.map((i, itemIdx) => { return (<div key={itemIdx} className={`rounded w-16 border-2 border-black aspect-square flex justify-center items-center uppercase text-xl font-bold select-none ${status[rowIdx][itemIdx] === statusName['green'] ? "bg-green-400" : null} ${status[rowIdx][itemIdx] === statusName['yellow'] ? "bg-yellow-400" : null} ${status[rowIdx][itemIdx] === statusName['gray'] ? "bg-gray-400" : null}`}>{i}</div>) })}</div>))}
        </div>
      </div>
    )
  }

  const Keyboard = ({ letterClick, enterClick, deleteClick }: keyboardProps) => {
    const keyboardList = Array.from("qwertyuiopasdfghjklzxcvbnm")

    return (
      <div>
        <div className="flex justify-center gap-4 mb-4">{keyboardList.slice(0, 10).map(i => (<div className="w-12 rounded bg-gray-200 aspect-square flex justify-center items-center uppercase text-lg font-bold cursor-pointer transition-all hover:bg-gray-300" key={i} onClick={() => letterClick(i)}>{i}</div>))}</div>
        <div className="flex justify-center gap-4 mb-4">{keyboardList.slice(10, 19).map(i => (<div className="w-12 rounded bg-gray-200 aspect-square flex justify-center items-center uppercase text-lg font-bold cursor-pointer transition-all hover:bg-gray-300" key={i} onClick={() => letterClick(i)}>{i}</div>))}</div>
        <div className="flex justify-center gap-4 mb-4">{keyboardList.slice(19, 27).map(i => (<div className="w-12 rounded bg-gray-200 aspect-square flex justify-center items-center uppercase text-lg font-bold cursor-pointer transition-all hover:bg-gray-300" key={i} onClick={() => letterClick(i)}>{i}</div>))}</div>
        <div className="flex justify-center gap-4">
          <button className="rounded bg-gray-200 px-4 py-2 font-bold cursor-pointer transition-all hover:bg-gray-300" onClick={deleteClick}>Delete</button>
          <button className="rounded bg-gray-200 px-4 py-2 font-bold cursor-pointer transition-all hover:bg-gray-300" onClick={enterClick}>Enter</button>
        </div>
      </div>
    )
  }

  const Restart = ({ restartClick }: restartProps) => {
    return (
      <div className="text-center">
        <div className="font-bold text-xl mb-4">Game Over</div>
        <div><button className="rounded bg-gray-200 px-4 py-2 font-bold cursor-pointer transition-all hover:bg-gray-300" onClick={restartClick}>Restart</button></div>
      </div>
    )
  }

  function restartGame() {
    getSolution()
    setTurn(0)
    setWin(false)
    setRowFilled(0)
    setStatus([
      [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
      [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
      [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
      [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
      [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none],
      [statusName.none, statusName.none, statusName.none, statusName.none, statusName.none]
    ])
    setAttempts([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""]
    ])
  }

  function getSolution() {
    fetch("https://random-word-api.vercel.app/api?words=1&length=5")
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(
            `Error Status ${resp.status}`
          );
        }
        return resp.json();
      })
      .then((data) => {
        setSolution(data[0])
      })
      .catch((err) => {
        alert(err.message);
      })
  }

  function keyboardLetter(l: string) {
    const res = attempts.map((row, rowIdx) => {
      if (rowIdx === turn) {
        return attempts[turn].map((i, idx) => {
          if (idx === rowFilled) {
            return l
          } else {
            return i
          }
        })
      } else {
        return row
      }
    })
    setRowFilled(prev => { return prev >= attempts[turn].length ? attempts[turn].length : prev + 1 })
    setAttempts(res)
  }

  function keyboardEnter() {
    if (attempts[turn].join('').length === 5) {
      setTurn(prev => prev + 1)
      setRowFilled(0)
      checkLetters()
    }
  }

  function keyboardDelete() {
    const res = attempts[turn].map((i, idx) => {
      if (idx === rowFilled - 1) {
        return ""
      }
      return i
    })
    setAttempts(attempts.map((row, rowIdx) => {
      if (rowIdx === turn) {
        return res
      }
      return row
    }))
    setRowFilled(prev => { return prev > 0 ? prev - 1 : 0 })
  }

  function checkLetters() {
    const sol = Array.from(solution)
    const getOccurrence = (i: string, t: string[]) => {
      return t.filter(item => item === i).length
    }
    const res = attempts[turn].map((i, idx) => {
      if (i === sol[idx]) {
        return statusName.green
      } else if (i !== sol[idx] && getOccurrence(i, sol) > 0 && getOccurrence(i, attempts[turn]) <= getOccurrence(i, sol)) {
        return statusName.yellow
      } else {
        return statusName.gray
      }
    })
    setStatus(prev => {
      return prev.map((row, rowIdx) => {
        if (rowIdx === turn) {
          return res
        } else {
          return row
        }
      })
    })
  }

  useEffect(() => {
    getSolution()
  }, []);

  useEffect(() => {
    const res = [...new Set(status[turn - 1])]
    const isOver = res.length === 1 && res.includes(statusName['green'])
    setWin(isOver)
  }, [status])

  return (
    <>
      <div className="m-auto p-4">
        <Grid />
        {win || (turn === 6 && !win) ? (<Restart restartClick={restartGame} />) : (<Keyboard letterClick={keyboardLetter} enterClick={keyboardEnter} deleteClick={keyboardDelete} />)}
      </div>
    </>
  )
}