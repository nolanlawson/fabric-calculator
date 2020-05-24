<svelte:head><title>Fabric calculator</title></svelte:head>
<div class="app">
  <h1>Fabric calculator</h1>
  <p>
    This tool helps you figure out how much fabric you should buy based on the pieces you need to cut.
    It assumes fabric is sold by the half-yard (18 inches).
  </p>
  <div class="flex">
    <div>
      <div>
        <label>
          <span>Width of fabric you're buying (inches): </span>
          <input type="number" placeholder="45" bind:value={fabricWidth} on:change={calculateFabricNeeded}>
        </label>
      </div>
      <div>
        <h2>Pieces of fabric</h2>
        <ul>
          {#each fabricPieces as fabricPiece, i}
            <li>
              <strong>Fabric piece #{i + 1}</strong>
              <div class="form-group">
                <label>
                  <span>Width (inches):</span>
                  <input type="number"
                         placeholder="10"
                         bind:value={fabricPieces[i].width}
                         on:change={calculateFabricNeeded}>
                </label>
              </div><div>
                <label>
                  <span>Height (inches):</span>
                  <input type="number"
                         placeholder="10"
                         bind:value={fabricPieces[i].height}
                         on:change={calculateFabricNeeded}>
                </label>
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
  <div class="error-message">
    {#if errorMessage}
      <span>{errorMessage}</span>
    {/if}
  </div>
  <div class="solution-message">
    {#if solutionMessage}
      <span>{solutionMessage}</span>
    {/if}
  </div>
</div>
<style>
  :global(body) {
    font-family: Arial, Helvetica, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .flex {
    display: flex;
  }

  .flex > * {
    flex: 1
  }

  ul {
    list-style: none;
  }

  .form-group, label {
    padding: 10px 0;
  }

  .error-message {
    color: darkred;
    padding: 20px;
  }

</style>
<script>
  import { packer } from './packer.js'
  const FABRIC_SOLD_BY = 18 // half a yard
  let fabricPieces = []
  let fabricWidth = 45
  let errorMessage = ''
  let solution
  let solutionMessage = ''

  let fabric

  function addFabricPiece () {
    fabricPieces = fabricPieces.concat([{
      width: 10,
      height: 10
    }])
    calculateFabricNeeded()
  }

  function calculateFabricNeeded () {
    console.log('calculateFabricNeeded')
    errorMessage = ''
    if (!fabricPieces.length) {
      return
    }
    if (fabricPieces.some(({ width, height}) => (width > fabricWidth && height > fabricWidth))) {
      errorMessage = 'One of the pieces of fabric is larger than the size of the fabric you are buying'
      return
    }
    let fabricHeight = FABRIC_SOLD_BY
    solution = undefined
    while (!solution) {
      try {
        const bins = packer({
          binWidth: fabricWidth,
          binHeight: fabricHeight,
          items: fabricPieces,
          allowRotation: true
        })
        solution = {
          bins,
          fabricHeight
        }
      } catch (err) {
        fabricHeight += FABRIC_SOLD_BY
      }
    }
    console.log(solution)
  }

  $: {
    calculateFabricNeeded()
  }


  $: solutionMessage = solution && `You need a piece of fabric ${solution.fabricHeight} inches long`

</script>