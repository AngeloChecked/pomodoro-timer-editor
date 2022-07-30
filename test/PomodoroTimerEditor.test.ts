import PomodoroTimerEditor from '../src/PomodoroTimerEditor'
import { expect } from 'chai'

describe('PomodoroTimerEditor', () => {
  it('set correctly a valid pomodoro timer template', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    const templateResult = pomodoroTimerEditor.setTemplate(`
- pomodoro:
    taskName: calendar
    time: 25m
- pause:
    taskName: small break 
    time: 5m
    timeSpent: 10s
`)

    expect(templateResult.isOk()).equal(true)
    expect(templateResult.unwrap()).deep.eq([
      { pomodoro: { taskName: 'calendar', time: '25m' } },
      { pause: { taskName: 'small break', time: '5m', timeSpent: '10s' } },
    ])
  })

  it('set an pomodoro timer template with invalid indentation', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    const templateResult = pomodoroTimerEditor.setTemplate(`
- pomodoro:
	taskName: calendar
    `)

    expect(templateResult.isErr()).equal(true)
    expect(templateResult.unwrapErr()).deep.eq({
      code: 'TAB_AS_INDENT',
      pos: [13, 14],
      linePos: [
        { line: 3, col: 1 },
        { line: 3, col: 2 },
      ],
    })
  })

  it('result the first timer error found', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

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
    const pomodoroTimerEditor = new PomodoroTimerEditor()

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
