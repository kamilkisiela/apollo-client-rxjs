import { assert } from 'chai';
import { spy, stub } from 'sinon';
import { ApolloClient, ApolloQueryResult, ObservableQuery } from 'apollo-client';

import * as heroes from './fixtures/heroes';
import { RxObservableQuery } from '../src/RxObservableQuery';
import { ObservableQueryRef } from '../src/utils/ObservableQueryRef';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

describe('RxObservableQuery', () => {
  let obsQuery: ObservableQuery<any>;
  let rxObsQuery: RxObservableQuery<ApolloQueryResult<any>>;
  let client: ApolloClient;

  beforeEach(() => {
    const mocked = heroes.mockClient();

    client = mocked.client;
    obsQuery = mocked.obsQuery;
    rxObsQuery = mocked.rxObsQuery;
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
      const stubbed = stub(obsQuery, 'refetch').returns('promise');
      const promise = rxObsQuery.refetch(heroes.variables);

      assert.deepEqual(stubbed.args[0], [heroes.variables]);
      assert.equal(promise, 'promise');
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
      const stubbed = stub(obsQuery, 'fetchMore').returns('promise');
      const options = {};
      const promise = rxObsQuery.fetchMore(options);

      assert.deepEqual(stubbed.args[0], [options]);
      assert.equal(promise, 'promise');
    });

    it('should be able to subscribeToMore', () => {
      const stubbed = stub(obsQuery, 'subscribeToMore').returns('fn');
      const options = {};
      const fn = rxObsQuery.subscribeToMore(options);

      assert.deepEqual(stubbed.args[0], [options]);
      assert.equal(fn, 'fn');
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
      stub(obsQuery, 'result').returns('promise');
      const promise = rxObsQuery.result();

      assert.equal(promise, 'promise');
    });
  });
});
