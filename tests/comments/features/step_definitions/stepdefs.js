import { Given, When, Then } from 'quickpickle';
import { expect } from 'vitest'
import _ from 'lodash-es';

Given('today is Sunday', function () {
    return { today : 'Sunday' };
});

When('I ask whether it\'s Friday yet', function (state) {
    return _.set('answer','Nope',state);
});

Then('I should be told {string}', function (state,[ answer ]) {
    expect(state.answer).toBe(answer);
});
