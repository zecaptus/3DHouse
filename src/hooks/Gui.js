import { useState } from "react";
import { GUI } from "dat.gui";

if (!window.gui) {
  window.gui = new GUI();
  window.__GUI_CONFIG__ = {};
  window.__GUI_SELECTED__ = {};
  window.__GUI_CACHE_DEBUG__ = {};
}

function init(name, debug, params, data, cb) {
  if (!window.__GUI_CONFIG__[name]) {
    window.__GUI_CACHE_DEBUG__[name] = { [debug]: cb };
    window.__GUI_CONFIG__[name] = window.gui.addFolder(name);
    Object.keys(params).forEach(param => {
      const controller = window.__GUI_CONFIG__[name].add(
        data,
        param,
        ...(params[param].args || [])
      );

      controller.onChange(function(value) {
        if (window.__GUI_SELECTED__ === "all") {
          Object.keys(window.__GUI_CACHE_DEBUG__[name]).forEach(key =>
            window.__GUI_CACHE_DEBUG__[name][key]({ ...data, [param]: value })
          );
        } else {
          window.__GUI_CACHE_DEBUG__[name][window.__GUI_SELECTED__]({
            ...data,
            [param]: value
          });
        }
        //cb({ ...data, [param]: value });
      });
    });
  } else {
    if (window.__GUI_CACHE_DEBUG__[name][debug]) return;
    window.__GUI_CACHE_DEBUG__[name][debug] = cb;
    const focusField = window.__GUI_CONFIG__[name].__controllers.find(
      controller => controller.property === "focus"
    );

    if (focusField) {
      focusField.remove();
    } else {
      window.__GUI_SELECTED__ = "all";
    }

    const controller = window.__GUI_CONFIG__[name].add(
      { ...data, focus: "all" },
      "focus",
      ["all", ...Object.keys(window.__GUI_CACHE_DEBUG__[name])]
    );

    controller.onChange(function(value) {
      window.__GUI_SELECTED__ = value;
    });
  }

  return window.__GUI_CONFIG__[name];
}

function useGui(name, params, debug = "none") {
  const defaultValue = Object.keys(params).reduce(
    (acc, param) => ({
      ...acc,
      [param]: params[param].value
    }),
    {}
  );
  const [gui, setGui] = useState(defaultValue);

  init(name, debug, params, { ...gui }, setGui);

  return gui;
}

export default useGui;
