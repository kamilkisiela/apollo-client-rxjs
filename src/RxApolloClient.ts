import { ApolloClient, WatchQueryOptions } from 'apollo-client';

import { RxObservableQuery } from './RxObservableQuery';
import { createWithObservableVariables } from './utils/variables';

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
