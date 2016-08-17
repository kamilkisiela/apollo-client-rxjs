import { assert } from 'chai';

import { RxApolloClient } from '../../src/RxApolloClient';
import * as heroes from '../fixtures/heroes';

describe('RxApolloClient.watchQuery', () => {
  let client: RxApolloClient;

  beforeEach(() => {
    client = heroes.mockRxClient().client;
  });

  it('should get the result', (done) => {
    const obs = client.watchQuery({
      query: heroes.query
    });

    obs.subscribe({
      next(result) {
        assert.deepEqual(result.data, heroes.data);
        done();
      },
      error() {
        done(new Error('should not be called'));
      }
    });
  });

  it('should be able to refetch', (done) => {
    const obs = client.watchQuery({
      query: heroes.query
    });

    obs.subscribe({
      next(result) {},
      error() {
        done(new Error('should not be called'));
      }
    });

    obs.refetch(heroes.variables).then(({data}) => {
      assert.deepEqual(data, heroes.dataWithVariables);
      done();
    });
  });
});
