import { expect, test, describe, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import {
  Test,
  applyBeforeAllHooks,
  applyBeforeHooks,
  applyBeforeStepHooks,
  applyAfterAllHooks,
  applyAfterHooks,
  applyAfterStepHooks,
  getWorldConstructor,
} from 'quickpickle';
import { log, logConfig } from 'quickpickle';

logConfig({})

let World = getWorldConstructor()

let state
const data = {}

beforeAll(async () => {
  state = new World({});
  state.history = data
  await applyBeforeAllHooks(state)
});

afterAll(async () => {
  await applyAfterAllHooks(state)
});

beforeEach(async () => {
  await applyBeforeHooks(state)
})

afterEach(async() => {
  await applyAfterHooks(state)
})

describe('Feature: Comprehensive Gherkin Syntax Example', () => {
  beforeEach(async () => {
    qp('a common precondition', state, 10);
    qp('another common precondition', state, 11);
  });

  describe('Basic scenario example', () => {
    test('Scenario: Basic scenario example', async () => {
      qp('an initial context', state, 15);
      qp('an action is performed', state, 16);
      qp('a verifiable outcome is achieved', state, 17);
    });
  });

  describe('Parameterized scenario', () => {
    const examples = [
      { parameter: 'value1', another_parameter: 'value2', expected_result: 'result1' },
      { parameter: 'value3', another_parameter: 'value4', expected_result: 'result2' }
    ];

    examples.forEach(({ parameter, another_parameter, expected_result }) => {
      test(`Scenario: Parameterized scenario with ${parameter}, ${another_parameter}, ${expected_result}`, async () => {
        qp(`a precondition with ${parameter}`, state, 20);
        qp(`an action is taken with ${another_parameter}`, state, 21);
        qp(`the outcome is ${expected_result}`, state, 22);
      });
    });
  });

  describe('Scenario with various DataTable types', () => {
    test('Scenario: Scenario with various DataTable types', async () => {
      qp('a list of strings:', state, 31);
      qp('a list of integers:', state, 35);
      qp('a map of string to string:', state, 39);
      qp('a list of maps:', state, 42);
      qp('a map of string to list of string:', state, 46);
      qp('they are processed', state, 49);
      qp('the system behaves correctly', state, 50);
    });
  });

  describe('Rule: Business rule description', () => {
    beforeEach(async () => {
      qp('a specific rule context', state, 57);
      qp('another specific rule context', state, 58);
    });

    test('Example: Rule example scenario', async () => {
      qp('a specific rule context', state, 61);
      qp('a rule-related action occurs', state, 62);
      qp('the rule outcome is observed', state, 63);
    });

    test('Scenario: Also a rule example', async () => {
      qp('a Rule statement', state, 66);
      qp('a scenario is below it', state, 67);
      qp('it is a child of the Rule, even if it isn\'t indented', state, 68);
    });

    test('Scenario: Scenario with doc string', async () => {
      qp('a document with the following content:', state, 74);
      qp('the document is processed', state, 80);
      qp('the system handles it correctly', state, 81);
    });

    test('Scenario: Scenario with content type doc string', async () => {
      qp('a document with the following Markdown content:', state, 84);
    });

    test('Scenario: Scenario with And and But steps', async () => {
      qp('an initial state', state, 93);
      qp('some additional context', state, 94);
      qp('an action is performed', state, 95);
      qp('another action is performed', state, 96);
      qp('some assertion is made', state, 97);
      qp('some exception is also handled', state, 98);
    });

    test('Scenario: Failing scenario example', async () => {
      qp('a condition that will fail', state, 102);
      qp('an impossible action is attempted', state, 103);
      qp('an unreachable assertion is made', state, 104);
    });
  });

  describe('Rule: Rules don\'t nest', () => {
    test('Example: This rule doesn\'t nest', async () => {
      qp('a Rule statement', state, 110);
      qp('another Rule is indented below it', state, 111);
      qp('the indented Rule is NOT a child of the previous Rule', state, 112);
    });
  });
});