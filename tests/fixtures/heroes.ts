import { Document } from 'graphql';
import { ApolloQueryResult } from 'apollo-client';
import { ObservableQuery } from 'apollo-client/ObservableQuery';

import { RxObservableQuery } from '../../src/RxObservableQuery';
import { RxApolloClient } from '../../src/RxApolloClient';

import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';

import mockNetworkInterface from '../mocks/mockNetworkInterface';

// data

export const query: Document = gql`
  query heroes {
    allHeroes {
      heroes {
        name
      }
    }
  }
`;
export const data = {
  allHeroes: {
    heroes: [{ name: 'Mr Foo' }, { name: 'Mr Bar' }],
  },
};

export const queryWithVariables: Document = gql`
  query heroes {
    allHeroes {
      heroes {
        name
      }
    }
  }
`;
export const dataWithVariables = {
  allHeroes: {
    heroes: [{ name: 'Mr Bar' }, { name: 'Mr Foo' }],
  },
};
export const variables = { hero: 'Mr Bar' };

// client

export interface MockedClientResult {
  client: ApolloClient;
  obsQuery: ObservableQuery;
  rxObsQuery: RxObservableQuery<ApolloQueryResult>;
}

export function mockClient(): MockedClientResult {
  const networkInterface = createNetworkInterface();

  const client = new ApolloClient({ networkInterface });
  const obsQuery = client.watchQuery({ query });
  const rxObsQuery = new RxObservableQuery(obsQuery);

  return {
    client,
    obsQuery,
    rxObsQuery,
  };
}

export interface MockedRxClientResult extends MockedClientResult {
  client: RxApolloClient;
}

export function mockRxClient(): MockedRxClientResult {
  const networkInterface = createNetworkInterface();

  const client = new RxApolloClient({ networkInterface });
  const obsQuery = client.watchQuery({ query });
  const rxObsQuery = new RxObservableQuery(obsQuery);

  return {
    client,
    obsQuery,
    rxObsQuery,
  };
}

function createNetworkInterface() {
  return mockNetworkInterface({
    request: { query },
    result: { data },
  }, {
    request: { query: queryWithVariables, variables },
    result: { data: dataWithVariables },
  });
}
