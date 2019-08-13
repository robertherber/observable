/**
 * @jest-environment jsdom
 */

const { useState, useEffect } = require('react'); // eslint-disable-line import/no-extraneous-dependencies


const useObservable = (o) => {
  const [value, setValue] = useState(o.get());
  useEffect(() => {
    const unobserve = o.observe((newValue) => {
      setValue(newValue);
    });
    return () => unobserve();
  }, [o]);
  return [value, o.set];
};

module.exports = { useObservable };
