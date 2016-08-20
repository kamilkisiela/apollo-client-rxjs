import { assert } from 'chai';
import { Subject } from 'rxjs/Subject';

import { rxify } from '../src/rxify';

import ApolloClient from 'apollo-client';

import * as heroes from './fixtures/heroes';

describe('rxify', () => {
  let client: ApolloClient;

  beforeEach(() => {
    client = heroes.mockClient().client;
  });

  it('should throw an error if not a function or ApolloClient', () => {
    assert.throw(() => {
      rxify({} as any);
    }, 'ApolloClient');
  });

  describe('client', () => {
    it('should be able to subscribe', (done) => {
      rxify(client)
        .watchQuery({ query: heroes.query })
        .map(result => result.data)
        .subscribe({
          next(data) {
            assert.deepEqual(data, heroes.data);
            done();
          },
          error() {
            done(new Error('should not be called'));
          }
        });
    });
  });

  describe('watchQuery', () => {
    it('should be able to subscribe', (done) => {
      rxify(client.watchQuery)({ query: heroes.query })
        .map(result => result.data)
        .subscribe({
          next(data) {
            assert.deepEqual(data, heroes.data);
            done();
          },
          error() {
            done(new Error('should not be called'));
          }
        });
    });

    it('should be able to use observable variables', (done) => {
      const hero = new Subject<string>();

      const obs = rxify(client.watchQuery)({
        query: heroes.queryWithVariables,
        variables: { hero }
      });

      obs.subscribe({
        next(result) {
          assert.deepEqual(result.data, heroes.dataWithVariables);
          done();
        },
        error() {
          done(new Error('should not be called'));
        }
      });

      hero.next(heroes.variables.hero);
    });

    it('should be able to use operator and observable variables', (done) => {
      const hero = new Subject<string>();

      const obs = rxify(client.watchQuery)({
        query: heroes.queryWithVariables,
        variables: { hero }
      }).map(result => result.data);

      obs.subscribe({
        next(data) {
          assert.deepEqual(data, heroes.dataWithVariables);
          done();
        },
        error() {
          done(new Error('should not be called'));
        }
      });

      hero.next(heroes.variables.hero);
    });
  });
});
