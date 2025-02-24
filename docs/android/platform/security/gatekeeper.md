# Android Gatekeeper
The Gatekeeper subsystem performs device pattern/password authentication in a Trusted Execution Environment (TEE). Gatekeeper enrolls and verifies passwords via an HMAC with a hardware-backed secret key. Additionally, Gatekeeper throttles consecutive failed verification attempts and must refuse to service requests based on a given timeout and a given number of consecutive failed attempts.

When users verify their passwords, Gatekeeper uses the TEE-derived shared secret to sign an authentication attestation to send to the hardware-backed Keystore. That is, a Gatekeeper attestation notifies Keystore that authentication-bound keys (for example, keys that apps have created) can be released for use by apps.

## Components
(TBA)

---
https://android.googlesource.com/platform/system/gatekeeper/
https://source.android.com/docs/security/features/authentication/gatekeeper