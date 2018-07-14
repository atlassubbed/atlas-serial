const { isArr } = require("./util")

module.exports = (jobs, cb) => {
  let errs = [], next, n;
  if (!isArr(jobs) || !(n = jobs.length)) 
    throw new Error("requires non-empty array of jobs");
  (next = i => jobs[i++](err => {
    err && errs.push(err);
    return i === n ? cb && cb(errs) : next(i)
  }))(0)
}
