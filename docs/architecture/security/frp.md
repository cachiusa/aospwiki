# Factory Reset Protection
## Overview
FRP defines a set of security protocols for dis-incentivising device theft.

Applies to devices running Android 5 or later.

* This data will live across factory resets not initiated via the Settings UI
* When a device is factory reset through Settings this data is wiped

(to be added)

## Activation
When FRP is active,
- Android Setup will show a notification with the icon
<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M226.67-80q-27.5 0-47.09-19.58Q160-119.17 160-146.67v-422.66q0-27.5 19.58-47.09Q199.17-636 226.67-636h60v-90.67q0-80.23 56.57-136.78T480.07-920q80.26 0 136.76 56.55 56.5 56.55 56.5 136.78V-636h60q27.5 0 47.09 19.58Q800-596.83 800-569.33v422.66q0 27.5-19.58 47.09Q760.83-80 733.33-80H226.67Zm253.44-200q32.22 0 55.06-22.52Q558-325.04 558-356.67q0-31-22.95-55.16Q512.11-436 479.89-436t-55.06 24.17Q402-387.67 402-356.33q0 31.33 22.95 53.83 22.94 22.5 55.16 22.5ZM353.33-636h253.34v-90.67q0-52.77-36.92-89.72-36.93-36.94-89.67-36.94-52.75 0-89.75 36.94-37 36.95-37 89.72V-636Z" /></svg>
 in the status bar
- (TBA)

## Deactivation
There are many known methods to bypass FRP, but most of them usually boil down to these:
- Erasing `frp` partition through custom recovery, bootloader mode, etc.
- Overwrite `user_setup_complete` in secure settings to skip Android setup
- Launch Android settings and set a screen lock, overwriting FRP credentials
- Installing custom Google Account Manager (`com.google.android.gsf.login`), then add another account, overwriting FRP credentials

## FRP Hardening in Android 15
> In May 2024, Google vaguely mentioned an “upgrade to Android’s factory reset protection” that makes it so thieves can’t set up stolen devices “without knowing your device or Google account credentials,” rendering stolen devices “unsellable,” thus “reducing [the] incentives for phone theft.”

Starting from Android 15:
- Enabling OEM unlocking will no longer prevent FRP from activating
- A secret key must now be presented on each boot to deactivate FRP
- A copy of this key is stored in `userdata` partition (`/data/system/frp_secret`), as well as in a persistent data block (`frp`)
- If this key is filled with zeroes, FRP will be disabled entirely (no screen lock or signed in account).

When secret key is wiped from `/data` but not `frp` partition (meaning there may have been an untrusted reset), FRP is in "activated" state, therefore:
- Writing data on the persistent data block is blocked.
- Setting a screen lock is blocked
- Installing new apps is blocked
(meaning there may have been an untrusted reset)
- The user must provide a key that matches the secrets on persistent data block (by signing in with owner's Google account).

Additionally, `frp` partition layout has been updated as follows:
::: details
```
| ---------BEGINNING OF PARTITION-------------|
| Partition digest (32 bytes)                 |
| --------------------------------------------|
| PARTITION_TYPE_MARKER (4 bytes)             |
| --------------------------------------------|
| FRP data block length (4 bytes)             |
| --------------------------------------------|
| FRP data (variable length; 100KB max)       |
| --------------------------------------------|
| ...                                         |
| Empty space.                                |
| ...                                         |
| --------------------------------------------|
| FRP secret magic (8 bytes)                  |
| FRP secret (32 bytes)                       |
| --------------------------------------------|
| Test mode data block (10000 bytes)          |
| --------------------------------------------|
|     | Test mode data length (4 bytes)       |
| --------------------------------------------|
|     | Test mode data (variable length)      |
|     | ...                                   |
| --------------------------------------------|
| FRP credential handle block (1000 bytes)    |
| --------------------------------------------|
|     | FRP credential handle length (4 bytes)|
| --------------------------------------------|
|     | FRP credential handle (variable len)  |
|     | ...                                   |
| --------------------------------------------|
| OEM Unlock bit (1 byte)                     |
| ---------END OF PARTITION-------------------|
```
:::

https://www.androidauthority.com/android-15-factory-reset-protection-upgrades-3479431/

https://android.googlesource.com/platform/frameworks/base/+/ebe3ba8767153120ab0081654b30dfffea5ed15b%5E%21/

https://android.googlesource.com/platform/frameworks/base/+/refs/heads/android15-release/core/java/android/service/persistentdata/PersistentDataBlockManager.java
