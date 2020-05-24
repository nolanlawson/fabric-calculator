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
        <div class="grid grid-2 grid-pad-20">
          <label for="fabric-width">Width of fabric you're buying:</label>
          <div><input id="fabric-width" type="number" placeholder="45" bind:value={fabricWidth}></div>
          <label for="fabric-increment">Fabric sold in increments of:</label>
          <div><input id="fabric-increment" type="number" placeholder="18" bind:value={fabricSoldBy}></div>
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
                <strong>Fabric piece #{i + 1}</strong>
                <div class="pad-v-10">
                  <label class="label-v">
                    <span>Width:</span>
                    <input type="number"
                           placeholder="10"
                           bind:value={fabricPieces[i].width}>
                  </label>
                </div>
                <div class="pad-v-10">
                  <label class="label-v">
                    <span>Length:</span>
                    <input type="number"
                           placeholder="10"
                           bind:value={fabricPieces[i].height}>
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
    </div>
    <div>
      <!-- canvas goes here -->
    </div>
  </div>
  {#if errorMessage}
    <div class="error-message pad-v-10">{errorMessage}</div>
  {/if}
  {#if solution && !errorMessage}
    <div class="solution-message pad-v-10">
      You need a piece of fabric <strong>{solution.fabricHeight} inches</strong> long
    </div>
  {/if}
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

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-pad-20 {
    grid-row-gap: 20px;
    grid-column-gap: 20px;
  }

  .grid-span-2 {
    grid-column: 1 / 3;
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

  @media (max-width: 767px) {
    .flex-h-when-big {
      flex-direction: column;
    }
  }

  ul {
    list-style: none;
  }

  .pad-v-10 {
    padding-top: 10px;
    padding-bottom: 10px;
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
    padding: 10px 0;
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
  import { packer } from 'guillotine-packer'

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

  $: {
    function calculateFabricNeeded () {
      console.log('calculateFabricNeeded')
      errorMessage = ''
      if (!fabricPieces.length) {
        return
      }
      if (fabricPieces.some(({ width, height }) => (width > fabricWidth && height > fabricWidth))) {
        errorMessage = 'One of the pieces of fabric is larger than the size of the fabric you are buying'
        return
      }
      let fabricHeight = fabricSoldBy
      solution = undefined
      while (!solution) {
        try {
          const bins = packer({
            binWidth: fabricWidth,
            binHeight: fabricHeight,
            items: fabricPieces,
            allowRotation
          })
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