import * as monaco from 'monaco-editor'

monaco.editor.create(document.getElementById('editor') as HTMLElement, {
  value: ` 
pomodoro:
	taskName: calendar
	time: 25m
	timeSpent: 0s
pause:
	taskName: calendar
	time: 25m
	timeSpent: 0s
`,
  language: 'yaml',
})
