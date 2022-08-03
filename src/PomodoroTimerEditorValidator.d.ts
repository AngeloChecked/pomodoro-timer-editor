import { Result } from 'oxide.ts';
import { PomodoroTimerEditorError } from './PomodoroTimerEditor';
export default class PomodoroTimerEditorValidator {
    private findColumns;
    private traverseLines;
    private traverseAndValidateKeys;
    validate(template: string): Result<'ok', PomodoroTimerEditorError>;
}
