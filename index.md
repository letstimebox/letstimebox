---
layout: default
---

<div id="timeBox" class="content">
</div>

<script type="text/babel">
  ReactDOM.render(<TimeBox role="Timekeeper" watchUrl="{{ site.watchUrl }}"/>, document.querySelector('#timeBox'));
</script>
