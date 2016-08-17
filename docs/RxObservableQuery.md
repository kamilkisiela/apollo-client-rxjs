# RxObservableQuery

### Examples

```ts
import { RxObservableQuery } from 'apollo-client-rxjs';
import { createNetworkInterface } from 'apollo-client';

import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';

// we will need this
import 'rxjs/add/operator/map';

const networkInterface = createNetworkInterface('https://example.com/graphql');

const client = new ApolloClient({ networkInterface });

const query = gql`
  query allHeroes {
    heroes {
      name
    }
  }
`;

// interesting part

const obs = client.watchQuery({ query });

obs.map(mapToHeroes); // throws an error, there's no `map` on pure `Observable`

// ...

const rxObs = new RxObservableQuery(client.watchQuery({ query }));

obs
  .map(mapToHeroes)
  .subscribe((heroes) => {
    console.log(heroes);
    // outputs: [{name: 'Batman'}, {name: 'Superman'}]
  });

// apollo-specific methods also work
obs.refetch(newVariables);
obs.startPolling(5000);
// ...

function mapToHeroes(result) {
  return result.data.heroes;
}
```
