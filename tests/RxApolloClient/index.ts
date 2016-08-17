import { assert } from 'chai';

import { RxApolloClient } from '../../src/RxApolloClient';

import ApolloClient from 'apollo-client';

import './watchQuery';
import './query';
import './mutate';

describe('RxApolloClient', () => {
  it('should extends ApolloClient', () => {
    assert.instanceOf(RxApolloClient.prototype, ApolloClient);
  });
});
