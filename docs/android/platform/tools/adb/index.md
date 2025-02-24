# Android Debug Bridge
The Android Debug Bridge (ADB) is used to:
- keep track of all Android devices and emulators instances connected to or running on a given host developer machine
- implement various control commands (e.g. "adb shell", "adb pull", etc.) for the benefit of clients (command-line users, or helper programs like DDMS). These commands are called 'services' in ADB.

## Components
### Server
This is a background process that runs on the host machine. Its purpose is to sense the USB ports to know when devices are attached/removed, as well as when emulator instances start/stop.

It thus maintains a list of "connected devices" and assigns a 'state' to each one of them: OFFLINE, BOOTLOADER, RECOVERY or ONLINE (more on this below).

The ADB server is really one giant multiplexing loop whose purpose is to orchestrate the exchange of data (packets, really) between clients, services and devices.

### Daemon (adbd)
The 'adbd' program runs as a background process within an Android device or emulated system. Its purpose is to connect to the ADB server (through USB for devices, through TCP for emulators) and provide a few services for clients that run on the host.

The ADB server considers that a device is ONLINE when it has successfully connected to the adbd program within it. Otherwise, the device is OFFLINE, meaning that the ADB server detected a new device/emulator, but could not connect to the adbd daemon.

The BOOTLOADER and RECOVERY states correspond to alternate states of devices when they are in the bootloader or recovery mode.

### Command-line client
The 'adb' command-line program is used to run adb commands from a shell or a script.

It first tries to locate the ADB server on the host machine, and will start one automatically if none is found. Then, the client sends its service requests to the ADB server.

Currently, a single 'adb' binary is used for both the server and client. This makes distribution and starting the server easier.

There are essentially two kinds of services that a client can talk to.
* Host Services:
These services run within the ADB Server and thus do not need to communicate with a device at all.

* Local Services:
These services either run within the adbd daemon, or are started by it on the device. The ADB server is used to multiplex streams between the client and the service running in adbd. In this case its role is to initiate the connection, then of being a pass-through for the data.

## Protocol details
(TBA) (overview.md)

---
https://android.googlesource.com/platform/packages/modules/adb/+/refs/heads/main/docs/dev/overview.md
https://android.googlesource.com/platform/packages/modules/adb/+/refs/heads/main/docs/dev/internals.md