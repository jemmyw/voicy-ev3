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
      command: 'forward',
      action: () => {
        echo('forward')
        send('forward')
      }
    },
    {
      name: 'backward',
      command: 'backward',
      action: () => {
        echo('backward')
        send('backward')
      }
    },
    {
      name: 'shoot',
      command: 'shoot',
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

