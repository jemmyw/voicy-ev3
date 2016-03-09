import Mumble from 'mumble-js'
import R from 'ramda'
import {Observable} from 'rx'
import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'

import {div, button} from '@cycle/dom'

const makeMumbleDriver = function(options) {
  return function mumbleDriver(commands$) {
    return Observable.create(function(obs) {
      const mumble = new Mumble({
        language: 'en-GB',
        debug: true,
        callbacks: {
          start: function() {
            obs.onNext({event: 'start'});
          },
          end: function() {
            obs.onNext({event: 'end'})
          }
        }
      });

      commands$.subscribe(function(command) {
        if(command === 'start') {
          console.log(mumble);
          mumble.setAutoRestart(true);
          mumble.setContinuous(false);
          mumble.start();
        } else if(command === 'stop') {
          mumble.stop();
        } else {
          mumble.addCommand(
            command.name,
            command.command,
            function() {
              var ary = [];
              for(var i = 0; i < arguments.length; ++i) {
                ary.push(arguments[i]);
              }
              console.log('command', command.name, ary);
              obs.onNext({
                event: 'speech',
                name: command.name,
                results: ary
              });
            }
          );
        }
      });
    }).share();
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  Mumble: makeMumbleDriver()
}

const commands = [
  {
    name: 'turn',
    command: /^turn (left|right)/,
    action: (direction) => {
      turn(direction)
    }
  },
  {
    name: 'forward',
    command: /^(?:move|go)?\s*forwards?(?: (?:for )?(\d+)(?: seconds?)?|$)/
  },
  {
    name: 'backward',
    command: /^(?:move|go)?\s*backwards?(?: (?:for )?(\d+)(?: seconds?)?|$)/
  },
  {
    name: 'shoot',
    command: /shoot|fire/
  },
  {
    name: 'stop',
    command: 'stop'
  }
]

const speechEvent = evts => R.both(R.compose(R.contains(R.__, evts), R.prop('name')), R.propEq('event', 'speech'));

const main = sources => {
  const intent$ = Observable.merge(
    sources.DOM.select('.start').events('click').map({type: 'start'}),
    sources.DOM.select('.stop').events('click').map({type: 'stop'})
  ).share()

  sources.Mumble.subscribe(c => console.log('c',c));

  const command$ = Observable.merge(
      sources.Mumble
        .filter(speechEvent(['stop', 'shoot']))
        .map(evt => ({type: evt.name})),
      sources.Mumble
        .filter(speechEvent(['forward', 'backward']))
        .map(evt => ({type: evt.name, for: Number(evt.results[0] || 10)})),
      sources.Mumble
        .filter(speechEvent(['turn']))
        .map(evt => ({type: 'turn', direction: evt.results[0]}))
    )
    .do(evt => console.log(evt))
    .share();

  const request$ = command$
    .map(command => ({
      method: 'post',
      url: 'https://jemmyw.tk/command',
      send: command
    }));

  const HTTP = sources.HTTP.share();
  const eye$ = HTTP.map(true).merge(HTTP.mergeAll().map(false))
    .startWith(false)
    .map(open => div(`.eye.${open ? 'open' : 'closed'}`));

  const startButton = button('.start', ['Start']);
  const stopButton = button('.stop', ['Stop']);

  const currentButton$ = sources.Mumble
    .filter(evt => evt.event === 'start')
    .map(stopButton)
    .merge(
      sources.Mumble
      .filter(evt => evt.event === 'end')
      .map(startButton)
    )
    .startWith(startButton)

  const vtree$ = Observable.combineLatest(currentButton$, eye$, (button, eye) =>
      div([
        eye,
        div([button])
      ]))
    .share();

  const mumble$ = Observable.merge(
    intent$.filter(R.propEq('type', 'start')).map('start'),
    intent$.filter(R.propEq('type', 'stop')).map('stop'),
    Observable.from(commands)
  ).shareReplay(1);

  return {
    DOM: vtree$,
    HTTP: request$,
    Mumble: mumble$
  }
}

run(main, drivers);
