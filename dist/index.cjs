"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  init: () => init
});
module.exports = __toCommonJS(index_exports);

// src/core/device/detector.ts
function DeviceDetector({ mobile, tablet, desktop }) {
  return {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.matchMedia(`(max-width: ${mobile?.max || 479}px)`).matches;
    },
    isTablet() {
      return /(iPad|Tablet|(Android(?!.*Mobile))|SM-T\d{3}|Kindle|Surface|PlayBook|Nexus (7|10)|Tab)/i.test(
        navigator.userAgent
      ) || window.matchMedia(
        `(min-width: ${tablet?.min || 768}px) and (max-width: ${tablet?.max || 991}px)`
      ).matches;
    },
    isDesktop() {
      return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|Kindle|Surface|PlayBook|Nexus (7|10)|Tab/i.test(
        navigator.userAgent
      ) && window.matchMedia(`(min-width: ${desktop?.min || 1025}px)`).matches;
    }
  };
}

// src/core/page/controller.ts
function PageLifecycle({
  onInit,
  scroll,
  triggerPageLeave,
  lockScrollUntilReady,
  utilities = {}
}) {
  const domListeners = [];
  const noop = () => {
  };
  const eventListeners = {
    "page:before": noop,
    "page:fontready": noop,
    "page:domready": noop,
    "page:ready": noop,
    "page:restore": noop,
    "page:leave": noop,
    "page:load": noop
  };
  const domReady = new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
  });
  if (lockScrollUntilReady) {
    scroll.stop();
    init2().then(() => scroll.start());
  } else {
    init2();
  }
  async function init2() {
    onInit?.();
    window.addEventListener("load", () => triggerEvent("page:load"));
    await triggerEvent("page:before");
    await document.fonts.ready;
    await triggerEvent("page:fontready");
    await domReady;
    await Promise.all(domListeners.map(runDomListener));
    await triggerEvent("page:ready");
    console.log("page:%c ready", "color:green;");
  }
  if (triggerPageLeave) document.addEventListener("click", handleClick);
  window.addEventListener("pageshow", ({ persisted }) => {
    if (persisted) triggerEvent("page:restore");
  });
  return {
    on(event, cb, options) {
      switch (event) {
        case "page:domready":
          domListeners.push({ cb, scope: options?.scope });
          break;
        case "page:fontready":
          if (options?.name) listenFontLoad(options.name, cb);
          else eventListeners[event] = cb;
          break;
        default:
          eventListeners[event] = cb;
      }
    },
    async refresh(scope) {
      const listeners = domListeners.filter((l) => scope ? l.scope === scope : true);
      await triggerEvent("page:before");
      await Promise.all(listeners.map(runDomListener));
      await triggerEvent("page:ready");
    },
    async cleanup(scope, detach = true) {
      const listeners = domListeners.filter((l) => scope ? l.scope === scope : true);
      const cleanups = listeners.map((l) => l.cleanup).filter((fn) => typeof fn === "function");
      await Promise.allSettled(cleanups.map((fn) => fn()));
      if (detach) {
        listeners.forEach((l) => {
          const index = domListeners.indexOf(l);
          if (index !== -1) domListeners.splice(index, 1);
        });
      } else {
        listeners.forEach((l) => {
          l.cleanup = void 0;
        });
      }
    },
    async emit(event) {
      await triggerEvent(event);
    }
  };
  async function runDomListener(listener) {
    const result = await listener.cb(utilities);
    if (typeof result === "function") {
      listener.cleanup = result;
    }
  }
  function listenFontLoad(name, cb) {
    Array.from(document.fonts).find((f) => f.family === name)?.loaded.then(() => cb(utilities));
  }
  async function triggerEvent(event) {
    if (event === "page:domready") return;
    await eventListeners[event](utilities);
  }
  async function handleClick(e) {
    if (!e.isTrusted || e.defaultPrevented) return;
    const target = e.target.closest("a");
    if (!target || !target.href) return;
    if (e.button === 1 || e.ctrlKey || e.metaKey) return;
    const href = target.getAttribute("href");
    const dest = new URL(target.href);
    const samePage = dest.pathname === new URL(location.href).pathname;
    if (typeof triggerPageLeave !== "boolean" && triggerPageLeave?.condition?.() || href?.startsWith("/") && !samePage) {
      e.preventDefault();
      await triggerEvent("page:leave");
      document.removeEventListener("click", handleClick);
      target.click();
      document.addEventListener("click", handleClick);
    }
  }
}

// src/core/page/scroll.ts
var import_lenis = __toESM(require("lenis"), 1);
function ScrollController({ lenis, useScrollTrigger } = {}) {
  const style = document.createElement("style");
  const instance = new import_lenis.default(lenis || { lerp: 0, autoRaf: useScrollTrigger ? false : true });
  if (useScrollTrigger) {
    if (typeof window.ScrollTrigger !== "undefined") gsap();
    else document.addEventListener("DOMContentLoaded", gsap);
  }
  style.textContent = "html.lenis,html.lenis body{height:auto}.lenis:not(.lenis-autoToggle).lenis-stopped{overflow:clip}.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-smooth iframe{pointer-events:none}.lenis.lenis-autoToggle{transition-property:overflow;transition-duration:1ms;transition-behavior:allow-discrete}";
  document.head.append(style);
  return instance;
  function gsap() {
    instance.on("scroll", window.ScrollTrigger.update);
    window.gsap.ticker.add((t) => instance.raf(t * 1e3));
    window.gsap.ticker.lagSmoothing(0);
  }
}

// src/shared/dom/css.ts
function setCssProperty(name, value, node) {
  if (node) node.style.setProperty(name, value);
  else document.documentElement.style.setProperty(name, value);
}

// src/shared/constants/index.ts
var appConfig = {
  classes: {
    hidden: "u-hidden"
  }
};

// src/shared/dom/visibillity.ts
function hideElement(node) {
  node.classList.add(appConfig.classes.hidden);
}
function showElement(node) {
  node.classList.remove(appConfig.classes.hidden);
}
function toggleElement(node) {
  node.classList.toggle(appConfig.classes.hidden);
}

// src/shared/dom/attributes.ts
function getAttribute(node, name) {
  return node.getAttribute(name) || node.attributes.getNamedItem(name) || null;
}

// src/shared/dom/template.ts
function getTemplate(id) {
  const t = document.getElementById(`template_${id}`) || document.getElementById(id);
  return t && t.tagName === "TEMPLATE" ? t.content.firstChild?.cloneNode(true) : null;
}

// src/shared/dom/on-class-change.ts
var observedNodes = /* @__PURE__ */ new Map();
var observer = null;
function getObserver() {
  return observer ?? (observer = new MutationObserver((list) => {
    for (const { type, attributeName, target } of list) {
      if (type === "attributes" && attributeName === "class") {
        const entry = observedNodes.get(target);
        if (!entry) continue;
        const currentClass = new Set(target.classList);
        if (!isEqual(currentClass, entry.prevClass)) {
          entry.prevClass = currentClass;
          entry.callbacks.forEach((cb) => cb());
        }
      }
    }
  }));
}
function isEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const val of a) if (!b.has(val)) return false;
  return true;
}
function onClassChange(node, callback) {
  let entry = observedNodes.get(node);
  if (!entry) {
    entry = { prevClass: new Set(node.classList), callbacks: /* @__PURE__ */ new Set() };
    observedNodes.set(node, entry);
    getObserver().observe(node, { attributes: true, attributeFilter: ["class"] });
  }
  entry.callbacks.add(callback);
  return {
    off() {
      entry.callbacks.delete(callback);
    }
  };
}

// src/shared/utils/debounce.ts
function debounce(func, ms) {
  let lastCall = null;
  let lastCallTimer = null;
  return function(...args) {
    const now = Date.now();
    if (lastCall && now - lastCall <= ms && lastCallTimer) {
      clearTimeout(lastCallTimer);
    }
    lastCall = now;
    lastCallTimer = setTimeout(() => func.apply(this, args), ms);
  };
}

// src/shared/utils/sleep.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/shared/utils/to-array.ts
function toArray(value, scope) {
  if (!value || typeof value != "string") return [];
  const context = scope || document;
  return Array.from(context.querySelectorAll(value));
}

// src/shared/utils/nth-element.ts
function nthElement(arr = [], every = 1, from = 1) {
  const result = [];
  for (let i = from - 1; i < arr.length; i += every) {
    result.push(arr[i]);
  }
  return result;
}

// src/shared/utils/query-params.ts
function getQueryParam(name, url) {
  try {
    return new URL(url || window.location.href).searchParams.get(name);
  } catch {
    return null;
  }
}
function getQueryParams(url) {
  const res = {};
  try {
    new URL(url || window.location.href).searchParams.forEach((value, key) => {
      res[key] = value;
    });
  } catch {
  }
  return res;
}
function getUtmQueries() {
  return {
    source: getQueryParam("utm_source"),
    medium: getQueryParam("utm_medium"),
    campaign: getQueryParam("utm_campaign"),
    term: getQueryParam("utm_term"),
    content: getQueryParam("utm_content"),
    id: getQueryParam("utm_id")
  };
}
function setQueryParam(name, value, options = {}) {
  updateQuery((params) => params.set(name, String(value)), options);
}
function deleteQueryParam(name, options = {}) {
  updateQuery((params) => params.delete(name), options);
}
function updateQuery(mutate, { push }) {
  try {
    const url = new URL(window.location.href);
    mutate(url.searchParams);
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (push) window.history.pushState(null, "", next);
    else window.history.replaceState(null, "", next);
  } catch {
    console.warn("Failed to update query params");
  }
}

// src/core/page/viewport.ts
function setViewportHeight() {
  const isIos26 = () => {
    const { userAgent } = navigator;
    return userAgent.includes("iPhone") && userAgent.includes("Version/26");
  };
  if (isIos26()) {
    const update = () => setCssProperty("--dynamic-viewport-height", `${window.outerHeight}px`);
    setCssProperty("--viewport-height", `${window.outerHeight}px`);
    setCssProperty("--ios26-bar-gap", `${window.outerHeight - window.innerHeight}px`);
    update();
    window.addEventListener("resize", debounce(update, 100));
  } else {
    const update = () => setCssProperty("--dynamic-viewport-height", `${window.innerHeight}px`);
    setCssProperty("--viewport-height", `${window.innerHeight}px`);
    update();
    window.addEventListener("resize", debounce(update, 100));
  }
}

// src/features/modal/modal.ts
function modalBuilder(scrollController) {
  const modals = /* @__PURE__ */ new Map();
  let idx = 0;
  function build(node, {
    name,
    onInit,
    onOpen,
    onClose,
    onOpenComplete,
    onCloseComplete,
    animationDuration = 500
  } = {}) {
    idx++;
    const closeButtons = node.querySelectorAll('[data-action="close"]');
    closeButtons.forEach((btn) => btn.addEventListener("click", close));
    onInit && onInit();
    const instance = {
      open,
      close,
      isOpen,
      destroy() {
        closeButtons.forEach((btn) => btn.removeEventListener("click", close));
        close();
      }
    };
    modals.set(name || `modal-${idx}`, instance);
    return instance;
    function isOpen() {
      return node.classList.contains("is-open");
    }
    function open() {
      if (scrollController) scrollController.stop();
      document.addEventListener("keyup", listenEscape);
      document.body.classList.add("modal-opened");
      node.classList.add("is-open");
      onOpen && onOpen();
      setTimeout(() => {
        onOpenComplete && onOpenComplete();
      }, animationDuration + 5);
    }
    function close() {
      document.removeEventListener("keyup", listenEscape);
      node.classList.remove("is-open");
      document.body.classList.remove("modal-opened");
      onClose && onClose();
      setTimeout(() => {
        if (scrollController) scrollController.start();
        onCloseComplete && onCloseComplete();
      }, animationDuration + 5);
    }
    function listenEscape(evt) {
      if ("Escape" === evt.key) close();
    }
  }
  return {
    build,
    get: (name) => modals.get(name),
    getAll: () => Object.fromEntries(modals)
  };
}

// src/features/article/article.ts
function article() {
  function render({ richtext, renderFunctions, container }) {
    const tags = Object.keys(renderFunctions);
    const processedHtml = removeWrappingPTags(richtext.innerHTML, tags);
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedHtml, "text/html");
    const result = processNode(doc.body);
    if (result) [...result.childNodes].forEach((n) => container.append(n));
    return container;
    function removeWrappingPTags(html, tags2) {
      const unescapedHtml = html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const regex = new RegExp(
        `<p>\\s*(<\\/?(${tags2.join("|")})(?:\\s[^>]*)?>)\\s*<\\/p>`,
        "gi"
      );
      return unescapedHtml.replace(regex, "$1");
    }
    function processNode(node) {
      if (!node) return;
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent || "");
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const renderFunction = getRenderFunction(tagName);
        if (renderFunction) {
          const children = Array.from(node.childNodes || []).map(processNode).filter(Boolean);
          return renderFunction(node, children);
        } else {
          const clone = node.cloneNode(false);
          Array.from(node.childNodes).forEach((child) => {
            const processedChild = processNode(child);
            if (processedChild) {
              clone.appendChild(processedChild);
            }
          });
          return clone;
        }
      }
      return null;
    }
    function getRenderFunction(tagName) {
      return renderFunctions[tagName] || null;
    }
  }
  return { render };
}

// src/features/forms/inputs/select.ts
function selectInput() {
  function build(node, onChange) {
    const seleted = node.querySelector("[data-value]");
    const toggle = node.querySelector("[data-toggle]");
    if (!seleted || !toggle) return;
    const defaultText = seleted.textContent;
    node.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) {
          seleted.textContent = input.value;
          $(node).triggerHandler("w-close.w-dropdown");
          toggle.classList.add("is-selected", "is-valid");
          toggle.classList.remove("is-invalid");
        }
        onChange?.(input);
      });
    });
    node.addEventListener("reset", () => {
      seleted.textContent = defaultText;
      toggle.classList.remove("is-invalid", "is-valid", "is-selected");
    });
  }
  return { build };
}

// src/features/forms/utils/get-form-data.ts
function getFormData(node) {
  const result = {};
  try {
    for (let [key, value] of new FormData(node)) {
      result[key] = value;
    }
  } catch {
    console.warn("getFormData: node is not Form");
  }
  return result;
}

// src/shared/webflow/restart.ts
async function restartWebflow() {
  const { Webflow } = window;
  if (!Webflow || !("destroy" in Webflow) || !("ready" in Webflow) || !("require" in Webflow))
    return;
  Webflow.destroy();
  Webflow.ready();
  return new Promise((resolve) => Webflow.push(() => resolve(void 0)));
}

// src/shared/webflow/ready.ts
var webflowReady = async () => {
  return new Promise((resolve) => {
    window.Webflow || (window.Webflow = []);
    window.Webflow.push(resolve);
  });
};

// src/shared/index.ts
var utils = {
  getFormData,
  getQueryParam,
  getQueryParams,
  getUtmQueries,
  setQueryParam,
  deleteQueryParam,
  getTemplate,
  setCssProperty,
  onClassChange,
  sleep,
  toArray,
  debounce,
  nthElement,
  hideElement,
  showElement,
  toggleElement,
  getAttribute,
  restartWebflow,
  webflowReady
};

// src/helpers.ts
function defineProperty(obj, key, value) {
  Object.defineProperty(obj, key, {
    value,
    enumerable: false
  });
}

// src/app.ts
function init(options = {}) {
  setViewportHeight();
  const { isMobile, isTablet, isDesktop } = DeviceDetector(options.devices || {});
  const scroll = ScrollController({ ...options.scroll });
  const modal = modalBuilder(scroll);
  const utilities = {
    ...utils,
    isMobile,
    isTablet,
    isDesktop,
    scroll
  };
  const components = {
    modal,
    selectInput: selectInput(),
    article: article()
    // phoneInput: phoneInput()
  };
  const { on, refresh, cleanup, emit } = PageLifecycle({
    ...options.page || {},
    utilities,
    scroll
  });
  function registerUtility(name, value) {
    utilities[name] = value;
  }
  const instance = {
    on,
    refresh,
    cleanup,
    emit,
    registerUtility,
    utils: utilities,
    scroll,
    components,
    content: {}
  };
  defineProperty(instance, "_developer", "t.me/drmc0de");
  defineProperty(instance, "_version", "1.1.0");
  return instance;
}
//# sourceMappingURL=index.cjs.map
