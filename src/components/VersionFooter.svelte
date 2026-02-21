<script lang="ts">
  import { getAppVersion } from '../lib/version';

  const version = getAppVersion();
</script>

<footer class="version-footer">
  <p class="version-text">v{version}</p>
</footer>

<style>
  .version-footer {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem 0;
    border-top: 1px solid #e0e0e0;
  }

  .version-text {
    margin: 0;
    font-size: 0.8rem;
    color: #999;
    font-family: 'Monaco', 'Courier New', monospace;
  }
</style>
