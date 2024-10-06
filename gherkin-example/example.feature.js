import { test, describe, beforeAll, afterAll } from 'vitest';
import {
  qp,
  applyBeforeAllHooks,
  applyBeforeHooks,
  applyAfterAllHooks,
  applyAfterHooks,
  getWorldConstructor,
} from 'quickpickle';

let World = getWorldConstructor()
const worldConfig = {}

const common = {};

beforeAll(async () => {
  await applyBeforeAllHooks(common);
});

afterAll(async () => {
  await applyAfterAllHooks(common);
});


const initScenario = async(scenario, tags) => {
  let state = new World(worldConfig);
  await state.init(worldConfig);
  state.common = common;
  state.info.feature = 'Feature: Comprehensive Gherkin Syntax Example';
  state.info.scenario = scenario;
  state.info.tags = tags;
  await applyBeforeHooks(state);
  qp('a common precondition', state, 10);
  qp('another common precondition', state, 11);
  return state;
}

const afterScenario = async(state) => {
  await applyAfterHooks(state);
}

describe('Feature: Comprehensive Gherkin Syntax Example', () => {

  test('Scenario: Basic scenario example', async () => {
    let state = await initScenario('Scenario: Basic scenario example', ['@tag', '@multiple_tags', '@scenario_tag']);
    qp('an initial context', state, 15);
    qp('an action is performed', state, 16);
    qp('a verifiable outcome is achieved', state, 17);
    await afterScenario(state);
  });

  test.for([
    { parameter: 'value1', another_parameter: 'value2', expected_result: 'result1' },
    { parameter: 'value3', another_parameter: 'value4', expected_result: 'result2' }
  ])(
    'Scenario: Parameterized scenario with $parameter, $another_parameter, $expected_result',
    async ({ parameter, another_parameter, expected_result }) => {
      let state = await initScenario(`Parameterized scenario with ${parameter}, ${another_parameter}, ${expected_result}`, ['@tag', '@multiple_tags']);
      qp(`a precondition with ${parameter}`, state, 20);
      qp(`an action is taken with ${another_parameter}`, state, 21);
      qp(`the outcome is ${expected_result}`, state, 22);
      await afterScenario(state);
    }
  );

  test('Scenario: Scenario with various DataTable types', async () => {
    let state = await initScenario('Scenario: Scenario with various DataTable types', ['@tag', '@multiple_tags', '@data_table']);
    qp('a list of strings:', state, 31, ['Apple','Banana','Cherry']);
    qp('a list of integers:', state, 35, ['1','2','3']);
    qp('a map of string to string:', state, 39, [['key1','value1'],['key2','value2']]);
    qp('a list of maps:', state, 42, [['name','age','role'],['Alice','30','admin'],['Bob','25','user']]);
    qp('a map of string to list of string:', state, 46, [['fruits','Apple, Banana, Cherry'],['vegetables', 'Carrot, Potato, Onion']]);
    qp('they are processed', state, 49);
    qp('the system behaves correctly', state, 50);
    await afterScenario(state);
  });

  describe('Rule: Business rule description', () => {

    const initRuleScenario = async (scenario, tags) => {
      let state = await initScenario(scenario, tags);
      state.info.rule = 'Business rule description';
      qp('a specific rule context', state, 57);
      qp('another specific rule context', state, 58);
      return state;
    }

    test('Example: Rule example scenario', async () => {
      let state = await initRuleScenario('Rule example scenario', ['@tag', '@multiple_tags', '@rule_tag']);
      qp('a specific rule context', state, 61);
      qp('a rule-related action occurs', state, 62);
      qp('the rule outcome is observed', state, 63);
      await afterScenario(state);
    });

    test('Scenario: Also a rule example', async () => {
      let state = await initRuleScenario('Also a rule example', ['@tag', '@multiple_tags', '@rule_tag']);
      qp('a Rule statement', state, 66);
      qp('a scenario is below it', state, 67);
      qp('it is a child of the Rule, even if it isn\'t indented', state, 68);
      await afterScenario(state);
    });

    test('Scenario: Scenario with doc string', async () => {
      let state = await initRuleScenario('Scenario with doc string', ['@tag', '@multiple_tags', '@rule_tag', '@wip', '@skip']);
      qp('a document with the following content:', state, 74, {
        content: 'This is a doc string.\nIt can contain multiple lines.\nUseful for specifying larget text inputs.',
      });
      qp('the document is processed', state, 80);
      qp('the system handles it correctly', state, 81);
      await afterScenario(state);
    });

    test('Scenario: Scenario with content type doc string', async () => {
      let state = await initRuleScenario('Scenario with content type doc string', ['@tag', '@multiple_tags', '@rule_tag']);
      qp('a document with the following Markdown content:', state, 84, {
        content: 'Lorem Ipsum\n===============\nLorem ipsum dolor sit amet,\nconsectetur adipiscing elit.',
        mediaType: 'markdown',
      });
      await afterScenario(state);
    });

    test('Scenario: Scenario with And and But steps', async () => {
      let state = await initRuleScenario('Scenario with And and But steps', ['@tag', '@multiple_tags', '@rule_tag']);
      qp('an initial state', state, 93);
      qp('some additional context', state, 94);
      qp('an action is performed', state, 95);
      qp('another action is performed', state, 96);
      qp('some assertion is made', state, 97);
      qp('some exception is also handled', state, 98);
      await afterScenario(state);
    });

    test('Scenario: Failing scenario example', async () => {
      let state = await initRuleScenario('Failing scenario example', ['@tag', '@multiple_tags', '@rule_tag', '@failing']);
      qp('a condition that will fail', state, 102);
      qp('an impossible action is attempted', state, 103);
      qp('an unreachable assertion is made', state, 104);
      await afterScenario(state);
    });
  });

  describe('Rule: Rules don\'t nest', () => {

    const initRuleScenario = async (scenario, tags) => {
      let state = await initScenario(scenario, tags);
      state.info.rule = 'Rules don\'t nest';
      return state;
    }

    test('Example: This rule doesn\'t nest', async () => {
      let state = await initRuleScenario('This rule doesn\'t nest', ['@tag', '@multiple_tags']);
      qp('a Rule statement', state, 110);
      qp('another Rule is indented below it', state, 111);
      qp('the indented Rule is NOT a child of the previous Rule', state, 112);
      await afterScenario(state);
    });
  });
});