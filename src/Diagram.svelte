<div class="grid">
  <div />
  <div class="x-label">
    {width}" (width)
  </div>
  <div class="y-label">
    {height}" (length)
  </div>
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 {width} {height}"
  >
    {#each items as item, i (item.id)}
      <rect x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            fill={getColor(item.id)}
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

  export let items
  export let height
  export let width
</script>