# kinetyped &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/mrehacek/kinetyped/blob/main/LICENSE)

Generative typography for web using [_p5.js_](https://github.com/processing/p5.js) and [_opentype.js_](https://github.com/opentypejs/opentype.js) in a Vue 3 app.
## Description
The goal of the project is to show that generative typography can be easily integrated into modern web design using frontend frameworks. A designer/generative artist can create a cool animated font, either completely custom and programmed in p5, or by playing with the editor controls in this app. Web developer then includes the font by importing a component with generated properties.

## Preview

See the app in [action](https://kinetyped.netlify.app/)!

![Demo - screenshot](https://github.com/mrehacek/kinetyped/blob/main/demo.png?raw=true)

## Installation
Using a package manager such as [pnpm](https://pnpm.io/installation) or [npm](http://npmjs.org/):
1. In the cloned directory, install dependencies using

    pnpm i

2. Start a development server (vite)
    
    pnpm run dev


## Technical description
### Technologies
- [_Vue 3_](https://vuejs.org/) (using Composition API, script setup syntax, and TypeScript)
- [Vite](https://vitejs.dev/) (build tool)
- [_p5.js_](https://github.com/processing/p5.js)
- [_opentype.js_](https://github.com/opentypejs/opentype.js) (font parsing)
- [Naive-UI](https://www.naiveui.com/en-US/light) (editor UI)

### How does it work?
First, a font is loaded and parsed into [path commands](https://github.com/opentypejs/opentype.js#path-commands) using _opentype.js_.
Then a tiny library (```src/p5/common/kinetype.ts```) interpolates a set of points along the glyph curves to be played with. Points are then processed in generative way (```src/p5/kinetype_example.ts```) by p5 sketch, in this sketch animated using perlin noise. These parts are meant to replace the old geomerative library from the Processing environment.

The sketch is then placed inside a Vue 3 application, and reactive data are then passed to the sketch. There are two reactive objects - one for sketch data used in setup function, the other in draw.
The reactivity doesn't do much in the sketch, as it is drawn in loop anyways, but a watcher on the setup object allows to reset the sketch automatically. The importance of reactivity is in allowing the developer to build a good UI for controlling the sketch.

## Usage
The project is intended to be used by generative artists and web developers. Currently, it works only as a demo, in Vue 3 ecosystem. The sketch itself however should be easy to include in React or any other frontend framework.

## Support
Open an issue.

## Feature work
- upload a font interface (see opentype.js demo)
- show in UI how to integrate
- make a guide and npm package for Vue3 integration
- make a similar guide for React
- implement constant-speed interpolation for curves
- separate kinetyped library as npm package
- add about page
- look at https://github.com/Jolg42/awesome-typography

## Contributing
I'm open to any modification, suggestions, and will be glad if you send me a link to see how you used kinetype.

## License
[MIT](https://choosealicense.com/licenses/mit/). Included are fonts under OFL or Apache license for testing purposes.
