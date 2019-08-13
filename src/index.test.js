const LeakDetector = require('jest-leak-detector').default;
const bluebird = require('bluebird');

const createObservable = require('./index');


describe('Core', () => {
  test('Should call observe callbacks when changing', () => {
    const onOffToggle = createObservable(true);

    const observedValues = [];

    onOffToggle.observe((newValue) => {
      observedValues.push(newValue);
    });

    onOffToggle.set(false);

    expect(observedValues).toEqual([false]);
  });

  test('Should observe multiple state changes', () => {
    const onOffToggle = createObservable(true);

    const observedValues = [];

    onOffToggle.observe((newValue) => {
      observedValues.push(newValue);
    });

    onOffToggle.set(false);
    onOffToggle.set(true);
    onOffToggle.set(false);

    expect(observedValues).toEqual([false, true, false]);
  });

  test('Should get value after changes', () => {
    const onOffToggle = createObservable(true);

    expect(onOffToggle.valueOf()).toEqual(true);

    onOffToggle.set(false);

    expect(onOffToggle.valueOf()).toEqual(false);

    onOffToggle.set(true);

    expect(onOffToggle.valueOf()).toEqual(true);
  });


  test('Should not observe after unobserving', () => {
    const onOffToggle = createObservable(true);

    const observedValues = [];

    onOffToggle.set(false);

    const observer = (newValue) => {
      observedValues.push(newValue);
    };

    onOffToggle.observe(observer);
    onOffToggle.set(true);
    onOffToggle.unobserve(observer);

    onOffToggle.set(false);

    expect(observedValues).toEqual([true]);
  });

  test('Should not observe after unobserving with returned handle', () => {
    const onOffToggle = createObservable(true);

    const observedValues = [];

    onOffToggle.set(false);

    const observer = (newValue) => {
      observedValues.push(newValue);
    };

    const unobserve = onOffToggle.observe(observer);
    onOffToggle.set(true);
    unobserve();

    onOffToggle.set(false);

    expect(observedValues).toEqual([true]);
  });

  test('Should not leak after unobserving', () => {
    const onOffToggle = createObservable(true);

    let observer = () => {};

    let unobserve = onOffToggle.observe(observer);

    const detector = new LeakDetector(onOffToggle.__listeners[0]);

    expect(detector.isLeaking()).toEqual(true);

    unobserve();

    unobserve = null;
    observer = null;

    expect(detector.isLeaking()).toEqual(false);
  });

  test('Should not leak after unobserving with function', () => {
    const onOffToggle = createObservable(true);

    let observer = () => {};

    onOffToggle.observe(observer);

    const detector = new LeakDetector(onOffToggle.__listeners[0]);

    expect(detector.isLeaking()).toEqual(true);

    onOffToggle.unobserve(observer);

    observer = null;

    expect(detector.isLeaking()).toEqual(false);
  });

  test('Should resolve promise(value) when set to expected value', async () => {
    const onOffToggle = createObservable(true);

    const promise = onOffToggle.waitFor(false);

    onOffToggle.set(false);

    const resolvedValue = await promise;

    expect(resolvedValue).toEqual({ previousValue: true, currentValue: false });
  });

  test('Should allow setting value with callback that gets called with previous value', async () => {
    const onOffToggle = createObservable(true);

    onOffToggle.set(previous => !previous);

    expect(onOffToggle.valueOf()).toEqual(false);
  });

  test('Use Bluebird with timeout', async () => {
    createObservable.Promise = bluebird;
    const onOffToggle = createObservable(true);
    let error;

    try {
      await onOffToggle.waitFor(false).timeout(1000);
    } catch (e) {
      error = e;
    }

    expect(error).toHaveProperty('message', 'operation timed out');
  });
});
