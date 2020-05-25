// random colors in an array
import rcolor from 'rcolor'

// Force rcolor to use the random seed of our choice by monkey-patching Math.random()
// This gives us consistent colors every time.
// https://github.com/sterlingwes/RandomColor/blob/9b4e24c/src/index.js#L10
const oldRandom = Math.random
Math.random = () => 0.3
rcolor.reSeed()
Math.random = oldRandom

const colors = []

export function getColor (i) {
  while (!colors[i]) {
    colors.push(rcolor())
  }
  return colors[i]
}
