# spotify_alarm_clock
Script + webserver to control a Spotify alarm clock.

***This hobby project is provided with no guarantee; use at your own risk.***

### Prerequisites
- [Spotify for Linux](https://www.spotify.com/download/linux) - Premium account recommended
- Install [spotify-cli-linux](https://github.com/pwittchen/spotify-cli-linux)
- (Optional) [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/)

### Setup
1. Make executable install.sh and run it:
```
chmod u+x install.sh
./install.sh
```
2. Add the `rtcwake` command to your sudoers file ([instructions](https://www.digitalocean.com/community/tutorials/how-to-edit-the-sudoers-file-on-ubuntu-and-centos)).

### Usage
1. (Recommended but optional) Run Raspberry Pi Zero W in headless mode and SSH in.
2. Connect your machine to a local wifi network.
3. Run the node webserver:
```
node webserver.js
```
4. Get your machine's hostname and/or IP address <ALARM_IP>  using
```
hostname
hostname -I
```
5. Using a device connected to the same local area network, open a browser and go to `http://<hostname>.local:8080` or equivalently, `http://<ALARM_IP>:8080`.
6. Select an alarm time and Sleep!. 
