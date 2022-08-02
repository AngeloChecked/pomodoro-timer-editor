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

  private editorTemplates: PomodoroTimerEditorTemplate[] = []

  setAndValidateEditorTemplate(template: string): Result<PomodoroTimerEditorTemplate[], PomodoroTimerEditorError> {
    const validation = this.validator.validate(template)
    if (validation.isErr()) {
      return Err(validation.unwrapErr())
    }
    try {
      const templateParsed = YAML.parse(template)
      this.editorTemplates = templateParsed
    } catch (error: any) {
      if (error.name === 'YAMLParseError') {
        return Err({ code: error.code, pos: error.pos, linePos: error.linePos })
      }
      console.error('unhandled error: ' + JSON.stringify(error))
      throw error
    }
    return Ok(this.editorTemplates)
  }

  private timeStringToSeconds(time: string, type: 's' | 'm'): number {
    const timeWithoutSymbol = parseInt(time.substring(0, time.length - 1))
    if (type === 's') {
      return timeWithoutSymbol
    } else {
      return timeWithoutSymbol * 60
    }
  }

  private formatTimeCountdown(timerInMinute: string, secondsSpent: string): string {
    const SecondRemaining = this.timeStringToSeconds(timerInMinute, 'm') - this.timeStringToSeconds(secondsSpent, 's')
    const minutes = Math.floor(SecondRemaining / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (SecondRemaining % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  produceCanvasTemplate(): PomodoroTimerCanvasElementTemplate[] {
    const canvasTemplates: PomodoroTimerCanvasElementTemplate[] = []
    this.editorTemplates.forEach((editorTemplate) => {
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

  updateTemplateToTheNextSecond(): PomodoroTimerEditorTemplate[] {
    for (const template of this.editorTemplates) {
      const moment = template.pomodoro ? template.pomodoro : template.pause
      const timeSpent = moment.timeSpent
      const timer = moment.timer
      if (!timeSpent) {
        moment.timeSpent = '1s'
        return this.editorTemplates
      }

      const secondsSpent = this.timeStringToSeconds(timeSpent, 's')
      const timerSeconds = this.timeStringToSeconds(timer, 'm')
      if (timerSeconds !== secondsSpent && timerSeconds > secondsSpent) {
        moment.timeSpent = `${secondsSpent + 1}s`
        return this.editorTemplates
      }
    }
    return this.editorTemplates
  }
}
