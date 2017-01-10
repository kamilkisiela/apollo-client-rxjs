import { ObservableQuery } from 'apollo-client';

export class ObservableQueryRef {
  private ref: ObservableQuery<any>;

  constructor(ref?: ObservableQuery<any>) {
    if (ref) {
      this.setRef(ref);
    }
  }

  public setRef(ref: ObservableQuery<any>) {
    this.ref = ref;
  }

  public getRef(): ObservableQuery<any> {
    return this.ref;
  }
}
