
export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

export class MousetrapStatic {
    //(el: Element): MousetrapInstance;
    new (el: Element): MousetrapInstance;
    stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
    bind(keys: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
    unbind(keys: string|string[], action?: string): void;
    trigger(keys: string, action?: string): void;
    reset(): void;
    pause(): void;
    unpause(): void;

    /** https://craig.is/killing/mice#extensions.global */
    bindGlobal(keyArray: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
}

export interface MousetrapInstance {
    stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
    bind(keys: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
    unbind(keys: string|string[], action?: string): void;
    trigger(keys: string, action?: string): void;
    reset(): void;
    pause(): void;
    unpause(): void;
}
