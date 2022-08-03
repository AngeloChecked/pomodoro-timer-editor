import { Result } from 'oxide.ts';
import PomodoroTimerEditorValidator from './PomodoroTimerEditorValidator';
import { PomodoroTimerCanvasElementTemplate } from './createPomodoroTimerCanvasElements';
declare type Moment = 'pomodoro' | 'pause';
export declare type PomodoroTimerEditorTemplate = {
    [key in Moment]: {
        taskName?: string;
        timer: string;
        timeSpent?: string;
    };
};
export declare type PomodoroTimerEditorError = {
    code: string;
    pos: [number, number];
    linePos: {
        line: number;
        col: number;
    }[];
};
export default class PomodoroTimerEditor {
    private validator;
    constructor(validator?: PomodoroTimerEditorValidator);
    private editorTemplates;
    setAndValidateEditorTemplate(template: string): Result<PomodoroTimerEditorTemplate[], PomodoroTimerEditorError>;
    private timeStringToSeconds;
    private formatTimeCountdown;
    produceCanvasTemplate(): PomodoroTimerCanvasElementTemplate[];
    updateTemplateToTheNextSecond(): PomodoroTimerEditorTemplate[];
    getYAMLTemplate(): string;
}
export {};
