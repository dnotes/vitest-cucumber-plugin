import { BeforeAll, AfterAll, Before, After, BeforeStep, AfterStep } from 'quickpickle';
import _ from 'lodash-es';

Before({ tags : '@hooks and not @nobefore', name: 'add before' },(state) => {
    return _.set('beforeTags',_.concat(_.getOr([],'beforeTags',state),'beforeTags'),state);
});

After({ tags : '@hooks', name : 'clear beforeTags' },(state) => {
    state = _.set('beforeTags',[],state);
    return state;
});
