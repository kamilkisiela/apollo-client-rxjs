import { assert } from 'chai';

import { RxApolloClient } from '../../src/RxApolloClient';
import * as heroes from '../fixtures/heroes';

describe('RxApolloClient.readQuery', () => {
  let client: RxApolloClient;

  beforeEach(() => {
    client = heroes.mockRxClient().client;
  });

  it('should be available', () => {
    assert.isFunction(client.readQuery);
  });
});
