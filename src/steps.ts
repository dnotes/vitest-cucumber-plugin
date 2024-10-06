import { ExpressionFactory, ParameterTypeRegistry, Expression } from '@cucumber/cucumber-expressions';
import _ from 'lodash/fp';

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

const steps: StepDefinition[] = [];

const typeName: Record<string, string> = {
    given: 'Given',
    then: 'Then',
    when: 'When',
};

const expressionFactory = new ExpressionFactory(new ParameterTypeRegistry());

export const addStepDefinition = (expression: string, f: (state: any, ...args: any[]) => any): void => {
    const cucumberExpression = expressionFactory.createExpression(expression);
    steps.push({ expression, f, cucumberExpression });
};

const findStepDefinitionMatches = (step: Step): StepDefinitionMatch[] => {
    const matchesMapper = _.map((match: any) => match.getValue());
    const reducer = _.reduce((accumulator: StepDefinitionMatch[], stepDefinition: StepDefinition) => {
        const matches = stepDefinition.cucumberExpression.match(step.text);
        if (matches) {
            return _.concat(accumulator, { stepDefinition, parameters: matchesMapper(matches) });
        } else {
            return accumulator;
        }
    }, []);

    return reducer(steps);
};

export const findStepDefinitionMatch = (step: Step): StepDefinitionMatch => {
    const stepDefinitionMatches = findStepDefinitionMatches(step);

    if (!stepDefinitionMatches || stepDefinitionMatches.length === 0) {
        throw new Error(`Undefined. Implement with the following snippet:

    ${typeName[step.type.type]}('${step.text}', (state, params, data) => {
        // Write code here that turns the phrase above into concrete actions
        throw new Error('Not yet implemented!');
        return state;
    });
`);
    }

    if (stepDefinitionMatches.length > 1) {
        throw new Error(`More than one step which matches: '${step.type.name} ${step.text}'`);
    }

    return stepDefinitionMatches[0];
};
