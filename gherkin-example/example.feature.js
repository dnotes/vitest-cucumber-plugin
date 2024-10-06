import { expect, test, describe, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import {
  qp,
  applyBeforeAllHooks,
  applyBeforeHooks,
  applyAfterAllHooks,
  applyAfterHooks,
  getWorldConstructor,
} from 'quickpickle';

let World = getWorldConstructor()

let state
const history = {}

beforeAll(async () => {
  await applyBeforeAllHooks(history)
});

afterAll(async () => {
  await applyAfterAllHooks(state, history)
});

afterEach(async() => {
  await applyAfterHooks(state)
})

describe('Feature: Comprehensive Gherkin Syntax Example', () => {
  beforeEach(async () => {
    state = new World({})
    await state.init({})
    state.history = history;
    state.info.feature = 'Feature: Comprehensive Gherkin Syntax Example'
    state.info.tags = ['@tag', '@multiple_tags']
    await applyBeforeHooks(state)
    qp('a common precondition', state, 10);
    qp('another common precondition', state, 11);
  });

  test('Scenario: Basic scenario example', async () => {
    state.info.scenario = 'Basic scenario example'
    qp('an initial context', state, 15);
    qp('an action is performed', state, 16);
    qp('a verifiable outcome is achieved', state, 17);
  });

  test.for([
    { parameter: 'value1', another_parameter: 'value2', expected_result: 'result1' },
    { parameter: 'value3', another_parameter: 'value4', expected_result: 'result2' }
  ])(
    'Scenario: Parameterized scenario with $parameter, $another_parameter, $expected_result',
    ({ parameter, another_parameter, expected_result }) => {
      state.info.scenario = `Parameterized scenario with ${parameter}, ${another_parameter}, ${expected_result}`
      qp(`a precondition with ${parameter}`, state, 20);
      qp(`an action is taken with ${another_parameter}`, state, 21);
      qp(`the outcome is ${expected_result}`, state, 22);
    }
  );

  test('Scenario: Scenario with various DataTable types', async () => {
    state.info.scenario = 'Scenario with various DataTable types'
    qp('a list of strings:', state, 31, ['Apple','Banana','Cherry']);
    qp('a list of integers:', state, 35, ['1','2','3']);
    qp('a map of string to string:', state, 39, [['key1','value1'],['key2','value2']]);
    qp('a list of maps:', state, 42, [['name','age','role'],['Alice','30','admin'],['Bob','25','user']]);
    qp('a map of string to list of string:', state, 46, [['fruits','Apple, Banana, Cherry'],['vegetables', 'Carrot, Potato, Onion']]);
    qp('they are processed', state, 49);
    qp('the system behaves correctly', state, 50);
  });

  describe('Rule: Business rule description', () => {
    beforeEach(async () => {
      state.info.rule = 'Business rule description'
      qp('a specific rule context', state, 57);
      qp('another specific rule context', state, 58);
    });

    test('Example: Rule example scenario', async () => {
      state.info.scenario = 'Rule example scenario'
      qp('a specific rule context', state, 61);
      qp('a rule-related action occurs', state, 62);
      qp('the rule outcome is observed', state, 63);
    });

    test('Scenario: Also a rule example', async () => {
      state.info.scenario = 'Also a rule example'
      qp('a Rule statement', state, 66);
      qp('a scenario is below it', state, 67);
      qp('it is a child of the Rule, even if it isn\'t indented', state, 68);
    });

    test('Scenario: Scenario with doc string', async () => {
      state.info.scenario = 'Scenario with doc string'
      qp('a document with the following content:', state, 74, {
        content: 'This is a doc string.\nIt can contain multiple lines.\nUseful for specifying larget text inputs.',
      });
      qp('the document is processed', state, 80);
      qp('the system handles it correctly', state, 81);
    });

    test('Scenario: Scenario with content type doc string', async () => {
      state.info.scenario = 'Scenario with content type doc string'
      qp('a document with the following Markdown content:', state, 84, {
        content: 'Lorem Ipsum\n===============\nLorem ipsum dolor sit amet,\nconsectetur adipiscing elit.',
        mediaType: 'markdown',
      });
    });

    test('Scenario: Scenario with And and But steps', async () => {
      state.info.scenario = 'Scenario with And and But steps'
      qp('an initial state', state, 93);
      qp('some additional context', state, 94);
      qp('an action is performed', state, 95);
      qp('another action is performed', state, 96);
      qp('some assertion is made', state, 97);
      qp('some exception is also handled', state, 98);
    });

    test('Scenario: Failing scenario example', async () => {
      state.info.scenario = 'Failing scenario example'
      qp('a condition that will fail', state, 102);
      qp('an impossible action is attempted', state, 103);
      qp('an unreachable assertion is made', state, 104);
    });
  });

  describe('Rule: Rules don\'t nest', () => {
    beforeAll(async () => {
      state.info.rule = 'Rules don\'t nest'
    });
    test('Example: This rule doesn\'t nest', async () => {
      state.info.scenario = 'This rule doesn\'t nest'
      qp('a Rule statement', state, 110);
      qp('another Rule is indented below it', state, 111);
      qp('the indented Rule is NOT a child of the previous Rule', state, 112);
    });
  });
});