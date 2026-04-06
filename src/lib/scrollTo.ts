/**
 * Shared scroll utility.
 * Dispatches "scrollStart" immediately, then "scrollEnd" only after
 * the window has actually stopped scrolling (no scroll events for 150 ms).
 * This replaces every setTimeout-based scrollEnd dispatch in the codebase.
 */

let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
let scrollListenerActive = false;

function onScroll() {
  if (scrollEndTimer) clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => {
    window.dispatchEvent(new Event("scrollEnd"));
    window.removeEventListener("scroll", onScroll);
    scrollListenerActive = false;
    scrollEndTimer = null;
  }, 150); // 150 ms of silence = scroll finished
}

export function scrollToSection(href: string) {
  const targetId = href.startsWith("#") ? href.substring(1) : href;
  const element = document.getElementById(targetId);
  if (!element) return;

  // Fire start event and update URL
  window.dispatchEvent(new Event("scrollStart"));
  window.history.replaceState(null, "", `#${targetId}`);

  // Calculate destination accounting for sticky navbar height
  const NAVBAR_OFFSET = 90;
  const elementPosition = element.getBoundingClientRect().top;
  const targetY = elementPosition + window.scrollY - NAVBAR_OFFSET;

  // Attach the end-detector before scrolling
  if (!scrollListenerActive) {
    window.addEventListener("scroll", onScroll, { passive: true });
    scrollListenerActive = true;
  }

  window.scrollTo({ top: targetY, behavior: "smooth" });

  // Safety net: if the page is already at the target (no scroll event fires),
  // dispatch scrollEnd after a short delay.
  if (scrollEndTimer) clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => {
    window.dispatchEvent(new Event("scrollEnd"));
    window.removeEventListener("scroll", onScroll);
    scrollListenerActive = false;
    scrollEndTimer = null;
  }, 2500); // outer safety cap
}

export function scrollToTop() {
  window.dispatchEvent(new Event("scrollStart"));

  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  if (!scrollListenerActive) {
    window.addEventListener("scroll", onScroll, { passive: true });
    scrollListenerActive = true;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Safety net
  if (scrollEndTimer) clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => {
    window.dispatchEvent(new Event("scrollEnd"));
    window.removeEventListener("scroll", onScroll);
    scrollListenerActive = false;
    scrollEndTimer = null;
  }, 2500);
}
