import { Request,Response } from 'express';
import 'reflect-metadata'                 
import { createConnection } from 'typeorm'     
var bodyParser = require('body-parser')     
var express = require('express')       
var cors = require('cors')           
const helmet = require("helmet");         
import routes from "./routes/routes";       
var morgan = require('morgan')         
require("dotenv").config(); 
import * as winston from "winston";



export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss:ms' }),
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
          winston.format.simple(),
      ),
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV === "dev") {
  logger.add(
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
        // winston.format.splat(),
        // winston.format.json()
      ),
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }));
}
logger.info("logging started");

                     
createConnection()            
  .then(async () => {                            
    // Create a new express application instance 
    const app = express(); 
                            
    // Call middlewares 
    app.use(cors()); 
    app.use(helmet());                                    
    app.use(bodyParser.urlencoded({extended:true}));  
    app.use(bodyParser.json()); 
   // app.use(morgan('dev'));  
    app.use(morgan(function (tokens:any,req:Request, res:Response) {
      const msg = [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'), '-',
          tokens['response-time'](req, res), 'ms',
      ].join(' ');
      logger.http(msg);
      return null;
      // return msg;
  })
  ); 
  async function start() {
   
  }
  
  start();
    app.use("/", routes);  
                                 
    app.listen(8000, () => {                        
      console.log("Server started on port",8000); 
    }); 
  })                                   
  .catch(error => console.log(error));  