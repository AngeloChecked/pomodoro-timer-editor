import * as YAML from 'yaml'
import { Result, Ok, Err } from 'oxide.ts'
import PomodoroTimerEditorValidator from './PomodoroTimerEditorValidator'

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

  setTemplate(template: string): Result<PomodoroTimerEditorTemplate[], PomodoroTimerEditorError> {
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
}
