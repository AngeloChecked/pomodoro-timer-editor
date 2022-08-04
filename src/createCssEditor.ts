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

import defaultCss from '../styles/default.style'
import bordersCss from '../styles/borders.style'
import pineappleCss from '../styles/pineapple.style'
const customCssFiles: [string, string][] = [
  ['default', defaultCss],
  ['borders', bordersCss],
  ['pineapple', pineappleCss],
]

export function loadCustomCss(
  editorSelectStyles: HTMLSelectElement,
  cssEditor: monaco.editor.IStandaloneCodeEditor
): void {
  customCssFiles.forEach(([name, cssRaw]) => {
    editorSelectStyles.appendChild(createOption(name, cssRaw))
  })

  editorSelectStyles.onchange = () => {
    cssEditor.setValue(editorSelectStyles.value)
  }

  function createOption(name: string, content: string): HTMLElement {
    const option = document.createElement('option')
    option.value = content
    option.innerHTML = name
    return option
  }
}
