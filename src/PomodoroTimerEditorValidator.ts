import { Err, Ok, Result } from 'oxide.ts'
import * as YAML from 'yaml'
import { PomodoroTimerEditorError } from './PomodoroTimerEditor'

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

export default class PomodoroTimerEditorValidator {
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

  private traverseLines(token: CustomYAMLParserToken): number[] {
    const newlineToken = token?.end?.find((t) => t.type === 'newline') ?? token?.sep?.find((t) => t.type === 'newline')

    let lines: number[] = []
    if (token.value) {
      lines = this.traverseLines(token.value)
    }
    let flatLines: number[] = []
    if (token.items) {
      flatLines = token.items.map((token) => this.traverseLines(token)).flat()
    }

    return (newlineToken ? [newlineToken.offset] : []).concat(lines, flatLines)
  }

  validate(template: string): Result<'ok', PomodoroTimerEditorError> {
    const tokens = new YAML.Parser().parse(template)
    const token = tokens.next() as CustomYAMLParserToken

    const newlines = this.traverseLines(token)

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
}
