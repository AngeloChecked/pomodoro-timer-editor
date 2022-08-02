import createCssEditor from './createCssEditor'
import configureAndCreateEditor from './configureAndCreateEditor'
import createPomodoroTimerElements, { PomodoroTimerMomentElementTemplate } from './createPomodoroTimerElements'

const dynamicStyle = document.getElementById('dynamic-style') as HTMLElement
const pomodoroCssEditor = document.getElementById('pomodoro-css') as HTMLElement
createCssEditor(pomodoroCssEditor, dynamicStyle)

const pomodoroCanvas = document.getElementById('pomodoro-canvas') as HTMLElement
const templates: PomodoroTimerMomentElementTemplate[] = [
  {
    pomodoro: {
      timer: '25:00',
      taskName: 'task name',
    },
  },
  {
    pause: {
      timer: '5:00',
    },
  },
]
createPomodoroTimerElements(document, templates).forEach((element) => {
  pomodoroCanvas.appendChild(element)
})

const monacoEditor = configureAndCreateEditor(document.getElementById('editor') as HTMLElement)
const editorModel = monacoEditor.getModel()
editorModel?.onDidChangeContent(() => {
  // const _value = editorModel.getValue()
})
