import { assert } from 'chai';
import { spy, stub } from 'sinon';
import { ApolloClient,  ApolloQueryResult, NetworkStatus, ObservableQuery } from 'apollo-client';

import * as heroes from './fixtures/heroes';
import { RxObservableQuery } from '../src/RxObservableQuery';
import { ObservableQueryRef } from '../src/utils/ObservableQueryRef';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

function apolloResultFactory<T>(data: T, override: Partial<ApolloQueryResult<T>> = {}): ApolloQueryResult<T> {
  return {
    data,
    loading: false,
    networkStatus: NetworkStatus.ready,
    stale: false,
    ...override,
  };
}

describe('RxObservableQuery', () => {
  let obsQuery: ObservableQuery<heroes.AllHeroesQueryResult>;
  let rxObsQuery: RxObservableQuery<heroes.AllHeroesQueryResult>;
  let client: ApolloClient;
  let queryResult: ApolloQueryResult<heroes.AllHeroesQueryResult>;
  let promiseResult: Promise<ApolloQueryResult<heroes.AllHeroesQueryResult>>;

  beforeEach(() => {
    const mocked = heroes.mockClient();

    client = mocked.client;
    obsQuery = mocked.obsQuery;
    rxObsQuery = mocked.rxObsQuery;
    queryResult = apolloResultFactory<heroes.AllHeroesQueryResult>(heroes.dataWithVariables);
    promiseResult = Promise.resolve(queryResult);
  });

  it('should handle ObservableQueryRef', (done) => {
    const mockedClient = {
      refetch() { done(); },
    };
    const obsQRef = new ObservableQueryRef(mockedClient as ObservableQuery<any>);
    const rxObs = new RxObservableQuery(obsQRef);

    rxObs.refetch();
  });

  describe('regular', () => {
    it('should be able to subscribe', () => {
      assert.doesNotThrow(() => {
        rxObsQuery.subscribe({
          next() {
            //
          },
        });
      }, Error);
    });

    it('should be able to receive data', (done: MochaDone) => {
      rxObsQuery.subscribe({
        next(result) {
          assert.deepEqual(result.data, heroes.data);
          done();
        },
        error(error) {
          done(error);
        },
      });
    });

    it('should be able to use a operator', (done: MochaDone) => {
      rxObsQuery.map(result => result.data).subscribe({
        next(result) {
          assert.deepEqual(result, heroes.data);
          done();
        },
        error() {
          done(new Error('should not be called'));
        },
      });
    });

    it('should be chainable', (done: MochaDone) => {
      const counter = { calls: 0 };

      function justDoIt() {
        counter.calls++;
      }

      rxObsQuery
      .do(justDoIt)
      .do(justDoIt)
      .do(justDoIt)
      .subscribe({
        next(result) {
          assert.deepEqual(result.data, heroes.data);
          assert.equal(counter.calls, 3);
          done();
        },
        error() {
          done(new Error('should not be called'));
        },
      });
    });
  });

  describe('apollo-specific', () => {
    it('should be able to refech', () => {
      const stubbed = stub(obsQuery, 'refetch').returns(promiseResult);
      const promise = rxObsQuery.refetch(heroes.variables);

      assert.deepEqual(stubbed.args[0], [heroes.variables]);
      assert.equal(promise, promiseResult);
    });

    it('should be able to startPolling', () => {
      const stubbed = stub(obsQuery, 'startPolling');
      const p = 234;
      rxObsQuery.startPolling(p);

      assert.deepEqual(stubbed.args[0], [p]);
    });

    it('should be able to stopPolling', () => {
      const spied = spy(obsQuery, 'stopPolling');
      rxObsQuery.stopPolling();

      assert.isTrue(spied.calledOnce);
    });

    it('should be able to fetchMore', () => {
      const stubbed = stub(obsQuery, 'fetchMore').returns(promiseResult);
      const options = {};
      const promise = rxObsQuery.fetchMore(options);

      assert.deepEqual(stubbed.args[0], [options]);
      assert.equal(promise, promiseResult);
    });

    it('should be able to subscribeToMore', () => {
      const mockFetchMore = () => { return; };
      const stubbed = stub(obsQuery, 'subscribeToMore').returns(mockFetchMore);
      const options = {};
      const fn = rxObsQuery.subscribeToMore(options);

      assert.deepEqual(stubbed.args[0], [options]);
      assert.equal(fn, mockFetchMore);
    });

    it('should be able to updateQuery', () => {
      const stubbed = stub(obsQuery, 'updateQuery').returns('void');
      const mapFn = () => {
        //
      };
      const result = rxObsQuery.updateQuery(mapFn);

      assert.deepEqual(stubbed.args[0], [mapFn]);
      assert.equal(result, undefined);
    });

    it('should be able to use result', () => {
      stub(obsQuery, 'result').returns(promiseResult);
      const promise = rxObsQuery.result();

      assert.equal(promise, promiseResult);
    });

    it('should be able to use currentResult', () => {
      stub(obsQuery, 'currentResult').returns(promiseResult);
      const obsQueryResult = rxObsQuery.currentResult();

      assert.equal(obsQueryResult, promiseResult);
    });

    it('should be able to get variables', () => {
      assert.isTrue(rxObsQuery.variables === obsQuery.variables);
    });

    it('should be able to setOptions', () => {
      const stubbed = stub(obsQuery, 'setOptions').returns(promiseResult);
      const options = {};
      const promise = rxObsQuery.setOptions(options);

      assert.deepEqual(stubbed.args[0], [options]);
      assert.equal(promise, promiseResult);
    });

    it('should be able to setVariables', () => {
      const stubbed = stub(obsQuery, 'setVariables').returns(promiseResult);
      const variables = {};
      const promise = rxObsQuery.setVariables(variables);

      assert.deepEqual(stubbed.args[0], [variables, false]);
      assert.equal(promise, promiseResult);
    });
  });
});
