import createCssEditor from './createCssEditor'
import configureAndCreateEditor from './configureAndCreateEditor'
import createPomodoroTimerCanvasElements, {
  PomodoroTimerCanvasElementTemplate,
} from './createPomodoroTimerCanvasElements'
import PomodoroTimerEditor from './PomodoroTimerEditor'

const dynamicStyle = document.getElementById('dynamic-style') as HTMLElement
const pomodoroCssEditor = document.getElementById('pomodoro-css') as HTMLElement
createCssEditor(pomodoroCssEditor, dynamicStyle)

const pomodoroCanvas = document.getElementById('pomodoro-canvas') as HTMLElement
function updatePomodoroCanvas(canvasTemplates: PomodoroTimerCanvasElementTemplate[]): void {
  pomodoroCanvas.innerHTML = ''
  createPomodoroTimerCanvasElements(document, canvasTemplates).forEach((element) => {
    pomodoroCanvas.appendChild(element)
  })
}

const monacoEditorBox = document.getElementById('editor') as HTMLDivElement
const monacoEditor = configureAndCreateEditor(monacoEditorBox)
const editorModel = monacoEditor.getModel()

const pomodoroTimerEditor = new PomodoroTimerEditor()
const editorTemplate = editorModel?.getValue()
if (editorTemplate) {
  const result = pomodoroTimerEditor.setAndValidateEditorTemplate(editorTemplate)
  if (result.isOk()) {
    updatePomodoroCanvas(pomodoroTimerEditor.produceCanvasTemplate())
  }
}

editorModel?.onDidChangeContent(() => {
  const value = editorModel.getValue()
  const result = pomodoroTimerEditor.setAndValidateEditorTemplate(value)
  if (result.isErr()) {
    console.log(result.unwrapErr())
  }
  if (result.isOk()) {
    const canvasTemplates = pomodoroTimerEditor.produceCanvasTemplate()
    updatePomodoroCanvas(canvasTemplates)
  }
})

let play = false
const playButton = document.getElementById('play-button') as HTMLImageElement
let timerLoop: NodeJS.Timeout

playButton.onclick = () => {
  if (play) {
    monacoEditor.updateOptions({ readOnly: true, hideCursorInOverviewRuler: true })
    playButton.src = 'img/stop-button.svg'
    timerLoop = setInterval(() => {
      pomodoroTimerEditor.updateTemplateToTheNextSecond()
      const editorTemplateOneSecondNext = pomodoroTimerEditor.getYAMLTemplate()
      editorModel?.setValue(editorTemplateOneSecondNext)
    }, 1000)
  } else {
    const x = monacoEditorBox.querySelector('.cursors-layer.cursor') as HTMLElement
    monacoEditor.updateOptions({ readOnly: false, hideCursorInOverviewRuler: false })
    playButton.src = 'img/play-button.svg'
    clearInterval(timerLoop)
  }
  play = !play
}
