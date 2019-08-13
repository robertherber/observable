# @kingstinct/observable

This is a simple dependency-free library to expose functionality to work with and observe value changes in JavaScript. Promises don't handle multiple state changes, and using more advanced libraries for this should not be necessary.

## Examples

### waitFor

###### Wait for Network Status
```
const networkStatus = observable('cellular');
networkStatus.set('wifi');

// somewhere else in your code

await networkStatus.waitFor('wifi');
downloadLargeFile();
```

### Observe
You can also observe as the value changes:

```
const isSyncEnabled = observable(false);
isSyncEnabled.set(previousValue => !!previousValue);

// somewhere else in your code

isSyncEnabled.observe(value => {
  updateUI(value);
});
```

### Set with previous value

###### Wait for Toggle
```

const isSyncEnabled = observable(false);
isSyncEnabled.set(previousValue => !!previousValue);

// somewhere else in your code

await isSyncEnabled.waitFor(true);
updateUI();
syncChanges();

```


###### Wait for value to be 100
```

const buttonPresses = observable(1);

function onClick(){
  buttonPresses.set(value => value + 1);
}

// somewhere else in your code

await buttonPresses.waitFor(100);

```
