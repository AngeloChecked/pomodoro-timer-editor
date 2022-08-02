import * as YAML from 'yaml'
import { Result, Ok, Err } from 'oxide.ts'
import PomodoroTimerEditorValidator from './PomodoroTimerEditorValidator'
import { PomodoroTimerCanvasElementTemplate } from './createPomodoroTimerCanvasElements'

type Moment = 'pomodoro' | 'pause'

export type PomodoroTimerEditorTemplate = {
  [key in Moment]: {
    taskName?: string
    timer: string
    timeSpent?: string
  }
}

export type PomodoroTimerEditorError = {
  code: string
  pos: [number, number]
  linePos: { line: number; col: number }[]
}

export default class PomodoroTimerEditor {
  constructor(private validator: PomodoroTimerEditorValidator = new PomodoroTimerEditorValidator()) {}

  private template: PomodoroTimerEditorTemplate[] = []

  setAndValidateEditorTemplate(template: string): Result<PomodoroTimerEditorTemplate[], PomodoroTimerEditorError> {
    const validation = this.validator.validate(template)
    if (validation.isErr()) {
      return Err(validation.unwrapErr())
    }
    try {
      const templateParsed = YAML.parse(template)
      this.template = templateParsed
    } catch (error: any) {
      if (error.name === 'YAMLParseError') {
        return Err({ code: error.code, pos: error.pos, linePos: error.linePos })
      }
      console.error('unhandled error: ' + JSON.stringify(error))
      throw error
    }
    return Ok(this.template)
  }

  private formatTimeCountdown(timerInMinute: string, secondsSpent: string): string {
    timerInMinute.slice(0, -1)
    secondsSpent.slice(0, -1)
    const SecondRemaining = parseInt(timerInMinute) * 60 - parseInt(secondsSpent)
    const minutes = Math.floor(SecondRemaining / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (SecondRemaining % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  produceCanvasTemplate(): PomodoroTimerCanvasElementTemplate[] {
    const canvasTemplates: PomodoroTimerCanvasElementTemplate[] = []
    this.template.forEach((editorTemplate) => {
      if (editorTemplate.pomodoro) {
        canvasTemplates.push({
          pomodoro: {
            timeToShow: this.formatTimeCountdown(
              editorTemplate.pomodoro.timer,
              editorTemplate.pomodoro.timeSpent ?? '0s'
            ),
            taskName: editorTemplate.pomodoro.taskName,
          },
        })
      }
      if (editorTemplate.pause) {
        canvasTemplates.push({
          pause: {
            timeToShow: this.formatTimeCountdown(editorTemplate.pause.timer, editorTemplate.pause.timeSpent ?? '0s'),
          },
        })
      }
    })
    return canvasTemplates
  }
}
