import PromiseWorker from 'promise-worker'

function isValidNonzeroInteger (i) {
  return i && typeof i === 'number' && i > 0
}

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module'
})

const promiseWorker = new PromiseWorker(worker)

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
