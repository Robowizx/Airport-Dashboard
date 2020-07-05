const {createLogger,format,transports} = require('winston');
const {combine,timestamp,printf,colorize} = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}@${level}: ${message}`;
  });

const options = {
  console:{
    format: combine(timestamp(),colorize({level:true,colors:{error:'red',warn:'yellow',info:'blue'}}),logFormat)
  },
  record:{
    filename:'./server.log',
    format: combine(timestamp(),logFormat)
  }
}  
  
const serverLog = createLogger({
    transports:[new transports.Console(options.console),
                new transports.File(options.record)]
});

 module.exports = {serverLog}; 