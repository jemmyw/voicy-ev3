import Mumble from 'mumble-js'
import jq from 'jquery'

const echo = action => {
  jq('#app').html(`Roger roger, ${action}`)
}

const send = type => {
  sendCommand({type: type})
}

const turn = direction => {
  sendCommand({type: 'turn', direction: direction})
}

const sendCommand = command => {
  jq.ajax({
    type: "POST",
    url: 'https://jemmyw.tk/command',
    data: JSON.stringify(command),
    dataType: 'json',
    contentType: 'application/json'
  }).then(() => {
    console.log('sent command', command);
  });
}

const mumble = new Mumble({
  language: 'en-GB',
  debug: true,

  commands: [
    {
      name: 'left',
      command: /^turn (left|right)/,
      action: (direction) => {
        echo(direction)
        turn(direction)
      }
    },
    {
      name: 'forward',
      command: /^(?:move|go)?\s*forwards?(?: for (\d+) seconds?)/,
      action: (seconds) => {
        echo('forward')
        const command = {type: 'forward'};
        if(seconds) { command.for = Number(seconds); }
        sendCommand(command);
      }
    },
    {
      name: 'backward',
      command: /^(?:move|go)?\s*backwards?(?: for (\d+) seconds?)/,
      action: (seconds) => {
        echo('backward')
        const command = {type: 'backward'};
        if(seconds) { command.for = Number(seconds); }
        sendCommand(command);
      }
    },
    {
      name: 'shoot',
      command: /shoot|fire/,
      action: () => {
        echo('shoot')
        send('shoot');
      }
    },
    {
      name: 'stop',
      command: 'stop',
      action: () =>{
        echo('stop');
        send('stop');
      }
    }
  ],

  callbacks: {
    start: event => {
      console.log('starting')
    }
  }
})

mumble.setAutoRestart(true)
mumble.setContinuous(true)
mumble.start()

