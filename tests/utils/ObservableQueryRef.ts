import { assert } from 'chai';
import { ObservableQuery } from 'apollo-client/ObservableQuery';

import { ObservableQueryRef } from '../../src/utils/ObservableQueryRef';

describe('ObservableQueryRef', () => {
  it('should set and get reference to ObservableQuery', () => {
    const obsQ = 'pretend to be ObservableQuery' as any;
    const ref = new ObservableQueryRef();

    ref.setRef(obsQ);
    assert.strictEqual(ref.getRef(), obsQ);
  });

  it('should be able to set reference using constructor', () => {
    const obsQ = 'pretend to be ObservableQuery' as any;
    const ref = new ObservableQueryRef(obsQ);

    assert.strictEqual(ref.getRef(), obsQ);
  });
});
