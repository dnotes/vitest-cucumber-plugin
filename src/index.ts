import _ from 'lodash/fp';
import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { tagsFunction } from './tags';
import {
  BeforeAll, applyBeforeAllHooks,
  Before, applyBeforeHooks,
  AfterAll, applyAfterAllHooks,
  After, applyAfterHooks,
  BeforeStep, applyBeforeStepHooks,
  AfterStep, applyAfterStepHooks,
} from './hooks';
import { renderGherkin } from './render';

const featureRegex = /\.feature(?:\.md)?$/;

export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };

export {
  applyBeforeAllHooks,
  applyBeforeHooks,
  applyAfterAllHooks,
  applyAfterHooks,
  applyBeforeStepHooks,
  applyAfterStepHooks,
};

export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;

export type QuickPickleConfig = {
  // Add any specific configuration options here
};

interface Step {
  text: string;
  dataTable?: any;
  docString?: {
    text: string;
  };
  type: {
    type: 'given' | 'when' | 'then';
    name: string;
  };
}

interface StepDefinitionMatch {
  stepDefinition: {
    f: (state: any, ...args: any[]) => any;
  };
  parameters: any[];
}

export const qp = (step: string, state: any, line: number, data?: any): any => {
  const stepObj: Step = {
    text: step,
    type: {
      type: 'given', // Default type, you might want to determine this dynamically
      name: 'Given'
    }
  };
  const stepDefinitionMatch = findStepDefinitionMatch(stepObj);
  return stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
};

interface PluginConfig {
  root: string;
  language: string;
  tagsFunction: (tags: string[]) => boolean;
  [key: string]: any;
}

interface ResolvedConfig {
  root: string;
  test?: {
    cucumber?: Partial<PluginConfig>;
  };
}

export const quickpickle = function() {
  let config: PluginConfig;

  return {
    name: 'vitest-cucumber-transform',
    configResolved: (resolvedConfig: ResolvedConfig) => {
      config = _.defaults(
        { root: resolvedConfig.root, language: 'en' },
        _.get('test.cucumber', resolvedConfig)
      ) as PluginConfig;

      config.tagsFunction = tagsFunction(_.get('tags', config));
    },
    transform: async (src: string, id: string): Promise<string | undefined> => {
      if (featureRegex.test(id)) {
        return renderGherkin(src, config, id.match(/\.md$/) ? true : false)
      }
    }
  };
}

export default quickpickle;
