import * as monaco from 'monaco-editor'

export default function configureAndCreateEditor(htmlElement: HTMLElement): monaco.editor.IStandaloneCodeEditor {
  monaco.languages.register({ id: 'pomodoro' })

  monaco.languages.setMonarchTokensProvider('pomodoro', {
    moments: ['pomodoro', 'pause'],
    optionalProperties: ['timeSpent'],
    properties: ['taskName', 'timer'],
    tokenizer: {
      root: [
        [/\s+/, 'white'],
        [/(^#.*$)/, 'comment'],
        [/-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?m/, 'minutes'],
        [/-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?s/, 'seconds'],
        [/[-:]/, 'delimiter'],
        [
          /[a-zA-Z]\w*/,
          {
            cases: {
              '@moments': 'moment',
              '@properties': 'property',
              '@optionalProperties': 'optionalProperty',
            },
          },
        ],
      ],
    },
  })

  monaco.languages.registerCompletionItemProvider('pomodoro', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      const suggestions = [
        {
          label: 'taskName',
          kind: monaco.languages.CompletionItemKind.Property,
          range,
          insertText: 'taskName:',
        },
        {
          label: 'timer',
          kind: monaco.languages.CompletionItemKind.Property,
          range,
          insertText: 'timer:',
        },
        {
          label: 'timeSpent',
          kind: monaco.languages.CompletionItemKind.Property,
          range,
          insertText: 'timeSpent:',
        },
        {
          label: 'pomodoro',
          kind: monaco.languages.CompletionItemKind.Keyword,
          range,
          insertText: 'pomodoro:',
        },
        {
          label: 'pause',
          kind: monaco.languages.CompletionItemKind.Keyword,
          range,
          insertText: 'pause:',
        },
        {
          label: '- pomodoro',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '- pomodoro:\n    taskName: $0\n    timer: ',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: { ...range, startColumn: 0 },
          documentation: 'pomodoro moment',
        },
        {
          label: '- pause',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '- pause:\n      timer: ',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: { ...range, startColumn: 0 },
          documentation: 'pomodoro moment',
        },
      ]
      return { suggestions }
    },
  })

  monaco.languages.setLanguageConfiguration('pomodoro', {
    comments: {
      lineComment: '#',
    },
  })

  monaco.editor.defineTheme('pomodoro', {
    base: 'vs',
    inherit: true,
    colors: { 'editor.background': '#ffebeb' },
    rules: [
      { token: 'moment', foreground: '920000', fontStyle: 'bold' },
      { token: 'property', foreground: '925a00' },
      { token: 'optionalProperty', foreground: '959651' },
      { token: 'delimiter', foreground: '008692' },
      { token: 'seconds', foreground: '373982' },
      { token: 'minutes', foreground: '378239' },
      { token: 'comment', foreground: '249200' },
    ],
  })

  monaco.editor.setTheme('pomodoro')

  const monacoEditor = monaco.editor.create(htmlElement, {
    value: `- pomodoro:
    taskName: Read emails
    timer: 25m
    timeSpent: 0s
- pause:
    timer: 5m
    timeSpent: 0s
`,
    fontSize: 20,
    tabSize: 4,
    language: 'pomodoro',
    quickSuggestions: { other: true, strings: true },
    minimap: { enabled: false },
  })

  return monacoEditor
}
