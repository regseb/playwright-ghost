# Customize

The plugin in the README has some problems. Let's see how to correct them.

```javascript
/// rickrollPlugin.js
export default function rickrollPlugin() {
  return {
    "BrowserType.launch:before": (args) => {
      return [
        {
          ...args[0],
          args: ["--disable-volume-adjust-sound"],
        },
      ];
    },

    "BrowserContext.newPage:after": (page) => {
      page.addInitScript(() => {
        // Execute script only in main frame.
        if (window !== top) {
          return;
        }
        addEventListener("load", () => {
          const iframe = document.createElement("iframe");
          iframe.src = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
          document.body.replaceChildren(iframe);
        });
      });
      return page;
    },
  };
}
```

## `launchPersistentContext()`

Playwright provides two methods for starting navigation:
[`BrowserType.launch()`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch)
and
[`BrowserType.launchPersistentContext()`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context).
The plugin hooks only `launch()`. If the user uses the other method, sound
adjustment will not be disabled.

We add a hook to `"BrowserType.launchPersistentContext:before"` and, as the two
functions are very similar, we factor the options into a new function
`disableVolumeAdjustSound()`.

```javascript
/// Factor in the modification of browser launch options.
const disableVolumeAdjustSound = (options) => {
  return {
    ...options,
    args: ["--disable-volume-adjust-sound"],
  };
};

export default function rickrollPlugin() {
  return {
    "BrowserType.launch:before": (args) => {
      return [disableVolumeAdjustSound(args[0])];
    },

    /// Add a hook for the other method of launching a browser.
    "BrowserType.launchPersistentContext:before": (args) => {
      /// Modify the options in the second argument (the first is the path to
      /// the profile).
      return [args[0], disableVolumeAdjustSound(args[1])];
    },

    /// ...
  };
}
```

## `:new`

The plugin hooks
[`BrowserContext.newPage()`](https://playwright.dev/docs/api/class-browsercontext#browser-context-new-page)
to add a script to the page. But it's also possible to create a page using
[`Browser.newPage()`](https://playwright.dev/docs/api/class-browser#browser-new-page).
Playwright-ghost provides shortcuts for modifying objects: `"Browser:new"`,
`"BrowserContext:new"`, `"Page:new"`, `"Frame:new"`, `"Locator:new"`,
`"FrameLocator:new"` and `"Mouse:new"`.

We'll use `"Page:new"` to add a script to all the pages we create.

```javascript
/// ...

export default function rickrollPlugin() {
  return {
    /// ...

    "Page:new": (page) => {
      page.addInitScript(() => {
        // Execute script only in main frame.
        if (window !== top) {
          return;
        }
        addEventListener("load", () => {
          const iframe = document.createElement("iframe");
          iframe.src = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
          document.body.replaceChildren(iframe);
        });
      });
      return page;
    },
  };
}
```

## `chromium`

Playwright supports multiple browsers (Chromium, Firefox and Webkit). The
`--disable-volume-adjust-sound` option is only available in Chromium. Be sure to
add it only when the plugin is running with Chromium.

Hook functions can have a second argument containing the context. For `"before"`
hooks, it contains the following properties:

- `obj`: the object on which the hook is called (`BrowserType`, `Page`...).
- `prop`: the name of the method on which the hook is called (`"launch"`,
  `""newPage"`...).

In our case, we'll use
[`BrowserType.name()`](https://playwright.dev/docs/api/class-browsertype#browser-type-name)
to determine the browser type. We therefore need to retrieve the `obj` on which
the two hooks are called.

```javascript
const disableVolumeAdjustSound = (options, browserType) => {
  if ("chromium" === browserType.name()) {
    return {
      ...options,
      args: ["--disable-volume-adjust-sound"],
    };
  }
  return options;
};

export default function rickrollPlugin() {
  return {
    "BrowserType.launch:before": (args, { obj: browserType }) => {
      return [disableVolumeAdjustSound(args[0], browserType)];
    },

    "BrowserType.launchPersistentContext:before": (
      args,
      { obj: browserType },
    ) => {
      return [args[0], disableVolumeAdjustSound(args[1], browserType)];
    },

    /// ...
  };
}
```

For `"after"` hooks, the context has a third `args` property: the arguments of
the method on which the hook is called.

## `args`

The plugin overrides the `args` property of the options. But if the user also
uses this property, his arguments will be lost.

The new arguments must therefore be added to the list of arguments (handling the
case where the user has not supplied any `options` or `args`).

```javascript
const disableVolumeAdjustSound = (options, browserType) => {
  if ("chromium" === browserType.name()) {
    return {
      ...options,
      args: ["--disable-volume-adjust-sound", ...(options?.args ?? [])],
    };
  }
  return options;
};

export default function rickrollPlugin() {
  /// ...
}
```

## `options`

The plugin always adds the same video. It is interesting to allow the user to
choose which video to display.

So we need to add an argument to the plugin function to pass in options. We'll
add the `video` property to specify the identifier of a YouTube video. The
options and the property are optional. The default is
[_Never Gonna Give You Up_](https://youtu.be/dQw4w9WgXcQ) video.

```javascript
/// ...

/// Add arguments to provide options to the plugin.
export default function rickrollPlugin(options) {
  /// Handle the case where the user has passed no options and the case where he
  /// has passed an empty object. The default is the Never Gonna Give You Up.
  const video = options?.video ?? "dQw4w9WgXcQ";

  return {
    /// ...

    "Page:new": (page) => {
      page.addInitScript((video) => {
        // Execute script only in main frame.
        if (window !== top) {
          return;
        }
        addEventListener("load", () => {
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.youtube-nocookie.com/embed/${video}`;
          document.body.replaceChildren(iframe);
        });
      }, video);
      return page;
    },
  };
}
```

## Final

Here's the final plugin code.

```javascript
const disableVolumeAdjustSound = (options, browserType) => {
  if ("chromium" === browserType.name()) {
    return {
      ...options,
      args: ["--disable-volume-adjust-sound", ...(options?.args ?? [])],
    };
  }
  return options;
};

export default function rickrollPlugin(options) {
  const video = options?.video ?? "dQw4w9WgXcQ";

  return {
    "BrowserType.launch:before": (args, { obj: browserType }) => {
      return [disableVolumeAdjustSound(args[0], browserType)];
    },

    "BrowserType.launchPersistentContext:before": (
      args,
      { obj: browserType },
    ) => {
      return [args[0], disableVolumeAdjustSound(args[1], browserType)];
    },

    "Page:new": (page) => {
      page.addInitScript((video) => {
        // Execute script only in main frame.
        if (window !== top) {
          return;
        }
        addEventListener("load", () => {
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.youtube-nocookie.com/embed/${video}`;
          document.body.replaceChildren(iframe);
        });
      }, video);
      return page;
    },
  };
}
```
