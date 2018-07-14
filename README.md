# atlas-serial

Run async functions in serial with an onDone callback.

[![Travis](https://img.shields.io/travis/atlassubbed/atlas-serial.svg)](https://travis-ci.org/atlassubbed/atlas-serial)

---

## install

```
npm install --save atlas-serial
```

## why

This is for running async subroutines in serial, regardless of whether or not tasks up the chain return errors. Since this is purely for control flow, tasks' results aren't tracked at all. If your N<sup>th</sup> task depends on your N-1<sup>th</sup> task's outcome, use a waterfall or some other structure.

## examples

Todo.

## caveats

Since order is important, a hash of tasks is not supported, as object key order is not guaranteed in javascript.
