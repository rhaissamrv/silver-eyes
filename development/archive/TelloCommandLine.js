const droneIP = '192.168.10.1'
const commandPORT = 8889

const readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout),
  prefix = 'Tello> '

const dgram = require('dgram')
const droneConnection = dgram.createSocket('udp4')

droneConnection.bind(8001)

droneConnection.on('message', (msg, info) => {
  console.log('Data received from drone : ' + msg.toString())
  rl.prompt()
})

console.log('---------------------------------------')
console.log('Tello Command Console')
console.log('---------------------------------------')

rl.on('line', (input) => {
  commandStr = input.trim()
  switch (commandStr) {
    case 'quit':
      droneConnection.close()
      rl.close()
      break
    default:
      console.log(`Command: ${commandStr}`)
      droneConnection.send(commandStr, 0, commandStr.length, commandPORT, droneIP, (err, bytes) => {
        if (err) throw err
      })
      break
  }
}).on('close', function () {
  console.log('Exiting Command Line Processor')
  process.exit(0)
})
console.log(prefix + 'Enter a Tello SDK Command.')
rl.setPrompt(prefix, prefix.length);
rl.prompt()