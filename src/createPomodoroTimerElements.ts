type Moment = 'pomodoro' | 'pause'
export type PomodoroTimerMomentElementTemplate = {
  [key in Moment]?: {
    taskName?: string
    timer: string
  }
}

export default function createPomodoroTimerElements(
  document: Document,
  templates: PomodoroTimerMomentElementTemplate[]
): HTMLElement[] {
  function pomodoroItem(timer: string, taskName?: string): HTMLElement {
    const pomodoroItem = document.createElement('div')
    pomodoroItem.className = 'pomodoro'
    const pomodoroIconItem = document.createElement('div')
    pomodoroIconItem.className = 'pomodoro-icon'
    const pomodoroTimerItem = document.createElement('div')
    const taskNameItem = document.createElement('div')
    if (taskName) {
      taskNameItem.innerHTML = taskName
    }
    taskNameItem.className = 'pomodoro-task-name'
    const timerItem = document.createElement('div')
    timerItem.innerHTML = timer
    timerItem.className = 'pomodoro-timer'
    pomodoroTimerItem.appendChild(taskNameItem)
    pomodoroTimerItem.appendChild(timerItem)
    pomodoroItem.appendChild(pomodoroIconItem)
    pomodoroItem.appendChild(pomodoroTimerItem)
    return pomodoroItem
  }

  function momentSeparator(): HTMLElement {
    const arrowItem = document.createElement('div')
    arrowItem.className = 'moment-separator'
    return arrowItem
  }

  function pauseItem(timer: string): HTMLElement {
    const pauseItem = document.createElement('div')
    pauseItem.className = 'pause'
    const pauseIconItem = document.createElement('div')
    pauseIconItem.className = 'pause-icon'
    const pauseTimerItem = document.createElement('div')
    pauseTimerItem.innerHTML = timer
    pauseTimerItem.className = 'pause-timer'
    pauseItem.appendChild(pauseIconItem)
    pauseItem.appendChild(pauseTimerItem)
    return pauseItem
  }

  const elements: HTMLElement[] = []
  templates.forEach((template) => {
    if (template.pomodoro) {
      elements.push(pomodoroItem(template.pomodoro.timer, template.pomodoro?.taskName))
    } else {
      elements.push(momentSeparator())
      elements.push(pauseItem(template.pause!.timer))
    }
  })
  return elements
}
