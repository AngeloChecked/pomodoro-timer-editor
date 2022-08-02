import { expect } from 'chai'
import createPomodoroTimerCanvasElements, {
  PomodoroTimerCanvasElementTemplate,
} from '../src/createPomodoroTimerCanvasElements'
import { JSDOM } from 'jsdom'
describe('createPomodoroTimerCanvasElements', () => {
  it('should created elements from template', () => {
    const templates: PomodoroTimerCanvasElementTemplate[] = [
      {
        pomodoro: {
          timeToShow: '25:00',
          taskName: 'task name',
        },
      },
      {
        pause: {
          timeToShow: '5:00',
        },
      },
    ]
    const dom = new JSDOM('<!DOCTYPE html>', {
      url: 'http://localhost',
    })
    const domDocument = dom.window.document

    const pomodoroElements = createPomodoroTimerCanvasElements(domDocument, templates)

    expect(pomodoroElements).lengthOf(3)
    expect(pomodoroElements[0].querySelector('[class=pomodoro-task-name]')?.innerHTML).eq('task name')
    expect(pomodoroElements[0].querySelector('[class=pomodoro-timer]')?.innerHTML).eq('25:00')
    expect(pomodoroElements[1].className).eq('moment-separator')
    expect(pomodoroElements[2].querySelector('[class=pause-timer]')?.innerHTML).eq('5:00')
  })
})
