import { DocumentNode } from 'graphql';
import { ApolloClient, ApolloQueryResult, ObservableQuery } from 'apollo-client';

import { RxObservableQuery } from '../../src/RxObservableQuery';
import { RxApolloClient } from '../../src/RxApolloClient';

import gql from 'graphql-tag';

import mockNetworkInterface from '../mocks/mockNetworkInterface';

// data

export const query: DocumentNode = gql`
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

export const queryWithVariables: DocumentNode = gql`
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

  const client = new ApolloClient({ networkInterface, addTypename: false });
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

  const client = new RxApolloClient({ networkInterface, addTypename: false });
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
