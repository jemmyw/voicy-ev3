import Mumble from 'mumble-js'
import jq from 'jquery'

const echo = action => {
  jq('#app').html(`Roger roger, ${action}`)
}

const send = type => {
  jq.ajax({
    type: "POST",
    url: 'http://192.168.2.3:3000/command',
    data: JSON.stringify({type: type}),
    dataType: 'json',
    contentType: 'application/json'
  }).then(() => {
    console.log('sent command');
  });
}
console.log(send);

const mumble = new Mumble({
  language: 'en-GB',
  debug: true,

  commands: [
    {
      name: 'left',
      command: /^turn (left|right)/,
      action: (direction) => {
        echo(direction)
      }
    },
    {
      name: 'forward',
      command: 'forward',
      action: () => {
        echo('forward')
      }
    },
    {
      name: 'backward',
      command: 'backward',
      action: () => {
        echo('backward')
      }
    },
    {
      name: 'shoot',
      command: 'shoot',
      action: () => {
        echo('shoot')
        send('shoot');
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

