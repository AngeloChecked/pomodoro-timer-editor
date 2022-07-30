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
  done?: boolean
}

export default class PomodoroTimerEditorValidator {
  private findColumns(
    startOffset: number,
    endOffset: number,
    newlineOffsets: number[]
  ): { line: number; col: number }[] {
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

  private traverseLines(tokens: CustomYAMLParserToken[]): number[] {
    let rootTokenLines: number[] = []
    for (const token of tokens) {
      const newlineToken =
        token?.end?.find((t) => t.type === 'newline') ??
        token?.sep?.find((t) => t.type === 'newline') ??
        (token?.type === 'newline' ? token : null)

      let lines: number[] = []
      if (token.value) {
        lines = this.traverseLines([token.value])
      }
      let flatLines: number[] = []
      if (token.items) {
        flatLines = this.traverseLines(token.items)
      }

      const actualNewLine = newlineToken ? [newlineToken.offset] : []
      rootTokenLines = rootTokenLines.concat(actualNewLine, lines, flatLines)
    }
    return rootTokenLines
  }

  validate(template: string): Result<'ok', PomodoroTimerEditorError> {
    const tokens = Array.from(new YAML.Parser().parse(template)) as CustomYAMLParserToken[]

    const newlines = this.traverseLines(tokens)

    for (const token of tokens) {
      const traverse = (token: CustomYAMLParserToken): Result<'ok', PomodoroTimerEditorError> => {
        if (token?.key?.source === 'timer') {
          const timerValueStartOffset = token?.value?.offset
          const timerValueEndOffset = token?.value?.end?.[0].offset
          const timerIsInMinutes = token.value?.source?.match(/^\d+m$/) !== null
          if (timerValueStartOffset && timerValueEndOffset && !timerIsInMinutes) {
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

      const result = traverse(token)
      if (result.isErr()) {
        return result
      }
    }
    return Ok('ok')
  }
}
