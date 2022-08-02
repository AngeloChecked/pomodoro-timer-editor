import { expect } from 'chai'
import createPomodoroTimerElements, { PomodoroTimerMomentElementTemplate } from '../src/createPomodoroTimerElements'
import { JSDOM } from 'jsdom'
describe('createPomodoroTimerElements', () => {
  it('should created elements from template', () => {
    const templates: PomodoroTimerMomentElementTemplate[] = [
      {
        pomodoro: {
          timer: '25:00',
          taskName: 'task name',
        },
      },
      {
        pause: {
          timer: '5:00',
        },
      },
    ]
    const dom = new JSDOM('<!DOCTYPE html>', {
      url: 'http://localhost',
    })
    const domDocument = dom.window.document

    const pomodoroElements = createPomodoroTimerElements(domDocument, templates)

    expect(pomodoroElements).lengthOf(3)
    expect(pomodoroElements[0].querySelector('[class=pomodoro-task-name]')?.innerHTML).eq('task name')
    expect(pomodoroElements[0].querySelector('[class=pomodoro-timer]')?.innerHTML).eq('25:00')
    expect(pomodoroElements[1].className).eq('moment-separator')
    expect(pomodoroElements[2].querySelector('[class=pause-timer]')?.innerHTML).eq('5:00')
  })
})
