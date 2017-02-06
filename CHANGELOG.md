# Change log

### vNEXT

### v0.5.1

- Remove `lodash` completely [PR #34](https://github.com/kamilkisiela/apollo-client-rxjs/pull/34)

### v0.5.0

- Add `result()`, `currentResult()`, `variables`, `setOptions`, `setVariables` [PR #29](https://github.com/kamilkisiela/apollo-client-rxjs/pull/29)
- Add generic types to `RxObservableQuery` [PR #30](https://github.com/kamilkisiela/apollo-client-rxjs/pull/30)
- **BREAKING CHANGE:** `RxObservableQuery` shares now generic type with `ApolloQueryResult` [PR #30](https://github.com/kamilkisiela/apollo-client-rxjs/pull/30)

```ts
RxObservableQuery<T> extends Observable<ApolloQueryResult<T>>
```

### v0.4.1

- Support `v0.8.0` of `apollo-client` [PR #25](https://github.com/kamilkisiela/apollo-client-rxjs/pull/25)

### v0.4.0

- Use ES6 Modules and UMD bundle to make this package tree-shaking friendly [PR #16](https://github.com/kamilkisiela/apollo-client-rxjs/pull/16)

### v0.3.0

- Update to `apollo-client@0.6.0` [PR #18](https://github.com/kamilkisiela/apollo-client-rxjs/pull/18)

### v0.2.4

- Use `lodash` instead of individual packages [PR #14](https://github.com/kamilkisiela/apollo-client-rxjs/pull/14)
- Make every `RxObservableQuery` asynchronous [PR #13](https://github.com/kamilkisiela/apollo-client-rxjs/pull/13)

### v0.2.3

- Update to `apollo-client@0.5.1` [PR #11](https://github.com/kamilkisiela/apollo-client-rxjs/pull/11)

### v0.2.2

- `rxjs` as a peerDependency [PR #9](https://github.com/kamilkisiela/apollo-client-rxjs/pull/9)

### v0.2.1

- Add support for `rxjs@5.0.0-beta.12` [PR #6](https://github.com/kamilkisiela/apollo-client-rxjs/pull/6)

### v0.2.0

- Add `subscribeToMore` function [PR #5](https://github.com/kamilkisiela/apollo-client-rxjs/pull/5)
- Add support for ApolloClient `v0.5.0` [PR #4](https://github.com/kamilkisiela/apollo-client-rxjs/pull/4)
- BREAKING CHANGE No longer support ApolloClient `v0.4.X` [PR #4](https://github.com/kamilkisiela/apollo-client-rxjs/pull/4)

### v0.1.0

- Add `updateQuery` to `RxObservableQuery` [PR #2](https://github.com/kamilkisiela/apollo-client-rxjs/pull/2)

### v0.0.1
