const globals = {
  'apollo-client': 'apollo',
  'rxjs/Observable': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/Subscriber': 'Rx',
  'rxjs/Operator': 'Rx',

  'rxjs/symbol/observable': 'Rx.Symbol',

  'rxjs/Scheduler/AsyncAction': 'Rx.Scheduler',

  'rxjs/Scheduler/AsyncScheduler': 'Rx.Scheduler',

  'rxjs/Observable/combineLatest': 'Rx.Observable',

  'rxjs/operators': 'Rx.Observable.prototype',
};

function onwarn(message) {
    'use strict';
    const suppressed = [
        'UNRESOLVED_IMPORT',
        'THIS_IS_UNDEFINED'
    ];

    if (!suppressed.find(code => message.code === code)) {
        return console.warn(message.message);
    }
}

export default {
  input: 'build/src/index.js',
  output: {
    file: 'build/bundles/apollo-rxjs.umd.js',
    format: 'umd',
  },
  sourcemap: true,
  exports: 'named',
  name: 'apollo.rxjs',
  globals,
  onwarn
};
