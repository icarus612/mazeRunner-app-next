import {useState} from 'react'
import cx from 'classnames'
import styles from 'styles/styles.module.scss'
import Maze from "components/maze"
import Runner from "components/runner"

export default ()=> {
  const [currentMaze, setCurrentMaze] = useState(false)
  const [currentCompleted, setCurrentCompleted] = useState(false)
  const [height, setHeight] = useState(10)
  const [width, setWidth] = useState(10)

  const newMaze = () => {
    setCurrentMaze(Maze({build: [height, width]}))
    setCurrentCompleted(false)
  }
  const solveMaze = () => {
    const runner = Runner(currentMaze);
    runner.makeNodePaths();
    runner.buildPath();
    setCurrentCompleted(runner);
  }
  
  const completedMaze = currentCompleted.completed ? currentCompleted.mappedMaze.map((row)=> {
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
  }) : <h5>Maze is not Solvable</h5>

  return (
    <div className={cx(styles.container, styles.h100_vh, styles.w100_vw, styles.f_col, styles.justify_center, styles.align_center)}>
      <div className={styles.maze}>
        {currentMaze && currentMaze.layout.map((row)=> {
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
        {currentCompleted && (
          <div className={styles.solved}>
            {completedMaze}
          </div>
        )}
      </div>
      <div>
        <lable>Set Maze Height:</lable>
        <input 
          type="number" 
          value={height} 
          className={styles.number_input}
          onChange={(e)=> setHeight(e.target.value)} 
        />
      </div>
      <div>
        <lable>Set Maze Width:</lable>
        <input 
          type="number" 
          value={width}
          className={styles.number_input}
          onChange={(e)=> setWidth(e.target.value)} 
        />
      </div>
      <button onClick={()=> newMaze()}>New Maze</button>
      {currentMaze && <button onClick={()=> solveMaze()}>Attempt to Solve</button>}
    </div>
  )
}
