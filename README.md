# Wobbly [![Build Status](https://travis-ci.com/Wobbly-App/wobbly-frontend.svg?branch=develop)](https://travis-ci.com/Wobbly-App/wobbly-frontend) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=Wobbly-App/wobbly-frontend)](https://dependabot.com) [![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#-contributors) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Wobbly is an app for workplace organizing. See [wobbly.app](https://wobbly.app) for more details.

* [Code of conduct](CODE-OF-CONDUCT.md)
* [Contributing guide](CONTRIBUTING.md)

## 💻 From 0 to Wobbly
* [Install yarn](https://yarnpkg.com/en/docs/install). Yarn is the package manager we use.
* Install TypeScript and Expo: `yarn global add typescript expo-cli`
* Clone this repo: `git clone git@github.com:Wobbly-App/wobbly-frontend.git`
* `cd` into the repo and run `yarn install` to get dependencies
* Run `yarn codegen` to automatically generate the TypeScript typings for our GraphQL client
* Copy one of the example configurations from `config` to `app.json` in the repository root. Eg: `cp config/app.development.json app.json`
* Run `yarn start`. You can preview and live reload the app in an Android/iOS emulator or on your device using the Expo app.
  * See the "Connecting to the backend" section below for more details
* Optional: Run `yarn storybook` for a web-based [storybook](https://storybook.js.org) environment
* Running into issues? See the [dev environment setup](https://wiki.wobbly.app/index.php/Development_environment_setup) page on our wiki.

## 🌐 Connecting to the backend
Our [backend](https://github.com/Wobbly-App/graphql-backend) exposes a GraphQL API.
* Running `yarn start` will connect to the GraphQL backend specified in your app.json.
* If you want to run against a local backend, remove the `backendUrl` field from your app.json (or use the provided example configuration). This is the default behaviour if no backend configuration is provided.

## 🔥 Testing
We use [loki](https://loki.js.org/) to run visual regression tests against our storybook. The general workflow for these are:
* Write a story for your component
* `yarn test` 
* If the tests fail due to a visual change, check the contents of [./loki/difference](./loki/difference). If you are happy with all the changes, run `yarn loki approve` to update the reference screens.
* If the test fail on CI and you think they should have passed, check the travis logs for a link to a url hosting diffs between the current and reference snapshots

## 🚀 Deploying
* `expo build:android --release-channel <your-channel>` builds an APK in the alpha release channel. Similarly for `expo build:ios --release-channel <your-channel>`.
  * Valid channels are `alpha`, `beta`, or none (i.e. `default`, our production channel).
* Expo apps can receive over-the-air updates so we unless we changed the SDK version, we don't need to submit changes to the App Store/Play Store. To publish changes run `expo publish --release-channel <your-channel>`.
* See more in the [Expo docs on release channels](https://docs.expo.io/versions/latest/distribution/release-channels/).

## ⚙️ Frameworks
* [Expo](https://expo.io)
* [TypeScript](https://www.typescriptlang.org/) and [TSLint](https://palantir.github.io/tslint/)
* [Apollo](https://www.apollographql.com/) for state management
* [Formik](https://jaredpalmer.com/formik) for forms
* [React Navigation](https://reactnavigation.org/) for navigation/routing

## 🧠 Useful tutorials
* [Atomic design](http://bradfrost.com/blog/post/atomic-web-design/)
* [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
* [React Native tutorial](https://facebook.github.io/react-native/docs/tutorial)

## 👩‍👩‍👧‍👦 Contributors

Thanks goes to these people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/1309951?v=4" width="100px;" alt="Tao Bror Bojlén"/><br /><sub><b>Tao Bror Bojlén</b></sub>](https://btao.org)<br />[💻](https://github.com/Wobbly-App/wobbly-frontend/commits?author=brortao "Code") [🚇](#infra-brortao "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-brortao "Reviewed Pull Requests") | [<img src="https://avatars0.githubusercontent.com/u/38507954?v=4" width="100px;" alt="John Evans"/><br /><sub><b>John Evans</b></sub>](http://bananananaba.com)<br />[🖋](#content-King-Mob "Content") [💼](#business-King-Mob "Business development") [🤔](#ideas-King-Mob "Ideas, Planning, & Feedback") [👀](#review-King-Mob "Reviewed Pull Requests") | [<img src="https://avatars2.githubusercontent.com/u/24790942?v=4" width="100px;" alt="William Pelton"/><br /><sub><b>William Pelton</b></sub>](https://www.icantotallycode.com/)<br />[💻](https://github.com/Wobbly-App/wobbly-frontend/commits?author=runranron "Code") [👀](#review-runranron "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/361391?v=4" width="100px;" alt="Chris Devereux"/><br /><sub><b>Chris Devereux</b></sub>](http://coderwall.com/chrisdevereux)<br />[💻](https://github.com/Wobbly-App/wobbly-frontend/commits?author=chrisdevereux "Code") [⚠️](https://github.com/Wobbly-App/wobbly-frontend/commits?author=chrisdevereux "Tests") |
| :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

🖤 🐈
