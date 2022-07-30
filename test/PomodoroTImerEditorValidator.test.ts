import { expect } from 'chai'
import PomodoroTimerEditorValidator from '../src/PomodoroTimerEditorValidator'

describe('PomodoroTimerEditorValidator', () => {
  it('timer property is in minutes', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditorValidator()

    const isValid = pomodoroTimerEditor.validate(`- pomodoro: 
  timer: 12m
`)

    expect(isValid.isOk()).eq(true)
  })

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

  it('result the first timer error found with another property', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditorValidator()

    const isValid = pomodoroTimerEditor.validate(`
- pomodoro:
    taskName: calendar
    timer: 25aa
`)

    expect(isValid.isErr()).equal(true)
    expect(isValid.unwrapErr()).deep.eq({
      code: 'BAD_TIMER_FORMAT',
      pos: [47, 51],
      linePos: [
        { line: 4, col: 13 },
        { line: 4, col: 14 },
        { line: 4, col: 15 },
        { line: 4, col: 16 },
      ],
    })
  })
})
