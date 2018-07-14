const { isArr } = require("./util")

module.exports = (jobs, cb) => {
  let errs = [], next, n;
  if (!isArr(jobs) || !(n = jobs.length)) 
    throw new Error("requires array of jobs");
  (next = (i=0) => jobs[i](err => {
    err && errs.push(err);
    return ++i === n ? cb() : next(i)
  }))()
}
