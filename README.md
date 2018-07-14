# atlas-serial

Run async functions in serial with an onDone callback.

[![Travis](https://img.shields.io/travis/atlassubbed/atlas-serial.svg)](https://travis-ci.org/atlassubbed/atlas-serial)

---

## install

```
npm install --save atlas-serial
```

## why

This is for running async subroutines in serial, regardless of whether or not tasks up the chain return errors. Since this is purely for control flow, tasks' results aren't tracked at all. If your N<sup>th</sup> task depends on your N-1<sup>th</sup> task's outcome, use [atlas-waterfall](https://github.com/atlassubbed/atlas-waterfall#readme) or some other structure.

## examples

Usage is pretty simple -- just pass in an array of jobs (which each take a `done` callback) and an `allDone` callback. The `allDone` callback is optional and is called after each of the `done` callbacks have been called.

#### array of jobs

The following will run `reddit.post` only *after* `email.send` has finished:

```javascript
const serial = require("atlas-serial");
serial([
  done => email.send("atlassubbed@gmail.com", "hello", err => {
    done(err)
  }),
  done => reddit.post("atlassubbed.png", "mildlyinteresting", err => {
    done(err);
  })
], errs => {
  // all done!
  // errs === [] on success
  // errs === [err2] if job2 fails
  // errs === [err1, err2] if both fail
})
```

## caveats

Since order is important, a hash of tasks is not supported, as object key order is not guaranteed in javascript. If you care about return values and which error is which, use [atlas-waterfall](https://github.com/atlassubbed/atlas-waterfall#readme) instead.
