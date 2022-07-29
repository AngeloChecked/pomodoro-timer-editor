import * as YAML from 'yaml'
import { Result, Ok, Err } from 'oxide.ts'

type Moment = 'pomodoro' | 'pause'
type PomodoroTimerEditorTemplate = {
  [key in Moment]: {
    taskName: string
    time: string
    timeSpent?: string
  }
}

type PomodoroTimerEditorError = {
  code: string
  pos: [number]
  linePos: { line: number; col: number }[]
}

export default class PomodoroTimerEditor {
  private template: PomodoroTimerEditorTemplate[] = []
  setTemplate(template: string): Result<PomodoroTimerEditorTemplate[], PomodoroTimerEditorError> {
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
