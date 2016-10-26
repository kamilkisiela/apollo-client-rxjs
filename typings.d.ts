/// <reference types="typed-graphql" />

declare module 'lodash.assign' {
  import main = require('lodash');
  export = main.assign;
}

declare module 'lodash.omit' {
  import main = require('lodash');
  export = main.omit;
}

declare module 'lodash.isfunction' {
  import main = require('lodash');
  export = main.isFunction;
}
