export function createApp(root: HTMLElement) {
  root.innerHTML = `
    <main class="proposal-app" data-scene="opening">
      <div class="stage" data-role="stage">
        <div class="stage__backdrop"></div>
        <div class="stage__actors"></div>
        <div class="stage__effects"></div>
        <div class="stage__photos" data-role="photo-strip"></div>
        <p class="stage__subtitle" data-role="subtitle"></p>
        <p class="stage__proposal-line" data-role="proposal-line"></p>
        <button class="stage__prompt" data-role="chest-trigger" type="button" hidden>
          打开终章
        </button>
        <p class="stage__viewport-note" data-role="viewport-note" hidden>
          推荐使用电脑横屏观看这段童话。
        </p>
      </div>
      <button class="start-overlay" data-role="start-overlay" type="button">
        进入童话
      </button>
    </main>
  `;
}
