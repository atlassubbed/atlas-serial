const { describe, it } = require("mocha")
const { expect } = require("chai")
const { makeAsyncJob } = require("./util")
const serial = require("../src/serial")

describe("serial", function(){

  const job1 = makeAsyncJob(20)
  const job2 = makeAsyncJob(200)
  const job3 = makeAsyncJob(0, new Error("job3"))

  it("throws an error if not passed an non-empty array", function(){
    const problemArgs = [NaN, Infinity, true, 22/7, 5, done => {}, "str", /reg/, new Date(), [], {}, null, undefined]
    problemArgs.forEach(arg => {
      expect(() => serial(arg)).to.throw("requires non-empty array of jobs")
    })
  })
  describe("works with an array of subroutines (no return values)", function(){
    it("should run each subroutine in serial", function(testDone){
      let numRunning = 0;
      serial([
        done => {
          expect(++numRunning).to.equal(1)
          job1(() => {
            done(null, numRunning--)
          })
        },
        done => {
          expect(++numRunning).to.equal(1)
          job2(() => {
            done(null, numRunning--)
            testDone()
          })
        }
      ])
    })
    it("should call the callback when all subroutines are done", function(testDone){
      let numRunning = 2;
      serial([
        done => {
          job1(() => {
            done(null, numRunning--)
          })
        },
        done => {
          job2(() => {
            done(null, numRunning--)
          })
        }
      ], () => {
        expect(numRunning).to.equal(0)
        testDone()
      })
    })
    it("should run all subroutines regardless of errors", function(testDone){
      let numRan = 0, numErr = 0;
      serial([
        done => {
          numRan++, job3(err => {
            if (err) numErr++;
            done(err)
          })
        },
        done => {
          numRan++, job2(err => {
            if (err) numErr++;
            expect(numRan).to.equal(2)
            expect(numErr).to.equal(1)
            testDone()
          })
        }
      ])
    })
    it("should not return any results", function(testDone){
      serial([job1, job2], (errs, results) => {
        expect(results).to.be.undefined
        testDone()
      })
    })
    it("should return empty list if there are no errors", function(testDone){
      serial([job1, job2], errs => {
        expect(errs).to.be.an("array").which.is.empty
        testDone()
      })
    })
    it("should report a list of errors, if there are errors", function(testDone){
      serial([job1, job2, job3], errs => {
        expect(errs).to.be.an("array").with.lengthOf(1)
        expect(errs[0]).to.be.an("error")
        expect(errs[0].message).to.equal("job3")
        testDone()
      })
    })
  })
})
