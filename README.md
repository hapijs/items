# items

Bare minimum async methods adapted specifically for the very limited **hapi** core use cases. Use
[async](https://github.com/caolan/async) for all your application needs.

[![Build Status](https://travis-ci.org/hapijs/items.svg?branch=v2-commercial)](https://travis-ci.org/hapijs/items)

## License

This version of the package requires a commercial license. You may not use, copy, or distribute it without first acquiring a commercial license from Sideway Inc. Using this software without a license is a violation of US and international law. To obtain a license, please contact [sales@sideway.com](mailto:sales@sideway.com). The open source version of this package can be found [here](https://github.com/hapijs/boom).

## Usage

### `Items.serial(items, method, callback)`

Runs `method` against each value in the `items` array *in series*. `callback` is executed when all of the tasks are complete. Calling back with an error will short-circuit the remaining tasks.

- `items` an array of items to pass to `method`.
- `method` a function with the signature `function (item, next, i)`.
    - `item` - is the currently processing item in the `items` array.
    - `next` - callback function to indicate the end of processing for `item`. Calling `next` with a truthy parameter indicates an error and ends `Items.serial`.
    - `i` - The current item's index in the `items` array.
- `callback` - a function with the signature `function (err)`.
    - `err` - indicates any errors during processing.

### `Items.parallel(items, method, callback)`

Runs `method` against each value in the `items` array *in parallel*. `callback` is executed when all of the tasks are complete. Calling back with an error will short-circuit the remaining tasks.

- `items` an array of items to pass to `method`.
- `method` a function with the signature `function (item, next, i)`.
    - `item` - is the currently processing item in the `items` array.
    - `next` - callback function to indicate the end of processing for `item`. Calling `next` with a truthy parameter indicates an error and ends `Items.parallel`.
    - `i` - The current item's index in the `items` array.
- `callback` - a function with the signature `function (err)`.
    - `err` - indicates any errors during processing.

### `Items.parallel.execute(tasks, callback)`

Runs all of the functions in `tasks` *in parallel* and stores the results in a collector object passed into `callback`. If any of the tasks callback with an error, the collector object is `null`.

- `tasks` - on object containing functions to execute in parallel. The `key` of the function is the `key` in the result of collector object. The task should have the signature `function (next)`
    - `next(err, result)` - callback function to indicate the end of processing for the current task.
        - `err` - indicates any errors during processing.
        - `result` - result of this function. This value will be set on the collector object in the final callback.
- `callback(err, result)`
    - `err` - any errors reported by *any* of the `tasks`.
    - `result` - an object containing the result of running all of the `tasks`. `result` will be `null` if any of the tasks callback with an error. The `result.key` will be the corresponding `key` of the `tasks` object.
