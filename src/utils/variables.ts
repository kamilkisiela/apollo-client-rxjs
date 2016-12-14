import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ObservableQuery } from 'apollo-client';

import { ObservableQueryRef } from './ObservableQueryRef';
import { RxObservableQuery } from '../RxObservableQuery';

import assign = require('lodash/assign');
import omit = require('lodash/omit');

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';

export function createWithObservableVariables(
  options: any,
  mapFn: (options: any) => ObservableQuery
): RxObservableQuery<any> {
  const observableQueryRef = new ObservableQueryRef();
  const varObs = observeVariables(options.variables);

  return new RxObservableQuery(observableQueryRef, subscriber => {
    const sub = varObs.switchMap(newVariables => {
      // prepare variables
      const cleanOptions = omit(options, 'variables');
      const newOptions = assign(cleanOptions, { variables: newVariables });

      observableQueryRef.setRef(mapFn(newOptions));

      return observableQueryRef.getRef();
    }).subscribe(subscriber);

    return () => sub.unsubscribe();
  });
}

export function observeVariables(variables?: Object): Observable<Object> {
  const keys = Object.keys(variables);

  return Observable.create((observer: Observer<any>) => {
    Observable.combineLatest(mapVariablesToObservables(variables))
      .subscribe((values) => {
        const resultVariables = {};

        values.forEach((value, i) => {
          const key = keys[i];
          resultVariables[key] = value;
        });

        observer.next(resultVariables);
      });
  });
};

function mapVariablesToObservables(variables?: Object) {
  return Object.keys(variables)
    .map(key => getVariableToObservable(variables[key]));
}

function getVariableToObservable(variable: any | Observable<any>) {
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
