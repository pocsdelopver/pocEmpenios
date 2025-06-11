const log4JS = require('log4js')

log4JS.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%[%-5.5p%]]-[%[%-6.6c%]] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: process.env.LOG_LEVEL || 'info'
    }
  }
})

const LOG = log4JS.getLogger('PocNMP')
const log = {
  info: message => {
    LOG.info(message)
  },
  debug: message => {
    LOG.debug(message)
  },
  error: message => {
    LOG.error(message)
  }
}

module.exports = LOG
module.exports = log

