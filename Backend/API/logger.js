//importing winston and moment module
const moment = require('moment-timezone');
const {createLogger,format,transports} = require('winston');
const {combine,timestamp,printf,colorize} = format;

//setting logging format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}@${level}: ${message}`;
  });

//timezone option for logger
  const appendTimestamp = format((info, opts) => {
  if(opts.tz)
    info.timestamp = moment().tz(opts.tz).format();
    return info;
});  

//setting options for logger 
  const options = {
  //settings for logging on console  
  console:{
    format: combine(timestamp(),
                    appendTimestamp({tz:'Asia/Kolkata'}),
                    colorize({level:true,colors:{error:'red',warn:'yellow',info:'blue'}}),
                    logFormat
                   )
  },
  //settings for logging to a file
  record:{
    filename:'./server.log',
    format: combine(timestamp(),
                    appendTimestamp({tz:'Asia/Kolkata'}),
                    logFormat
                   )
  }
}  
  
//creating logger object
const serverLog = createLogger({
    transports:[new transports.Console(options.console),
                new transports.File(options.record)]
});

 module.exports = serverLog; 