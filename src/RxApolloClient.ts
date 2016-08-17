import { ApolloQueryResult } from 'apollo-client';
import { WatchQueryOptions } from 'apollo-client/watchQueryOptions';
import { RxObservableQuery } from './RxObservableQuery';
import { createWithObservableVariables } from './utils/variables';

import ApolloClient from 'apollo-client';

import 'rxjs/add/operator/switchMap';

export class RxApolloClient extends ApolloClient {
  constructor(options: any) {
    super(options);
  }

  public watchQuery(options: WatchQueryOptions): any { // RxObservableQuery<ApolloQueryResult> {
    if (typeof options.variables === 'object') {
      return createWithObservableVariables(options, super.watchQuery);
    }

    return new RxObservableQuery(super.watchQuery(options));
  }
}
