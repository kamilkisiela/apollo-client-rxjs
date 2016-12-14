import { ApolloClient, ApolloQueryResult, ObservableQuery } from 'apollo-client';

import { createWithObservableVariables } from './utils/variables';
import { RxObservableQuery } from './RxObservableQuery';

import isFunction = require('lodash/isFunction');

export type WatchQueryFn = (options?: any) => ObservableQuery;
export type WatchQueryRxFn = (options?: any) => RxObservableQuery<ApolloQueryResult>;

export function rxify(
  clientOrWatchQuery: ApolloClient | WatchQueryFn
): any {
  // ApolloClient
  if (clientOrWatchQuery instanceof ApolloClient) {
    const savedWatchQuery = clientOrWatchQuery.watchQuery;

    clientOrWatchQuery.watchQuery = function(options): RxObservableQuery<ApolloQueryResult> {
      return wrapWatchQuery((opts) => savedWatchQuery.call(this, opts))(options);
    }.bind(clientOrWatchQuery);

    return clientOrWatchQuery;
  }

  // ApolloClient.watchQuery
  if (isFunction(clientOrWatchQuery)) {
    return wrapWatchQuery(clientOrWatchQuery);
  }

  throw new Error('Use ApolloClient or a function that returns ObservableQuery');
}

function wrapWatchQuery(
  watchQuery: WatchQueryFn
): WatchQueryRxFn {
  return (options) => {
    if (typeof options.variables === 'object') {
      return createWithObservableVariables(
        options,
        (newOptions) => watchQuery(newOptions)
      );
    }

    return new RxObservableQuery(watchQuery(options));
  };
}
