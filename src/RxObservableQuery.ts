import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { Operator } from 'rxjs/Operator';
import { $$observable } from 'rxjs/symbol/observable';
import { ObservableQuery } from 'apollo-client/ObservableQuery';
import { ApolloQueryResult } from 'apollo-client';

import { ObservableQueryRef } from './utils/ObservableQueryRef';

export class RxObservableQuery<T> extends Observable<T> {
  constructor(
    public apollo: ObservableQuery | ObservableQueryRef,
    subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void
  ) {
    super(null);

    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  public lift<T, R>(operator: Operator<T, R>): Observable<R> {
    const observable = new RxObservableQuery<R>(this.apollo);

    observable.source = this;
    observable.operator = operator;

    return observable;
  }

  // apollo-specific methods

  public refetch(variables?: any): Promise<ApolloQueryResult> {
    return this.getObservableQuery().refetch(variables);
  }

  public stopPolling(): void {
    return this.getObservableQuery().stopPolling();
  }

  public startPolling(p: number): void {
    return this.getObservableQuery().startPolling(p);
  }

  public fetchMore(options: any): Promise<any> {
    return this.getObservableQuery().fetchMore(options);
  }

  // where magic happens

  public _subscribe(subscriber: Subscriber<T>) {
    // XXX Allows to use operators on top of the RxObservableQuery
    // if source is defined then some mutation has been used
    // allows to use "lifting" chain
    if (this.source) {
      return this.source['_subscribe'](subscriber);
    }

    const obs = this.getObservableQuery();
    return obs[$$observable]().subscribe(subscriber);
  }

  private getObservableQuery(): ObservableQuery {
    if (this.apollo instanceof ObservableQueryRef) {
      const ref = <ObservableQueryRef> this.apollo;
      return ref.getRef();
    }

    return <ObservableQuery> this.apollo;
  }
}
