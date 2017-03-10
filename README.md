# Drone Dreams

_Drone Dreams_ is a collaborative music creation tool that gives audience members control over select parameters in a DAW during a live performance.

This repository holds the NodeJS web server that acts as an interface for users, handles pointer coordinate data and user identification, and sends it to PureData. It also contains the PureData patch that handles the data recieved by the server, and manages the connectivity between the DAW's parameters and each user's pointer input. Node communicates with Pd through a direct TCP connection, requiring an open port for the process in the network the machine running Pd is connected to.

[More information found here.](http://v-os.ca/dronedreams)

## Dependancies

_Drone Dreams_' site runs on NodeJS, and has the following dependencies:
  - ExpressJS
  - socket.io