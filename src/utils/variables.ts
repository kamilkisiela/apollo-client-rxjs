import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/Observable/combineLatest';
import { ObservableQuery } from 'apollo-client';
import { omit } from './helpers';

import { ObservableQueryRef } from './ObservableQueryRef';
import { RxObservableQuery } from '../RxObservableQuery';

export function createWithObservableVariables(
  options: any,
  mapFn: (options: any) => ObservableQuery<any>,
): RxObservableQuery<any> {
  const observableQueryRef = new ObservableQueryRef();
  const varObs = observeVariables(options.variables);

  return new RxObservableQuery(observableQueryRef, subscriber => {
    const sub = switchMap.call(varObs, (newVariables => {
      // prepare variables
      const cleanOptions = omit(options, 'variables');
      const newOptions = Object.assign(cleanOptions, { variables: newVariables });

      observableQueryRef.setRef(mapFn(newOptions));

      return observableQueryRef.getRef();
    })).subscribe(subscriber);

    return () => sub.unsubscribe();
  });
}

export function observeVariables(variables?: Object): Observable<Object> {
  const keys = Object.keys(variables);

  return Observable.create((observer: Observer<any>) => {
    combineLatest.call(undefined, mapVariablesToObservables(variables))
      .subscribe((values) => {
        const resultVariables = {};

        values.forEach((value, i) => {
          const key = keys[i];
          resultVariables[key] = value;
        });

        observer.next(resultVariables);
      });
  });
}

function mapVariablesToObservables(variables?: Object): Observable<any>[] {
  return Object.keys(variables)
    .map(key => getVariableToObservable(variables[key]));
}

function getVariableToObservable(variable: any | Observable<any>): Observable<any> {
  if (variable instanceof Observable) {
    return variable;
  } else if (typeof variable !== 'undefined') {
    return new Observable<any>(subscriber => {
      subscriber.next(variable);
    });
  } else {
    return new Observable<any>(subscriber => {
      subscriber.next(null);
    });
  }
}
