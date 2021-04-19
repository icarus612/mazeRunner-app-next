import {useState} from 'react'
import cx from 'classnames'
import styles from 'styles/styles.module.scss'
import Maze from "components/maze"
import Runner from "components/runner"

export default ()=> {
  const [currentMaze, setCurrentMaze] = useState(false)
  const [currentCompleted, setCurrentCompleted] = useState(false)

  const newMaze = () => {
    setCurrentMaze(Maze())
    setCurrentCompleted(false)
  }
  const solveMaze = () => {
    const runner = Runner(currentMaze);
    runner.makeNodePaths();
    runner.buildPath();
    setCurrentCompleted(runner);
  }
  
  console.log(currentMaze)
  return (
    <div className={cx(styles.container, styles.h100_vh, styles.w100_vw, styles.f_col, styles.justify_center, styles.align_center)}>
      <div>
        {currentMaze && !currentCompleted && currentMaze.layout.map((row)=> {
          return (
            <div className={cx(styles.f_row)}>
              {row.map((el, i)=> {
                return <div key={i} className={cx(
                  styles.maze_tile, 
                  {[styles.start]: el == currentMaze.startChar},
                  {[styles.end]: el == currentMaze.endChar},
                  {[styles.wall]: el == currentMaze.wallChar},
                  {[styles.open]: el == currentMaze.openChar},
                )} />
              })}
            </div>
          )
        })}

      {currentCompleted && currentCompleted.mappedMaze.map((row)=> {
          return (
            <div className={cx(styles.f_row)}>
              {row.map((el, i)=> {
                return <div key={i} className={cx(
                  styles.maze_tile, 
                  {[styles.start]: el == currentMaze.startChar},
                  {[styles.end]: el == currentMaze.endChar},
                  {[styles.wall]: el == currentMaze.wallChar},
                  {[styles.open]: el == currentMaze.openChar},
                  {[styles.path]: el == currentCompleted.pathChar},
                )} />
              })}
            </div>
          )
        })}
      </div>
      <button onClick={()=> newMaze()}>New Maze</button>
      {currentMaze && <button onClick={()=> solveMaze()}>Attempt to Solve</button>}
    </div>
  )
}
