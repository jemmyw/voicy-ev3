import Mumble from 'mumble-js'
import jq from 'jquery'

const echo = action => {
  jq('#app').html(`Roger roger, ${action}`)
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

