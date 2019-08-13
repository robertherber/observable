/**
 * @jest-environment node
 */

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

const createObservable = (initialValue) => {
  let value = initialValue;
  let listeners = [];
  const resolvers = {};
  const promises = {};

  const unobserve = (callback) => {
    listeners = listeners.filter(cb => cb !== callback);
  };

  const observe = (callback) => {
    listeners.push(callback);
    return () => unobserve(callback);
  };

  const set = (arg) => {
    const newState = isFunction(arg) ? arg(value) : arg;

    const previousValue = value;
    value = newState;

    listeners.forEach(cb => cb(newState, previousValue));
    if (resolvers[newState]) {
      resolvers[newState]({ previousValue, currentValue: value });
      delete resolvers[newState];
      delete promises[newState];
    }
  };

  const get = () => value;

  const waitFor = (state) => {
    if (value === state) {
      return createObservable.Promise.resolve();
    }

    promises[state] = promises[state] || new createObservable.Promise((resolve) => {
      resolvers[state] = resolve;
    });

    return promises[state];
  };

  return {
    __promises: promises,
    __resolvers: resolvers,
    __listeners: listeners,
    observe,
    unobserve,
    set,
    get,
    valueOf: get,
    waitFor,
  };
};

createObservable.Promise = Promise;

module.exports = createObservable;
