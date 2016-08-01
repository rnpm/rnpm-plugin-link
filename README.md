# Dear friends,

Last November me ([@Kureev](https://github.com/Kureev)) and Mike ([@grabbou](https://github.com/grabbou)) started RNPM. We aimed to bring you a better developer experience and bridge the tooling gap we had back then. Now, as you may know, RNPM is merged into [React Native core](https://github.com/facebook/react-native). It means that from now on you don't need to install a third-party software to use your favorite linking functionality (just use a react-native cli). We'd like to say a big "Thank you!" to everybody who supported us, filed new issues, composed PRs and helped us to review them.

Now, when RNPM is a part of React Native, we're going to seal this repository and keep working on React Native tooling inside the core. That said, I kindly ask you to file all new issues / prs in react-native repo and cc us. This repo (and other rnpm plugins) will be a available for a few more months in a read-only mode.

With love, 
Alexey Kureev and Michał Grabowski

![](http://esq.h-cdn.co/assets/16/17/640x360/gallery-1462115295-obama-mic-drop.gif)

rnpm link ![npm version](https://img.shields.io/npm/v/rnpm-plugin-link.svg) ![dependencies](https://img.shields.io/david/rnpm/rnpm-plugin-link.svg) [![Circle CI](https://img.shields.io/circleci/project/rnpm/rnpm-plugin-link/master.svg)](https://circleci.com/gh/rnpm/rnpm-plugin-link)
==========

This plugin is automatically installed with `rnpm`.

## Usage

Automatically updates your project by linking all dependencies for Android (if present) and for iOS (if present). It's a great fit to your `postinstall` hook to always make sure you are linked. You can supply optional [name] argument to link only one dependency, e.g.

```bash
$ rnpm link react-native-module
```

## Commands
`rnpm-plugin-link` supports following commands:
- `prelink` - runs before the link
- `postlink` - runs after the link

## License

The MIT License (MIT)

Copyright (c) 2015 Mike Grabowski, 2015 Alexey Kureev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
