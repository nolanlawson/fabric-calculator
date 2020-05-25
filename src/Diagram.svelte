<div class="grid">
  <div />
  <div class="x-label">
    {width} inches
  </div>
  <div class="y-label">
    {height} inches
  </div>
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 {width} {height}"
  >
    {#each bins as bin, i}
      <rect x={bin.x}
            y={bin.y}
            width={bin.width}
            height={bin.height}
            fill={getColor(i)}
      />
    {/each}

  </svg>
</div>
<style>
  svg {
    background: #fafafa;
    border: 1px solid #333;
    width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content 1fr;
  }

  .y-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
</style>
<script>
  import { getColor } from './colors.js'

  export let bins
  export let height
  export let width
</script>