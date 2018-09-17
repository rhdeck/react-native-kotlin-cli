# react-native-kotlin-cli

Global helper for initializing and building Kotlin-based native modules for React Native

# Requirements

- Android Studio 3.1 or later
- React Native 0.56.0 or newer (have not tested lower than that)

# Install globally for development

_react-native-kotlin-cli_ is a helper utility for initializing new Kotlin-based native modules and UI components.

```bash
yarn global add react-native-kotlin-cli
```

To learn how it works:

```bash
react-native-kotlin --help
```

# How to make a new Swift-based native module

\_react-native-kotlin lets you quickly create a new kotlin-based native module and get coding.

```bash
react-native-kotlin init myproject
```

# Usage

This comes with scripts now!

## yarn bridge

Automatically build the bridge file from Kotlin to React-Native. Uses [react-native-kotlin-bridge](https://github.com/rhdeck/react-native-kotlin-bridge) for the building work - check that out for idiosyncracies.

## yarn watch

Will watch your kt files (in the module) for changes, and rebuild your JS on the fly. Super-handy. Best practice is to run as background process so as not to lock up a terminal:

```bash
yarn watch &
```

# Wrapping with a test app

Don't develop native code from your module. Never works well. Best practice is to work from the context of a runnable app.

`react-native-kotlin` makes it easy to create a new almost-blank react-native app and add your kotlin module.

```bash
react-native-kotlin makeapp myprojecttest myproject
```

# Deployment: adding the module to an existing app

You can add the Swift-based native module to you app relatively easily.

```bash
cd /path/to/myapp
yarn add link:/path/to/myproject # local link
# yarn add @me/myproject # npm registered
# yarn add meongithub/myproject # github fetch
yarn add react-native-update-gradle # You probably need to add this to allow kotlin support
yarn add react-native-fix-android-links # Guarantees your devex if you deploy via a link
react-native link
```

The _react-native-kotlin_ package will, via react-native link, take care of compatibility between your react native and the Kotlin based component.

Done!
