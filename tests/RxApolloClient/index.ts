import { assert } from 'chai';
import { ApolloClient } from 'apollo-client';

import { RxApolloClient } from '../../src/RxApolloClient';

import './watchQuery';
import './query';
import './mutate';
import './writeQuery';
import './readQuery';
import './writeFragment';
import './readFragment';

describe('RxApolloClient', () => {
  it('should extends ApolloClient', () => {
    assert.instanceOf(RxApolloClient.prototype, ApolloClient);
  });
});
