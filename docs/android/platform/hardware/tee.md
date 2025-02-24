# Trusted Execution Environment (TEE)
## Introduction
Trusted Execution Environments (TEEs) are largely used in modern mobile devices to provide an isolated environment
for execution of Trusted Applications (TAs) that can securely perform security-critical tasks. They have a relatively small codebase and limited APIs.

In contrast, the Rich Execution Environments (REEs), such as Android OS, cannot be fully audited and trusted (due to
their complexity). An isolated TEE can be used alongside the REE to implement security-sensitive functions. This makes
it harder for an attacker to compromise these functions, as the attack surface is significantly reduced and is limited to communication with the TEE.

In other words, the goal of the TEE is to withstand attacks from a fully compromised REE, including by privileged adversaries with kernel or root capabilities.

## Trusted Applications
A Trusted Application (TA) is a program that runs in the TEE and exposes security services to Android client applications.

The application can open a session with the TA and invoke commands within the session. After receiving a command, a
TA parses the commands input, performs required processing and sends a response back to the client.

## Implementations
### ARM TrustZone
TrustZone separates the device into two execution environments:
1. A non-secure REE where the “Normal World” operating system runs.
2. A secure TEE where the “Secure World” operating system runs. It runs a separate, isolated, TrustZone Operating System (TZOS), in parallel to Android.


As the implementation of the TZOS is left to vendors, there are multiple implementations by various vendors, including:
- Qualcomm Secure Execution Environment (QSEE) by
Qualcomm: used in Google Pixel devices and in Snapdragon models of Samsung Galaxy devices.
- Kinibi by Trustonic: used in older Exynos models of
Samsung Galaxy devices, prior to S10.
- TrustedCore (TC) by Huawei.
- TEEGRIS by Samsung (used in newer Exynos models
of Samsung Galaxy devices).

---
https://github.com/shakevsky/keybuster
https://github.com/littlekernel/lk/wiki/Introduction
https://www.usenix.org/system/files/sec22-shakevsky.pdf