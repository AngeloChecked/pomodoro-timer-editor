declare type Moment = 'pomodoro' | 'pause';
export declare type PomodoroTimerCanvasElementTemplate = {
    [key in Moment]?: {
        taskName?: string;
        timeToShow: string;
    };
};
export default function createPomodoroTimerCanvasElements(document: Document, templates: PomodoroTimerCanvasElementTemplate[]): HTMLElement[];
export {};
