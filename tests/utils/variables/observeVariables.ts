import { assert } from 'chai';
import { Subject } from 'rxjs/Subject';

import { observeVariables } from '../../../src/utils/variables';

describe('observeVariables', () => {
  it('should handle primitive values', (done) => {
    const variables = {
      foo: 'first',
    };
    const result = {
      foo: 'first',
    };

    observeVariables(variables).subscribe((newVariables: any) => {
      assert.deepEqual(newVariables, result);
      done();
    });
  });

  it('should handle single Subject', (done) => {
    const counter = { calls: 0 };
    const variables = {
      foo: new Subject<string>()
    };

    const results = [{
      foo: 'first',
    }, {
      foo: 'second',
    }];

    observeVariables(variables).subscribe((newVariables: any) => {
      assert.deepEqual(newVariables, results[counter.calls++]);

      if (counter.calls === 2) {
        done();
      }
    });

    variables.foo.next('first');
    variables.foo.next('second');
  });

  it('should handle multiple Subjects', (done) => {
    const counter = { calls: 0 };
    const variables = {
      foo: new Subject<string>(),
      bar: new Subject<string>(),
    };

    const results = [{
      foo: 'foo 1',
      bar: 'bar 1',
    }, {
      foo: 'foo 1',
      bar: 'bar 2',
    }];

    observeVariables(variables).subscribe((newVariables: any) => {
      assert.deepEqual(newVariables, results[counter.calls++]);

      if (counter.calls === 2) {
        done();
      }
    });

    variables.foo.next('foo 1');
    variables.bar.next('bar 1');

    variables.bar.next('bar 2');
  });

  it('should handle multiple Subjects mixed with primitive values', (done) => {
    const counter = { calls: 0 };
    const variables = {
      foo: new Subject<string>(),
      bar: new Subject<string>(),
      baz: 'baz 1'
    };

    const results = [{
      foo: 'foo 1',
      bar: 'bar 1',
      baz: 'baz 1',
    }, {
      foo: 'foo 1',
      bar: 'bar 2',
      baz: 'baz 1',
    }];

    observeVariables(variables).subscribe((newVariables: any) => {
      assert.deepEqual(newVariables, results[counter.calls++]);

      if (counter.calls === 2) {
        done();
      }
    });

    variables.foo.next('foo 1');
    variables.bar.next('bar 1');

    variables.bar.next('bar 2');
  });

  it('should transform undefined variables to be null', (done) => {
    const variables = {
      foo: undefined,
    };
    const result = {
      foo: null,
    };

    observeVariables(variables).subscribe((newVariables: any) => {
      assert.deepEqual(newVariables, result);
      done();
    });
  });
});
