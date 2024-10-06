import { Given, When, Then } from 'quickpickle';
import _ from 'lodash-es';
import { expect } from 'vitest'

Given('today is Sunday', function () {
    return { today : 'Sunday' };
});

Given('today is Friday', function () {
    return { today : 'Friday' };
});

When('I ask whether it\'s Friday yet', function (state) {
    return _.set('answer',(state.today === 'Friday') ? 'TGIF' : 'Nope',state);
});

Then('I should be told {string}', function (state,[ answer ]) {
    expect(state.answer).toBe(answer);
});
