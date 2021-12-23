/* global Worker */
import PromiseWorker from 'promise-worker'
import { isValidNonzeroInteger } from './util.js'

function createPromiseWorker () {
  const worker = new Worker(new URL('./worker.js', import.meta.url), {
    type: 'module'
  })

  return new PromiseWorker(worker)
}

// workers don't play nice with jest
function createJestWorker () {
  return {
    postMessage: async function (data) {
      // lazy-load so prod doesn't get this imported twice
      const { calculateWithPacker } = await import('./calculateWithPacker.js')
      return calculateWithPacker(data)
    }
  }
}

const promiseWorker = process.env.NODE_ENV === 'test' ? createJestWorker() : createPromiseWorker()

export async function calculateSolution ({ fabricPieces, fabricWidth, fabricSoldBy, allowRotation }) {
  if (!fabricPieces.length) {
    return { noSolution: true }
  }
  if (fabricPieces.some(_ => (!isValidNonzeroInteger(_.width) || !isValidNonzeroInteger(_.height))) ||
    !isValidNonzeroInteger(fabricWidth) ||
    !isValidNonzeroInteger(fabricSoldBy)) {
    return { error: 'All lengths/widths must be greater than zero' } // ignore zeroes
  }
  if (fabricPieces.some(({ width, height }) => (width > fabricWidth && height > fabricWidth))) {
    return { error: 'One of the pieces of fabric is larger than the size of the fabric you are buying.' }
  }

  return (await promiseWorker.postMessage({ fabricPieces, fabricWidth, fabricSoldBy, allowRotation }))
}
