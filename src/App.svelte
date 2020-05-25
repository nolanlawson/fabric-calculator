<svelte:head><title>Fabric calculator</title></svelte:head>
<div class="app">
  <h1>Fabric calculator</h1>
  <p>
    This tool can calculate how much fabric you should buy based on the pieces you need to cut.
    The default assumption is that fabric is sold by the half-yard. All values are in inches.
  </p>
  <div class="flex flex-h-when-big">
    <div>
      <div class="pad-v-10 pad-h-10">
        <div class="grid grid-gap-20 grid-2fr-1fr">
          <label for="fabric-width">Width of fabric you're buying:</label>
          <div class="input-wrap">
            <input id="fabric-width" type="number" inputmode="numeric"
                   placeholder="45" bind:value={fabricWidth}>
          </div>
          <label for="fabric-increment">Fabric sold in increments of:</label>
          <div class="input-wrap">
            <input id="fabric-increment" type="number" inputmode="numeric"
                   placeholder="18" bind:value={fabricSoldBy}>
          </div>
          <div class="grid-span-2">
            <input id="fabric-rotation" type="checkbox" bind:checked={allowRotation}>
            <label for="fabric-rotation">Allow cutting against the grain</label>
          </div>
        </div>
      </div>
      <div>
        <h2>Pieces of fabric</h2>
        <ul>
            {#each fabricPieces as fabricPiece, i (fabricPiece.id)}
              <li class="pad-v-10">
                <span class="center-v left-h">
                  <div class="indicator" style="background-color: {getColor(fabricPiece.id)};" />
                  <strong>Fabric piece #{fabricPiece.id + 1}</strong>
                </span>
                <div class="grid grid-gap-10 pad-v-10 fabric-piece-grid">
                  <label for="fabric-width-{i}">Width:</label>
                  <div class="input-wrap">
                    <input id="fabric-width-{i}" type="number" inputmode="numeric"
                           placeholder="10" bind:value={fabricPieces[i].width}>
                  </div>
                  <label for="fabric-height-{i}">Length:</label>
                  <div class="input-wrap">
                    <input id="fabric-height-{i}" type="number" inputmode="numeric"
                           placeholder="10" bind:value={fabricPieces[i].height}>
                  </div>
                </div>
                <div>
                  <button type="button" on:click={() => removeFabricPiece(i)}>Remove</button>
                </div>
              </li>
            {/each}
        </ul>
        <button type="button" on:click={addFabricPiece}>Add fabric piece</button>
      </div>
        {#if errorMessage}
          <div class="error-message pad-v-20">{errorMessage}</div>
        {/if}
        {#if solution && !errorMessage}
          <div class="solution-message pad-v-20">
            You need a piece of fabric <strong>{solution.fabricHeight} inches</strong> long
          </div>
        {/if}
    </div>
    <div class="text-align-center">
        {#if solution}
          <Diagram
            items={solution.items}
            width={fabricWidth}
            height={solution.fabricHeight}
          />
        {/if}
    </div>
  </div>
</div>
<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    font-family: sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .grid {
    display: grid;
    align-items: center;
  }

  .grid-gap-20 {
    grid-row-gap: 20px;
    grid-column-gap: 20px;
  }

  .grid-gap-10 {
    grid-row-gap: 10px;
    grid-column-gap: 10px;
  }

  .grid-span-2 {
    grid-column: 1 / 3;
  }

  .grid-2fr-1fr {
    grid-template-columns: 2fr 1fr;
  }

  .input-wrap {
    min-width: 0;
  }

  .input-wrap input {
    width: 100%;
  }

  .flex {
    display: flex;
  }

  .flex > * {
    flex: 1;
  }

  .flex-h {
    flex-direction: row;
  }

  .flex-h-when-big {
    flex-direction: row;
  }

  .flex-h-when-big > :first-child {
    margin-right: 20px;
  }

  @media (max-width: 767px) {
    .flex-h-when-big {
      flex-direction: column;
    }

    .flex-h-when-big > :first-child {
      margin-bottom: 20px;
    }
  }

  .fabric-piece-grid {
    grid-template-columns: 2fr 1fr 2fr 1fr;
  }

  @media (max-width: 767px) {
    .fabric-piece-grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  .indicator {
    width: 1em;
    height: 1em;
    border-radius: 1px;
    display: inline-block;
    margin-right: 10px;
  }

  .center-h {
    display: flex;
    justify-content: center;
  }

  .text-align-center {
    text-align: center;
  }

  .center-v {
    display: flex;
    align-items: center;
  }

  .left-h {
    display: flex;
    justify-content: flex-start;
  }

  ul {
    list-style: none;
  }

  .pad-v-10 {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .pad-v-5 {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .pad-v-20 {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .pad-h-10 {
    padding-left: 10px;
    padding-right: 10px;
  }

  .error-message {
    color: darkred;
  }

  .label-v > * {
    display: block;
    padding: 5px 0;
  }

  .label-h > * {
    padding: 10px 0;
  }

  button {
    padding: 3px 7px;
    font-size: 1.1em;
    cursor: pointer;
  }

  input {
    font-size: 1em;
  }

  input[type=checkbox] {
    margin-right: 10px;
  }

</style>
<script>
  import Diagram from './Diagram.svelte'
  import { packer } from 'guillotine-packer'
  import { getColor } from './colors.js'

  const MAX_NUM_CALCULATIONS = 100

  let fabricSoldBy = 18 // half a yard
  let fabricPieces = []
  let fabricWidth = 45
  let allowRotation = true
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
      while (!solution)  {
        try {
          if (timesCalculated++ > MAX_NUM_CALCULATIONS) {
            console.log(`gave up after ${MAX_NUM_CALCULATIONS} calculations`)
            errorMessage = 'Could not calculate a solution to this problem'
            return
          }
          const bins = packer({
            binWidth: fabricWidth,
            binHeight: fabricHeight,
            items: fabricPieces.map(({ width, height, id}) => ({ width, height, name: id })),
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

</script>