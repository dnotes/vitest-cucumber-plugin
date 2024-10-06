import { Expression } from '@cucumber/cucumber-expressions';
interface StepDefinition {
    expression: string;
    f: (state: any, ...args: any[]) => any;
    cucumberExpression: Expression;
}
interface Step {
    text: string;
    type: {
        type: 'given' | 'when' | 'then';
        name: string;
    };
}
interface StepDefinitionMatch {
    stepDefinition: StepDefinition;
    parameters: any[];
}
export declare const addStepDefinition: (expression: string, f: (state: any, ...args: any[]) => any) => void;
export declare const findStepDefinitionMatch: (step: Step) => StepDefinitionMatch;
export {};
