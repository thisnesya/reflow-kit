# ReflowKit

A lightweight utility kit for building Webflow sites with smooth scrolling, page lifecycle management, and common UI components.

## Installation

Include via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/thisnesya/reflow-kit@latest/dist/reflow.kit.min.js"></script>
```

## Quick Start

```javascript
const reflowkit = ReflowKit.init({
    scroll: {
        useScrollTrigger: true,
        lenis: {
            lerp: 0.1
        }
    },
    page: {
        triggerPageLeave: false
    },
    devices: {
        mobile: { max: 767 },
        tablet: { min: 768, max: 991 }
    }
});

reflowkit.on("page:domready", ({ toArray, scroll }) => {
    // Your initialization code here
    const buttons = toArray(".button");

    // Return cleanup function (optional)
    return () => {
        // Cleanup listeners when page changes
    };
});
```

## Configuration

### `scroll`

Controls smooth scrolling via [Lenis](https://lenis.darkroom.engineering/).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `useScrollTrigger` | `boolean` | `false` | Sync Lenis with GSAP ticker for ScrollTrigger compatibility |
| `lenis` | `LenisOptions` | `{ lerp: 0 }` | Lenis configuration options |

```javascript
ReflowKit.init({
    scroll: {
        useScrollTrigger: true,
        lenis: {
            lerp: 0.125,
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        }
    }
});
```

**Note:** When `useScrollTrigger: true`, the kit automatically:
- Syncs Lenis RAF with GSAP ticker
- Updates ScrollTrigger on scroll events
- Disables GSAP lag smoothing for consistent timing

### `page`

Page lifecycle configuration.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `triggerPageLeave` | `boolean \| { condition: () => boolean }` | `false` | Trigger `page:leave` event before navigation |
| `onInit` | `() => void` | - | Called immediately on initialization |

```javascript
ReflowKit.init({
    page: {
        triggerPageLeave: true,
        onInit: () => {
            window.history.scrollRestoration = "manual";
            window.scrollTo(0, 0);
        }
    }
});
```

### `devices`

Device detection breakpoints.

| Option | Type | Default |
|--------|------|---------|
| `mobile.max` | `number` | `479` |
| `tablet.min` | `number` | `768` |
| `tablet.max` | `number` | `991` |
| `desktop.min` | `number` | `1025` |

```javascript
ReflowKit.init({
    devices: {
        mobile: { max: 767 },
        tablet: { min: 768, max: 991 },
        desktop: { min: 992 }
    }
});
```

## Page Lifecycle

### Events

| Event | Description |
|-------|-------------|
| `page:before` | Fires before DOM ready handlers run |
| `page:fontready` | Fires when fonts are loaded |
| `page:domready` | Main initialization event - register your listeners here |
| `page:ready` | Fires after all `page:domready` handlers complete |
| `page:load` | Fires on window load |
| `page:restore` | Fires when page is restored from bfcache |
| `page:leave` | Fires before navigation (if `triggerPageLeave` enabled) |

### `on(event, callback, options?)`

Register event listeners.

```javascript
reflowkit.on("page:domready", (utils) => {
    const { toArray, scroll, isMobile } = utils;

    if (isMobile()) return;

    const cards = toArray(".card");
    cards.forEach(card => {
        card.addEventListener("click", handleClick);
    });

    // Return cleanup function
    return () => {
        cards.forEach(card => {
            card.removeEventListener("click", handleClick);
        });
    };
}, { scope: "home" });
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `scope` | `string` | Scope name for selective cleanup/reInit |
| `name` | `string` | Font family name (only for `page:fontready`) |

### `cleanup(scope?, detach?)`

Run cleanup functions and by default remove the listeners entirely so they won't run again on `refresh`. Pass `false` as the second argument to retain the listeners (only the cleanup fn reference is cleared).

```javascript
// Cleanup all listeners and remove them
await reflowkit.cleanup();

// Cleanup only "home" scope and remove those listeners
await reflowkit.cleanup("home");

// Cleanup but keep listeners registered (they'll run again on refresh)
await reflowkit.cleanup("home", false);
```

### `refresh(scope?)`

Re-run `page:before`, `page:domready` listeners, and `page:ready`. Useful after dynamic content changes.

```javascript
// Re-initialize all
await reflowkit.refresh();

// Re-initialize only "cases" scope
await reflowkit.refresh("cases");
```

### `emit(event)`

Manually emit any lifecycle event to trigger its registered listener.

```javascript
await reflowkit.emit("page:leave");
await reflowkit.emit("page:restore");
```

## Scroll Controller

The scroll controller is a Lenis instance with full API access.

```javascript
const { scroll } = reflowkit;

// Stop scrolling (e.g., when modal opens)
scroll.stop();

// Resume scrolling
scroll.start();

// Scroll to element
scroll.scrollTo("#section", { duration: 1.2 });

// Scroll to position
scroll.scrollTo(0, { immediate: true });

// Listen to scroll events
scroll.on("scroll", ({ scroll, velocity, direction }) => {
    console.log(scroll, velocity, direction);
});
```

## Components

### Modal

Build modals with automatic scroll locking.

```javascript
const modal = reflowkit.components.modal.build(
    document.querySelector(".modal"),
    {
        name: "contact",
        onInit: () => console.log("Modal initialized"),
        onOpen: () => console.log("Modal opened"),
        onClose: () => console.log("Modal closed")
    }
);

// Open modal
modal.open();

// Close modal
modal.close();

// Destroy modal (cleanup listeners)
modal.destroy();

// Get modal by name
const contactModal = reflowkit.components.modal.get("contact");
```

**HTML Structure:**

```html
<div class="modal">
    <div class="modal-content">
        <button data-action="close">Close</button>
        <!-- Modal content -->
    </div>
</div>
```

**CSS Classes (auto-applied):**
- `modal-opened` - Added to `body` when modal is open
- `is-open` - Added to modal element when open

### Select Input

Custom dropdown select for Webflow.

```javascript
const select = reflowkit.components.selectInput.build(
    document.querySelector(".custom-select"),
    (input) => {
        console.log("Selected:", input.value);
    }
);
```

**HTML Structure:**

```html
<div class="custom-select w-dropdown">
    <div data-toggle class="w-dropdown-toggle">
        <span data-value>Select option</span>
    </div>
    <nav class="w-dropdown-list">
        <label>
            <input type="radio" name="option" value="Option 1">
            Option 1
        </label>
        <label>
            <input type="radio" name="option" value="Option 2">
            Option 2
        </label>
    </nav>
</div>
```

**CSS Classes (auto-applied):**
- `is-selected` - Added to toggle when option is selected
- `is-valid` - Added to toggle when valid selection made
- `is-invalid` - Removed when valid selection made

### Article Renderer

Transform Webflow rich text with custom renderers.

```javascript
const article = reflowkit.components.article.render({
    richtext: document.querySelector(".w-richtext"),
    container: document.querySelector(".article-container"),
    renderFunctions: {
        h2: (node, children) => {
            const el = document.createElement("h2");
            el.className = "custom-heading";
            children.forEach(child => el.appendChild(child));
            return el;
        },
        p: (node, children) => {
            const el = document.createElement("p");
            el.className = "custom-paragraph";
            children.forEach(child => el.appendChild(child));
            return el;
        }
    }
});
```

## Utilities

All utilities are available in `page:domready` callback and via `reflowkit.utils`.

### DOM Utilities

#### `toArray(selector, scope?)`

Query elements as array.

```javascript
const items = toArray(".item");
const nestedItems = toArray(".nested", parentElement);
```

#### `getTemplate(id)`

Clone template content by ID.

```javascript
// Finds #template_card or #card
const cardClone = getTemplate("card");
container.appendChild(cardClone);
```

#### `hideElement(node)` / `showElement(node)` / `toggleElement(node)`

Toggle visibility using `u-hidden` class.

```javascript
hideElement(loader);
showElement(content);
toggleElement(menu);
```

#### `onClassChange(node, callback)`

Observe class changes on element.

```javascript
const { off } = onClassChange(element, () => {
    console.log("Class changed:", element.className);
});

// Stop observing
off();
```

#### `setCssProperty(name, value)`

Set CSS custom property on `:root`.

```javascript
setCssProperty("--header-height", "80px");
```

#### `getAttribute(node, name)`

Get data attribute value.

```javascript
const id = getAttribute(button, "item-id"); // data-item-id
```

### Query Parameters

#### `getQueryParam(name, url?)`

Get single query parameter.

```javascript
const page = getQueryParam("page"); // ?page=2 → "2"
```

#### `getQueryParams(url?)`

Get all query parameters as object.

```javascript
const params = getQueryParams(); // { page: "2", sort: "name" }
```

#### `getUtmQueries()`

Get UTM parameters.

```javascript
const utm = getUtmQueries();
// { source, medium, campaign, term, content, id }
```

### Form Utilities

#### `getFormData(form)`

Get form data as object.

```javascript
const data = getFormData(document.querySelector("form"));
// { name: "John", email: "john@example.com" }
```

### General Utilities

#### `debounce(fn, ms)`

Debounce function calls.

```javascript
const debouncedSearch = debounce((query) => {
    fetch(`/search?q=${query}`);
}, 300);

input.addEventListener("input", (e) => debouncedSearch(e.target.value));
```

#### `sleep(ms)`

Promise-based delay.

```javascript
await sleep(1000);
console.log("1 second later");
```

#### `nthElement(selector, index, scope?)`

Get nth element matching selector.

```javascript
const thirdItem = nthElement(".item", 2); // 0-indexed
```

### Webflow Utilities

#### `restartWebflow()`

Restart Webflow interactions after dynamic content changes.

```javascript
container.innerHTML = newContent;
await restartWebflow();
```

#### `webflowReady()`

Wait for Webflow to be ready.

```javascript
await webflowReady();
// Webflow is now initialized
```

## Custom Utilities

Register custom utilities available in all lifecycle callbacks.

```javascript
reflowkit.registerUtility("syncWebflowTabs", function(source, targets = []) {
    const sourceLinks = source.querySelectorAll(".w-tab-menu .w-tab-link");

    sourceLinks.forEach(link => {
        const tabName = link.getAttribute("data-w-tab");
        if (!tabName) return;

        const targetLinks = targets.map(target =>
            target.querySelector(`.w-tab-link[data-w-tab="${tabName}"]`)
        );

        $(link).on("click.syncTabs", e => {
            e.preventDefault();
            targetLinks.forEach(t => $(t).triggerHandler("click.w-tabs"));
        });
    });

    return {
        destroy() {
            sourceLinks.forEach(link => $(link).off("click.syncTabs"));
        }
    };
});

// Use in lifecycle
reflowkit.on("page:domready", ({ syncWebflowTabs }) => {
    const source = document.getElementById("tab-head");
    const target = document.getElementById("tab-body");

    const { destroy } = syncWebflowTabs(source, [target]);

    return destroy;
}, { scope: "cases" });
```

## Device Detection

```javascript
reflowkit.on("page:domready", ({ isMobile, isTablet, isDesktop }) => {
    if (isMobile()) {
        // Mobile-specific code
    }

    if (isTablet()) {
        // Tablet-specific code
    }

    if (isDesktop()) {
        // Desktop-specific code
    }
});
```

## CSS Variables

The kit sets these CSS variables automatically:

| Variable | Description |
|----------|-------------|
| `--viewport-height` | Initial viewport height (set once) |
| `--dynamic-viewport-height` | Updated on resize (useful for mobile 100vh issues) |

```css
.hero {
    height: var(--dynamic-viewport-height, 100vh);
}
```

## GSAP + ScrollTrigger Integration

For scroll-based animations with GSAP:

```javascript
const reflowkit = ReflowKit.init({
    scroll: {
        useScrollTrigger: true,
        lenis: { lerp: 0.1 }
    }
});

reflowkit.on("page:domready", ({ scroll }) => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".parallax", {
        y: -100,
        scrollTrigger: {
            trigger: ".parallax",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    return () => {
        ScrollTrigger.getAll().forEach(st => st.kill());
    };
});
```

## License

ISC
