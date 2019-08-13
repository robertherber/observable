# @kingstinct/observable

Easy-to-use and dependency-free observable library. `await` a specific value. Observe value changes.

## Examples

### waitFor

###### Network Status
```javascript
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

```javascript
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

Easy to keep it clean and immutable.

###### Toggle
```javascript
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
```javascript
const buttonPresses = observable(0);

// ...

await buttonPresses.waitFor(10);

// ...

function onClick(){
  buttonPresses.set(value => value + 1);
}

```

### Bring your own Promise library
By default native JavaScript Promises are used. But you can override it if you want:

```javascript
observable.Promise = bluebird; // use Bluebird instead of native promise

const isOnlineObservable = observable(false);

await isOnlineObservable.waitFor(true).timeout(1000); // use Bluebird.timeout
```
