import PomodoroTimerEditor from '../src/PomodoroTimerEditor'
import { expect } from 'chai'

describe('PomodoroTimerEditor', () => {
  it('set correctly a valid pomodoro timer template', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    const templateResult = pomodoroTimerEditor.setAndValidateEditorTemplate(`
- pomodoro:
    taskName: calendar
    timer: 25m
- pause:
    timer: 5m
    timeSpent: 10s
`)

    expect(templateResult.isOk()).equal(true)
    expect(templateResult.unwrap()).deep.eq([
      { pomodoro: { taskName: 'calendar', timer: '25m' } },
      { pause: { timer: '5m', timeSpent: '10s' } },
    ])
  })

  it('set an pomodoro timer template with invalid indentation', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    const templateResult = pomodoroTimerEditor.setAndValidateEditorTemplate(`
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

  it('from editor template produce relative canvas template', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    pomodoroTimerEditor.setAndValidateEditorTemplate(`
- pomodoro:
    taskName: calendar
    timer: 25m
- pause:
    timer: 5m
    timeSpent: 10s
`)

    const canvasTemplate = pomodoroTimerEditor.produceCanvasTemplate()

    expect(canvasTemplate).deep.eq([
      {
        pomodoro: {
          taskName: 'calendar',
          timeToShow: '25:00',
        },
      },
      {
        pause: {
          timeToShow: '04:50',
        },
      },
    ])
  })

  it('produce template with the first moment one second in the future', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    pomodoroTimerEditor.setAndValidateEditorTemplate(`
- pomodoro:
    taskName: calendar
    timer: 25m
- pause:
    timer: 5m
    timeSpent: 10s
`)

    const canvasTemplate = pomodoroTimerEditor.updateTemplateToTheNextSecond()

    expect(canvasTemplate).deep.eq([
      { pomodoro: { taskName: 'calendar', timer: '25m', timeSpent: '1s' } },
      { pause: { timer: '5m', timeSpent: '10s' } },
    ])
  })

  it('produce template with the successive moment one second in the future if the previous is completed', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    pomodoroTimerEditor.setAndValidateEditorTemplate(`
- pomodoro:
    taskName: calendar
    timer: 25m
    timeSpent: 1500s 
- pause:
    timer: 5m
    timeSpent: 10s
`)

    const canvasTemplate = pomodoroTimerEditor.updateTemplateToTheNextSecond()

    expect(canvasTemplate).deep.eq([
      { pomodoro: { taskName: 'calendar', timer: '25m', timeSpent: '1500s' } },
      { pause: { timer: '5m', timeSpent: '11s' } },
    ])
  })

  it('produce internal template in yaml correctly', () => {
    const pomodoroTimerEditor = new PomodoroTimerEditor()

    pomodoroTimerEditor.setAndValidateEditorTemplate(`
- pomodoro:
    taskName: calendar
    timer: 25m
    timeSpent: 1500s 
- pause:
    timer: 5m
    timeSpent: 10s
`)

    const canvasTemplate = pomodoroTimerEditor.getYAMLTemplate()

    expect(canvasTemplate).eq(`- pomodoro:
    taskName: calendar
    timer: 25m
    timeSpent: 1500s
- pause:
    timer: 5m
    timeSpent: 10s
`)
  })
})
