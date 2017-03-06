# Drone Dreams

_Drone Dreams_ is a collaborative music creation tool that gives audience members control over select parameters in a DAW during a live performance.

This repository holds the web server that acts as an interface for users, as well as the PureData patch that manages the connectivity between the DAW's parameters and each user's pointer coordinates.

Each user's mouse coordinates (or touch coordinates, for mobile) on the canvas are sent, along with a unique user ID to maintain persistent control over the same parameters, to PureData, which then handles the allocation of parameters and communication with the DAW.

## Dependancies

_Drone Dreams_' site runs on NodeJS, and has the following dependencies:
  - jQuery
  - ExpressJS
  - socket.io