document.documentElement.classList.add("page-ready");

(() => {
  const measurementId = "G-0E6CY1W1LL";
  const consentStorageKey = "dvmarketing-cookie-consent";
  const deniedConsent = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  const grantedConsent = {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  const banner = document.querySelector("#cookie-banner");

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  window.gtag("consent", "default", deniedConsent);

  let analyticsScriptAdded = false;

  function loadAnalytics() {
    window.gtag("consent", "update", grantedConsent);
    if (analyticsScriptAdded) return;
    analyticsScriptAdded = true;

    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.onerror = () => {
      console.error("Google Analytics could not be loaded.");
    };
    document.head.append(script);
  }

  function clearAnalyticsCookies() {
    const cookieNames = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("=")[0])
      .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat"));
    const paths = new Set(["/", window.location.pathname.replace(/[^/]*$/, "")]);

    for (const cookieName of cookieNames) {
      for (const path of paths) {
        document.cookie = `${cookieName}=; Max-Age=0; path=${path}; SameSite=Lax`;
      }
    }
  }

  function storeChoice(choice) {
    try {
      window.localStorage.setItem(consentStorageKey, choice);
    } catch (error) {
      console.error("Cookie consent could not be saved in local storage.", error);
    }
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function saveChoice(choice) {
    storeChoice(choice);
    if (banner) banner.hidden = true;

    if (choice === "accepted") {
      loadAnalytics();
      return;
    }

    window.gtag("consent", "update", deniedConsent);
    clearAnalyticsCookies();
  }

  let savedChoice = null;
  try {
    savedChoice = window.localStorage.getItem(consentStorageKey);
  } catch (error) {
    console.error("Cookie consent could not be read from local storage.", error);
  }

  if (savedChoice === "accepted") {
    loadAnalytics();
  } else if (savedChoice === "rejected") {
    window.gtag("consent", "update", deniedConsent);
  } else {
    showBanner();
  }

  document.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.getAttribute("data-cookie-choice");
      if (choice === "accepted" || choice === "rejected") saveChoice(choice);
    });
  });

  document.querySelectorAll("[data-cookie-settings]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showBanner();
      banner?.querySelector('[data-cookie-choice="accepted"]')?.focus();
    });
  });
})();
