import rcolor2 from "/web_modules/rcolor.js";
const oldRandom = Math.random;
Math.random = () => 0.3;
rcolor2.reSeed();
Math.random = oldRandom;
const colors = [];
export function getColor(i) {
  while (!colors[i]) {
    colors.push(rcolor2());
  }
  return colors[i];
}
