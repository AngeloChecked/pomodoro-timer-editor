import * as YAML from 'yaml'
import { Result, Ok, Err } from 'oxide.ts'

type Moment = 'pomodoro' | 'pause'
type PomodoroTimerEditorTemplate = {
  [key in Moment]: {
    taskName: string
    time: string
    timeSpent?: string
  }
}

type PomodoroTimerEditorError = {
  code: string
  pos: [number, number]
  linePos: { line: number; col: number }[]
}

type CustomYAMLParserToken = {
  type: string
  offset: number
  start: string[]
  indent?: number
  source?: string
  key?: CustomYAMLParserToken
  end?: CustomYAMLParserToken[]
  sep?: CustomYAMLParserToken[]
  items?: CustomYAMLParserToken[]
  value?: CustomYAMLParserToken
}

export default class PomodoroTimerEditor {
  private template: PomodoroTimerEditorTemplate[] = []

  private findColumns(
    startOffset: number,
    endOffset: number,
    newlineOffsets: number[]
  ): { line: number; col: number }[] {
    console.log(newlineOffsets)
    const lineOffsetIndex = newlineOffsets.findIndex((line) => line > startOffset)
    const previousLineOffset = newlineOffsets?.[lineOffsetIndex - 1] ?? 0
    const line = lineOffsetIndex + 1
    const linesAndColumns: { line: number; col: number }[] = []
    const starColumnOffset = startOffset - previousLineOffset
    for (let i = 1; i <= endOffset - startOffset; i++) {
      linesAndColumns.push({ line, col: starColumnOffset + i })
    }
    return linesAndColumns
  }

  validate(template: string): Result<'ok', PomodoroTimerEditorError> {
    const tokens = new YAML.Parser().parse(template)
    const token = tokens.next() as CustomYAMLParserToken

    const traverseLines = (token: CustomYAMLParserToken): number[] => {
      const newlineToken =
        token?.end?.find((t) => t.type === 'newline') ?? token?.sep?.find((t) => t.type === 'newline')

      let lines: number[] = []
      if (token.value) {
        lines = traverseLines(token.value)
      }
      let flatLines: number[] = []
      if (token.items) {
        flatLines = token.items.map((token) => traverseLines(token)).flat()
      }

      return (newlineToken ? [newlineToken.offset] : []).concat(lines, flatLines)
    }

    const newlines = traverseLines(token)
    console.log('lines ------> ' + newlines)
    const traverse = (token: CustomYAMLParserToken): Result<'ok', PomodoroTimerEditorError> => {
      if (token?.key?.source === 'timer') {
        const timerValueStartOffset = token?.value?.offset
        const timerValueEndOffset = token?.value?.end?.[0].offset
        console.log('------ \n\n', JSON.stringify(token))
        console.log('------ \n\n')
        if (timerValueStartOffset && timerValueEndOffset) {
          return Err({
            code: 'BAD_TIMER_FORMAT',
            pos: [timerValueStartOffset, timerValueEndOffset],
            linePos: this.findColumns(timerValueStartOffset, timerValueEndOffset, newlines),
          })
        }
      }

      const items = token?.items
      if (items) {
        for (const item of items) {
          const result = traverse(item)
          if (result.isErr()) {
            return result
          }
        }
      }
      const value = token?.value
      if (value) {
        const result = traverse(value)
        if (result.isErr()) {
          return result
        }
      }
      return Ok('ok')
    }

    return traverse(token)
  }

  setTemplate(template: string): Result<PomodoroTimerEditorTemplate[], PomodoroTimerEditorError> {
    const validation = this.validate(template)
    if (validation.isErr()) {
      return Err(validation.unwrapErr())
    }
    try {
      const templateParsed = YAML.parse(template)
      this.template = templateParsed
    } catch (error: any) {
      if (error.name === 'YAMLParseError') {
        return Err({ code: error.code, pos: error.pos, linePos: error.linePos })
      }
      console.error('unhandled error: ' + JSON.stringify(error))
      throw error
    }
    return Ok(this.template)
  }
}
