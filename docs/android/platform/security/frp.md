# Factory Reset Protection
## Background
Google's Factory Reset Protection (FRP) ties devices to a Google account using a tiny, special region of persistent state.
- This data will live across factory resets not initiated via the Settings UI
- When a device is factory reset through Settings this data is wiped

It prevents a thief from wiping the device to a fresh state for resale without being stuck at a screen for authenticating with the Google account persisted on the device after wiping.

> This is strictly a theft deterrence feature, not a security feature, and the standard implementation depends on having the device tied to an account on an online service. The only advantage would be encouraging thieves to return a stolen device for a potential reward after realizing that it has no value beyond scrapping it for parts.

Google's approach works well because if users forget their Google password, there are account recovery methods available to avoid a bricked phone.

This feature is implemented in both Android Setup (com.google.android.setupwizard) and `PersistentDataBlockManager` service on Android 5+ devices.

## Persistent data block (PDB)
Contains FRP data. Also stores OEM unlock status

The PDB partition can be queried by looking for `ro.frp.pst` in system properties or using `getprop`. Alternatively, find FRP related entries in `ueventd.rc`

Commonly used partitions:
- `config`
- `frp`
- `persistent`
- `presistdata`

### Layout
(TBA)

## Activation
When FRP is active,
- Android Setup will show a notification with the icon ![padlock](./lock.svg) in the status bar
- (TBA)

## Deactivation
There are many known methods to get around FRP, varying based on the device OS distribution and version. Most of them usually come down to the following:
- Erase PDB partition through custom recovery, bootloader mode, etc.
- Remove/unset `ro.frp.pst` from system properties to disable PDB manager/service
- Overwrite `user_setup_complete` or similar flags in secure settings to skip Android Setup
- Launch Android settings and set a screen lock, overwriting FRP credentials
- Install custom Google Account Manager (`com.google.android.gsf.login`), add another account, overwriting FRP credentials

https://grapheneos.org/faq#anti-theft

## FRP Hardening in Android 15
### Changes
Enabling OEM unlocking will no longer prevent FRP from activating

A secret key must now be presented on each boot to deactivate FRP. A copy of this key is stored in `userdata` partition (`/data/system/frp_secret`), as well as in the PDB

If this key is filled with zeroes, FRP will be disabled entirely (meaning no signed in account and screen lock).

When secret key is wiped from `/data` but not the PDB (meaning there may have been an untrusted reset), FRP is in "activated" state, therefore:
- Writing data on the PDB is blocked by PDB service
- Setting a screen lock is blocked
- Package installer (com.android.packageinstaller) blocks installing new apps

Additionally, the PDB partition layout has been updated as follows:
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

### PersistentDataBlockManager
Interface to the persistent data partition. Provides access to information about the state of factory reset protection.

https://www.androidauthority.com/android-15-factory-reset-protection-upgrades-3479431/
https://developer.android.com/reference/android/service/persistentdata/PersistentDataBlockManager
https://android.googlesource.com/platform/frameworks/base/+/ebe3ba8767153120ab0081654b30dfffea5ed15b%5E%21/
https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/core/java/com/android/server/pdb/PersistentDataBlockService.java
https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/service/persistentdata/PersistentDataBlockManager.java
https://android.googlesource.com/platform/frameworks/base/+/master/services/core/jni/com_android_server_PersistentDataBlockService.cpp