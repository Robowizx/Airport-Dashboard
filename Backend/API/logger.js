//importing winston module
const {createLogger,format,transports} = require('winston');
const {combine,timestamp,printf,colorize} = format;

//setting logging format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}@${level}: ${message}`;
  });

//setting options for logger 
  const options = {
  //settings for logging on console  
  console:{
    format: combine(timestamp(),colorize({level:true,colors:{error:'red',warn:'yellow',info:'blue'}}),logFormat)
  },
  //settings for logging to a file
  record:{
    filename:'./server.log',
    format: combine(timestamp(),logFormat)
  }
}  
  
//creating logger object
const serverLog = createLogger({
    transports:[new transports.Console(options.console),
                new transports.File(options.record)]
});

 module.exports = serverLog; 