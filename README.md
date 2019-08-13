# @kingstinct/observable

This is a simple dependency-free library to expose functionality to work with and observe value changes in JavaScript. Promises don't handle multiple state changes, and using more advanced libraries for this should not be necessary.

## Examples

### waitFor

###### Network Status
```
const networkStatus = observable('cellular');

// ...

await networkStatus.waitFor('wifi');
console.log('Start downloading large file..');
downloadLargeFile();

// ...

networkStatus.set('wifi');      // Start downloading large file..
```

### observe
Observe as the value changes

```
const networkStatus = observable('cellular');

// ...

networkStatus.observe((status, previousStatus) => {
  console.log('NetworkStatus changed from ' + previousStatus + ' to ' + status)
});

// ...

networkStatus.set('wifi');      // NetworkStatus changed from cellular to wifi
networkStatus.set('offline');   // NetworkStatus changed from wifi to offline
```

### Set with previous value

###### Toggle
```
const isSyncEnabled = observable(false);

// ...

await isSyncEnabled.waitFor(true);
updateUI();
syncChanges();

// ...

const toggleSync = (previousValue) => !previousValue
isSyncEnabled.set(toggleSync);

```


###### Press button 10 times
```
const buttonPresses = observable(0);

// ...

await buttonPresses.waitFor(10);

// ...

function onClick(){
  buttonPresses.set(value => value + 1);
}

```
