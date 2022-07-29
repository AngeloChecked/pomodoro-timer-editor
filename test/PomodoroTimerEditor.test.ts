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
})
