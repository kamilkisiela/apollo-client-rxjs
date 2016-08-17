# RxApolloClient

Same as `ApolloClient` but the `ObservableQuery` is wrapped in the `RxObservableQuery`.

With this we can use Observable variables.

### Examples

```ts
import { RxApolloClient } from 'apollo-client-rxjs';
import { createNetworkInterface } from 'apollo-client';

import gql from 'graphql-tag';

// we will need this
import 'rxjs/add/operator/map';

const networkInterface = createNetworkInterface('https://example.com/graphql');

const client = new RxApolloClient({ networkInterface });

const query = gql`
  query allHeroes {
    heroes {
      name
    }
  }
`;

// nothing changed

client.query(); // same as ApolloClient.query
client.mutate(); // same as ApolloClient.mutate

// interesting part

const obs = client.watchQuery({ query });

obs
  .map({data} => data.heroes)
  .subscribe((heroes) => {
    console.log(heroes);
    // outputs: [{name: 'Batman'}, {name: 'Superman'}]
  });

// apollo-specific methods also work
obs.refetch(newVariables);
obs.startPolling(5000);
// ...
```
