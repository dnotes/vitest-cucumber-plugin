import _ from 'lodash-es';
import { After } from 'quickpickle';

After('clear out the items',(state) => {
    return _.set('items',[],state);
});
