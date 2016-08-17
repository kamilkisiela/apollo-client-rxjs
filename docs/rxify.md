# rxify

Includes observable variables!

## ApolloClient

#### Examples

```ts
import { rxify } from 'apollo-client-rxjs';

const client = new ApolloClient;
rxify(client); // watchQuery has been overwritten

const obs = client.watchQuery(options);

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
```

## watchQuery

#### Examples

```ts
import { rxify } from 'apollo-client-rxjs';

const client = new ApolloClient;

const obs = rxify(client.watchQuery)(options); // returns RxObservableQuery

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
```


### Observable variables

```ts
import { rxify } from 'apollo-client-rxjs';
import { Subject } from 'rxjs/Subject';

const client = new ApolloClient;

const variables = {
  heroes: new Subject();
};
const obs = rxify(client.watchQuery)({ query, variables }); // returns RxObservableQuery

obs
  .map(mapToHeroes)
  .subscribe((heroes) => {
    console.log('heroes', heroes);
    // first output: [{name: 'Batman'}, {name: 'Superman'}]
    // second outputs: [{name: 'Batman'}, {name: 'Superman'}]
  });

variables.heroes.next(['Batman']);
// results [{name: 'Batman'}]

variables.heroes.next(['Batman', 'Superman']);
// results [{name: 'Batman'}, {name: 'Superman'}]
```
