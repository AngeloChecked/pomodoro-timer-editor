import configureAndCreateEditor from './monacoEditor'

const monacoEditor = configureAndCreateEditor(document.getElementById('editor') as HTMLElement)

const editorModel = monacoEditor.getModel()
editorModel?.onDidChangeContent(() => {
  // const _value = editorModel.getValue()
})
