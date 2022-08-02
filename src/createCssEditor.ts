import * as monaco from 'monaco-editor'

export default function createCssEditor(
  htmlElement: HTMLElement,
  cssStyle: HTMLElement
): monaco.editor.IStandaloneCodeEditor {
  const cssEditor = monaco.editor.create(htmlElement, {
    value: cssStyle.innerHTML,
    fontSize: 14,
    tabSize: 2,
    language: 'css',
    quickSuggestions: { other: true, strings: true },
    minimap: { enabled: false },
    lineNumbers: 'off',
  })
  const cssEditorModel = cssEditor.getModel()
  cssEditorModel?.onDidChangeContent(() => {
    const changedValue = cssEditorModel.getValue()
    if (cssStyle?.innerHTML) {
      cssStyle.innerHTML = changedValue
    }
  })
  return cssEditor
}
