import { packer } from 'guillotine-packer'

const MAX_NUM_CALCULATIONS = 100

export function calculateWithPacker ({ fabricPieces, fabricWidth, fabricSoldBy, allowRotation }) {
  let fabricHeight = fabricSoldBy
  let timesCalculated = 0
  while (true) {
    try {
      if (timesCalculated++ > MAX_NUM_CALCULATIONS) {
        console.log(`gave up after ${MAX_NUM_CALCULATIONS} calculations`)
        return { error: 'Could not calculate a solution to this problem.' }
      }
      const bins = packer({
        binWidth: fabricWidth,
        binHeight: fabricHeight,
        items: fabricPieces.map(({ width, height, id }) => ({ width, height, name: id }))
      }, {
        allowRotation
      })
      if (bins.length === 1) {
        const items = bins[0].map(item => ({
          width: item.width,
          height: item.height,
          x: item.x,
          y: item.y,
          id: item.item.name
        })).sort((a, b) => (a.id < b.id ? -1 : 1))
        return {
          items,
          fabricHeight,
          timesCalculated
        }
      } else {
        fabricHeight += fabricSoldBy
      }
    } catch (err) {
      fabricHeight += fabricSoldBy
    }
  }
}
