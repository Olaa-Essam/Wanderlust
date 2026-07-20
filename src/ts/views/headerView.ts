export default class HeaderView {

  private static pageTitle: HTMLElement;
  private static pageSubtitle: HTMLElement;
  private static dateTimeEl: HTMLElement;
  private static clockIntervalId: number;

  static init(): void {
    if (!this.pageTitle) this.pageTitle = document.getElementById("page-title")!;
    if (!this.pageSubtitle) this.pageSubtitle = document.getElementById("page-subtitle")!;
    if (!this.dateTimeEl) this.dateTimeEl = document.getElementById("current-datetime")!;

    if (!this.clockIntervalId) {
      this.startLiveClock();
    }

    document.getElementById("mobile-menu-btn")!.addEventListener("click", () => {
      document.getElementById("sidebar-overlay")?.classList.remove("hidden");
      document.getElementById("sidebar-overlay")?.classList.add("active");
      document.getElementById("sidebar")!.style.transform = "translateX(0%)";
    })

    document.getElementById("sidebar-overlay")!.addEventListener("click", () => {
      document.getElementById("sidebar-overlay")?.classList.remove("active");
      document.getElementById("sidebar-overlay")?.classList.add("hidden");
      document.getElementById("sidebar")!.style.transform = "translateX(-100%)";
    })

  }

  static updateHeader(viewName: string, titleText: string): void {
    this.init();

    this.pageTitle.innerText = titleText;

    if (this.pageSubtitle) {
      const subtitles: Record<string, string> = {
        dashboard: "Welcome back! Ready to plan your next adventure?",
        holidays: "Explore public holidays around the world",
        events: "Find concerts, sports, and entertainment",
        weather: "Check forecasts for any destination",
        "long-weekends": "Find the perfect mini-trip opportunities",
        currency: "Convert currencies with live exchange rates",
        "sun-times": "Check sunrise and sunset times worldwide",
        "my-plans": "Your saved holidays and events"
      };
      this.pageSubtitle.textContent = subtitles[viewName] || subtitles["dashboard"]!;
    }
  }

  private static startLiveClock(): void {
    const updateTime = () => {
      if (!this.dateTimeEl) return;

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      this.dateTimeEl.innerText = new Intl.DateTimeFormat('en-US', options).format(new Date());
    };

    updateTime(); 
    this.clockIntervalId = window.setInterval(updateTime, 60000);
  }
}