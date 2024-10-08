import { Given, When, Then, DataTable } from 'quickpickle';
import { expect } from 'vitest'
import _ from 'lodash-es';

Given('the following doc string:',(state,params,docString) => {
    return _.set('docString',docString,state);
});

When('the following doc string is appended:',(state,params,docString) => {
    return _.set('docString',_.getOr('','docString',state)+docString,state);
});

Then('final doc string will look like this:',(state,params,docString) => {
    expect(docString).toEqual(_.get('docString',state));
});
