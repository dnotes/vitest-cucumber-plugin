import { ExpressionFactory, ParameterTypeRegistry } from '@cucumber/cucumber-expressions';
const steps = [];
const typeName = {
    given: 'Given',
    then: 'Then',
    when: 'When',
};
const expressionFactory = new ExpressionFactory(new ParameterTypeRegistry());
export const addStepDefinition = (expression, f) => {
    const cucumberExpression = expressionFactory.createExpression(expression);
    steps.push({ expression, f, cucumberExpression });
};
const findStepDefinitionMatches = (step) => {
    return steps.reduce((accumulator, stepDefinition) => {
        const matches = stepDefinition.cucumberExpression.match(step);
        if (matches) {
            return [...accumulator, {
                    stepDefinition,
                    parameters: matches.map((match) => match.getValue())
                }];
        }
        else {
            return accumulator;
        }
    }, []);
};
export const findStepDefinitionMatch = (step) => {
    const stepDefinitionMatches = findStepDefinitionMatches(step);
    if (!stepDefinitionMatches || stepDefinitionMatches.length === 0) {
        throw new Error(`Undefined. Implement with the following snippet:

    Given('${step}', (world, ...params) => {
        // Write code here that turns the phrase above into concrete actions
        throw new Error('Not yet implemented!');
        return state;
    });
`);
    }
    if (stepDefinitionMatches.length > 1) {
        throw new Error(`More than one step which matches: '${step}'`);
    }
    return stepDefinitionMatches[0];
};
//# sourceMappingURL=steps.js.map