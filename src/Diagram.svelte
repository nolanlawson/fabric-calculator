<section aria-label="Diagram {width} wide by {height} long">
  <ul class="sr-only" aria-label="Fabric pieces drawn in the diagram">
      {#each items as item, i (item.id)}
        <li>Fabric piece #{i + 1}: {item.width} wide by {item.height} long, at position {item.x}, {item.y}</li>
      {/each}
  </ul>
  <div class="grid" aria-hidden="true">
    <div/>
    <div class="x-label">
        {width}"
    </div>
    <div/>
    <div class="y-label">
        {height}" (selvage)
    </div>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 {width} {height}"
      >
        <!-- rectangles -->
          {#each items as item, i (item.id)}
            <rect x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                  fill={getColor(item.id)}
            />
          {/each}

        <!-- gridlines -->
        {#if showGridlines}
          {#each dashes as dash ([dash.x1, dash.y1, dash.x2, dash.y2].join(','))}
            <line x1={dash.x1} y1={dash.y1} x2={dash.x2} y2={dash.y2}
                  class="border" stroke-dasharray="1" />
          {/each}
        {/if}
        <!-- border -->
        <rect class="border" x="0" y="0" {width} {height} fill-opacity="0"></rect>
      </svg>
    </div>
    <div class="y-label-right">
      (selvage)
    </div>
  </div>
  <div>
    <div class="pad-v-10">
    <label>
      <input type="checkbox" bind:checked={showGridlines}>
      <span>Show gridlines</span>
    </label>
    </div>
  </div>
</section>
<style>
  svg {
    background: #fafafa;
    width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: min-content 1fr;
    grid-column-gap: 5px;
    grid-row-gap: 5px;
  }

  .y-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }

  .y-label-right {
    writing-mode: vertical-rl;
  }

  .border {
    stroke: #adadad;
    stroke-width: 0.25;
  }
</style>
<script>
  import { getColor } from './colors.js'
  import { isValidNonzeroInteger } from './util.js'

  let showGridlines = true
  let dashes = []

  function calculateDashes(width, height, increment) {
    if (!isValidNonzeroInteger(increment) || !isValidNonzeroInteger(width) || !isValidNonzeroInteger(height)) {
      return []
    }
    const result = []
    for (let i = increment; i < width; i += increment) {
      result.push({
        x1: i,
        y1: 0,
        x2: i,
        y2: height
      })
    }
    for (let i = increment; i < height; i += increment) {
      result.push({
        x1: 0,
        y1: i,
        x2: width,
        y2: i
      })
    }
    return result
  }

  $: dashes = calculateDashes(width, height, increment)

  export let increment
  export let items
  export let height
  export let width
</script>