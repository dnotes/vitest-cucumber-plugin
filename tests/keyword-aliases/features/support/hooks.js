import _ from 'lodash-es';
import { After } from 'vitest-cucumber-plugin';

After('clear out the items',(state) => {
    return _.set('items',[],state);
});
