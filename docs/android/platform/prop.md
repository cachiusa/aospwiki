# System properties
System properties are string key/value pairs stored in the `build.prop` global dictionary.

System properties are system-wide resources that are easy to use and have a low performance overhead. When using system properties, you don't need to use interprocess communication (IPC) even if a system property is shared across multiple processes.

However, system properties are similar to global variables and can be harmful when misused. The misuse of system properties can result in issues such as security vulnerabilities and apps becoming inaccessible to users. Before using system properties to store configuration information, consider the other configuration options.

https://source.android.com/docs/core/architecture/configuration
https://source.android.com/docs/core/architecture/configuration/add-system-properties