import { expect } from 'chai'
import PomodoroTimerEditorValidator from '../src/PomodoroTimerEditorValidator'

describe('PomodoroTimerEditorValidator', () => {
  it('result the first timer error found', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditorValidator()

    const isValid = pomodoroTimerEditor.validate(`- pomodoro: 
  timer: 12aaa
- pomodoro: 
  timer: 14bbb
`)

    expect(isValid.isErr()).equal(true)
    expect(isValid.unwrapErr()).deep.eq({
      code: 'BAD_TIMER_FORMAT',
      pos: [22, 27],
      linePos: [
        { line: 2, col: 11 },
        { line: 2, col: 12 },
        { line: 2, col: 13 },
        { line: 2, col: 14 },
        { line: 2, col: 15 },
      ],
    })
  })

  it.skip('result the first timer error found with another property', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditorValidator()

    const isValid = pomodoroTimerEditor.validate(`
- pomodoro:
    taskName: calendar
    time: 25aa
`)

    expect(isValid.isErr()).equal(true)
    expect(isValid.unwrapErr()).deep.eq({
      code: 'BAD_TIMER_FORMAT',
      pos: [45, 49],
      linePos: [
        { line: 4, col: 10 },
        { line: 4, col: 11 },
        { line: 4, col: 12 },
        { line: 4, col: 13 },
      ],
    })
  })
})
