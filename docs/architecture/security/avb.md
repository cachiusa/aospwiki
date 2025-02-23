# Android Verified Boot 2.0
Android 8.0 and higher includes a reference implementation of Verified Boot called Android Verified Boot (AVB) or Verified Boot 2.0.

For devices below Android 8.0, see [dm-verity](./dm-verity)

AVB works with Project Treble architecture, which separates the Android framework from the underlying vendor implementation.

AVB's key features include delegating updates for different partitions, a common footer format for signing partitions, and protection from attackers rolling back to a vulnerable version of Android (anti-rollback).

## Verified Boot state
### Green - Normal boot
- Bootloader locked, verified root of trust
### Yellow - Warn before boot
- Bootloader locked, custom root of trust
### Orange - Warn before boot
- Bootloader unlocked
### Red - Warn before boot
- dm-verity corruption
I/O Error (eio)
### Red - Cannot boot
- No valid OS found

## Communicate Verified Boot state to Android
The bootloader communicates Verified Boot state to Android through
- cmdline
- bootconfig (Android 12+)

It sets the `androidboot.verifiedbootstate` option to one of the following values:
- green: if device is LOCKED and user-settable root of trust isn't used
- yellow: if device is LOCKED and user-settable root of trust is used
- orange: if device is UNLOCKED

https://source.android.com/docs/security/features/verifiedboot/avb
https://android.googlesource.com/platform/external/avb/+/main/README.md