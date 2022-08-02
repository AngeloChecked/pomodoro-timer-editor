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
const monacoEditor = configureAndCreateEditor(document.getElementById('editor') as HTMLElement)
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

// setInterval(() => {
//   editorModel?.setValue()
// }, 1000)
