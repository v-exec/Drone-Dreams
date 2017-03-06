# Drone Sleep

_Drone Sleep_ is a collaborative music creation tool that gives audience members control over select parameters in a DAW during a live performance.

This repository holds the web server that acts as an interface for users. Their mouse coordinates on the canvas are sent, along with a unique user ID to maintain persistent control over the same parameters, to PureData, which then handles the allocation of parameters and communication with the DAW.

## Dependancies

_Drone Sleep_'s site runs on NodeJS, and has the following dependencies:
  - jQuery
  - ExpressJS
  - socket.io