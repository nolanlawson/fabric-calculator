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
        <div class="grid grid-pad-20 grid-2fr-1fr">
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
            <label for="fabric-rotation">Allow cutting against the seam</label>
          </div>
        </div>
      </div>
      <div>
        <h2>Pieces of fabric</h2>
        <ul>
            {#each fabricPieces as fabricPiece, i}
              <li>
                <span class="center-v left-h">
                  <div class="indicator" style="background-color: {getColor(i)};" />
                  <strong>Fabric piece #{i + 1}</strong>
                </span>
                <div class="pad-v-5">
                  <label class="label-v">
                    <span>Width:</span>
                    <div>
                      <input type="number"
                           inputmode="numeric"
                           placeholder="10"
                           bind:value={fabricPieces[i].width}>
                    </div>
                  </label>
                </div>
                <div class="pad-v-5">
                  <label class="label-v">
                    <span>Length:</span>
                    <div>
                      <input type="number"
                             inputmode="numeric"
                             placeholder="10"
                             bind:value={fabricPieces[i].height}>
                    </div>
                  </label>
                </div>
                <div class="pad-v-10">
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
            bins={solution.bins}
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

  .grid-pad-20 {
    grid-row-gap: 20px;
    grid-column-gap: 20px;
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

  let fabricSoldBy = 18 // half a yard
  let fabricPieces = []
  let fabricWidth = 45
  let allowRotation = true
  let errorMessage = ''
  let solution

  let fabric

  function addFabricPiece () {
    fabricPieces = fabricPieces.concat([{
      width: 10,
      height: 10
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
      console.log(fabricPieces)
      if (fabricPieces.some(_ => (!isValidNonzeroInteger(_.width) || !isValidNonzeroInteger(_.height))) ||
              !isValidNonzeroInteger(fabricWidth) ||
              !isValidNonzeroInteger(fabricSoldBy)) {
        console.log('ignoring', fabricPieces, fabricWidth, fabricSoldBy)
        return // ignore 0s
      }
      if (fabricPieces.some(({ width, height }) => (width > fabricWidth && height > fabricWidth))) {
        errorMessage = 'One of the pieces of fabric is larger than the size of the fabric you are buying'
        return
      }
      console.log('calculating', JSON.stringify(fabricPieces), fabricWidth, fabricSoldBy)
      let fabricHeight = fabricSoldBy
      while (!solution) {
        try {
          const bins = packer({
            binWidth: fabricWidth,
            binHeight: fabricHeight,
            items: fabricPieces,
            allowRotation
          })[0]
          solution = {
            bins,
            fabricHeight
          }
        } catch (err) {
          fabricHeight += fabricSoldBy
        }
      }
      console.log(solution)
    }

    calculateFabricNeeded()
  }

</script>