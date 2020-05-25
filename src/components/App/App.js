/* eslint-disable no-labels,no-inner-declarations */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern":
     "(Diagram|getColor|errorMessage|addFabricPiece|removeFabricPiece)"
   }]
 */

import { packer } from 'guillotine-packer'
import Diagram from '../Diagram/Diagram.svelte'
import { getColor } from '../../utils/colors.js'

const MAX_NUM_CALCULATIONS = 100

const fabricSoldBy = 18 // half a yard
let fabricPieces = []
const fabricWidth = 45
const allowRotation = true
let errorMessage = ''
let fabricId = -1
let solution

function addFabricPiece () {
  fabricPieces = fabricPieces.concat([{
    width: 10,
    height: 10,
    id: ++fabricId
  }])
}

function removeFabricPiece (i) {
  fabricPieces.splice(i, 1)
  fabricPieces = [...fabricPieces] // update
}

function isValidNonzeroInteger (i) {
  return i && typeof i === 'number' && i > 0
}

$: {
  function calculateFabricNeeded () {
    solution = undefined
    errorMessage = ''
    if (!fabricPieces.length) {
      return
    }
    if (fabricPieces.some(_ => (!isValidNonzeroInteger(_.width) || !isValidNonzeroInteger(_.height))) ||
      !isValidNonzeroInteger(fabricWidth) ||
      !isValidNonzeroInteger(fabricSoldBy)) {
      return // ignore zeroes
    }
    if (fabricPieces.some(({ width, height }) => (width > fabricWidth && height > fabricWidth))) {
      errorMessage = 'One of the pieces of fabric is larger than the size of the fabric you are buying'
      return
    }
    console.log('calculating', JSON.stringify(fabricPieces), fabricWidth, fabricSoldBy)
    let fabricHeight = fabricSoldBy
    let timesCalculated = 0
    while (!solution) {
      try {
        if (timesCalculated++ > MAX_NUM_CALCULATIONS) {
          console.log(`gave up after ${MAX_NUM_CALCULATIONS} calculations`)
          errorMessage = 'Could not calculate a solution to this problem'
          return
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
          }))
          solution = {
            items,
            fabricHeight
          }
        } else {
          fabricHeight += fabricSoldBy
        }
      } catch (err) {
        fabricHeight += fabricSoldBy
      }
    }
    console.log(`solution (calculated ${timesCalculated} time(s))`, solution)
  }

  calculateFabricNeeded()
}
