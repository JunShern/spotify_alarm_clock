#!/bin/bash

unix_time=$(date +%s -d "$1")
if [ -z "$1" ]; then
    echo "No time argument given!"
fi
# If the time has already passed today, set for tomorrow
DESIRED=$((`date +%s -d "$unix_time"`))
NOW=$((`date +%s`))
if [ $DESIRED -lt $NOW ]; then
    DESIRED=$((`date +%s -d "$1"` + 24*60*60))
fi
sudo rtcwake -m mem -t $DESIRED> /dev/null

sleep 5 
if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
    # Connected to wifi; use Spotify
    echo "Starting Spotify..."
    spotify &
    sleep 20
    spotify-cli --play
else
    # Internet is down; use annoying beeps
    echo "No internet, beeping..."
    while true;
    do
        (speaker-test -t sine -f 1000 >/dev/null)& pid=$! ; sleep 0.8s ; kill -9 $pid
        sleep 0.2
        (speaker-test -t sine -f 2000 >/dev/null)& pid=$! ; sleep 0.8s ; kill -9 $pid
        sleep 0.2
        (speaker-test -t sine -f 4000 >/dev/null)& pid=$! ; sleep 0.8s ; kill -9 $pid
        sleep 0.2
    done
fi
