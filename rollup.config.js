export default {
  entry: 'build/src/index.js',
  dest: 'build/bundles/apollo-rxjs.umd.js',
  format: 'umd',
  moduleName: 'apollo.rxjs',
  globals: {
    'apollo-client': 'apollo',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/Subscriber': 'Rx',
    'rxjs/Operator': 'Rx',
    
    'rxjs/symbol/observable': 'Rx.Symbol',

    'rxjs/scheduler/AsyncScheduler': 'Rx.Scheduler.async',

    'rxjs/observable/combineLatest': 'Rx.Observable',

    'rxjs/operator/observeOn': 'Rx.Observable.prototype',
    'rxjs/operator/switchMap': 'Rx.Observable.prototype'
  }
}
