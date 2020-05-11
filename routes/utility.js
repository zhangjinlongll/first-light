const fs = require('fs');
   /**
    * time wait
    *
    * @param time {number} time(ms) to wait
    */
   /* eslint-disable compat/compat */
   const wait = async (time = 1000) => {
     return new Promise((resolve) => {
       setTimeout(resolve, time);
     });
   };
   /**
    * set log
    *
    * getLogger(path).level
    *    level:
    *        log
    *        trace
    *        debug
    *        info
    *        warn
    *        error
    * @param path
    */
   function getLogger(path) {
     return require('tracer').console({
       transport: (data) => {
         console.log('tracer===', data.output);
         fs.appendFile(`./logs/${path}.log`, `${data.rawoutput} \n`, () => {});
       },
     });
   }
   module.exports = {
     wait,
     getLogger,
   };