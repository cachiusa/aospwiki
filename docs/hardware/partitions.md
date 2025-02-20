# About hardware partitions
https://source.android.com/docs/core/architecture/partitions

## abl / aboot
Android Bootloader

It's what the large majority of you refer to as "bootloader mode", as it is where services such as fastboot or OEM firmware flashing tools are housed.

Also responsible for:
* bringing up most remaining core hardware
* verifying the signature of the boot image, reports the verity status to Android Verified boot through dm-verity
* loading the kernel/ramdisk/DTB into memory
* mounting '/' from the ramdisk or the system partition
* executing `init`

OEMs can customize their abl/aboot, but not PBL/XBL

## apdp
Filesystem type: ext4

## bluetooth
Filesystem type: ext4

## boot
Typically includes:
* Header
    * Kernel cmdline
* Kernel image (may be concatenated with DTB)
* Generic ramdisk (devices launched before Android 13 only)
    * `init` binary
    * Recovery (Hybrid ramdisk devices only)
    * Init fstab

The specification is as following:

### init_boot
Contains the generic ramdisk for devices launching with Android 13 and beyond.

### vendor_boot
Contains all vendor-specific information for GKI devices (launching with Android 11 on Linux 5.4)

Uses header version 3 (Android 11) or 4 (Android 12+)

Typically includes
* Generic ramdisk
    * Kernel modules
    * Recovery resources
    * Init fstab
* Other ramdisks (header v4+) with each corresponding to the ramdisk element described above
* Linux device tree blob (DTB)
* Kernel cmdline

### dtb
A _device tree (DT)_ is a data structure of named nodes and properties that describe non-discoverable hardware.

Kernels, such as the Linux kernel used in Android, use DTs to support a wide range of hardware configurations used by Android-powered devices.

Hardware vendors supply their own _device tree source (DTS)_ files, which are compiled into the _device tree blob (DTB)_ file using the _[device tree compiler](https://git.kernel.org/pub/scm/utils/dtc/dtc.git)_. These files are then used by the bootloader.

The DTB file contains a binary-formatted _flattened device tree_.

### dtbo
A [device tree overlay](https://lkml.org/lkml/2012/11/5/615) (DTO) enables a central DTB to be overlaid on the DT (a _device tree blob for overlay (DTBO)_).

A bootloader using DTO can maintain the system-on-chip (SoC) DT and dynamically overlay a device-specific DT, adding nodes to the tree and making changes to properties in the existing tree.

catecontentfv
catefv
cateloader
cdt
## core_nhlos / NON-HLOS
Core Non-High Level OS

Filesystem type: FAT

Contains BSPs 


## countrycode
## cust
Vendor customizations 
## ddr
## devcfg
Type: mbn
## devinfo
Qualcomm-specific?
Stores bootloader unlock status. If this partition is erased, bootloader will relock
## dsp
Filesystem type: ext4
## featenabler
Type: mbn
## ffu
## frp
Factory Reset Protection (FRP) partition

According to frameworks/base/services/core/java/com/android/server/pdb/PersistentDataBlockService.java (as of android15-qpr1-release):
* This data will live across factory resets not initiated via the Settings UI.
* When a device is factory reset through Settings this data is wiped.
* The persistent data block is currently laid out as follows:
<details>

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
</details>

## fsc
## fsg
## gsort
## hyp
Type: mbn
## imagefv
Type: elf
## keymaster
Type: mbn
## keystore
## log
## logdump
## logfs
Type: bin
## mdcompress
## minidump
## misc

## modem
ext4
### modemst1
### modemst2

## multiimgoem
## oem
## persist
### persistbak
## qupfw
Type: ELF
## rawdump
## rescue
Filesystem: ext4
## rpm
Type: mbn
## secdata
## ssd
## storsec
Type: mbn
## super
Contains multiple logical partitions (and their slots)

They behave very much like Linux LVM, being flexible and easy to change around. However, dynamic partitioning follows a different format from LVM.

Available on device launching with Android 10 or later

Typically includes:
* system
* vendor
* product
* odm

Can be modified with lptools
## tz
ARM TrustZone

Type: mbn
## uefisecapp
Type: mbn
## uefivarstore
## data
Contains user-installed apps and data, including customization data.

It is erased when the device is factory reset.
### userdata
Like `data`, but for devices that use metadata encryption.

### metadata
Contains the metadata encryption key

Filesystem: ext4

The size is 16 MB or larger. It isn't encrypted and its data isn't snapshotted. Erased when the device is factory reset.

## vm-data
## vm-keystore
## vm-system
## xbl
Qualcomm's Secondary/eXtensible Bootloader

* Bring up core hardware like CPU cores, the MMU, etc.
* Bring up core processes concurrent to Android such as the Secure World for Qualcomm ARM chipsets known as TrustZone
* Verify the signature of, load, and execute aboot/ABL

Verified and loaded by Qualcomm's Primary Bootloader (PBL)

### xbl_config
eXtended Bootloader configuration binary

Stores important configuration data, previously found on older platforms within plain text cfg files, such as:
* XBL DTB
* CPR
* DCB

See also: https://github.com/Project-Aloha/XBLConfigReader

## vbmeta
### vbmeta_system

## system
Contains the Android framework.
## odm
Contains original design manufacturer (ODM) customizations to system-on-chip (SoC) vendor board-support packages (BSPs)

Such customizations enable ODMs to
* replace or customize SoC components
* implement kernel modules for
    * board-specific components
    * board-specific daemons
    * their own features on hardware abstraction layers (HALs)

See also:
* https://source.android.com/docs/core/architecture/partitions/odm-partitions

### odm_dlkm
Contains ODM kernel modules.

Storing ODM kernel modules in the odm_dlkm partition (as opposed to the odm partition) makes it possible to update ODM kernel modules without updating the odm partition.
## vendor
Contains vendor-specific or proprietary blobs
## recovery
Contains the recovery image.

Device may reboot into recovery
* During the OTA process
* When powering on with special key combinations / grounded test points
* When running the command `reboot recovery`
* When Android Rescue Party is triggered

See also:
* Android Recovery

## tos
Contains the binary image of the Trusty OS
## radio
Contains the radio image
