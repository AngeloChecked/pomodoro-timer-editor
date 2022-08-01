import * as monaco from 'monaco-editor'
import createCssEditor from './cssEditor'
import configureAndCreateEditor from './monacoEditor'
import PomodoroTimerEditor from './PomodoroTimerEditor'

const dynamicStyle = document.getElementById('dynamic-style') as HTMLElement
const pomodoroCssEditor = document.getElementById('pomodoro-css') as HTMLElement
createCssEditor(pomodoroCssEditor, dynamicStyle)

const pomodoroCanvas = document.getElementById('pomodoro-canvas') as HTMLElement
function pomodoroItem() {
  const pomodoroItem = document.createElement('div')
  pomodoroItem.className = 'pomodoro'
  const pomodoroIconItem = document.createElement('div')
  pomodoroIconItem.className = 'pomodoro-icon'
  const pomodoroTimerItem = document.createElement('div')
  const taskName = document.createElement('div')
  taskName.innerHTML = 'task name'
  taskName.className = 'pomodoro-task-name'
  const timer = document.createElement('div')
  timer.innerHTML = '25:00'
  timer.className = 'pomodoro-timer'
  pomodoroTimerItem.appendChild(taskName)
  pomodoroTimerItem.appendChild(timer)
  pomodoroItem.appendChild(pomodoroIconItem)
  pomodoroItem.appendChild(pomodoroTimerItem)
  return pomodoroItem
}
function momentSeparator() {
  const arrowItem = document.createElement('div')
  arrowItem.className = 'moment-separator'
  return arrowItem
}

function pauseItem() {
  const pauseItem = document.createElement('div')
  pauseItem.className = 'pause'
  const pauseIconItem = document.createElement('div')
  pauseIconItem.className = 'pause-icon'
  const pauseTimerItem = document.createElement('div')
  pauseTimerItem.innerHTML = '5:00'
  pauseTimerItem.className = 'pause-timer'
  pauseItem.appendChild(pauseIconItem)
  pauseItem.appendChild(pauseTimerItem)
  return pauseItem
}

pomodoroCanvas.appendChild(pomodoroItem())
pomodoroCanvas.appendChild(momentSeparator())
pomodoroCanvas.appendChild(pauseItem())
pomodoroCanvas.appendChild(pomodoroItem())
pomodoroCanvas.appendChild(momentSeparator())
pomodoroCanvas.appendChild(pauseItem())
pomodoroCanvas.appendChild(pomodoroItem())
pomodoroCanvas.appendChild(momentSeparator())
pomodoroCanvas.appendChild(pauseItem())

const monacoEditor = configureAndCreateEditor(document.getElementById('editor') as HTMLElement)
const editorModel = monacoEditor.getModel()
editorModel?.onDidChangeContent(() => {
  // const _value = editorModel.getValue()
})
