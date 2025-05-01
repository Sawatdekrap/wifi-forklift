# Wifi Forklift

This is a server and client for a WIFI remote-controlled forklift powered by a Raspberry Pi Zero 2 W.

The server is a simple Python websockets server. It receives control information and sends a camera feed from an onboard camera module (I used the Raspberri Pi Camera Module 3). There is very little thought on functionality beyond getting it working well.

The client is a react application that connects to the websocket server to transmit control information from what a user presses on screen or on the keyboard, and receives camera feed info which is displays in the UI.

## Setup

- Use the [Raspberry Pi imager](https://www.raspberrypi.com/software/) to load Raspberry Pi OS Lite (No GUI)
  - You can also configure WIFI and SSH in this stage
- SSH into the Raspberry Pi Zero
  - You can find the IP address either by connecting directly (keyboard, monitor), or by searching for it.
  - By default, the raspberry pi hostname is set to `raspberrypi` or `raspberrypi.local`
- Install git using `sudo apt install git`
- Clone this repo
- Run the commands in `setup.sh`
- Run the websocket server with `python main.py --host "0.0.0.0"
- Run the React app with `npm run dev`
- Enter the address for the websocket server (`ws://<HOST>:<PORT>`), connect, and control the forklift

## Why?

I bought a remote-control forklift for a game at work, and it came broken. Instead of giving up or buying another one, I tried to get it working another way.
