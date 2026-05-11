import { r as reactExports, V as jsxRuntimeExports, U as React } from "./server-vmEPNGJQ.js";
import { r as reactDomExports, L as Link } from "./router-BvjE7Hmm.js";
import { M as MotionConfigContext, i as isHTMLElement$1, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect$1, L as LayoutGroupContext, m as motion } from "./proxy-B-Od97nL.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement$1(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement$1(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement$1(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = children.props?.ref ?? children?.ref;
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      ref.current?.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect$1(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender?.();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && safeToRemove?.();
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes$1,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$8 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$8);
const __iconNode$7 = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode$7);
const __iconNode$6 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function useCombinedRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }
  return reactExports.useMemo(
    () => (node) => {
      refs.forEach((ref) => ref(node));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
const canUseDOM = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
function isWindow(element) {
  const elementString = Object.prototype.toString.call(element);
  return elementString === "[object Window]" || // In Electron context the Window object serializes to [object global]
  elementString === "[object global]";
}
function isNode(node) {
  return "nodeType" in node;
}
function getWindow(target) {
  var _target$ownerDocument, _target$ownerDocument2;
  if (!target) {
    return window;
  }
  if (isWindow(target)) {
    return target;
  }
  if (!isNode(target)) {
    return window;
  }
  return (_target$ownerDocument = (_target$ownerDocument2 = target.ownerDocument) == null ? void 0 : _target$ownerDocument2.defaultView) != null ? _target$ownerDocument : window;
}
function isDocument(node) {
  const {
    Document
  } = getWindow(node);
  return node instanceof Document;
}
function isHTMLElement(node) {
  if (isWindow(node)) {
    return false;
  }
  return node instanceof getWindow(node).HTMLElement;
}
function isSVGElement(node) {
  return node instanceof getWindow(node).SVGElement;
}
function getOwnerDocument(target) {
  if (!target) {
    return document;
  }
  if (isWindow(target)) {
    return target.document;
  }
  if (!isNode(target)) {
    return document;
  }
  if (isDocument(target)) {
    return target;
  }
  if (isHTMLElement(target) || isSVGElement(target)) {
    return target.ownerDocument;
  }
  return document;
}
const useIsomorphicLayoutEffect = canUseDOM ? reactExports.useLayoutEffect : reactExports.useEffect;
function useEvent(handler) {
  const handlerRef = reactExports.useRef(handler);
  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  });
  return reactExports.useCallback(function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return handlerRef.current == null ? void 0 : handlerRef.current(...args);
  }, []);
}
function useInterval() {
  const intervalRef = reactExports.useRef(null);
  const set = reactExports.useCallback((listener, duration) => {
    intervalRef.current = setInterval(listener, duration);
  }, []);
  const clear = reactExports.useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  return [set, clear];
}
function useLatestValue(value, dependencies) {
  if (dependencies === void 0) {
    dependencies = [value];
  }
  const valueRef = reactExports.useRef(value);
  useIsomorphicLayoutEffect(() => {
    if (valueRef.current !== value) {
      valueRef.current = value;
    }
  }, dependencies);
  return valueRef;
}
function useLazyMemo(callback, dependencies) {
  const valueRef = reactExports.useRef();
  return reactExports.useMemo(
    () => {
      const newValue = callback(valueRef.current);
      valueRef.current = newValue;
      return newValue;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...dependencies]
  );
}
function useNodeRef(onChange) {
  const onChangeHandler = useEvent(onChange);
  const node = reactExports.useRef(null);
  const setNodeRef = reactExports.useCallback(
    (element) => {
      if (element !== node.current) {
        onChangeHandler == null ? void 0 : onChangeHandler(element, node.current);
      }
      node.current = element;
    },
    //eslint-disable-next-line
    []
  );
  return [node, setNodeRef];
}
function usePrevious(value) {
  const ref = reactExports.useRef();
  reactExports.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
let ids = {};
function useUniqueId(prefix, value) {
  return reactExports.useMemo(() => {
    if (value) {
      return value;
    }
    const id = ids[prefix] == null ? 0 : ids[prefix] + 1;
    ids[prefix] = id;
    return prefix + "-" + id;
  }, [prefix, value]);
}
function createAdjustmentFn(modifier) {
  return function(object) {
    for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      adjustments[_key - 1] = arguments[_key];
    }
    return adjustments.reduce((accumulator, adjustment) => {
      const entries = Object.entries(adjustment);
      for (const [key, valueAdjustment] of entries) {
        const value = accumulator[key];
        if (value != null) {
          accumulator[key] = value + modifier * valueAdjustment;
        }
      }
      return accumulator;
    }, {
      ...object
    });
  };
}
const add = /* @__PURE__ */ createAdjustmentFn(1);
const subtract = /* @__PURE__ */ createAdjustmentFn(-1);
function hasViewportRelativeCoordinates(event) {
  return "clientX" in event && "clientY" in event;
}
function isKeyboardEvent(event) {
  if (!event) {
    return false;
  }
  const {
    KeyboardEvent
  } = getWindow(event.target);
  return KeyboardEvent && event instanceof KeyboardEvent;
}
function isTouchEvent(event) {
  if (!event) {
    return false;
  }
  const {
    TouchEvent
  } = getWindow(event.target);
  return TouchEvent && event instanceof TouchEvent;
}
function getEventCoordinates(event) {
  if (isTouchEvent(event)) {
    if (event.touches && event.touches.length) {
      const {
        clientX: x,
        clientY: y
      } = event.touches[0];
      return {
        x,
        y
      };
    } else if (event.changedTouches && event.changedTouches.length) {
      const {
        clientX: x,
        clientY: y
      } = event.changedTouches[0];
      return {
        x,
        y
      };
    }
  }
  if (hasViewportRelativeCoordinates(event)) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
  return null;
}
const CSS = /* @__PURE__ */ Object.freeze({
  Translate: {
    toString(transform) {
      if (!transform) {
        return;
      }
      const {
        x,
        y
      } = transform;
      return "translate3d(" + (x ? Math.round(x) : 0) + "px, " + (y ? Math.round(y) : 0) + "px, 0)";
    }
  },
  Scale: {
    toString(transform) {
      if (!transform) {
        return;
      }
      const {
        scaleX,
        scaleY
      } = transform;
      return "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    }
  },
  Transform: {
    toString(transform) {
      if (!transform) {
        return;
      }
      return [CSS.Translate.toString(transform), CSS.Scale.toString(transform)].join(" ");
    }
  },
  Transition: {
    toString(_ref) {
      let {
        property,
        duration,
        easing
      } = _ref;
      return property + " " + duration + "ms " + easing;
    }
  }
});
const SELECTOR = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
function findFirstFocusableNode(element) {
  if (element.matches(SELECTOR)) {
    return element;
  }
  return element.querySelector(SELECTOR);
}
const hiddenStyles = {
  display: "none"
};
function HiddenText(_ref) {
  let {
    id,
    value
  } = _ref;
  return React.createElement("div", {
    id,
    style: hiddenStyles
  }, value);
}
function LiveRegion(_ref) {
  let {
    id,
    announcement,
    ariaLiveType = "assertive"
  } = _ref;
  const visuallyHidden = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    clipPath: "inset(100%)",
    whiteSpace: "nowrap"
  };
  return React.createElement("div", {
    id,
    style: visuallyHidden,
    role: "status",
    "aria-live": ariaLiveType,
    "aria-atomic": true
  }, announcement);
}
function useAnnouncement() {
  const [announcement, setAnnouncement] = reactExports.useState("");
  const announce = reactExports.useCallback((value) => {
    if (value != null) {
      setAnnouncement(value);
    }
  }, []);
  return {
    announce,
    announcement
  };
}
const DndMonitorContext = /* @__PURE__ */ reactExports.createContext(null);
function useDndMonitor(listener) {
  const registerListener = reactExports.useContext(DndMonitorContext);
  reactExports.useEffect(() => {
    if (!registerListener) {
      throw new Error("useDndMonitor must be used within a children of <DndContext>");
    }
    const unsubscribe = registerListener(listener);
    return unsubscribe;
  }, [listener, registerListener]);
}
function useDndMonitorProvider() {
  const [listeners] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const registerListener = reactExports.useCallback((listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [listeners]);
  const dispatch = reactExports.useCallback((_ref) => {
    let {
      type,
      event
    } = _ref;
    listeners.forEach((listener) => {
      var _listener$type;
      return (_listener$type = listener[type]) == null ? void 0 : _listener$type.call(listener, event);
    });
  }, [listeners]);
  return [dispatch, registerListener];
}
const defaultScreenReaderInstructions = {
  draggable: "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  "
};
const defaultAnnouncements = {
  onDragStart(_ref) {
    let {
      active
    } = _ref;
    return "Picked up draggable item " + active.id + ".";
  },
  onDragOver(_ref2) {
    let {
      active,
      over
    } = _ref2;
    if (over) {
      return "Draggable item " + active.id + " was moved over droppable area " + over.id + ".";
    }
    return "Draggable item " + active.id + " is no longer over a droppable area.";
  },
  onDragEnd(_ref3) {
    let {
      active,
      over
    } = _ref3;
    if (over) {
      return "Draggable item " + active.id + " was dropped over droppable area " + over.id;
    }
    return "Draggable item " + active.id + " was dropped.";
  },
  onDragCancel(_ref4) {
    let {
      active
    } = _ref4;
    return "Dragging was cancelled. Draggable item " + active.id + " was dropped.";
  }
};
function Accessibility(_ref) {
  let {
    announcements = defaultAnnouncements,
    container,
    hiddenTextDescribedById,
    screenReaderInstructions = defaultScreenReaderInstructions
  } = _ref;
  const {
    announce,
    announcement
  } = useAnnouncement();
  const liveRegionId = useUniqueId("DndLiveRegion");
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  useDndMonitor(reactExports.useMemo(() => ({
    onDragStart(_ref2) {
      let {
        active
      } = _ref2;
      announce(announcements.onDragStart({
        active
      }));
    },
    onDragMove(_ref3) {
      let {
        active,
        over
      } = _ref3;
      if (announcements.onDragMove) {
        announce(announcements.onDragMove({
          active,
          over
        }));
      }
    },
    onDragOver(_ref4) {
      let {
        active,
        over
      } = _ref4;
      announce(announcements.onDragOver({
        active,
        over
      }));
    },
    onDragEnd(_ref5) {
      let {
        active,
        over
      } = _ref5;
      announce(announcements.onDragEnd({
        active,
        over
      }));
    },
    onDragCancel(_ref6) {
      let {
        active,
        over
      } = _ref6;
      announce(announcements.onDragCancel({
        active,
        over
      }));
    }
  }), [announce, announcements]));
  if (!mounted) {
    return null;
  }
  const markup = React.createElement(React.Fragment, null, React.createElement(HiddenText, {
    id: hiddenTextDescribedById,
    value: screenReaderInstructions.draggable
  }), React.createElement(LiveRegion, {
    id: liveRegionId,
    announcement
  }));
  return container ? reactDomExports.createPortal(markup, container) : markup;
}
var Action;
(function(Action2) {
  Action2["DragStart"] = "dragStart";
  Action2["DragMove"] = "dragMove";
  Action2["DragEnd"] = "dragEnd";
  Action2["DragCancel"] = "dragCancel";
  Action2["DragOver"] = "dragOver";
  Action2["RegisterDroppable"] = "registerDroppable";
  Action2["SetDroppableDisabled"] = "setDroppableDisabled";
  Action2["UnregisterDroppable"] = "unregisterDroppable";
})(Action || (Action = {}));
function noop() {
}
function useSensor(sensor, options) {
  return reactExports.useMemo(
    () => ({
      sensor,
      options: options != null ? options : {}
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sensor, options]
  );
}
function useSensors() {
  for (var _len = arguments.length, sensors = new Array(_len), _key = 0; _key < _len; _key++) {
    sensors[_key] = arguments[_key];
  }
  return reactExports.useMemo(
    () => [...sensors].filter((sensor) => sensor != null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...sensors]
  );
}
const defaultCoordinates = /* @__PURE__ */ Object.freeze({
  x: 0,
  y: 0
});
function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
function sortCollisionsAsc(_ref, _ref2) {
  let {
    data: {
      value: a
    }
  } = _ref;
  let {
    data: {
      value: b
    }
  } = _ref2;
  return a - b;
}
function sortCollisionsDesc(_ref3, _ref4) {
  let {
    data: {
      value: a
    }
  } = _ref3;
  let {
    data: {
      value: b
    }
  } = _ref4;
  return b - a;
}
function getFirstCollision(collisions, property) {
  if (!collisions || collisions.length === 0) {
    return null;
  }
  const [firstCollision] = collisions;
  return firstCollision[property];
}
function centerOfRectangle(rect, left, top) {
  if (left === void 0) {
    left = rect.left;
  }
  if (top === void 0) {
    top = rect.top;
  }
  return {
    x: left + rect.width * 0.5,
    y: top + rect.height * 0.5
  };
}
const closestCenter = (_ref) => {
  let {
    collisionRect,
    droppableRects,
    droppableContainers
  } = _ref;
  const centerRect = centerOfRectangle(collisionRect, collisionRect.left, collisionRect.top);
  const collisions = [];
  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);
    if (rect) {
      const distBetween = distanceBetween(centerOfRectangle(rect), centerRect);
      collisions.push({
        id,
        data: {
          droppableContainer,
          value: distBetween
        }
      });
    }
  }
  return collisions.sort(sortCollisionsAsc);
};
function getIntersectionRatio(entry, target) {
  const top = Math.max(target.top, entry.top);
  const left = Math.max(target.left, entry.left);
  const right = Math.min(target.left + target.width, entry.left + entry.width);
  const bottom = Math.min(target.top + target.height, entry.top + entry.height);
  const width = right - left;
  const height = bottom - top;
  if (left < right && top < bottom) {
    const targetArea = target.width * target.height;
    const entryArea = entry.width * entry.height;
    const intersectionArea = width * height;
    const intersectionRatio = intersectionArea / (targetArea + entryArea - intersectionArea);
    return Number(intersectionRatio.toFixed(4));
  }
  return 0;
}
const rectIntersection = (_ref) => {
  let {
    collisionRect,
    droppableRects,
    droppableContainers
  } = _ref;
  const collisions = [];
  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);
    if (rect) {
      const intersectionRatio = getIntersectionRatio(rect, collisionRect);
      if (intersectionRatio > 0) {
        collisions.push({
          id,
          data: {
            droppableContainer,
            value: intersectionRatio
          }
        });
      }
    }
  }
  return collisions.sort(sortCollisionsDesc);
};
function adjustScale(transform, rect1, rect2) {
  return {
    ...transform,
    scaleX: rect1 && rect2 ? rect1.width / rect2.width : 1,
    scaleY: rect1 && rect2 ? rect1.height / rect2.height : 1
  };
}
function getRectDelta(rect1, rect2) {
  return rect1 && rect2 ? {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top
  } : defaultCoordinates;
}
function createRectAdjustmentFn(modifier) {
  return function adjustClientRect(rect) {
    for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      adjustments[_key - 1] = arguments[_key];
    }
    return adjustments.reduce((acc, adjustment) => ({
      ...acc,
      top: acc.top + modifier * adjustment.y,
      bottom: acc.bottom + modifier * adjustment.y,
      left: acc.left + modifier * adjustment.x,
      right: acc.right + modifier * adjustment.x
    }), {
      ...rect
    });
  };
}
const getAdjustedRect = /* @__PURE__ */ createRectAdjustmentFn(1);
function parseTransform(transform) {
  if (transform.startsWith("matrix3d(")) {
    const transformArray = transform.slice(9, -1).split(/, /);
    return {
      x: +transformArray[12],
      y: +transformArray[13],
      scaleX: +transformArray[0],
      scaleY: +transformArray[5]
    };
  } else if (transform.startsWith("matrix(")) {
    const transformArray = transform.slice(7, -1).split(/, /);
    return {
      x: +transformArray[4],
      y: +transformArray[5],
      scaleX: +transformArray[0],
      scaleY: +transformArray[3]
    };
  }
  return null;
}
function inverseTransform(rect, transform, transformOrigin) {
  const parsedTransform = parseTransform(transform);
  if (!parsedTransform) {
    return rect;
  }
  const {
    scaleX,
    scaleY,
    x: translateX,
    y: translateY
  } = parsedTransform;
  const x = rect.left - translateX - (1 - scaleX) * parseFloat(transformOrigin);
  const y = rect.top - translateY - (1 - scaleY) * parseFloat(transformOrigin.slice(transformOrigin.indexOf(" ") + 1));
  const w = scaleX ? rect.width / scaleX : rect.width;
  const h = scaleY ? rect.height / scaleY : rect.height;
  return {
    width: w,
    height: h,
    top: y,
    right: x + w,
    bottom: y + h,
    left: x
  };
}
const defaultOptions = {
  ignoreTransform: false
};
function getClientRect(element, options) {
  if (options === void 0) {
    options = defaultOptions;
  }
  let rect = element.getBoundingClientRect();
  if (options.ignoreTransform) {
    const {
      transform,
      transformOrigin
    } = getWindow(element).getComputedStyle(element);
    if (transform) {
      rect = inverseTransform(rect, transform, transformOrigin);
    }
  }
  const {
    top,
    left,
    width,
    height,
    bottom,
    right
  } = rect;
  return {
    top,
    left,
    width,
    height,
    bottom,
    right
  };
}
function getTransformAgnosticClientRect(element) {
  return getClientRect(element, {
    ignoreTransform: true
  });
}
function getWindowClientRect(element) {
  const width = element.innerWidth;
  const height = element.innerHeight;
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height
  };
}
function isFixed(node, computedStyle) {
  if (computedStyle === void 0) {
    computedStyle = getWindow(node).getComputedStyle(node);
  }
  return computedStyle.position === "fixed";
}
function isScrollable(element, computedStyle) {
  if (computedStyle === void 0) {
    computedStyle = getWindow(element).getComputedStyle(element);
  }
  const overflowRegex = /(auto|scroll|overlay)/;
  const properties2 = ["overflow", "overflowX", "overflowY"];
  return properties2.some((property) => {
    const value = computedStyle[property];
    return typeof value === "string" ? overflowRegex.test(value) : false;
  });
}
function getScrollableAncestors(element, limit) {
  const scrollParents = [];
  function findScrollableAncestors(node) {
    if (limit != null && scrollParents.length >= limit) {
      return scrollParents;
    }
    if (!node) {
      return scrollParents;
    }
    if (isDocument(node) && node.scrollingElement != null && !scrollParents.includes(node.scrollingElement)) {
      scrollParents.push(node.scrollingElement);
      return scrollParents;
    }
    if (!isHTMLElement(node) || isSVGElement(node)) {
      return scrollParents;
    }
    if (scrollParents.includes(node)) {
      return scrollParents;
    }
    const computedStyle = getWindow(element).getComputedStyle(node);
    if (node !== element) {
      if (isScrollable(node, computedStyle)) {
        scrollParents.push(node);
      }
    }
    if (isFixed(node, computedStyle)) {
      return scrollParents;
    }
    return findScrollableAncestors(node.parentNode);
  }
  if (!element) {
    return scrollParents;
  }
  return findScrollableAncestors(element);
}
function getFirstScrollableAncestor(node) {
  const [firstScrollableAncestor] = getScrollableAncestors(node, 1);
  return firstScrollableAncestor != null ? firstScrollableAncestor : null;
}
function getScrollableElement(element) {
  if (!canUseDOM || !element) {
    return null;
  }
  if (isWindow(element)) {
    return element;
  }
  if (!isNode(element)) {
    return null;
  }
  if (isDocument(element) || element === getOwnerDocument(element).scrollingElement) {
    return window;
  }
  if (isHTMLElement(element)) {
    return element;
  }
  return null;
}
function getScrollXCoordinate(element) {
  if (isWindow(element)) {
    return element.scrollX;
  }
  return element.scrollLeft;
}
function getScrollYCoordinate(element) {
  if (isWindow(element)) {
    return element.scrollY;
  }
  return element.scrollTop;
}
function getScrollCoordinates(element) {
  return {
    x: getScrollXCoordinate(element),
    y: getScrollYCoordinate(element)
  };
}
var Direction;
(function(Direction2) {
  Direction2[Direction2["Forward"] = 1] = "Forward";
  Direction2[Direction2["Backward"] = -1] = "Backward";
})(Direction || (Direction = {}));
function isDocumentScrollingElement(element) {
  if (!canUseDOM || !element) {
    return false;
  }
  return element === document.scrollingElement;
}
function getScrollPosition(scrollingContainer) {
  const minScroll = {
    x: 0,
    y: 0
  };
  const dimensions = isDocumentScrollingElement(scrollingContainer) ? {
    height: window.innerHeight,
    width: window.innerWidth
  } : {
    height: scrollingContainer.clientHeight,
    width: scrollingContainer.clientWidth
  };
  const maxScroll = {
    x: scrollingContainer.scrollWidth - dimensions.width,
    y: scrollingContainer.scrollHeight - dimensions.height
  };
  const isTop = scrollingContainer.scrollTop <= minScroll.y;
  const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
  const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
  const isRight = scrollingContainer.scrollLeft >= maxScroll.x;
  return {
    isTop,
    isLeft,
    isBottom,
    isRight,
    maxScroll,
    minScroll
  };
}
const defaultThreshold = {
  x: 0.2,
  y: 0.2
};
function getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, _ref, acceleration, thresholdPercentage) {
  let {
    top,
    left,
    right,
    bottom
  } = _ref;
  if (acceleration === void 0) {
    acceleration = 10;
  }
  if (thresholdPercentage === void 0) {
    thresholdPercentage = defaultThreshold;
  }
  const {
    isTop,
    isBottom,
    isLeft,
    isRight
  } = getScrollPosition(scrollContainer);
  const direction = {
    x: 0,
    y: 0
  };
  const speed = {
    x: 0,
    y: 0
  };
  const threshold = {
    height: scrollContainerRect.height * thresholdPercentage.y,
    width: scrollContainerRect.width * thresholdPercentage.x
  };
  if (!isTop && top <= scrollContainerRect.top + threshold.height) {
    direction.y = Direction.Backward;
    speed.y = acceleration * Math.abs((scrollContainerRect.top + threshold.height - top) / threshold.height);
  } else if (!isBottom && bottom >= scrollContainerRect.bottom - threshold.height) {
    direction.y = Direction.Forward;
    speed.y = acceleration * Math.abs((scrollContainerRect.bottom - threshold.height - bottom) / threshold.height);
  }
  if (!isRight && right >= scrollContainerRect.right - threshold.width) {
    direction.x = Direction.Forward;
    speed.x = acceleration * Math.abs((scrollContainerRect.right - threshold.width - right) / threshold.width);
  } else if (!isLeft && left <= scrollContainerRect.left + threshold.width) {
    direction.x = Direction.Backward;
    speed.x = acceleration * Math.abs((scrollContainerRect.left + threshold.width - left) / threshold.width);
  }
  return {
    direction,
    speed
  };
}
function getScrollElementRect(element) {
  if (element === document.scrollingElement) {
    const {
      innerWidth,
      innerHeight
    } = window;
    return {
      top: 0,
      left: 0,
      right: innerWidth,
      bottom: innerHeight,
      width: innerWidth,
      height: innerHeight
    };
  }
  const {
    top,
    left,
    right,
    bottom
  } = element.getBoundingClientRect();
  return {
    top,
    left,
    right,
    bottom,
    width: element.clientWidth,
    height: element.clientHeight
  };
}
function getScrollOffsets(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return add(acc, getScrollCoordinates(node));
  }, defaultCoordinates);
}
function getScrollXOffset(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return acc + getScrollXCoordinate(node);
  }, 0);
}
function getScrollYOffset(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return acc + getScrollYCoordinate(node);
  }, 0);
}
function scrollIntoViewIfNeeded(element, measure) {
  if (measure === void 0) {
    measure = getClientRect;
  }
  if (!element) {
    return;
  }
  const {
    top,
    left,
    bottom,
    right
  } = measure(element);
  const firstScrollableAncestor = getFirstScrollableAncestor(element);
  if (!firstScrollableAncestor) {
    return;
  }
  if (bottom <= 0 || right <= 0 || top >= window.innerHeight || left >= window.innerWidth) {
    element.scrollIntoView({
      block: "center",
      inline: "center"
    });
  }
}
const properties = [["x", ["left", "right"], getScrollXOffset], ["y", ["top", "bottom"], getScrollYOffset]];
class Rect {
  constructor(rect, element) {
    this.rect = void 0;
    this.width = void 0;
    this.height = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.right = void 0;
    this.left = void 0;
    const scrollableAncestors = getScrollableAncestors(element);
    const scrollOffsets = getScrollOffsets(scrollableAncestors);
    this.rect = {
      ...rect
    };
    this.width = rect.width;
    this.height = rect.height;
    for (const [axis, keys, getScrollOffset] of properties) {
      for (const key of keys) {
        Object.defineProperty(this, key, {
          get: () => {
            const currentOffsets = getScrollOffset(scrollableAncestors);
            const scrollOffsetsDeltla = scrollOffsets[axis] - currentOffsets;
            return this.rect[key] + scrollOffsetsDeltla;
          },
          enumerable: true
        });
      }
    }
    Object.defineProperty(this, "rect", {
      enumerable: false
    });
  }
}
class Listeners {
  constructor(target) {
    this.target = void 0;
    this.listeners = [];
    this.removeAll = () => {
      this.listeners.forEach((listener) => {
        var _this$target;
        return (_this$target = this.target) == null ? void 0 : _this$target.removeEventListener(...listener);
      });
    };
    this.target = target;
  }
  add(eventName, handler, options) {
    var _this$target2;
    (_this$target2 = this.target) == null ? void 0 : _this$target2.addEventListener(eventName, handler, options);
    this.listeners.push([eventName, handler, options]);
  }
}
function getEventListenerTarget(target) {
  const {
    EventTarget
  } = getWindow(target);
  return target instanceof EventTarget ? target : getOwnerDocument(target);
}
function hasExceededDistance(delta, measurement) {
  const dx = Math.abs(delta.x);
  const dy = Math.abs(delta.y);
  if (typeof measurement === "number") {
    return Math.sqrt(dx ** 2 + dy ** 2) > measurement;
  }
  if ("x" in measurement && "y" in measurement) {
    return dx > measurement.x && dy > measurement.y;
  }
  if ("x" in measurement) {
    return dx > measurement.x;
  }
  if ("y" in measurement) {
    return dy > measurement.y;
  }
  return false;
}
var EventName;
(function(EventName2) {
  EventName2["Click"] = "click";
  EventName2["DragStart"] = "dragstart";
  EventName2["Keydown"] = "keydown";
  EventName2["ContextMenu"] = "contextmenu";
  EventName2["Resize"] = "resize";
  EventName2["SelectionChange"] = "selectionchange";
  EventName2["VisibilityChange"] = "visibilitychange";
})(EventName || (EventName = {}));
function preventDefault(event) {
  event.preventDefault();
}
function stopPropagation(event) {
  event.stopPropagation();
}
var KeyboardCode;
(function(KeyboardCode2) {
  KeyboardCode2["Space"] = "Space";
  KeyboardCode2["Down"] = "ArrowDown";
  KeyboardCode2["Right"] = "ArrowRight";
  KeyboardCode2["Left"] = "ArrowLeft";
  KeyboardCode2["Up"] = "ArrowUp";
  KeyboardCode2["Esc"] = "Escape";
  KeyboardCode2["Enter"] = "Enter";
  KeyboardCode2["Tab"] = "Tab";
})(KeyboardCode || (KeyboardCode = {}));
const defaultKeyboardCodes = {
  start: [KeyboardCode.Space, KeyboardCode.Enter],
  cancel: [KeyboardCode.Esc],
  end: [KeyboardCode.Space, KeyboardCode.Enter, KeyboardCode.Tab]
};
const defaultKeyboardCoordinateGetter = (event, _ref) => {
  let {
    currentCoordinates
  } = _ref;
  switch (event.code) {
    case KeyboardCode.Right:
      return {
        ...currentCoordinates,
        x: currentCoordinates.x + 25
      };
    case KeyboardCode.Left:
      return {
        ...currentCoordinates,
        x: currentCoordinates.x - 25
      };
    case KeyboardCode.Down:
      return {
        ...currentCoordinates,
        y: currentCoordinates.y + 25
      };
    case KeyboardCode.Up:
      return {
        ...currentCoordinates,
        y: currentCoordinates.y - 25
      };
  }
  return void 0;
};
class KeyboardSensor {
  constructor(props) {
    this.props = void 0;
    this.autoScrollEnabled = false;
    this.referenceCoordinates = void 0;
    this.listeners = void 0;
    this.windowListeners = void 0;
    this.props = props;
    const {
      event: {
        target
      }
    } = props;
    this.props = props;
    this.listeners = new Listeners(getOwnerDocument(target));
    this.windowListeners = new Listeners(getWindow(target));
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.attach();
  }
  attach() {
    this.handleStart();
    this.windowListeners.add(EventName.Resize, this.handleCancel);
    this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
    setTimeout(() => this.listeners.add(EventName.Keydown, this.handleKeyDown));
  }
  handleStart() {
    const {
      activeNode,
      onStart
    } = this.props;
    const node = activeNode.node.current;
    if (node) {
      scrollIntoViewIfNeeded(node);
    }
    onStart(defaultCoordinates);
  }
  handleKeyDown(event) {
    if (isKeyboardEvent(event)) {
      const {
        active,
        context,
        options
      } = this.props;
      const {
        keyboardCodes = defaultKeyboardCodes,
        coordinateGetter = defaultKeyboardCoordinateGetter,
        scrollBehavior = "smooth"
      } = options;
      const {
        code
      } = event;
      if (keyboardCodes.end.includes(code)) {
        this.handleEnd(event);
        return;
      }
      if (keyboardCodes.cancel.includes(code)) {
        this.handleCancel(event);
        return;
      }
      const {
        collisionRect
      } = context.current;
      const currentCoordinates = collisionRect ? {
        x: collisionRect.left,
        y: collisionRect.top
      } : defaultCoordinates;
      if (!this.referenceCoordinates) {
        this.referenceCoordinates = currentCoordinates;
      }
      const newCoordinates = coordinateGetter(event, {
        active,
        context: context.current,
        currentCoordinates
      });
      if (newCoordinates) {
        const coordinatesDelta = subtract(newCoordinates, currentCoordinates);
        const scrollDelta = {
          x: 0,
          y: 0
        };
        const {
          scrollableAncestors
        } = context.current;
        for (const scrollContainer of scrollableAncestors) {
          const direction = event.code;
          const {
            isTop,
            isRight,
            isLeft,
            isBottom,
            maxScroll,
            minScroll
          } = getScrollPosition(scrollContainer);
          const scrollElementRect = getScrollElementRect(scrollContainer);
          const clampedCoordinates = {
            x: Math.min(direction === KeyboardCode.Right ? scrollElementRect.right - scrollElementRect.width / 2 : scrollElementRect.right, Math.max(direction === KeyboardCode.Right ? scrollElementRect.left : scrollElementRect.left + scrollElementRect.width / 2, newCoordinates.x)),
            y: Math.min(direction === KeyboardCode.Down ? scrollElementRect.bottom - scrollElementRect.height / 2 : scrollElementRect.bottom, Math.max(direction === KeyboardCode.Down ? scrollElementRect.top : scrollElementRect.top + scrollElementRect.height / 2, newCoordinates.y))
          };
          const canScrollX = direction === KeyboardCode.Right && !isRight || direction === KeyboardCode.Left && !isLeft;
          const canScrollY = direction === KeyboardCode.Down && !isBottom || direction === KeyboardCode.Up && !isTop;
          if (canScrollX && clampedCoordinates.x !== newCoordinates.x) {
            const newScrollCoordinates = scrollContainer.scrollLeft + coordinatesDelta.x;
            const canScrollToNewCoordinates = direction === KeyboardCode.Right && newScrollCoordinates <= maxScroll.x || direction === KeyboardCode.Left && newScrollCoordinates >= minScroll.x;
            if (canScrollToNewCoordinates && !coordinatesDelta.y) {
              scrollContainer.scrollTo({
                left: newScrollCoordinates,
                behavior: scrollBehavior
              });
              return;
            }
            if (canScrollToNewCoordinates) {
              scrollDelta.x = scrollContainer.scrollLeft - newScrollCoordinates;
            } else {
              scrollDelta.x = direction === KeyboardCode.Right ? scrollContainer.scrollLeft - maxScroll.x : scrollContainer.scrollLeft - minScroll.x;
            }
            if (scrollDelta.x) {
              scrollContainer.scrollBy({
                left: -scrollDelta.x,
                behavior: scrollBehavior
              });
            }
            break;
          } else if (canScrollY && clampedCoordinates.y !== newCoordinates.y) {
            const newScrollCoordinates = scrollContainer.scrollTop + coordinatesDelta.y;
            const canScrollToNewCoordinates = direction === KeyboardCode.Down && newScrollCoordinates <= maxScroll.y || direction === KeyboardCode.Up && newScrollCoordinates >= minScroll.y;
            if (canScrollToNewCoordinates && !coordinatesDelta.x) {
              scrollContainer.scrollTo({
                top: newScrollCoordinates,
                behavior: scrollBehavior
              });
              return;
            }
            if (canScrollToNewCoordinates) {
              scrollDelta.y = scrollContainer.scrollTop - newScrollCoordinates;
            } else {
              scrollDelta.y = direction === KeyboardCode.Down ? scrollContainer.scrollTop - maxScroll.y : scrollContainer.scrollTop - minScroll.y;
            }
            if (scrollDelta.y) {
              scrollContainer.scrollBy({
                top: -scrollDelta.y,
                behavior: scrollBehavior
              });
            }
            break;
          }
        }
        this.handleMove(event, add(subtract(newCoordinates, this.referenceCoordinates), scrollDelta));
      }
    }
  }
  handleMove(event, coordinates) {
    const {
      onMove
    } = this.props;
    event.preventDefault();
    onMove(coordinates);
  }
  handleEnd(event) {
    const {
      onEnd
    } = this.props;
    event.preventDefault();
    this.detach();
    onEnd();
  }
  handleCancel(event) {
    const {
      onCancel
    } = this.props;
    event.preventDefault();
    this.detach();
    onCancel();
  }
  detach() {
    this.listeners.removeAll();
    this.windowListeners.removeAll();
  }
}
KeyboardSensor.activators = [{
  eventName: "onKeyDown",
  handler: (event, _ref, _ref2) => {
    let {
      keyboardCodes = defaultKeyboardCodes,
      onActivation
    } = _ref;
    let {
      active
    } = _ref2;
    const {
      code
    } = event.nativeEvent;
    if (keyboardCodes.start.includes(code)) {
      const activator = active.activatorNode.current;
      if (activator && event.target !== activator) {
        return false;
      }
      event.preventDefault();
      onActivation == null ? void 0 : onActivation({
        event: event.nativeEvent
      });
      return true;
    }
    return false;
  }
}];
function isDistanceConstraint(constraint) {
  return Boolean(constraint && "distance" in constraint);
}
function isDelayConstraint(constraint) {
  return Boolean(constraint && "delay" in constraint);
}
class AbstractPointerSensor {
  constructor(props, events2, listenerTarget) {
    var _getEventCoordinates;
    if (listenerTarget === void 0) {
      listenerTarget = getEventListenerTarget(props.event.target);
    }
    this.props = void 0;
    this.events = void 0;
    this.autoScrollEnabled = true;
    this.document = void 0;
    this.activated = false;
    this.initialCoordinates = void 0;
    this.timeoutId = null;
    this.listeners = void 0;
    this.documentListeners = void 0;
    this.windowListeners = void 0;
    this.props = props;
    this.events = events2;
    const {
      event
    } = props;
    const {
      target
    } = event;
    this.props = props;
    this.events = events2;
    this.document = getOwnerDocument(target);
    this.documentListeners = new Listeners(this.document);
    this.listeners = new Listeners(listenerTarget);
    this.windowListeners = new Listeners(getWindow(target));
    this.initialCoordinates = (_getEventCoordinates = getEventCoordinates(event)) != null ? _getEventCoordinates : defaultCoordinates;
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.removeTextSelection = this.removeTextSelection.bind(this);
    this.attach();
  }
  attach() {
    const {
      events: events2,
      props: {
        options: {
          activationConstraint,
          bypassActivationConstraint
        }
      }
    } = this;
    this.listeners.add(events2.move.name, this.handleMove, {
      passive: false
    });
    this.listeners.add(events2.end.name, this.handleEnd);
    if (events2.cancel) {
      this.listeners.add(events2.cancel.name, this.handleCancel);
    }
    this.windowListeners.add(EventName.Resize, this.handleCancel);
    this.windowListeners.add(EventName.DragStart, preventDefault);
    this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
    this.windowListeners.add(EventName.ContextMenu, preventDefault);
    this.documentListeners.add(EventName.Keydown, this.handleKeydown);
    if (activationConstraint) {
      if (bypassActivationConstraint != null && bypassActivationConstraint({
        event: this.props.event,
        activeNode: this.props.activeNode,
        options: this.props.options
      })) {
        return this.handleStart();
      }
      if (isDelayConstraint(activationConstraint)) {
        this.timeoutId = setTimeout(this.handleStart, activationConstraint.delay);
        this.handlePending(activationConstraint);
        return;
      }
      if (isDistanceConstraint(activationConstraint)) {
        this.handlePending(activationConstraint);
        return;
      }
    }
    this.handleStart();
  }
  detach() {
    this.listeners.removeAll();
    this.windowListeners.removeAll();
    setTimeout(this.documentListeners.removeAll, 50);
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  handlePending(constraint, offset) {
    const {
      active,
      onPending
    } = this.props;
    onPending(active, constraint, this.initialCoordinates, offset);
  }
  handleStart() {
    const {
      initialCoordinates
    } = this;
    const {
      onStart
    } = this.props;
    if (initialCoordinates) {
      this.activated = true;
      this.documentListeners.add(EventName.Click, stopPropagation, {
        capture: true
      });
      this.removeTextSelection();
      this.documentListeners.add(EventName.SelectionChange, this.removeTextSelection);
      onStart(initialCoordinates);
    }
  }
  handleMove(event) {
    var _getEventCoordinates2;
    const {
      activated,
      initialCoordinates,
      props
    } = this;
    const {
      onMove,
      options: {
        activationConstraint
      }
    } = props;
    if (!initialCoordinates) {
      return;
    }
    const coordinates = (_getEventCoordinates2 = getEventCoordinates(event)) != null ? _getEventCoordinates2 : defaultCoordinates;
    const delta = subtract(initialCoordinates, coordinates);
    if (!activated && activationConstraint) {
      if (isDistanceConstraint(activationConstraint)) {
        if (activationConstraint.tolerance != null && hasExceededDistance(delta, activationConstraint.tolerance)) {
          return this.handleCancel();
        }
        if (hasExceededDistance(delta, activationConstraint.distance)) {
          return this.handleStart();
        }
      }
      if (isDelayConstraint(activationConstraint)) {
        if (hasExceededDistance(delta, activationConstraint.tolerance)) {
          return this.handleCancel();
        }
      }
      this.handlePending(activationConstraint, delta);
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    onMove(coordinates);
  }
  handleEnd() {
    const {
      onAbort,
      onEnd
    } = this.props;
    this.detach();
    if (!this.activated) {
      onAbort(this.props.active);
    }
    onEnd();
  }
  handleCancel() {
    const {
      onAbort,
      onCancel
    } = this.props;
    this.detach();
    if (!this.activated) {
      onAbort(this.props.active);
    }
    onCancel();
  }
  handleKeydown(event) {
    if (event.code === KeyboardCode.Esc) {
      this.handleCancel();
    }
  }
  removeTextSelection() {
    var _this$document$getSel;
    (_this$document$getSel = this.document.getSelection()) == null ? void 0 : _this$document$getSel.removeAllRanges();
  }
}
const events = {
  cancel: {
    name: "pointercancel"
  },
  move: {
    name: "pointermove"
  },
  end: {
    name: "pointerup"
  }
};
class PointerSensor extends AbstractPointerSensor {
  constructor(props) {
    const {
      event
    } = props;
    const listenerTarget = getOwnerDocument(event.target);
    super(props, events, listenerTarget);
  }
}
PointerSensor.activators = [{
  eventName: "onPointerDown",
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;
    if (!event.isPrimary || event.button !== 0) {
      return false;
    }
    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];
const events$1 = {
  move: {
    name: "mousemove"
  },
  end: {
    name: "mouseup"
  }
};
var MouseButton;
(function(MouseButton2) {
  MouseButton2[MouseButton2["RightClick"] = 2] = "RightClick";
})(MouseButton || (MouseButton = {}));
class MouseSensor extends AbstractPointerSensor {
  constructor(props) {
    super(props, events$1, getOwnerDocument(props.event.target));
  }
}
MouseSensor.activators = [{
  eventName: "onMouseDown",
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;
    if (event.button === MouseButton.RightClick) {
      return false;
    }
    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];
const events$2 = {
  cancel: {
    name: "touchcancel"
  },
  move: {
    name: "touchmove"
  },
  end: {
    name: "touchend"
  }
};
class TouchSensor extends AbstractPointerSensor {
  constructor(props) {
    super(props, events$2);
  }
  static setup() {
    window.addEventListener(events$2.move.name, noop2, {
      capture: false,
      passive: false
    });
    return function teardown() {
      window.removeEventListener(events$2.move.name, noop2);
    };
    function noop2() {
    }
  }
}
TouchSensor.activators = [{
  eventName: "onTouchStart",
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;
    const {
      touches
    } = event;
    if (touches.length > 1) {
      return false;
    }
    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];
var AutoScrollActivator;
(function(AutoScrollActivator2) {
  AutoScrollActivator2[AutoScrollActivator2["Pointer"] = 0] = "Pointer";
  AutoScrollActivator2[AutoScrollActivator2["DraggableRect"] = 1] = "DraggableRect";
})(AutoScrollActivator || (AutoScrollActivator = {}));
var TraversalOrder;
(function(TraversalOrder2) {
  TraversalOrder2[TraversalOrder2["TreeOrder"] = 0] = "TreeOrder";
  TraversalOrder2[TraversalOrder2["ReversedTreeOrder"] = 1] = "ReversedTreeOrder";
})(TraversalOrder || (TraversalOrder = {}));
function useAutoScroller(_ref) {
  let {
    acceleration,
    activator = AutoScrollActivator.Pointer,
    canScroll,
    draggingRect,
    enabled,
    interval = 5,
    order = TraversalOrder.TreeOrder,
    pointerCoordinates,
    scrollableAncestors,
    scrollableAncestorRects,
    delta,
    threshold
  } = _ref;
  const scrollIntent = useScrollIntent({
    delta,
    disabled: !enabled
  });
  const [setAutoScrollInterval, clearAutoScrollInterval] = useInterval();
  const scrollSpeed = reactExports.useRef({
    x: 0,
    y: 0
  });
  const scrollDirection = reactExports.useRef({
    x: 0,
    y: 0
  });
  const rect = reactExports.useMemo(() => {
    switch (activator) {
      case AutoScrollActivator.Pointer:
        return pointerCoordinates ? {
          top: pointerCoordinates.y,
          bottom: pointerCoordinates.y,
          left: pointerCoordinates.x,
          right: pointerCoordinates.x
        } : null;
      case AutoScrollActivator.DraggableRect:
        return draggingRect;
    }
  }, [activator, draggingRect, pointerCoordinates]);
  const scrollContainerRef = reactExports.useRef(null);
  const autoScroll = reactExports.useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }
    const scrollLeft = scrollSpeed.current.x * scrollDirection.current.x;
    const scrollTop = scrollSpeed.current.y * scrollDirection.current.y;
    scrollContainer.scrollBy(scrollLeft, scrollTop);
  }, []);
  const sortedScrollableAncestors = reactExports.useMemo(() => order === TraversalOrder.TreeOrder ? [...scrollableAncestors].reverse() : scrollableAncestors, [order, scrollableAncestors]);
  reactExports.useEffect(
    () => {
      if (!enabled || !scrollableAncestors.length || !rect) {
        clearAutoScrollInterval();
        return;
      }
      for (const scrollContainer of sortedScrollableAncestors) {
        if ((canScroll == null ? void 0 : canScroll(scrollContainer)) === false) {
          continue;
        }
        const index = scrollableAncestors.indexOf(scrollContainer);
        const scrollContainerRect = scrollableAncestorRects[index];
        if (!scrollContainerRect) {
          continue;
        }
        const {
          direction,
          speed
        } = getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, rect, acceleration, threshold);
        for (const axis of ["x", "y"]) {
          if (!scrollIntent[axis][direction[axis]]) {
            speed[axis] = 0;
            direction[axis] = 0;
          }
        }
        if (speed.x > 0 || speed.y > 0) {
          clearAutoScrollInterval();
          scrollContainerRef.current = scrollContainer;
          setAutoScrollInterval(autoScroll, interval);
          scrollSpeed.current = speed;
          scrollDirection.current = direction;
          return;
        }
      }
      scrollSpeed.current = {
        x: 0,
        y: 0
      };
      scrollDirection.current = {
        x: 0,
        y: 0
      };
      clearAutoScrollInterval();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      acceleration,
      autoScroll,
      canScroll,
      clearAutoScrollInterval,
      enabled,
      interval,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(rect),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(scrollIntent),
      setAutoScrollInterval,
      scrollableAncestors,
      sortedScrollableAncestors,
      scrollableAncestorRects,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(threshold)
    ]
  );
}
const defaultScrollIntent = {
  x: {
    [Direction.Backward]: false,
    [Direction.Forward]: false
  },
  y: {
    [Direction.Backward]: false,
    [Direction.Forward]: false
  }
};
function useScrollIntent(_ref2) {
  let {
    delta,
    disabled
  } = _ref2;
  const previousDelta = usePrevious(delta);
  return useLazyMemo((previousIntent) => {
    if (disabled || !previousDelta || !previousIntent) {
      return defaultScrollIntent;
    }
    const direction = {
      x: Math.sign(delta.x - previousDelta.x),
      y: Math.sign(delta.y - previousDelta.y)
    };
    return {
      x: {
        [Direction.Backward]: previousIntent.x[Direction.Backward] || direction.x === -1,
        [Direction.Forward]: previousIntent.x[Direction.Forward] || direction.x === 1
      },
      y: {
        [Direction.Backward]: previousIntent.y[Direction.Backward] || direction.y === -1,
        [Direction.Forward]: previousIntent.y[Direction.Forward] || direction.y === 1
      }
    };
  }, [disabled, delta, previousDelta]);
}
function useCachedNode(draggableNodes, id) {
  const draggableNode = id != null ? draggableNodes.get(id) : void 0;
  const node = draggableNode ? draggableNode.node.current : null;
  return useLazyMemo((cachedNode) => {
    var _ref;
    if (id == null) {
      return null;
    }
    return (_ref = node != null ? node : cachedNode) != null ? _ref : null;
  }, [node, id]);
}
function useCombineActivators(sensors, getSyntheticHandler) {
  return reactExports.useMemo(() => sensors.reduce((accumulator, sensor) => {
    const {
      sensor: Sensor
    } = sensor;
    const sensorActivators = Sensor.activators.map((activator) => ({
      eventName: activator.eventName,
      handler: getSyntheticHandler(activator.handler, sensor)
    }));
    return [...accumulator, ...sensorActivators];
  }, []), [sensors, getSyntheticHandler]);
}
var MeasuringStrategy;
(function(MeasuringStrategy2) {
  MeasuringStrategy2[MeasuringStrategy2["Always"] = 0] = "Always";
  MeasuringStrategy2[MeasuringStrategy2["BeforeDragging"] = 1] = "BeforeDragging";
  MeasuringStrategy2[MeasuringStrategy2["WhileDragging"] = 2] = "WhileDragging";
})(MeasuringStrategy || (MeasuringStrategy = {}));
var MeasuringFrequency;
(function(MeasuringFrequency2) {
  MeasuringFrequency2["Optimized"] = "optimized";
})(MeasuringFrequency || (MeasuringFrequency = {}));
const defaultValue = /* @__PURE__ */ new Map();
function useDroppableMeasuring(containers, _ref) {
  let {
    dragging,
    dependencies,
    config
  } = _ref;
  const [queue, setQueue] = reactExports.useState(null);
  const {
    frequency,
    measure,
    strategy
  } = config;
  const containersRef = reactExports.useRef(containers);
  const disabled = isDisabled();
  const disabledRef = useLatestValue(disabled);
  const measureDroppableContainers = reactExports.useCallback(function(ids2) {
    if (ids2 === void 0) {
      ids2 = [];
    }
    if (disabledRef.current) {
      return;
    }
    setQueue((value) => {
      if (value === null) {
        return ids2;
      }
      return value.concat(ids2.filter((id) => !value.includes(id)));
    });
  }, [disabledRef]);
  const timeoutId = reactExports.useRef(null);
  const droppableRects = useLazyMemo((previousValue) => {
    if (disabled && !dragging) {
      return defaultValue;
    }
    if (!previousValue || previousValue === defaultValue || containersRef.current !== containers || queue != null) {
      const map = /* @__PURE__ */ new Map();
      for (let container of containers) {
        if (!container) {
          continue;
        }
        if (queue && queue.length > 0 && !queue.includes(container.id) && container.rect.current) {
          map.set(container.id, container.rect.current);
          continue;
        }
        const node = container.node.current;
        const rect = node ? new Rect(measure(node), node) : null;
        container.rect.current = rect;
        if (rect) {
          map.set(container.id, rect);
        }
      }
      return map;
    }
    return previousValue;
  }, [containers, queue, dragging, disabled, measure]);
  reactExports.useEffect(() => {
    containersRef.current = containers;
  }, [containers]);
  reactExports.useEffect(
    () => {
      if (disabled) {
        return;
      }
      measureDroppableContainers();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dragging, disabled]
  );
  reactExports.useEffect(
    () => {
      if (queue && queue.length > 0) {
        setQueue(null);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(queue)]
  );
  reactExports.useEffect(
    () => {
      if (disabled || typeof frequency !== "number" || timeoutId.current !== null) {
        return;
      }
      timeoutId.current = setTimeout(() => {
        measureDroppableContainers();
        timeoutId.current = null;
      }, frequency);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frequency, disabled, measureDroppableContainers, ...dependencies]
  );
  return {
    droppableRects,
    measureDroppableContainers,
    measuringScheduled: queue != null
  };
  function isDisabled() {
    switch (strategy) {
      case MeasuringStrategy.Always:
        return false;
      case MeasuringStrategy.BeforeDragging:
        return dragging;
      default:
        return !dragging;
    }
  }
}
function useInitialValue(value, computeFn) {
  return useLazyMemo((previousValue) => {
    if (!value) {
      return null;
    }
    if (previousValue) {
      return previousValue;
    }
    return typeof computeFn === "function" ? computeFn(value) : value;
  }, [computeFn, value]);
}
function useInitialRect(node, measure) {
  return useInitialValue(node, measure);
}
function useMutationObserver(_ref) {
  let {
    callback,
    disabled
  } = _ref;
  const handleMutations = useEvent(callback);
  const mutationObserver = reactExports.useMemo(() => {
    if (disabled || typeof window === "undefined" || typeof window.MutationObserver === "undefined") {
      return void 0;
    }
    const {
      MutationObserver
    } = window;
    return new MutationObserver(handleMutations);
  }, [handleMutations, disabled]);
  reactExports.useEffect(() => {
    return () => mutationObserver == null ? void 0 : mutationObserver.disconnect();
  }, [mutationObserver]);
  return mutationObserver;
}
function useResizeObserver(_ref) {
  let {
    callback,
    disabled
  } = _ref;
  const handleResize = useEvent(callback);
  const resizeObserver = reactExports.useMemo(
    () => {
      if (disabled || typeof window === "undefined" || typeof window.ResizeObserver === "undefined") {
        return void 0;
      }
      const {
        ResizeObserver
      } = window;
      return new ResizeObserver(handleResize);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled]
  );
  reactExports.useEffect(() => {
    return () => resizeObserver == null ? void 0 : resizeObserver.disconnect();
  }, [resizeObserver]);
  return resizeObserver;
}
function defaultMeasure(element) {
  return new Rect(getClientRect(element), element);
}
function useRect(element, measure, fallbackRect) {
  if (measure === void 0) {
    measure = defaultMeasure;
  }
  const [rect, setRect] = reactExports.useState(null);
  function measureRect() {
    setRect((currentRect) => {
      if (!element) {
        return null;
      }
      if (element.isConnected === false) {
        var _ref;
        return (_ref = currentRect != null ? currentRect : fallbackRect) != null ? _ref : null;
      }
      const newRect = measure(element);
      if (JSON.stringify(currentRect) === JSON.stringify(newRect)) {
        return currentRect;
      }
      return newRect;
    });
  }
  const mutationObserver = useMutationObserver({
    callback(records) {
      if (!element) {
        return;
      }
      for (const record of records) {
        const {
          type,
          target
        } = record;
        if (type === "childList" && target instanceof HTMLElement && target.contains(element)) {
          measureRect();
          break;
        }
      }
    }
  });
  const resizeObserver = useResizeObserver({
    callback: measureRect
  });
  useIsomorphicLayoutEffect(() => {
    measureRect();
    if (element) {
      resizeObserver == null ? void 0 : resizeObserver.observe(element);
      mutationObserver == null ? void 0 : mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      mutationObserver == null ? void 0 : mutationObserver.disconnect();
    }
  }, [element]);
  return rect;
}
function useRectDelta(rect) {
  const initialRect = useInitialValue(rect);
  return getRectDelta(rect, initialRect);
}
const defaultValue$1 = [];
function useScrollableAncestors(node) {
  const previousNode = reactExports.useRef(node);
  const ancestors = useLazyMemo((previousValue) => {
    if (!node) {
      return defaultValue$1;
    }
    if (previousValue && previousValue !== defaultValue$1 && node && previousNode.current && node.parentNode === previousNode.current.parentNode) {
      return previousValue;
    }
    return getScrollableAncestors(node);
  }, [node]);
  reactExports.useEffect(() => {
    previousNode.current = node;
  }, [node]);
  return ancestors;
}
function useScrollOffsets(elements) {
  const [scrollCoordinates, setScrollCoordinates] = reactExports.useState(null);
  const prevElements = reactExports.useRef(elements);
  const handleScroll = reactExports.useCallback((event) => {
    const scrollingElement = getScrollableElement(event.target);
    if (!scrollingElement) {
      return;
    }
    setScrollCoordinates((scrollCoordinates2) => {
      if (!scrollCoordinates2) {
        return null;
      }
      scrollCoordinates2.set(scrollingElement, getScrollCoordinates(scrollingElement));
      return new Map(scrollCoordinates2);
    });
  }, []);
  reactExports.useEffect(() => {
    const previousElements = prevElements.current;
    if (elements !== previousElements) {
      cleanup(previousElements);
      const entries = elements.map((element) => {
        const scrollableElement = getScrollableElement(element);
        if (scrollableElement) {
          scrollableElement.addEventListener("scroll", handleScroll, {
            passive: true
          });
          return [scrollableElement, getScrollCoordinates(scrollableElement)];
        }
        return null;
      }).filter((entry) => entry != null);
      setScrollCoordinates(entries.length ? new Map(entries) : null);
      prevElements.current = elements;
    }
    return () => {
      cleanup(elements);
      cleanup(previousElements);
    };
    function cleanup(elements2) {
      elements2.forEach((element) => {
        const scrollableElement = getScrollableElement(element);
        scrollableElement == null ? void 0 : scrollableElement.removeEventListener("scroll", handleScroll);
      });
    }
  }, [handleScroll, elements]);
  return reactExports.useMemo(() => {
    if (elements.length) {
      return scrollCoordinates ? Array.from(scrollCoordinates.values()).reduce((acc, coordinates) => add(acc, coordinates), defaultCoordinates) : getScrollOffsets(elements);
    }
    return defaultCoordinates;
  }, [elements, scrollCoordinates]);
}
function useScrollOffsetsDelta(scrollOffsets, dependencies) {
  if (dependencies === void 0) {
    dependencies = [];
  }
  const initialScrollOffsets = reactExports.useRef(null);
  reactExports.useEffect(
    () => {
      initialScrollOffsets.current = null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );
  reactExports.useEffect(() => {
    const hasScrollOffsets = scrollOffsets !== defaultCoordinates;
    if (hasScrollOffsets && !initialScrollOffsets.current) {
      initialScrollOffsets.current = scrollOffsets;
    }
    if (!hasScrollOffsets && initialScrollOffsets.current) {
      initialScrollOffsets.current = null;
    }
  }, [scrollOffsets]);
  return initialScrollOffsets.current ? subtract(scrollOffsets, initialScrollOffsets.current) : defaultCoordinates;
}
function useSensorSetup(sensors) {
  reactExports.useEffect(
    () => {
      if (!canUseDOM) {
        return;
      }
      const teardownFns = sensors.map((_ref) => {
        let {
          sensor
        } = _ref;
        return sensor.setup == null ? void 0 : sensor.setup();
      });
      return () => {
        for (const teardown of teardownFns) {
          teardown == null ? void 0 : teardown();
        }
      };
    },
    // TO-DO: Sensors length could theoretically change which would not be a valid dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
    sensors.map((_ref2) => {
      let {
        sensor
      } = _ref2;
      return sensor;
    })
  );
}
function useSyntheticListeners(listeners, id) {
  return reactExports.useMemo(() => {
    return listeners.reduce((acc, _ref) => {
      let {
        eventName,
        handler
      } = _ref;
      acc[eventName] = (event) => {
        handler(event, id);
      };
      return acc;
    }, {});
  }, [listeners, id]);
}
function useWindowRect(element) {
  return reactExports.useMemo(() => element ? getWindowClientRect(element) : null, [element]);
}
const defaultValue$2 = [];
function useRects(elements, measure) {
  if (measure === void 0) {
    measure = getClientRect;
  }
  const [firstElement] = elements;
  const windowRect = useWindowRect(firstElement ? getWindow(firstElement) : null);
  const [rects, setRects] = reactExports.useState(defaultValue$2);
  function measureRects() {
    setRects(() => {
      if (!elements.length) {
        return defaultValue$2;
      }
      return elements.map((element) => isDocumentScrollingElement(element) ? windowRect : new Rect(measure(element), element));
    });
  }
  const resizeObserver = useResizeObserver({
    callback: measureRects
  });
  useIsomorphicLayoutEffect(() => {
    resizeObserver == null ? void 0 : resizeObserver.disconnect();
    measureRects();
    elements.forEach((element) => resizeObserver == null ? void 0 : resizeObserver.observe(element));
  }, [elements]);
  return rects;
}
function getMeasurableNode(node) {
  if (!node) {
    return null;
  }
  if (node.children.length > 1) {
    return node;
  }
  const firstChild = node.children[0];
  return isHTMLElement(firstChild) ? firstChild : node;
}
function useDragOverlayMeasuring(_ref) {
  let {
    measure
  } = _ref;
  const [rect, setRect] = reactExports.useState(null);
  const handleResize = reactExports.useCallback((entries) => {
    for (const {
      target
    } of entries) {
      if (isHTMLElement(target)) {
        setRect((rect2) => {
          const newRect = measure(target);
          return rect2 ? {
            ...rect2,
            width: newRect.width,
            height: newRect.height
          } : newRect;
        });
        break;
      }
    }
  }, [measure]);
  const resizeObserver = useResizeObserver({
    callback: handleResize
  });
  const handleNodeChange = reactExports.useCallback((element) => {
    const node = getMeasurableNode(element);
    resizeObserver == null ? void 0 : resizeObserver.disconnect();
    if (node) {
      resizeObserver == null ? void 0 : resizeObserver.observe(node);
    }
    setRect(node ? measure(node) : null);
  }, [measure, resizeObserver]);
  const [nodeRef, setRef2] = useNodeRef(handleNodeChange);
  return reactExports.useMemo(() => ({
    nodeRef,
    rect,
    setRef: setRef2
  }), [rect, nodeRef, setRef2]);
}
const defaultSensors = [{
  sensor: PointerSensor,
  options: {}
}, {
  sensor: KeyboardSensor,
  options: {}
}];
const defaultData = {
  current: {}
};
const defaultMeasuringConfiguration = {
  draggable: {
    measure: getTransformAgnosticClientRect
  },
  droppable: {
    measure: getTransformAgnosticClientRect,
    strategy: MeasuringStrategy.WhileDragging,
    frequency: MeasuringFrequency.Optimized
  },
  dragOverlay: {
    measure: getClientRect
  }
};
class DroppableContainersMap extends Map {
  get(id) {
    var _super$get;
    return id != null ? (_super$get = super.get(id)) != null ? _super$get : void 0 : void 0;
  }
  toArray() {
    return Array.from(this.values());
  }
  getEnabled() {
    return this.toArray().filter((_ref) => {
      let {
        disabled
      } = _ref;
      return !disabled;
    });
  }
  getNodeFor(id) {
    var _this$get$node$curren, _this$get;
    return (_this$get$node$curren = (_this$get = this.get(id)) == null ? void 0 : _this$get.node.current) != null ? _this$get$node$curren : void 0;
  }
}
const defaultPublicContext = {
  activatorEvent: null,
  active: null,
  activeNode: null,
  activeNodeRect: null,
  collisions: null,
  containerNodeRect: null,
  draggableNodes: /* @__PURE__ */ new Map(),
  droppableRects: /* @__PURE__ */ new Map(),
  droppableContainers: /* @__PURE__ */ new DroppableContainersMap(),
  over: null,
  dragOverlay: {
    nodeRef: {
      current: null
    },
    rect: null,
    setRef: noop
  },
  scrollableAncestors: [],
  scrollableAncestorRects: [],
  measuringConfiguration: defaultMeasuringConfiguration,
  measureDroppableContainers: noop,
  windowRect: null,
  measuringScheduled: false
};
const defaultInternalContext = {
  activatorEvent: null,
  activators: [],
  active: null,
  activeNodeRect: null,
  ariaDescribedById: {
    draggable: ""
  },
  dispatch: noop,
  draggableNodes: /* @__PURE__ */ new Map(),
  over: null,
  measureDroppableContainers: noop
};
const InternalContext = /* @__PURE__ */ reactExports.createContext(defaultInternalContext);
const PublicContext = /* @__PURE__ */ reactExports.createContext(defaultPublicContext);
function getInitialState() {
  return {
    draggable: {
      active: null,
      initialCoordinates: {
        x: 0,
        y: 0
      },
      nodes: /* @__PURE__ */ new Map(),
      translate: {
        x: 0,
        y: 0
      }
    },
    droppable: {
      containers: new DroppableContainersMap()
    }
  };
}
function reducer(state, action) {
  switch (action.type) {
    case Action.DragStart:
      return {
        ...state,
        draggable: {
          ...state.draggable,
          initialCoordinates: action.initialCoordinates,
          active: action.active
        }
      };
    case Action.DragMove:
      if (state.draggable.active == null) {
        return state;
      }
      return {
        ...state,
        draggable: {
          ...state.draggable,
          translate: {
            x: action.coordinates.x - state.draggable.initialCoordinates.x,
            y: action.coordinates.y - state.draggable.initialCoordinates.y
          }
        }
      };
    case Action.DragEnd:
    case Action.DragCancel:
      return {
        ...state,
        draggable: {
          ...state.draggable,
          active: null,
          initialCoordinates: {
            x: 0,
            y: 0
          },
          translate: {
            x: 0,
            y: 0
          }
        }
      };
    case Action.RegisterDroppable: {
      const {
        element
      } = action;
      const {
        id
      } = element;
      const containers = new DroppableContainersMap(state.droppable.containers);
      containers.set(id, element);
      return {
        ...state,
        droppable: {
          ...state.droppable,
          containers
        }
      };
    }
    case Action.SetDroppableDisabled: {
      const {
        id,
        key,
        disabled
      } = action;
      const element = state.droppable.containers.get(id);
      if (!element || key !== element.key) {
        return state;
      }
      const containers = new DroppableContainersMap(state.droppable.containers);
      containers.set(id, {
        ...element,
        disabled
      });
      return {
        ...state,
        droppable: {
          ...state.droppable,
          containers
        }
      };
    }
    case Action.UnregisterDroppable: {
      const {
        id,
        key
      } = action;
      const element = state.droppable.containers.get(id);
      if (!element || key !== element.key) {
        return state;
      }
      const containers = new DroppableContainersMap(state.droppable.containers);
      containers.delete(id);
      return {
        ...state,
        droppable: {
          ...state.droppable,
          containers
        }
      };
    }
    default: {
      return state;
    }
  }
}
function RestoreFocus(_ref) {
  let {
    disabled
  } = _ref;
  const {
    active,
    activatorEvent,
    draggableNodes
  } = reactExports.useContext(InternalContext);
  const previousActivatorEvent = usePrevious(activatorEvent);
  const previousActiveId = usePrevious(active == null ? void 0 : active.id);
  reactExports.useEffect(() => {
    if (disabled) {
      return;
    }
    if (!activatorEvent && previousActivatorEvent && previousActiveId != null) {
      if (!isKeyboardEvent(previousActivatorEvent)) {
        return;
      }
      if (document.activeElement === previousActivatorEvent.target) {
        return;
      }
      const draggableNode = draggableNodes.get(previousActiveId);
      if (!draggableNode) {
        return;
      }
      const {
        activatorNode,
        node
      } = draggableNode;
      if (!activatorNode.current && !node.current) {
        return;
      }
      requestAnimationFrame(() => {
        for (const element of [activatorNode.current, node.current]) {
          if (!element) {
            continue;
          }
          const focusableNode = findFirstFocusableNode(element);
          if (focusableNode) {
            focusableNode.focus();
            break;
          }
        }
      });
    }
  }, [activatorEvent, disabled, draggableNodes, previousActiveId, previousActivatorEvent]);
  return null;
}
function applyModifiers(modifiers, _ref) {
  let {
    transform,
    ...args
  } = _ref;
  return modifiers != null && modifiers.length ? modifiers.reduce((accumulator, modifier) => {
    return modifier({
      transform: accumulator,
      ...args
    });
  }, transform) : transform;
}
function useMeasuringConfiguration(config) {
  return reactExports.useMemo(
    () => ({
      draggable: {
        ...defaultMeasuringConfiguration.draggable,
        ...config == null ? void 0 : config.draggable
      },
      droppable: {
        ...defaultMeasuringConfiguration.droppable,
        ...config == null ? void 0 : config.droppable
      },
      dragOverlay: {
        ...defaultMeasuringConfiguration.dragOverlay,
        ...config == null ? void 0 : config.dragOverlay
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config == null ? void 0 : config.draggable, config == null ? void 0 : config.droppable, config == null ? void 0 : config.dragOverlay]
  );
}
function useLayoutShiftScrollCompensation(_ref) {
  let {
    activeNode,
    measure,
    initialRect,
    config = true
  } = _ref;
  const initialized = reactExports.useRef(false);
  const {
    x,
    y
  } = typeof config === "boolean" ? {
    x: config,
    y: config
  } : config;
  useIsomorphicLayoutEffect(() => {
    const disabled = !x && !y;
    if (disabled || !activeNode) {
      initialized.current = false;
      return;
    }
    if (initialized.current || !initialRect) {
      return;
    }
    const node = activeNode == null ? void 0 : activeNode.node.current;
    if (!node || node.isConnected === false) {
      return;
    }
    const rect = measure(node);
    const rectDelta = getRectDelta(rect, initialRect);
    if (!x) {
      rectDelta.x = 0;
    }
    if (!y) {
      rectDelta.y = 0;
    }
    initialized.current = true;
    if (Math.abs(rectDelta.x) > 0 || Math.abs(rectDelta.y) > 0) {
      const firstScrollableAncestor = getFirstScrollableAncestor(node);
      if (firstScrollableAncestor) {
        firstScrollableAncestor.scrollBy({
          top: rectDelta.y,
          left: rectDelta.x
        });
      }
    }
  }, [activeNode, x, y, initialRect, measure]);
}
const ActiveDraggableContext = /* @__PURE__ */ reactExports.createContext({
  ...defaultCoordinates,
  scaleX: 1,
  scaleY: 1
});
var Status;
(function(Status2) {
  Status2[Status2["Uninitialized"] = 0] = "Uninitialized";
  Status2[Status2["Initializing"] = 1] = "Initializing";
  Status2[Status2["Initialized"] = 2] = "Initialized";
})(Status || (Status = {}));
const DndContext = /* @__PURE__ */ reactExports.memo(function DndContext2(_ref) {
  var _sensorContext$curren, _dragOverlay$nodeRef$, _dragOverlay$rect, _over$rect;
  let {
    id,
    accessibility,
    autoScroll = true,
    children,
    sensors = defaultSensors,
    collisionDetection = rectIntersection,
    measuring,
    modifiers,
    ...props
  } = _ref;
  const store = reactExports.useReducer(reducer, void 0, getInitialState);
  const [state, dispatch] = store;
  const [dispatchMonitorEvent, registerMonitorListener] = useDndMonitorProvider();
  const [status, setStatus] = reactExports.useState(Status.Uninitialized);
  const isInitialized = status === Status.Initialized;
  const {
    draggable: {
      active: activeId,
      nodes: draggableNodes,
      translate
    },
    droppable: {
      containers: droppableContainers
    }
  } = state;
  const node = activeId != null ? draggableNodes.get(activeId) : null;
  const activeRects = reactExports.useRef({
    initial: null,
    translated: null
  });
  const active = reactExports.useMemo(() => {
    var _node$data;
    return activeId != null ? {
      id: activeId,
      // It's possible for the active node to unmount while dragging
      data: (_node$data = node == null ? void 0 : node.data) != null ? _node$data : defaultData,
      rect: activeRects
    } : null;
  }, [activeId, node]);
  const activeRef = reactExports.useRef(null);
  const [activeSensor, setActiveSensor] = reactExports.useState(null);
  const [activatorEvent, setActivatorEvent] = reactExports.useState(null);
  const latestProps = useLatestValue(props, Object.values(props));
  const draggableDescribedById = useUniqueId("DndDescribedBy", id);
  const enabledDroppableContainers = reactExports.useMemo(() => droppableContainers.getEnabled(), [droppableContainers]);
  const measuringConfiguration = useMeasuringConfiguration(measuring);
  const {
    droppableRects,
    measureDroppableContainers,
    measuringScheduled
  } = useDroppableMeasuring(enabledDroppableContainers, {
    dragging: isInitialized,
    dependencies: [translate.x, translate.y],
    config: measuringConfiguration.droppable
  });
  const activeNode = useCachedNode(draggableNodes, activeId);
  const activationCoordinates = reactExports.useMemo(() => activatorEvent ? getEventCoordinates(activatorEvent) : null, [activatorEvent]);
  const autoScrollOptions = getAutoScrollerOptions();
  const initialActiveNodeRect = useInitialRect(activeNode, measuringConfiguration.draggable.measure);
  useLayoutShiftScrollCompensation({
    activeNode: activeId != null ? draggableNodes.get(activeId) : null,
    config: autoScrollOptions.layoutShiftCompensation,
    initialRect: initialActiveNodeRect,
    measure: measuringConfiguration.draggable.measure
  });
  const activeNodeRect = useRect(activeNode, measuringConfiguration.draggable.measure, initialActiveNodeRect);
  const containerNodeRect = useRect(activeNode ? activeNode.parentElement : null);
  const sensorContext = reactExports.useRef({
    activatorEvent: null,
    active: null,
    activeNode,
    collisionRect: null,
    collisions: null,
    droppableRects,
    draggableNodes,
    draggingNode: null,
    draggingNodeRect: null,
    droppableContainers,
    over: null,
    scrollableAncestors: [],
    scrollAdjustedTranslate: null
  });
  const overNode = droppableContainers.getNodeFor((_sensorContext$curren = sensorContext.current.over) == null ? void 0 : _sensorContext$curren.id);
  const dragOverlay = useDragOverlayMeasuring({
    measure: measuringConfiguration.dragOverlay.measure
  });
  const draggingNode = (_dragOverlay$nodeRef$ = dragOverlay.nodeRef.current) != null ? _dragOverlay$nodeRef$ : activeNode;
  const draggingNodeRect = isInitialized ? (_dragOverlay$rect = dragOverlay.rect) != null ? _dragOverlay$rect : activeNodeRect : null;
  const usesDragOverlay = Boolean(dragOverlay.nodeRef.current && dragOverlay.rect);
  const nodeRectDelta = useRectDelta(usesDragOverlay ? null : activeNodeRect);
  const windowRect = useWindowRect(draggingNode ? getWindow(draggingNode) : null);
  const scrollableAncestors = useScrollableAncestors(isInitialized ? overNode != null ? overNode : activeNode : null);
  const scrollableAncestorRects = useRects(scrollableAncestors);
  const modifiedTranslate = applyModifiers(modifiers, {
    transform: {
      x: translate.x - nodeRectDelta.x,
      y: translate.y - nodeRectDelta.y,
      scaleX: 1,
      scaleY: 1
    },
    activatorEvent,
    active,
    activeNodeRect,
    containerNodeRect,
    draggingNodeRect,
    over: sensorContext.current.over,
    overlayNodeRect: dragOverlay.rect,
    scrollableAncestors,
    scrollableAncestorRects,
    windowRect
  });
  const pointerCoordinates = activationCoordinates ? add(activationCoordinates, translate) : null;
  const scrollOffsets = useScrollOffsets(scrollableAncestors);
  const scrollAdjustment = useScrollOffsetsDelta(scrollOffsets);
  const activeNodeScrollDelta = useScrollOffsetsDelta(scrollOffsets, [activeNodeRect]);
  const scrollAdjustedTranslate = add(modifiedTranslate, scrollAdjustment);
  const collisionRect = draggingNodeRect ? getAdjustedRect(draggingNodeRect, modifiedTranslate) : null;
  const collisions = active && collisionRect ? collisionDetection({
    active,
    collisionRect,
    droppableRects,
    droppableContainers: enabledDroppableContainers,
    pointerCoordinates
  }) : null;
  const overId = getFirstCollision(collisions, "id");
  const [over, setOver] = reactExports.useState(null);
  const appliedTranslate = usesDragOverlay ? modifiedTranslate : add(modifiedTranslate, activeNodeScrollDelta);
  const transform = adjustScale(appliedTranslate, (_over$rect = over == null ? void 0 : over.rect) != null ? _over$rect : null, activeNodeRect);
  const activeSensorRef = reactExports.useRef(null);
  const instantiateSensor = reactExports.useCallback(
    (event, _ref2) => {
      let {
        sensor: Sensor,
        options
      } = _ref2;
      if (activeRef.current == null) {
        return;
      }
      const activeNode2 = draggableNodes.get(activeRef.current);
      if (!activeNode2) {
        return;
      }
      const activatorEvent2 = event.nativeEvent;
      const sensorInstance = new Sensor({
        active: activeRef.current,
        activeNode: activeNode2,
        event: activatorEvent2,
        options,
        // Sensors need to be instantiated with refs for arguments that change over time
        // otherwise they are frozen in time with the stale arguments
        context: sensorContext,
        onAbort(id2) {
          const draggableNode = draggableNodes.get(id2);
          if (!draggableNode) {
            return;
          }
          const {
            onDragAbort
          } = latestProps.current;
          const event2 = {
            id: id2
          };
          onDragAbort == null ? void 0 : onDragAbort(event2);
          dispatchMonitorEvent({
            type: "onDragAbort",
            event: event2
          });
        },
        onPending(id2, constraint, initialCoordinates, offset) {
          const draggableNode = draggableNodes.get(id2);
          if (!draggableNode) {
            return;
          }
          const {
            onDragPending
          } = latestProps.current;
          const event2 = {
            id: id2,
            constraint,
            initialCoordinates,
            offset
          };
          onDragPending == null ? void 0 : onDragPending(event2);
          dispatchMonitorEvent({
            type: "onDragPending",
            event: event2
          });
        },
        onStart(initialCoordinates) {
          const id2 = activeRef.current;
          if (id2 == null) {
            return;
          }
          const draggableNode = draggableNodes.get(id2);
          if (!draggableNode) {
            return;
          }
          const {
            onDragStart
          } = latestProps.current;
          const event2 = {
            activatorEvent: activatorEvent2,
            active: {
              id: id2,
              data: draggableNode.data,
              rect: activeRects
            }
          };
          reactDomExports.unstable_batchedUpdates(() => {
            onDragStart == null ? void 0 : onDragStart(event2);
            setStatus(Status.Initializing);
            dispatch({
              type: Action.DragStart,
              initialCoordinates,
              active: id2
            });
            dispatchMonitorEvent({
              type: "onDragStart",
              event: event2
            });
            setActiveSensor(activeSensorRef.current);
            setActivatorEvent(activatorEvent2);
          });
        },
        onMove(coordinates) {
          dispatch({
            type: Action.DragMove,
            coordinates
          });
        },
        onEnd: createHandler(Action.DragEnd),
        onCancel: createHandler(Action.DragCancel)
      });
      activeSensorRef.current = sensorInstance;
      function createHandler(type) {
        return async function handler() {
          const {
            active: active2,
            collisions: collisions2,
            over: over2,
            scrollAdjustedTranslate: scrollAdjustedTranslate2
          } = sensorContext.current;
          let event2 = null;
          if (active2 && scrollAdjustedTranslate2) {
            const {
              cancelDrop
            } = latestProps.current;
            event2 = {
              activatorEvent: activatorEvent2,
              active: active2,
              collisions: collisions2,
              delta: scrollAdjustedTranslate2,
              over: over2
            };
            if (type === Action.DragEnd && typeof cancelDrop === "function") {
              const shouldCancel = await Promise.resolve(cancelDrop(event2));
              if (shouldCancel) {
                type = Action.DragCancel;
              }
            }
          }
          activeRef.current = null;
          reactDomExports.unstable_batchedUpdates(() => {
            dispatch({
              type
            });
            setStatus(Status.Uninitialized);
            setOver(null);
            setActiveSensor(null);
            setActivatorEvent(null);
            activeSensorRef.current = null;
            const eventName = type === Action.DragEnd ? "onDragEnd" : "onDragCancel";
            if (event2) {
              const handler2 = latestProps.current[eventName];
              handler2 == null ? void 0 : handler2(event2);
              dispatchMonitorEvent({
                type: eventName,
                event: event2
              });
            }
          });
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggableNodes]
  );
  const bindActivatorToSensorInstantiator = reactExports.useCallback((handler, sensor) => {
    return (event, active2) => {
      const nativeEvent = event.nativeEvent;
      const activeDraggableNode = draggableNodes.get(active2);
      if (
        // Another sensor is already instantiating
        activeRef.current !== null || // No active draggable
        !activeDraggableNode || // Event has already been captured
        nativeEvent.dndKit || nativeEvent.defaultPrevented
      ) {
        return;
      }
      const activationContext = {
        active: activeDraggableNode
      };
      const shouldActivate = handler(event, sensor.options, activationContext);
      if (shouldActivate === true) {
        nativeEvent.dndKit = {
          capturedBy: sensor.sensor
        };
        activeRef.current = active2;
        instantiateSensor(event, sensor);
      }
    };
  }, [draggableNodes, instantiateSensor]);
  const activators = useCombineActivators(sensors, bindActivatorToSensorInstantiator);
  useSensorSetup(sensors);
  useIsomorphicLayoutEffect(() => {
    if (activeNodeRect && status === Status.Initializing) {
      setStatus(Status.Initialized);
    }
  }, [activeNodeRect, status]);
  reactExports.useEffect(
    () => {
      const {
        onDragMove
      } = latestProps.current;
      const {
        active: active2,
        activatorEvent: activatorEvent2,
        collisions: collisions2,
        over: over2
      } = sensorContext.current;
      if (!active2 || !activatorEvent2) {
        return;
      }
      const event = {
        active: active2,
        activatorEvent: activatorEvent2,
        collisions: collisions2,
        delta: {
          x: scrollAdjustedTranslate.x,
          y: scrollAdjustedTranslate.y
        },
        over: over2
      };
      reactDomExports.unstable_batchedUpdates(() => {
        onDragMove == null ? void 0 : onDragMove(event);
        dispatchMonitorEvent({
          type: "onDragMove",
          event
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollAdjustedTranslate.x, scrollAdjustedTranslate.y]
  );
  reactExports.useEffect(
    () => {
      const {
        active: active2,
        activatorEvent: activatorEvent2,
        collisions: collisions2,
        droppableContainers: droppableContainers2,
        scrollAdjustedTranslate: scrollAdjustedTranslate2
      } = sensorContext.current;
      if (!active2 || activeRef.current == null || !activatorEvent2 || !scrollAdjustedTranslate2) {
        return;
      }
      const {
        onDragOver
      } = latestProps.current;
      const overContainer = droppableContainers2.get(overId);
      const over2 = overContainer && overContainer.rect.current ? {
        id: overContainer.id,
        rect: overContainer.rect.current,
        data: overContainer.data,
        disabled: overContainer.disabled
      } : null;
      const event = {
        active: active2,
        activatorEvent: activatorEvent2,
        collisions: collisions2,
        delta: {
          x: scrollAdjustedTranslate2.x,
          y: scrollAdjustedTranslate2.y
        },
        over: over2
      };
      reactDomExports.unstable_batchedUpdates(() => {
        setOver(over2);
        onDragOver == null ? void 0 : onDragOver(event);
        dispatchMonitorEvent({
          type: "onDragOver",
          event
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [overId]
  );
  useIsomorphicLayoutEffect(() => {
    sensorContext.current = {
      activatorEvent,
      active,
      activeNode,
      collisionRect,
      collisions,
      droppableRects,
      draggableNodes,
      draggingNode,
      draggingNodeRect,
      droppableContainers,
      over,
      scrollableAncestors,
      scrollAdjustedTranslate
    };
    activeRects.current = {
      initial: draggingNodeRect,
      translated: collisionRect
    };
  }, [active, activeNode, collisions, collisionRect, draggableNodes, draggingNode, draggingNodeRect, droppableRects, droppableContainers, over, scrollableAncestors, scrollAdjustedTranslate]);
  useAutoScroller({
    ...autoScrollOptions,
    delta: translate,
    draggingRect: collisionRect,
    pointerCoordinates,
    scrollableAncestors,
    scrollableAncestorRects
  });
  const publicContext = reactExports.useMemo(() => {
    const context = {
      active,
      activeNode,
      activeNodeRect,
      activatorEvent,
      collisions,
      containerNodeRect,
      dragOverlay,
      draggableNodes,
      droppableContainers,
      droppableRects,
      over,
      measureDroppableContainers,
      scrollableAncestors,
      scrollableAncestorRects,
      measuringConfiguration,
      measuringScheduled,
      windowRect
    };
    return context;
  }, [active, activeNode, activeNodeRect, activatorEvent, collisions, containerNodeRect, dragOverlay, draggableNodes, droppableContainers, droppableRects, over, measureDroppableContainers, scrollableAncestors, scrollableAncestorRects, measuringConfiguration, measuringScheduled, windowRect]);
  const internalContext = reactExports.useMemo(() => {
    const context = {
      activatorEvent,
      activators,
      active,
      activeNodeRect,
      ariaDescribedById: {
        draggable: draggableDescribedById
      },
      dispatch,
      draggableNodes,
      over,
      measureDroppableContainers
    };
    return context;
  }, [activatorEvent, activators, active, activeNodeRect, dispatch, draggableDescribedById, draggableNodes, over, measureDroppableContainers]);
  return React.createElement(DndMonitorContext.Provider, {
    value: registerMonitorListener
  }, React.createElement(InternalContext.Provider, {
    value: internalContext
  }, React.createElement(PublicContext.Provider, {
    value: publicContext
  }, React.createElement(ActiveDraggableContext.Provider, {
    value: transform
  }, children)), React.createElement(RestoreFocus, {
    disabled: (accessibility == null ? void 0 : accessibility.restoreFocus) === false
  })), React.createElement(Accessibility, {
    ...accessibility,
    hiddenTextDescribedById: draggableDescribedById
  }));
  function getAutoScrollerOptions() {
    const activeSensorDisablesAutoscroll = (activeSensor == null ? void 0 : activeSensor.autoScrollEnabled) === false;
    const autoScrollGloballyDisabled = typeof autoScroll === "object" ? autoScroll.enabled === false : autoScroll === false;
    const enabled = isInitialized && !activeSensorDisablesAutoscroll && !autoScrollGloballyDisabled;
    if (typeof autoScroll === "object") {
      return {
        ...autoScroll,
        enabled
      };
    }
    return {
      enabled
    };
  }
});
const NullContext = /* @__PURE__ */ reactExports.createContext(null);
const defaultRole = "button";
const ID_PREFIX$1 = "Draggable";
function useDraggable(_ref) {
  let {
    id,
    data,
    disabled = false,
    attributes
  } = _ref;
  const key = useUniqueId(ID_PREFIX$1);
  const {
    activators,
    activatorEvent,
    active,
    activeNodeRect,
    ariaDescribedById,
    draggableNodes,
    over
  } = reactExports.useContext(InternalContext);
  const {
    role = defaultRole,
    roleDescription = "draggable",
    tabIndex = 0
  } = attributes != null ? attributes : {};
  const isDragging = (active == null ? void 0 : active.id) === id;
  const transform = reactExports.useContext(isDragging ? ActiveDraggableContext : NullContext);
  const [node, setNodeRef] = useNodeRef();
  const [activatorNode, setActivatorNodeRef] = useNodeRef();
  const listeners = useSyntheticListeners(activators, id);
  const dataRef = useLatestValue(data);
  useIsomorphicLayoutEffect(
    () => {
      draggableNodes.set(id, {
        id,
        key,
        node,
        activatorNode,
        data: dataRef
      });
      return () => {
        const node2 = draggableNodes.get(id);
        if (node2 && node2.key === key) {
          draggableNodes.delete(id);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggableNodes, id]
  );
  const memoizedAttributes = reactExports.useMemo(() => ({
    role,
    tabIndex,
    "aria-disabled": disabled,
    "aria-pressed": isDragging && role === defaultRole ? true : void 0,
    "aria-roledescription": roleDescription,
    "aria-describedby": ariaDescribedById.draggable
  }), [disabled, role, tabIndex, isDragging, roleDescription, ariaDescribedById.draggable]);
  return {
    active,
    activatorEvent,
    activeNodeRect,
    attributes: memoizedAttributes,
    isDragging,
    listeners: disabled ? void 0 : listeners,
    node,
    over,
    setNodeRef,
    setActivatorNodeRef,
    transform
  };
}
function useDndContext() {
  return reactExports.useContext(PublicContext);
}
const ID_PREFIX$1$1 = "Droppable";
const defaultResizeObserverConfig = {
  timeout: 25
};
function useDroppable(_ref) {
  let {
    data,
    disabled = false,
    id,
    resizeObserverConfig
  } = _ref;
  const key = useUniqueId(ID_PREFIX$1$1);
  const {
    active,
    dispatch,
    over,
    measureDroppableContainers
  } = reactExports.useContext(InternalContext);
  const previous = reactExports.useRef({
    disabled
  });
  const resizeObserverConnected = reactExports.useRef(false);
  const rect = reactExports.useRef(null);
  const callbackId = reactExports.useRef(null);
  const {
    disabled: resizeObserverDisabled,
    updateMeasurementsFor,
    timeout: resizeObserverTimeout
  } = {
    ...defaultResizeObserverConfig,
    ...resizeObserverConfig
  };
  const ids2 = useLatestValue(updateMeasurementsFor != null ? updateMeasurementsFor : id);
  const handleResize = reactExports.useCallback(
    () => {
      if (!resizeObserverConnected.current) {
        resizeObserverConnected.current = true;
        return;
      }
      if (callbackId.current != null) {
        clearTimeout(callbackId.current);
      }
      callbackId.current = setTimeout(() => {
        measureDroppableContainers(Array.isArray(ids2.current) ? ids2.current : [ids2.current]);
        callbackId.current = null;
      }, resizeObserverTimeout);
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [resizeObserverTimeout]
  );
  const resizeObserver = useResizeObserver({
    callback: handleResize,
    disabled: resizeObserverDisabled || !active
  });
  const handleNodeChange = reactExports.useCallback((newElement, previousElement) => {
    if (!resizeObserver) {
      return;
    }
    if (previousElement) {
      resizeObserver.unobserve(previousElement);
      resizeObserverConnected.current = false;
    }
    if (newElement) {
      resizeObserver.observe(newElement);
    }
  }, [resizeObserver]);
  const [nodeRef, setNodeRef] = useNodeRef(handleNodeChange);
  const dataRef = useLatestValue(data);
  reactExports.useEffect(() => {
    if (!resizeObserver || !nodeRef.current) {
      return;
    }
    resizeObserver.disconnect();
    resizeObserverConnected.current = false;
    resizeObserver.observe(nodeRef.current);
  }, [nodeRef, resizeObserver]);
  reactExports.useEffect(
    () => {
      dispatch({
        type: Action.RegisterDroppable,
        element: {
          id,
          key,
          disabled,
          node: nodeRef,
          rect,
          data: dataRef
        }
      });
      return () => dispatch({
        type: Action.UnregisterDroppable,
        key,
        id
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );
  reactExports.useEffect(() => {
    if (disabled !== previous.current.disabled) {
      dispatch({
        type: Action.SetDroppableDisabled,
        id,
        key,
        disabled
      });
      previous.current.disabled = disabled;
    }
  }, [id, key, disabled, dispatch]);
  return {
    active,
    rect,
    isOver: (over == null ? void 0 : over.id) === id,
    node: nodeRef,
    over,
    setNodeRef
  };
}
function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
  return newArray;
}
function getSortedRects(items, rects) {
  return items.reduce((accumulator, id, index) => {
    const rect = rects.get(id);
    if (rect) {
      accumulator[index] = rect;
    }
    return accumulator;
  }, Array(items.length));
}
function isValidIndex(index) {
  return index !== null && index >= 0;
}
function itemsEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
function normalizeDisabled(disabled) {
  if (typeof disabled === "boolean") {
    return {
      draggable: disabled,
      droppable: disabled
    };
  }
  return disabled;
}
const rectSortingStrategy = (_ref) => {
  let {
    rects,
    activeIndex,
    overIndex,
    index
  } = _ref;
  const newRects = arrayMove(rects, overIndex, activeIndex);
  const oldRect = rects[index];
  const newRect = newRects[index];
  if (!newRect || !oldRect) {
    return null;
  }
  return {
    x: newRect.left - oldRect.left,
    y: newRect.top - oldRect.top,
    scaleX: newRect.width / oldRect.width,
    scaleY: newRect.height / oldRect.height
  };
};
const defaultScale$1 = {
  scaleX: 1,
  scaleY: 1
};
const verticalListSortingStrategy = (_ref) => {
  var _rects$activeIndex;
  let {
    activeIndex,
    activeNodeRect: fallbackActiveRect,
    index,
    rects,
    overIndex
  } = _ref;
  const activeNodeRect = (_rects$activeIndex = rects[activeIndex]) != null ? _rects$activeIndex : fallbackActiveRect;
  if (!activeNodeRect) {
    return null;
  }
  if (index === activeIndex) {
    const overIndexRect = rects[overIndex];
    if (!overIndexRect) {
      return null;
    }
    return {
      x: 0,
      y: activeIndex < overIndex ? overIndexRect.top + overIndexRect.height - (activeNodeRect.top + activeNodeRect.height) : overIndexRect.top - activeNodeRect.top,
      ...defaultScale$1
    };
  }
  const itemGap = getItemGap$1(rects, index, activeIndex);
  if (index > activeIndex && index <= overIndex) {
    return {
      x: 0,
      y: -activeNodeRect.height - itemGap,
      ...defaultScale$1
    };
  }
  if (index < activeIndex && index >= overIndex) {
    return {
      x: 0,
      y: activeNodeRect.height + itemGap,
      ...defaultScale$1
    };
  }
  return {
    x: 0,
    y: 0,
    ...defaultScale$1
  };
};
function getItemGap$1(clientRects, index, activeIndex) {
  const currentRect = clientRects[index];
  const previousRect = clientRects[index - 1];
  const nextRect = clientRects[index + 1];
  if (!currentRect) {
    return 0;
  }
  if (activeIndex < index) {
    return previousRect ? currentRect.top - (previousRect.top + previousRect.height) : nextRect ? nextRect.top - (currentRect.top + currentRect.height) : 0;
  }
  return nextRect ? nextRect.top - (currentRect.top + currentRect.height) : previousRect ? currentRect.top - (previousRect.top + previousRect.height) : 0;
}
const ID_PREFIX = "Sortable";
const Context = /* @__PURE__ */ React.createContext({
  activeIndex: -1,
  containerId: ID_PREFIX,
  disableTransforms: false,
  items: [],
  overIndex: -1,
  useDragOverlay: false,
  sortedRects: [],
  strategy: rectSortingStrategy,
  disabled: {
    draggable: false,
    droppable: false
  }
});
function SortableContext(_ref) {
  let {
    children,
    id,
    items: userDefinedItems,
    strategy = rectSortingStrategy,
    disabled: disabledProp = false
  } = _ref;
  const {
    active,
    dragOverlay,
    droppableRects,
    over,
    measureDroppableContainers
  } = useDndContext();
  const containerId = useUniqueId(ID_PREFIX, id);
  const useDragOverlay = Boolean(dragOverlay.rect !== null);
  const items = reactExports.useMemo(() => userDefinedItems.map((item) => typeof item === "object" && "id" in item ? item.id : item), [userDefinedItems]);
  const isDragging = active != null;
  const activeIndex = active ? items.indexOf(active.id) : -1;
  const overIndex = over ? items.indexOf(over.id) : -1;
  const previousItemsRef = reactExports.useRef(items);
  const itemsHaveChanged = !itemsEqual(items, previousItemsRef.current);
  const disableTransforms = overIndex !== -1 && activeIndex === -1 || itemsHaveChanged;
  const disabled = normalizeDisabled(disabledProp);
  useIsomorphicLayoutEffect(() => {
    if (itemsHaveChanged && isDragging) {
      measureDroppableContainers(items);
    }
  }, [itemsHaveChanged, items, isDragging, measureDroppableContainers]);
  reactExports.useEffect(() => {
    previousItemsRef.current = items;
  }, [items]);
  const contextValue = reactExports.useMemo(
    () => ({
      activeIndex,
      containerId,
      disabled,
      disableTransforms,
      items,
      overIndex,
      useDragOverlay,
      sortedRects: getSortedRects(items, droppableRects),
      strategy
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex, containerId, disabled.draggable, disabled.droppable, disableTransforms, items, overIndex, droppableRects, useDragOverlay, strategy]
  );
  return React.createElement(Context.Provider, {
    value: contextValue
  }, children);
}
const defaultNewIndexGetter = (_ref) => {
  let {
    id,
    items,
    activeIndex,
    overIndex
  } = _ref;
  return arrayMove(items, activeIndex, overIndex).indexOf(id);
};
const defaultAnimateLayoutChanges = (_ref2) => {
  let {
    containerId,
    isSorting,
    wasDragging,
    index,
    items,
    newIndex,
    previousItems,
    previousContainerId,
    transition
  } = _ref2;
  if (!transition || !wasDragging) {
    return false;
  }
  if (previousItems !== items && index === newIndex) {
    return false;
  }
  if (isSorting) {
    return true;
  }
  return newIndex !== index && containerId === previousContainerId;
};
const defaultTransition = {
  duration: 200,
  easing: "ease"
};
const transitionProperty = "transform";
const disabledTransition = /* @__PURE__ */ CSS.Transition.toString({
  property: transitionProperty,
  duration: 0,
  easing: "linear"
});
const defaultAttributes = {
  roleDescription: "sortable"
};
function useDerivedTransform(_ref) {
  let {
    disabled,
    index,
    node,
    rect
  } = _ref;
  const [derivedTransform, setDerivedtransform] = reactExports.useState(null);
  const previousIndex = reactExports.useRef(index);
  useIsomorphicLayoutEffect(() => {
    if (!disabled && index !== previousIndex.current && node.current) {
      const initial = rect.current;
      if (initial) {
        const current = getClientRect(node.current, {
          ignoreTransform: true
        });
        const delta = {
          x: initial.left - current.left,
          y: initial.top - current.top,
          scaleX: initial.width / current.width,
          scaleY: initial.height / current.height
        };
        if (delta.x || delta.y) {
          setDerivedtransform(delta);
        }
      }
    }
    if (index !== previousIndex.current) {
      previousIndex.current = index;
    }
  }, [disabled, index, node, rect]);
  reactExports.useEffect(() => {
    if (derivedTransform) {
      setDerivedtransform(null);
    }
  }, [derivedTransform]);
  return derivedTransform;
}
function useSortable(_ref) {
  let {
    animateLayoutChanges = defaultAnimateLayoutChanges,
    attributes: userDefinedAttributes,
    disabled: localDisabled,
    data: customData,
    getNewIndex = defaultNewIndexGetter,
    id,
    strategy: localStrategy,
    resizeObserverConfig,
    transition = defaultTransition
  } = _ref;
  const {
    items,
    containerId,
    activeIndex,
    disabled: globalDisabled,
    disableTransforms,
    sortedRects,
    overIndex,
    useDragOverlay,
    strategy: globalStrategy
  } = reactExports.useContext(Context);
  const disabled = normalizeLocalDisabled(localDisabled, globalDisabled);
  const index = items.indexOf(id);
  const data = reactExports.useMemo(() => ({
    sortable: {
      containerId,
      index,
      items
    },
    ...customData
  }), [containerId, customData, index, items]);
  const itemsAfterCurrentSortable = reactExports.useMemo(() => items.slice(items.indexOf(id)), [items, id]);
  const {
    rect,
    node,
    isOver,
    setNodeRef: setDroppableNodeRef
  } = useDroppable({
    id,
    data,
    disabled: disabled.droppable,
    resizeObserverConfig: {
      updateMeasurementsFor: itemsAfterCurrentSortable,
      ...resizeObserverConfig
    }
  });
  const {
    active,
    activatorEvent,
    activeNodeRect,
    attributes,
    setNodeRef: setDraggableNodeRef,
    listeners,
    isDragging,
    over,
    setActivatorNodeRef,
    transform
  } = useDraggable({
    id,
    data,
    attributes: {
      ...defaultAttributes,
      ...userDefinedAttributes
    },
    disabled: disabled.draggable
  });
  const setNodeRef = useCombinedRefs(setDroppableNodeRef, setDraggableNodeRef);
  const isSorting = Boolean(active);
  const displaceItem = isSorting && !disableTransforms && isValidIndex(activeIndex) && isValidIndex(overIndex);
  const shouldDisplaceDragSource = !useDragOverlay && isDragging;
  const dragSourceDisplacement = shouldDisplaceDragSource && displaceItem ? transform : null;
  const strategy = localStrategy != null ? localStrategy : globalStrategy;
  const finalTransform = displaceItem ? dragSourceDisplacement != null ? dragSourceDisplacement : strategy({
    rects: sortedRects,
    activeNodeRect,
    activeIndex,
    overIndex,
    index
  }) : null;
  const newIndex = isValidIndex(activeIndex) && isValidIndex(overIndex) ? getNewIndex({
    id,
    items,
    activeIndex,
    overIndex
  }) : index;
  const activeId = active == null ? void 0 : active.id;
  const previous = reactExports.useRef({
    activeId,
    items,
    newIndex,
    containerId
  });
  const itemsHaveChanged = items !== previous.current.items;
  const shouldAnimateLayoutChanges = animateLayoutChanges({
    active,
    containerId,
    isDragging,
    isSorting,
    id,
    index,
    items,
    newIndex: previous.current.newIndex,
    previousItems: previous.current.items,
    previousContainerId: previous.current.containerId,
    transition,
    wasDragging: previous.current.activeId != null
  });
  const derivedTransform = useDerivedTransform({
    disabled: !shouldAnimateLayoutChanges,
    index,
    node,
    rect
  });
  reactExports.useEffect(() => {
    if (isSorting && previous.current.newIndex !== newIndex) {
      previous.current.newIndex = newIndex;
    }
    if (containerId !== previous.current.containerId) {
      previous.current.containerId = containerId;
    }
    if (items !== previous.current.items) {
      previous.current.items = items;
    }
  }, [isSorting, newIndex, containerId, items]);
  reactExports.useEffect(() => {
    if (activeId === previous.current.activeId) {
      return;
    }
    if (activeId != null && previous.current.activeId == null) {
      previous.current.activeId = activeId;
      return;
    }
    const timeoutId = setTimeout(() => {
      previous.current.activeId = activeId;
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [activeId]);
  return {
    active,
    activeIndex,
    attributes,
    data,
    rect,
    index,
    newIndex,
    items,
    isOver,
    isSorting,
    isDragging,
    listeners,
    node,
    overIndex,
    over,
    setNodeRef,
    setActivatorNodeRef,
    setDroppableNodeRef,
    setDraggableNodeRef,
    transform: derivedTransform != null ? derivedTransform : finalTransform,
    transition: getTransition()
  };
  function getTransition() {
    if (
      // Temporarily disable transitions for a single frame to set up derived transforms
      derivedTransform || // Or to prevent items jumping to back to their "new" position when items change
      itemsHaveChanged && previous.current.newIndex === index
    ) {
      return disabledTransition;
    }
    if (shouldDisplaceDragSource && !isKeyboardEvent(activatorEvent) || !transition) {
      return void 0;
    }
    if (isSorting || shouldAnimateLayoutChanges) {
      return CSS.Transition.toString({
        ...transition,
        property: transitionProperty
      });
    }
    return void 0;
  }
}
function normalizeLocalDisabled(localDisabled, globalDisabled) {
  var _localDisabled$dragga, _localDisabled$droppa;
  if (typeof localDisabled === "boolean") {
    return {
      draggable: localDisabled,
      // Backwards compatibility
      droppable: false
    };
  }
  return {
    draggable: (_localDisabled$dragga = localDisabled == null ? void 0 : localDisabled.draggable) != null ? _localDisabled$dragga : globalDisabled.draggable,
    droppable: (_localDisabled$droppa = localDisabled == null ? void 0 : localDisabled.droppable) != null ? _localDisabled$droppa : globalDisabled.droppable
  };
}
[KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState2 = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState: getInitialState2, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(() => selector(api.getState()), [api, selector]),
    React.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = ((createState) => createState ? createImpl(createState) : createImpl);
function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0);
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, void 0)),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const persistImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => window.localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  let hydrationVersion = 0;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    return setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      return setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    const currentVersion = ++hydrationVersion;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            const migration = options.migrate(
              deserializedStorageValue.state,
              deserializedStorageValue.version
            );
            if (migration instanceof Promise) {
              return migration.then((result) => [true, result]);
            }
            return [true, migration];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      if (currentVersion !== hydrationVersion) {
        return;
      }
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(get(), void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persist = persistImpl;
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const rnds8 = new Uint8Array(16);
function rng() {
  return crypto.getRandomValues(rnds8);
}
function v4(options, buf, offset) {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return _v4(options);
}
function _v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const SECTION_CATALOG = [
  { key: "summary", label: "Summary", kind: "summary", category: "Core", description: "Headline professional summary.", aliases: ["summary", "professional summary", "profile"] },
  { key: "objective", label: "Objective", kind: "summary", category: "Core", description: "Targeted career objective.", aliases: ["objective", "career objective"] },
  { key: "about", label: "About Me", kind: "richtext", category: "Core", description: "First-person narrative.", aliases: ["about", "about me", "bio"] },
  { key: "experience", label: "Experience", kind: "timeline", category: "Core", description: "Work history with bullets.", aliases: ["experience", "work experience", "employment", "professional experience"] },
  { key: "education", label: "Education", kind: "timeline", category: "Core", description: "Schools, degrees, dates.", aliases: ["education", "academic background"] },
  { key: "skills", label: "Skills", kind: "skills", category: "Core", description: "Grouped competencies.", aliases: ["skills", "core competencies"] },
  { key: "projects", label: "Projects", kind: "projects", category: "Core", description: "Side projects with tech & impact.", aliases: ["projects", "selected projects"] },
  { key: "achievements", label: "Achievements", kind: "list", category: "Core", description: "Awards & notable wins.", aliases: ["achievements", "awards", "honors", "accomplishments"] },
  { key: "certifications", label: "Certifications", kind: "list", category: "Core", description: "Credentials & licenses.", aliases: ["certifications", "licenses"] },
  { key: "publications", label: "Publications", kind: "list", category: "Core", description: "Papers, articles, book chapters.", aliases: ["publications", "papers"] },
  { key: "internships", label: "Internships", kind: "timeline", category: "Core", description: "Internship stints.", aliases: ["internships", "internship experience"] },
  { key: "freelance", label: "Freelance", kind: "timeline", category: "Core", description: "Independent client work.", aliases: ["freelance", "freelance experience", "contract work"] },
  { key: "leadership", label: "Leadership", kind: "timeline", category: "Core", description: "Leadership roles & impact.", aliases: ["leadership", "leadership experience"] },
  { key: "volunteer", label: "Volunteer", kind: "timeline", category: "Core", description: "Community / pro-bono work.", aliases: ["volunteer", "volunteer experience", "community service"] },
  { key: "extracurriculars", label: "Extracurriculars", kind: "list", category: "Core", description: "Clubs, societies, activities.", aliases: ["extracurriculars", "extracurricular activities", "activities"] },
  { key: "training", label: "Training", kind: "list", category: "Core", description: "Workshops, bootcamps, courses.", aliases: ["training", "workshops", "bootcamps"] },
  { key: "courses", label: "Courses", kind: "list", category: "Core", description: "Notable courses & coursework.", aliases: ["courses", "relevant coursework", "coursework"] },
  { key: "research", label: "Research", kind: "timeline", category: "Core", description: "Research roles & projects.", aliases: ["research", "research experience"] },
  { key: "teaching", label: "Teaching", kind: "timeline", category: "Core", description: "Teaching & TA roles.", aliases: ["teaching", "teaching experience"] },
  { key: "consulting", label: "Consulting", kind: "timeline", category: "Core", description: "Consulting engagements.", aliases: ["consulting", "consulting experience"] },
  { key: "tech_skills", label: "Technical Skills", kind: "skills", category: "Technical", description: "Programming-focused skill matrix.", aliases: ["technical skills", "tech skills"] },
  { key: "tools", label: "Tools & Tech", kind: "skills", category: "Technical", description: "Tools, platforms, frameworks.", aliases: ["tools", "tools and technologies", "tech stack"] },
  { key: "open_source", label: "Open Source", kind: "projects", category: "Technical", description: "OSS contributions.", aliases: ["open source", "open source contributions", "oss"] },
  { key: "hackathons", label: "Hackathons", kind: "list", category: "Technical", description: "Hackathon wins & participation.", aliases: ["hackathons"] },
  { key: "competitive", label: "Competitive Programming", kind: "list", category: "Technical", description: "Ratings & contest results.", aliases: ["competitive programming", "cp"] },
  { key: "patents", label: "Patents", kind: "list", category: "Technical", description: "Filed & granted patents.", aliases: ["patents"] },
  { key: "tech_blogs", label: "Tech Blogs", kind: "links", category: "Technical", description: "Engineering writing.", aliases: ["tech blogs", "blog", "writing"] },
  { key: "research_interests", label: "Research Interests", kind: "richtext", category: "Academic", description: "Areas of focus.", aliases: ["research interests"] },
  { key: "thesis", label: "Thesis", kind: "richtext", category: "Academic", description: "Thesis / dissertation abstract.", aliases: ["thesis", "dissertation"] },
  { key: "conferences", label: "Conferences", kind: "list", category: "Academic", description: "Conferences attended/spoken at.", aliases: ["conferences"] },
  { key: "talks", label: "Talks", kind: "list", category: "Academic", description: "Invited talks & lectures.", aliases: ["talks", "presentations", "lectures"] },
  { key: "grants", label: "Grants", kind: "list", category: "Academic", description: "Research funding & grants.", aliases: ["grants", "fellowships", "funding"] },
  { key: "affiliations", label: "Affiliations", kind: "list", category: "Academic", description: "Professional memberships.", aliases: ["affiliations", "memberships", "professional memberships"] },
  { key: "key_accomplishments", label: "Key Accomplishments", kind: "list", category: "Business", description: "Top-of-funnel wins.", aliases: ["key accomplishments", "highlights"] },
  { key: "board", label: "Board Memberships", kind: "list", category: "Business", description: "Board & advisory roles.", aliases: ["board memberships", "advisory roles", "boards"] },
  { key: "speaking", label: "Speaking", kind: "list", category: "Business", description: "Speaking engagements.", aliases: ["speaking", "speaking engagements"] },
  { key: "exhibitions", label: "Exhibitions", kind: "list", category: "Creative", description: "Shows & exhibitions.", aliases: ["exhibitions", "shows"] },
  { key: "performances", label: "Performances", kind: "list", category: "Creative", description: "Live performances.", aliases: ["performances"] },
  { key: "discography", label: "Discography", kind: "list", category: "Creative", description: "Released works.", aliases: ["discography", "releases"] },
  { key: "filmography", label: "Filmography", kind: "list", category: "Creative", description: "Film & video credits.", aliases: ["filmography"] },
  { key: "featured_work", label: "Featured Work", kind: "links", category: "Creative", description: "Press & features.", aliases: ["featured work", "press"] },
  { key: "academic_awards", label: "Academic Awards", kind: "list", category: "Student", description: "Scholarships & academic honors.", aliases: ["academic awards", "scholarships"] },
  { key: "positions", label: "Positions of Responsibility", kind: "list", category: "Student", description: "Campus leadership roles.", aliases: ["positions of responsibility", "campus leadership"] },
  { key: "competitions", label: "Competitions", kind: "list", category: "Student", description: "Olympiads & competitions.", aliases: ["competitions", "olympiads"] },
  { key: "capstone", label: "Capstone Projects", kind: "projects", category: "Student", description: "Final-year/major projects.", aliases: ["capstone", "capstone projects"] },
  { key: "languages", label: "Languages", kind: "list", category: "Personal", description: "Spoken languages.", aliases: ["languages"] },
  { key: "interests", label: "Interests", kind: "list", category: "Personal", description: "Hobbies & interests.", aliases: ["interests", "hobbies"] },
  { key: "availability", label: "Availability", kind: "richtext", category: "Personal", description: "Availability & relocation.", aliases: ["availability", "relocation"] },
  { key: "references", label: "References", kind: "list", category: "Trust", description: "Reference contacts.", aliases: ["references"] },
  { key: "testimonials", label: "Testimonials", kind: "list", category: "Trust", description: "Recommendations & quotes.", aliases: ["testimonials", "recommendations"] },
  { key: "clearance", label: "Security Clearance", kind: "richtext", category: "Trust", description: "Clearance level.", aliases: ["security clearance", "clearance"] },
  { key: "online", label: "Online Presence", kind: "links", category: "Online", description: "Profiles across platforms.", aliases: ["online presence", "social profiles", "links"] },
  { key: "clinical", label: "Clinical Experience", kind: "timeline", category: "Specialized", description: "Clinical rotations.", aliases: ["clinical experience", "clinical"] },
  { key: "legal", label: "Legal Experience", kind: "timeline", category: "Specialized", description: "Cases & legal practice.", aliases: ["legal experience"] },
  { key: "flight_hours", label: "Flight Hours", kind: "list", category: "Specialized", description: "Flight log summary.", aliases: ["flight hours"] },
  { key: "sports", label: "Sports Achievements", kind: "list", category: "Specialized", description: "Athletic accomplishments.", aliases: ["sports", "sports achievements", "athletics"] }
];
const CATEGORIES = [
  "Core",
  "Technical",
  "Academic",
  "Business",
  "Creative",
  "Student",
  "Personal",
  "Trust",
  "Online",
  "Specialized"
];
function findPreset(key) {
  return SECTION_CATALOG.find((p) => p.key === key);
}
function matchHeading(heading) {
  const h = heading.trim().toLowerCase().replace(/[^a-z\s&/]/g, " ").replace(/\s+/g, " ").trim();
  if (!h) return void 0;
  for (const p of SECTION_CATALOG) if (p.aliases.some((a) => a === h)) return p;
  for (const p of SECTION_CATALOG) if (p.aliases.some((a) => h.includes(a) || a.includes(h))) return p;
  return void 0;
}
function inst(key, partial) {
  const p = findPreset(key);
  return {
    id: v4(),
    kind: p.kind,
    key: p.key,
    title: p.label,
    enabled: true,
    data: { items: [] },
    ...partial
  };
}
const sampleResume = {
  personal: {
    name: "Aarav Sharma",
    title: "Senior Software Engineer",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, IN",
    website: "aarav.dev",
    github: "github.com/aarav",
    linkedin: "linkedin.com/in/aarav"
  },
  sections: [
    inst("summary", {
      data: { text: "Senior engineer with 6+ years building large-scale distributed systems and AI-powered developer tooling. Shipped products used by 2M+ users; led teams across infra, ML, and DX." }
    }),
    inst("experience", {
      data: { items: [
        {
          id: v4(),
          role: "Senior Software Engineer",
          organization: "Lumen Labs",
          location: "Remote",
          startDate: "2023",
          endDate: "Present",
          bullets: [
            "Architected a streaming inference pipeline cutting p95 latency from 1.4s → 280ms across 40M monthly requests.",
            "Led migration of monolith to event-driven services, reducing deploy time 8x and infra cost 32%.",
            "Mentored 6 engineers; established RFC process now used company-wide."
          ]
        },
        {
          id: v4(),
          role: "Software Engineer",
          organization: "Northwind",
          location: "Bengaluru",
          startDate: "2020",
          endDate: "2023",
          bullets: [
            "Built realtime collaboration engine (CRDT) powering 200k concurrent editors.",
            "Owned billing platform: integrated Stripe, recovered $1.2M ARR via dunning workflows."
          ]
        }
      ] }
    }),
    inst("projects", {
      data: { items: [
        {
          id: v4(),
          name: "ResumeOS",
          link: "github.com/aarav/resumeos",
          tech: "React, WebGPU, web-llm",
          bullets: [
            "Local-first AI resume builder running Gemma fully in-browser via WebGPU.",
            "Section-level rewrite, ATS scoring, and react-pdf text-layer export."
          ]
        }
      ] }
    }),
    inst("skills", {
      data: { groups: [
        { id: v4(), label: "Languages", items: ["TypeScript", "Python", "Go", "Rust"] },
        { id: v4(), label: "Systems", items: ["Kafka", "Postgres", "Redis", "Kubernetes"] },
        { id: v4(), label: "AI / ML", items: ["PyTorch", "ONNX", "WebGPU", "RAG"] }
      ] }
    }),
    inst("education", {
      data: { items: [
        {
          id: v4(),
          role: "B.Tech, Computer Science",
          organization: "IIT Bombay",
          location: "Mumbai",
          startDate: "2016",
          endDate: "2020",
          bullets: ["GPA 9.1/10 · Dean's list · Robotics Club lead"]
        }
      ] }
    }),
    inst("achievements", {
      data: { items: [
        { id: v4(), text: "Speaker, KubeCon India 2024 — Edge inference at scale" },
        { id: v4(), text: "Top 1% — ICPC Asia Regionals 2019" }
      ] }
    })
  ]
};
function emptyDataFor(kind) {
  switch (kind) {
    case "summary":
      return { text: "" };
    case "richtext":
      return { text: "" };
    case "list":
      return { items: [] };
    case "timeline":
      return { items: [] };
    case "projects":
      return { items: [] };
    case "skills":
      return { groups: [] };
    case "links":
      return { items: [] };
    case "custom":
      return { items: [] };
  }
}
function freshSection(preset) {
  return {
    id: v4(),
    kind: preset.kind,
    key: preset.key,
    title: preset.label,
    enabled: true,
    data: emptyDataFor(preset.kind)
  };
}
const useResumeStore = create()(
  persist(
    (set) => ({
      resume: sampleResume,
      template: "ats-minimal",
      modelId: "auto",
      setTemplate: (template) => set({ template }),
      setModelId: (modelId) => set({ modelId }),
      patchPersonal: (p) => set((state) => ({ resume: { ...state.resume, personal: { ...state.resume.personal, ...p } } })),
      addSection: (preset) => {
        const s = freshSection(preset);
        set((state) => ({ resume: { ...state.resume, sections: [...state.resume.sections, s] } }));
        return s.id;
      },
      addCustomSection: (title) => {
        const s = {
          id: v4(),
          kind: "custom",
          key: `custom_${v4().slice(0, 8)}`,
          title: title || "Custom Section",
          enabled: true,
          data: { items: [] }
        };
        set((state) => ({ resume: { ...state.resume, sections: [...state.resume.sections, s] } }));
        return s.id;
      },
      removeSection: (id) => set((state) => ({ resume: { ...state.resume, sections: state.resume.sections.filter((s) => s.id !== id) } })),
      toggleSection: (id) => set((state) => ({
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s)
        }
      })),
      renameSection: (id, title) => set((state) => ({
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((s) => s.id === id ? { ...s, title } : s)
        }
      })),
      reorderSections: (orderedIds) => set((state) => {
        const map = new Map(state.resume.sections.map((s) => [s.id, s]));
        const next = orderedIds.map((id) => map.get(id)).filter(Boolean);
        for (const s of state.resume.sections) if (!orderedIds.includes(s.id)) next.push(s);
        return { resume: { ...state.resume, sections: next } };
      }),
      patchSection: (id, updater) => set((state) => ({
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((s) => s.id === id ? updater(s) : s)
        }
      })),
      loadResume: (resume) => set({ resume }),
      reset: () => set({ resume: sampleResume })
    }),
    {
      name: "resumeos:v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Wipe legacy v1 if present — schema diverged.
      migrate: (state) => state
    }
  )
);
function SectionList({ activeId, onSelect, onAdd }) {
  const sections = useResumeStore((s) => s.resume.sections);
  const reorder = useResumeStore((s) => s.reorderSections);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const onDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorder(arrayMove(sections, oldIndex, newIndex).map((s) => s.id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onSelect("personal"),
        className: `text-left px-3 py-2 rounded-md border text-[13px] font-mono transition ${activeId === "personal" ? "border-ink bg-paper" : "border-transparent hover:border-rule hover:bg-paper/60"}`,
        children: "Personal"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 border-t border-rule" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: sections.map((s) => s.id), strategy: verticalListSortingStrategy, children: sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SortableRow, { section: s, active: s.id === activeId, onSelect: () => onSelect(s.id) }, s.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onAdd, className: "mt-2 flex items-center gap-1.5 justify-center px-3 py-2 rounded-md border border-dashed border-rule text-[12px] font-mono text-ink-soft hover:border-ink hover:text-ink transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
      " Add section"
    ] })
  ] });
}
function SortableRow({ section, active, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const toggle = useResumeStore((s) => s.toggleSection);
  const remove = useResumeStore((s) => s.removeSection);
  const rename = useResumeStore((s) => s.renameSection);
  const [editing, setEditing] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState(section.title);
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 20 : void 0 };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: setNodeRef,
      style,
      className: `group flex items-center gap-1 rounded-md border transition ${active ? "border-ink bg-paper" : "border-transparent hover:border-rule hover:bg-paper/60"} ${isDragging ? "shadow-lg" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...attributes, ...listeners, className: "px-1 py-2 cursor-grab text-ink-soft hover:text-ink", "aria-label": "Drag", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 12 }) }),
        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            autoFocus: true,
            value: draft,
            onChange: (e) => setDraft(e.target.value),
            onBlur: () => {
              rename(section.id, draft.trim() || section.title);
              setEditing(false);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                rename(section.id, draft.trim() || section.title);
                setEditing(false);
              }
              if (e.key === "Escape") {
                setDraft(section.title);
                setEditing(false);
              }
            },
            className: "flex-1 bg-transparent text-[13px] font-mono px-1 outline-none border-b border-ink"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSelect, className: "flex-1 text-left px-1 py-2 text-[13px] font-mono", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: section.enabled ? "text-ink" : "text-ink-soft line-through opacity-60", children: section.title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setDraft(section.title);
              setEditing((v) => !v);
            },
            "aria-label": "Rename",
            className: "opacity-0 group-hover:opacity-100 px-1 text-ink-soft hover:text-ink transition",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 11 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => toggle(section.id),
            "aria-label": `Toggle ${section.title}`,
            className: `mr-1 h-4 w-7 rounded-full border border-ink relative transition ${section.enabled ? "bg-ink" : "bg-paper"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { layout: true, className: `absolute top-0.5 h-2.5 w-2.5 rounded-full ${section.enabled ? "left-3 bg-paper" : "left-0.5 bg-ink"}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (confirm(`Remove "${section.title}"?`)) remove(section.id);
            },
            "aria-label": "Delete",
            className: "opacity-0 group-hover:opacity-100 mr-1 px-1 text-ink-soft hover:text-destructive transition",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 })
          }
        )
      ]
    }
  );
}
function Field$1({ label, value, onChange, multiline, rows = 4 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft mb-1", children: label }),
    multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value, onChange: (e) => onChange(e.target.value), rows, className: "w-full rounded-md border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-md border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink" })
  ] });
}
function AddBtn({ onClick, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: "text-[11px] font-mono px-3 py-1.5 rounded-md border border-rule hover:border-ink hover:bg-paper transition", children: [
    "+ ",
    children
  ] });
}
function RmBtn({ onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, "aria-label": "Remove", className: "text-[10px] font-mono px-2 py-1 rounded border border-rule text-ink-soft hover:text-ink hover:border-ink transition", children: "remove" });
}
function SectionForm({ section }) {
  const patch = useResumeStore((s) => s.patchSection);
  if (section.kind === "summary" || section.kind === "richtext") {
    const data2 = section.data;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Field$1,
      {
        label: section.title,
        multiline: true,
        rows: section.kind === "richtext" ? 6 : 4,
        value: data2.text,
        onChange: (v) => patch(section.id, (s) => ({ ...s, data: { ...s.data, text: v } }))
      }
    );
  }
  if (section.kind === "list") {
    const data2 = section.data;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      data2.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: it.text,
            onChange: (e) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, text: e.target.value } : x) } })),
            className: "flex-1 rounded-md border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RmBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.filter((x) => x.id !== it.id) } })) })
      ] }, it.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: [...s.data.items, { id: v4(), text: "" }] } })), children: "Add item" })
    ] });
  }
  if (section.kind === "timeline") {
    const data2 = section.data;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      data2.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule p-3 bg-paper", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-ink-soft", children: it.role || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RmBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.filter((x) => x.id !== it.id) } })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field$1,
            {
              label: "Role / Title",
              value: it.role,
              onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, role: v } : x) } }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field$1,
            {
              label: "Organization",
              value: it.organization,
              onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, organization: v } : x) } }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field$1,
            {
              label: "Location",
              value: it.location,
              onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, location: v } : x) } }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field$1,
              {
                label: "Start",
                value: it.startDate,
                onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, startDate: v } : x) } }))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field$1,
              {
                label: "End",
                value: it.endDate,
                onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, endDate: v } : x) } }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Bullets (one per line)",
            multiline: true,
            value: it.bullets.join("\n"),
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, bullets: v.split("\n").map((b) => b.trim()).filter(Boolean) } : x) } }))
          }
        )
      ] }, it.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: [...s.data.items, { id: v4(), role: "", organization: "", location: "", startDate: "", endDate: "", bullets: [] }] } })), children: "Add entry" })
    ] });
  }
  if (section.kind === "projects") {
    const data2 = section.data;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      data2.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule p-3 bg-paper", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-ink-soft", children: it.name || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RmBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.filter((x) => x.id !== it.id) } })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field$1,
            {
              label: "Name",
              value: it.name,
              onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, name: v } : x) } }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field$1,
            {
              label: "Tech",
              value: it.tech,
              onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, tech: v } : x) } }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field$1,
            {
              label: "Link",
              value: it.link,
              onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, link: v } : x) } }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Bullets",
            multiline: true,
            value: it.bullets.join("\n"),
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, bullets: v.split("\n").map((b) => b.trim()).filter(Boolean) } : x) } }))
          }
        )
      ] }, it.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: [...s.data.items, { id: v4(), name: "", link: "", tech: "", bullets: [] }] } })), children: "Add project" })
    ] });
  }
  if (section.kind === "skills") {
    const data2 = section.data;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      data2.groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[160px_1fr_auto] gap-3 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Group",
            value: g.label,
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { groups: s.data.groups.map((x) => x.id === g.id ? { ...x, label: v } : x) } }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Items (comma-separated)",
            value: g.items.join(", "),
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { groups: s.data.groups.map((x) => x.id === g.id ? { ...x, items: v.split(",").map((i) => i.trim()).filter(Boolean) } : x) } }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RmBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { groups: s.data.groups.filter((x) => x.id !== g.id) } })) })
      ] }, g.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { groups: [...s.data.groups, { id: v4(), label: "New group", items: [] }] } })), children: "Add group" })
    ] });
  }
  if (section.kind === "links") {
    const data2 = section.data;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      data2.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[160px_1fr_auto] gap-3 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Label",
            value: it.label,
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, label: v } : x) } }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "URL",
            value: it.url,
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, url: v } : x) } }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RmBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.filter((x) => x.id !== it.id) } })) })
      ] }, it.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: [...s.data.items, { id: v4(), label: "", url: "" }] } })), children: "Add link" })
    ] });
  }
  const data = section.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    data.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule p-3 bg-paper", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-ink-soft", children: it.title || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RmBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.filter((x) => x.id !== it.id) } })) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Title",
            value: it.title,
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, title: v } : x) } }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Subtitle",
            value: it.subtitle,
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, subtitle: v } : x) } }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            label: "Dates",
            value: it.dateRange,
            onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, dateRange: v } : x) } }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          label: "Bullets",
          multiline: true,
          value: it.bullets.join("\n"),
          onChange: (v) => patch(section.id, (s) => ({ ...s, data: { items: s.data.items.map((x) => x.id === it.id ? { ...x, bullets: v.split("\n").map((b) => b.trim()).filter(Boolean) } : x) } }))
        }
      )
    ] }, it.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddBtn, { onClick: () => patch(section.id, (s) => ({ ...s, data: { items: [...s.data.items, { id: v4(), title: "", subtitle: "", dateRange: "", bullets: [] }] } })), children: "Add entry" })
  ] });
}
function Field({ label, value, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-md border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink" })
  ] });
}
function PersonalForm() {
  const p = useResumeStore((s) => s.resume.personal);
  const patch = useResumeStore((s) => s.patchPersonal);
  const set = (k, v) => patch({ [k]: v });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", value: p.name, onChange: (v) => set("name", v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", value: p.title, onChange: (v) => set("title", v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", value: p.email, onChange: (v) => set("email", v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", value: p.phone, onChange: (v) => set("phone", v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Location", value: p.location, onChange: (v) => set("location", v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Website", value: p.website, onChange: (v) => set("website", v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "GitHub", value: p.github, onChange: (v) => set("github", v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "LinkedIn", value: p.linkedin, onChange: (v) => set("linkedin", v) })
  ] });
}
function AddSectionModal({ open, onClose, onAdded }) {
  const [q, setQ] = reactExports.useState("");
  const [customTitle, setCustomTitle] = reactExports.useState("");
  const addSection = useResumeStore((s) => s.addSection);
  const addCustom = useResumeStore((s) => s.addCustomSection);
  const sectionList = useResumeStore((s) => s.resume.sections);
  const existing = reactExports.useMemo(() => new Set(sectionList.map((x) => x.key)), [sectionList]);
  const filtered = reactExports.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return SECTION_CATALOG;
    return SECTION_CATALOG.filter((p) => p.label.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.aliases.some((a) => a.includes(term)));
  }, [q]);
  const add2 = (p) => {
    onAdded(addSection(p));
    onClose();
  };
  const addCustomNow = () => {
    const t = customTitle.trim();
    if (!t) return;
    onAdded(addCustom(t));
    setCustomTitle("");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          onClick: (e) => e.stopPropagation(),
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 10, opacity: 0 },
          transition: { duration: 0.18 },
          className: "w-full max-w-3xl max-h-[85vh] flex flex-col rounded-xl border border-rule bg-card shadow-2xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-rule", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono-display text-base", children: "Section Library" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-ink-soft", children: [
                  "Add from ",
                  SECTION_CATALOG.length,
                  " curated presets, or create your own."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded hover:bg-paper", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-rule flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "text-ink-soft" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  autoFocus: true,
                  value: q,
                  onChange: (e) => setQ(e.target.value),
                  placeholder: "Search sections…",
                  className: "flex-1 bg-transparent text-sm outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto px-5 py-4 flex-1", children: CATEGORIES.map((cat) => {
              const items = filtered.filter((p) => p.category === cat);
              if (!items.length) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft mb-2", children: cat }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: items.map((p) => {
                  const has = existing.has(p.key);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => add2(p),
                      className: `text-left rounded-md border border-rule p-2.5 hover:border-ink hover:bg-paper transition ${has ? "opacity-60" : ""}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[12px]", children: p.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-ink-soft", children: p.kind })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-ink-soft mt-0.5", children: [
                          p.description,
                          has ? " · already added (will create another)" : ""
                        ] })
                      ]
                    },
                    p.key
                  );
                }) })
              ] }, cat);
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-rule flex gap-2 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: customTitle,
                  onChange: (e) => setCustomTitle(e.target.value),
                  placeholder: "Custom section title…",
                  onKeyDown: (e) => {
                    if (e.key === "Enter") addCustomNow();
                  },
                  className: "flex-1 rounded-md border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: addCustomNow,
                  disabled: !customTitle.trim(),
                  className: "flex items-center gap-1 rounded-md bg-ink text-paper text-[12px] font-mono px-3 py-2 hover:opacity-90 disabled:opacity-40 transition",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                    " Custom"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  ) });
}
let pdfjsModule = null;
async function getPdfjs() {
  if (pdfjsModule) return pdfjsModule;
  const pdfjs = await import("./pdf-alY2YfZX.js");
  const workerUrl = (await import("./pdf.worker.min-DsEtpD-e.js")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  pdfjsModule = pdfjs;
  return pdfjs;
}
async function extractFromFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return extractPdf(file);
  if (name.endsWith(".docx")) return extractDocx(file);
  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    const text = await file.text();
    return { pages: chunkText(text), raw: text, source: "txt" };
  }
  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}
async function extractPdf(file) {
  const pdfjs = await getPdfjs();
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const items = content.items;
    const lines = /* @__PURE__ */ new Map();
    for (const it of items) {
      const y = Math.round(it.transform?.[5] ?? 0);
      const arr = lines.get(y) ?? [];
      arr.push(it.str);
      lines.set(y, arr);
    }
    const ordered = Array.from(lines.entries()).sort((a, b) => b[0] - a[0]).map(([, v]) => v.join(" ").replace(/\s+/g, " ").trim()).filter(Boolean);
    pages.push(ordered.join("\n"));
  }
  return { pages, raw: pages.join("\n\n"), source: "pdf" };
}
async function extractDocx(file) {
  const mammoth = await import("./mammoth.browser-BGL3NGle.js").then((n) => n.m);
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  const text = result.value || "";
  return { pages: chunkText(text), raw: text, source: "docx" };
}
function chunkText(text, target = 3e3) {
  const paras = text.split(/\n{2,}/);
  const out = [];
  let buf = "";
  for (const p of paras) {
    if (buf.length + p.length > target && buf) {
      out.push(buf);
      buf = "";
    }
    buf += (buf ? "\n\n" : "") + p;
  }
  if (buf) out.push(buf);
  return out.length ? out : [text];
}
const QUICK_GOALS = [
  "Make this ATS-friendly",
  "Optimize for FAANG SWE",
  "Stronger action verbs",
  "Add quantified impact metrics",
  "Concise & senior tone",
  "Inject trending GenAI terminology"
];
function sectionToContextText(s) {
  switch (s.kind) {
    case "summary":
    case "richtext":
      return s.data.text;
    case "list":
      return s.data.items.map((i) => `- ${i.text}`).join("\n");
    case "timeline":
      return s.data.items.map((i) => `- ${i.role} @ ${i.organization} (${i.startDate}–${i.endDate})
  ${i.bullets.join("\n  ")}`).join("\n");
    case "projects":
      return s.data.items.map((p) => `- ${p.name} (${p.tech})
  ${p.bullets.join("\n  ")}`).join("\n");
    case "skills":
      return s.data.groups.map((g) => `${g.label}: ${g.items.join(", ")}`).join("\n");
    case "links":
      return s.data.items.map((i) => `${i.label}: ${i.url}`).join("\n");
    case "custom":
      return s.data.items.map((i) => `- ${i.title}${i.subtitle ? ` — ${i.subtitle}` : ""}${i.dateRange ? ` (${i.dateRange})` : ""}
  ${i.bullets.join("\n  ")}`).join("\n");
  }
}
function buildContext(resume) {
  const parts = [];
  parts.push(`# ${resume.personal.name} — ${resume.personal.title}`);
  for (const s of resume.sections) {
    if (!s.enabled) continue;
    const body = sectionToContextText(s);
    if (body.trim()) parts.push(`## ${s.title}
${body}`);
  }
  return parts.join("\n\n");
}
function rewritePrompt(opts) {
  return `You are an elite resume editor. Rewrite the "${opts.section.title}" section to satisfy this goal: "${opts.goal}".

Rules:
- Keep facts truthful. Never invent companies, dates, or metrics.
- Use crisp, results-oriented language. Active voice. Strong verbs.
- Quantify impact where the original implies it.
- Output ONLY the rewritten section content. One bullet per line, no preamble, no markdown headers.

Resume context:
${buildContext(opts.resume)}

Current ${opts.section.title} content:
${opts.current}

Rewritten ${opts.section.title}:`;
}
function extractionPrompt(pageText, knownKeys) {
  return `You are a resume parser. Extract structured data from the following resume page text.

Return STRICT JSON with this shape (no prose, no markdown fences):
{
  "personal": { "name"?: string, "title"?: string, "email"?: string, "phone"?: string, "location"?: string, "website"?: string, "github"?: string, "linkedin"?: string },
  "sections": [
    {
      "key": string,        // one of: ${knownKeys.join(", ")} OR a snake_case custom key
      "title": string,      // human-readable title from the resume
      "kind": "summary"|"richtext"|"list"|"timeline"|"projects"|"skills"|"links"|"custom",
      "data": object        // shape per kind below
    }
  ]
}

Data shapes by kind:
- summary/richtext: { "text": string }
- list:             { "items": [{ "text": string }] }
- timeline:         { "items": [{ "role": string, "organization": string, "location": string, "startDate": string, "endDate": string, "bullets": string[] }] }
- projects:         { "items": [{ "name": string, "link": string, "tech": string, "bullets": string[] }] }
- skills:           { "groups": [{ "label": string, "items": string[] }] }
- links:            { "items": [{ "label": string, "url": string }] }
- custom:           { "items": [{ "title": string, "subtitle": string, "dateRange": string, "bullets": string[] }] }

Only include fields you actually find. Omit unknown fields rather than guessing.

Resume page text:
"""
${pageText}
"""

JSON:`;
}
const KNOWN_KEYS = SECTION_CATALOG.map((p) => p.key);
async function parseWithAI(pages, generate, onProgress) {
  const acc = { personal: {}, sections: [] };
  for (let i = 0; i < pages.length; i++) {
    onProgress?.(i, pages.length);
    const text = pages[i].slice(0, 8e3);
    const prompt = extractionPrompt(text, KNOWN_KEYS);
    const json = await generateJson(generate, prompt);
    if (!json) continue;
    mergeInto(acc, normalizeJson(json));
  }
  onProgress?.(pages.length, pages.length);
  return acc;
}
function generateJson(generate, prompt) {
  return new Promise((resolve) => {
    let done = false;
    generate(prompt, {
      onToken: () => {
      },
      onDone: (text) => {
        if (done) return;
        done = true;
        resolve(safeJson(text));
      },
      onError: () => {
        if (done) return;
        done = true;
        resolve(null);
      }
    });
  });
}
function safeJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}
function parseHeuristic(pages) {
  const fullText = pages.join("\n");
  const personal = extractPersonal(fullText);
  const sections = splitIntoSections(fullText).map(({ heading, body }) => buildSectionDraft(heading, body));
  return { personal, sections };
}
function extractPersonal(text) {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0];
  const phone = text.match(/(\+?\d[\d\s\-().]{7,}\d)/)?.[0];
  const linkedin = text.match(/linkedin\.com\/[\w\-/]+/i)?.[0];
  const github = text.match(/github\.com\/[\w\-/]+/i)?.[0];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const name = lines[0]?.length && lines[0].length < 60 && /^[A-Za-z][A-Za-z\s'.-]+$/.test(lines[0]) ? lines[0] : void 0;
  const title = lines[1] && lines[1].length < 80 ? lines[1] : void 0;
  return { name, title, email, phone, linkedin, github };
}
function splitIntoSections(text) {
  const lines = text.split(/\n/);
  const out = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (looksLikeHeading(line)) {
      if (current) out.push(current);
      current = { heading: line, body: "" };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) out.push(current);
  return out;
}
function looksLikeHeading(line) {
  if (line.length > 60) return false;
  if (matchHeading(line)) return true;
  return /^[A-Z][A-Z\s&/]+$/.test(line) && line.split(/\s+/).length <= 5;
}
function buildSectionDraft(heading, body) {
  const preset = matchHeading(heading);
  if (preset) {
    const data = bodyToData(body, preset.kind);
    return { key: preset.key, title: preset.label, kind: preset.kind, data };
  }
  return {
    key: `custom_${heading.toLowerCase().replace(/\W+/g, "_").slice(0, 24)}`,
    title: titleCase(heading),
    kind: "custom",
    data: { items: body.split(/\n+/).filter(Boolean).map((line) => ({ id: v4(), title: line.slice(0, 80), subtitle: "", dateRange: "", bullets: [] })) }
  };
}
function bodyToData(body, kind) {
  const lines = body.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (kind === "summary" || kind === "richtext") return { text: lines.join(" ") };
  if (kind === "list") return { items: lines.map((t) => ({ id: v4(), text: t.replace(/^[-•·]\s*/, "") })) };
  if (kind === "skills") {
    const groups = lines.map((l) => {
      const [label, rest] = l.split(/[:|]/, 2);
      if (rest) return { id: v4(), label: label.trim(), items: rest.split(/[,;]/).map((s) => s.trim()).filter(Boolean) };
      return { id: v4(), label: "Skills", items: l.split(/[,;]/).map((s) => s.trim()).filter(Boolean) };
    });
    return { groups };
  }
  if (kind === "links") return { items: lines.map((l) => {
    const m = l.match(/(.+?)[\s:]+(\S+)$/);
    return { id: v4(), label: m?.[1]?.trim() || l, url: m?.[2]?.trim() || l };
  }) };
  if (kind === "projects") {
    const items2 = chunkByBullets(lines).map((chunk) => ({ id: v4(), name: chunk[0] || "Project", link: "", tech: "", bullets: chunk.slice(1) }));
    return { items: items2 };
  }
  const items = chunkByBullets(lines).map((chunk) => ({ id: v4(), role: chunk[0] || "", organization: "", location: "", startDate: "", endDate: "", bullets: chunk.slice(1) }));
  return { items };
}
function chunkByBullets(lines) {
  const chunks = [];
  let cur = [];
  for (const l of lines) {
    if (/^[-•·]/.test(l)) cur.push(l.replace(/^[-•·]\s*/, ""));
    else {
      if (cur.length) chunks.push(cur);
      cur = [l];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}
function titleCase(s) {
  return s.toLowerCase().split(/\s+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}
function normalizeJson(input) {
  const obj = input ?? {};
  const personal = obj.personal ?? {};
  const rawSections = Array.isArray(obj.sections) ? obj.sections : [];
  const sections = [];
  for (const r of rawSections) {
    const rec = r;
    const key = String(rec.key ?? "");
    const kindMaybe = String(rec.kind ?? "");
    const preset = findPreset(key);
    const kind = preset?.kind ?? (validKind(kindMaybe) ? kindMaybe : "custom");
    const title = String(rec.title ?? preset?.label ?? key ?? "Section");
    const data = sanitizeData(kind, rec.data);
    const fallbackKey = key.length > 0 ? key : `custom_${v4().slice(0, 8)}`;
    const finalKey = preset?.key ?? fallbackKey;
    sections.push({ key: finalKey, title, kind, data });
  }
  return { personal, sections };
}
function validKind(k) {
  return ["summary", "richtext", "list", "timeline", "projects", "skills", "links", "custom"].includes(k);
}
function sanitizeData(kind, raw) {
  const empty = emptyDataFor(kind);
  if (!raw || typeof raw !== "object") return empty;
  const o = raw;
  const arr = (v) => Array.isArray(v) ? v : [];
  const str = (v, fb = "") => typeof v === "string" ? v : fb;
  const strArr = (v) => arr(v).map((x) => str(x)).filter(Boolean);
  switch (kind) {
    case "summary":
    case "richtext":
      return { text: str(o.text) };
    case "list":
      return { items: arr(o.items).map((i) => ({ id: v4(), text: str(i?.text) })).filter((x) => x.text) };
    case "skills":
      return { groups: arr(o.groups).map((g) => ({ id: v4(), label: str(g?.label, "Skills"), items: strArr(g?.items) })).filter((g) => g.items.length) };
    case "links":
      return { items: arr(o.items).map((l) => ({ id: v4(), label: str(l?.label), url: str(l?.url) })).filter((l) => l.url) };
    case "projects":
      return { items: arr(o.items).map((p) => {
        const r = p;
        return { id: v4(), name: str(r.name), link: str(r.link), tech: str(r.tech), bullets: strArr(r.bullets) };
      }).filter((p) => p.name || p.bullets.length) };
    case "timeline":
      return { items: arr(o.items).map((p) => {
        const r = p;
        return { id: v4(), role: str(r.role), organization: str(r.organization), location: str(r.location), startDate: str(r.startDate), endDate: str(r.endDate), bullets: strArr(r.bullets) };
      }).filter((p) => p.role || p.organization || p.bullets.length) };
    case "custom":
      return { items: arr(o.items).map((p) => {
        const r = p;
        return { id: v4(), title: str(r.title), subtitle: str(r.subtitle), dateRange: str(r.dateRange), bullets: strArr(r.bullets) };
      }).filter((p) => p.title || p.bullets.length) };
  }
}
function mergeInto(target, src) {
  for (const [k, v] of Object.entries(src.personal)) {
    if (v && !target.personal[k]) target.personal[k] = v;
  }
  for (const sec of src.sections) {
    const existing = target.sections.find((s) => s.key === sec.key && s.kind === sec.kind);
    if (!existing) {
      target.sections.push(sec);
      continue;
    }
    if (existing.kind === "summary" || existing.kind === "richtext") {
      const a = existing.data.text;
      const b = sec.data.text;
      existing.data.text = a.length >= b.length ? a : b;
    } else if (existing.kind === "skills") {
      existing.data.groups.push(...sec.data.groups);
    } else {
      const ea = existing.data;
      const eb = sec.data;
      ea.items.push(...eb.items);
    }
  }
}
function toResumeState(result, base) {
  const personal = { ...base.personal, ...stripUndef(result.personal) };
  const sections = result.sections.map((d) => ({
    id: v4(),
    kind: d.kind,
    key: d.key,
    title: d.title,
    enabled: true,
    data: d.data
  }));
  return { personal, sections };
}
function stripUndef(o) {
  const out = {};
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v !== void 0 && v !== null && v !== "") out[k] = v;
  }
  return out;
}
function ImportResumeModal({ open, onClose, status, generate }) {
  const baseResume = useResumeStore((s) => s.resume);
  const loadResume = useResumeStore((s) => s.loadResume);
  const [stage, setStage] = reactExports.useState("idle");
  const [progress, setProgress] = reactExports.useState({ i: 0, total: 1, label: "" });
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [usedAI, setUsedAI] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const reset = () => {
    setStage("idle");
    setResult(null);
    setError(null);
    setProgress({ i: 0, total: 1, label: "" });
  };
  const onFile = async (file) => {
    reset();
    try {
      setStage("extracting");
      setProgress({ i: 0, total: 1, label: `Reading ${file.name}…` });
      const doc = await extractFromFile(file);
      setProgress({ i: 0, total: doc.pages.length, label: `Extracted ${doc.pages.length} page(s).` });
      setStage("parsing");
      const aiAvailable = status === "ready";
      setUsedAI(aiAvailable);
      const parsed = aiAvailable ? await parseWithAI(doc.pages, generate, (i, total) => setProgress({ i, total, label: `Analyzing page ${i + 1}/${total}…` })) : parseHeuristic(doc.pages);
      setResult(parsed);
      setStage("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStage("error");
    }
  };
  const commit = (mode) => {
    if (!result) return;
    if (mode === "replace") {
      loadResume(toResumeState(result, baseResume));
    } else {
      const next = toResumeState(result, baseResume);
      loadResume({
        personal: { ...baseResume.personal, ...next.personal },
        sections: [...baseResume.sections, ...next.sections.filter((s) => !baseResume.sections.some((x) => x.key === s.key))]
      });
    }
    onClose();
    reset();
  };
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: () => {
        onClose();
        reset();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          onClick: (e) => e.stopPropagation(),
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 10, opacity: 0 },
          transition: { duration: 0.18 },
          className: "w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-rule bg-card shadow-2xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-rule", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14, className: "text-ai" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono-display text-base", children: "Import Resume" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-ink-soft", children: status === "ready" ? "AI ready" : "heuristic mode" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                onClose();
                reset();
              }, className: "p-1 rounded hover:bg-paper", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 overflow-y-auto flex-1", children: [
              stage === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onDrop,
                    onDragOver: (e) => e.preventDefault(),
                    className: "border-2 border-dashed border-rule rounded-xl p-8 text-center hover:border-ink transition cursor-pointer",
                    onClick: () => fileRef.current?.click(),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 28, className: "mx-auto mb-2 text-ink-soft" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[13px]", children: "Drop your resume here, or click to browse" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-ink-soft mt-1", children: "PDF · DOCX · TXT — up to 10 MB. Files never leave your device." })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".pdf,.docx,.txt", hidden: true, onChange: (e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-ink-soft mt-3", children: status === "ready" ? "Each page will be analyzed by your local AI model and mapped to known section types." : "Load an AI model in the editor for the best extraction. Without it, a heuristic parser will still recover most sections." })
              ] }),
              (stage === "extracting" || stage === "parsing") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 24, className: "mx-auto mb-3 text-ink-soft animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[12px]", children: progress.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1.5 w-full rounded-full bg-rule overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "h-full bg-ai", animate: { width: `${Math.round((progress.i + 1) / Math.max(1, progress.total) * 100)}%` }, transition: { ease: "linear" } }) })
              ] }),
              stage === "review" && result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-mono text-ink-soft", children: [
                  "Detected via ",
                  usedAI ? "AI" : "heuristic",
                  " parsing:"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-rule p-3 bg-paper", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft mb-1.5", children: "Personal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] grid grid-cols-2 gap-x-4", children: [
                    Object.entries(result.personal).filter(([, v]) => v).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-ink-soft", children: [
                        k,
                        ":"
                      ] }),
                      " ",
                      String(v)
                    ] }, k)),
                    Object.values(result.personal).filter(Boolean).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-ink-soft", children: "No fields detected." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-rule p-3 bg-paper max-h-[320px] overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft mb-1.5", children: [
                    "Sections (",
                    result.sections.length,
                    ")"
                  ] }),
                  result.sections.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-ink-soft", children: "No sections detected. Try a different file or load an AI model." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: result.sections.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-[12px] flex justify-between gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: s.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-ink-soft text-[11px]", children: [
                      s.kind,
                      " · ",
                      countItems(s.data),
                      " items"
                    ] })
                  ] }, i)) })
                ] })
              ] }),
              stage === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-[12px] text-destructive", children: error })
            ] }),
            stage === "review" && result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-rule flex gap-2 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "rounded-md border border-rule text-[12px] font-mono px-3 py-2 hover:border-ink transition", children: "Try another" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => commit("merge"), className: "rounded-md border border-ink text-[12px] font-mono px-3 py-2 hover:bg-paper transition", children: "Merge with current" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => commit("replace"), className: "rounded-md bg-ink text-paper text-[12px] font-mono px-3 py-2 hover:opacity-90 transition", children: "Replace resume" })
            ] })
          ]
        }
      )
    }
  ) });
}
function countItems(d) {
  if (!d || typeof d !== "object") return 0;
  const o = d;
  if (Array.isArray(o.items)) return o.items.length;
  if (Array.isArray(o.groups)) return o.groups.length;
  if (typeof o.text === "string") return o.text ? 1 : 0;
  return 0;
}
const MODELS = [
  {
    id: "auto",
    label: "Smart Auto",
    tag: "Auto",
    vramGb: 0,
    qualityPct: 90,
    speedPct: 90,
    modelId: "",
    blurb: "Detects your device and picks the best fit."
  },
  {
    id: "gemma-2-2b",
    label: "Gemma 2 · 2B (Fast)",
    tag: "Fast",
    vramGb: 2.2,
    qualityPct: 78,
    speedPct: 95,
    modelId: "gemma-2-2b-it-q4f16_1-MLC",
    blurb: "Snappy on most laptops. Great for rewrites and tone shifts."
  },
  {
    id: "gemma-2-9b",
    label: "Gemma 2 · 9B (Pro)",
    tag: "Pro",
    vramGb: 6.5,
    qualityPct: 96,
    speedPct: 65,
    modelId: "gemma-2-9b-it-q4f16_1-MLC",
    blurb: "Highest fidelity. Recommended on discrete GPUs / Apple Silicon."
  }
];
async function detectDeviceCapability() {
  const fallback = {
    webgpu: false,
    vramGb: 0,
    recommendation: MODELS[1]
  };
  try {
    const nav = navigator;
    if (!nav.gpu) return fallback;
    const adapter = await nav.gpu.requestAdapter();
    if (!adapter) return fallback;
    const limits = adapter.limits;
    const maxBuffer = limits.maxBufferSize ?? 0;
    const vramGb = Math.max(2, Math.round(maxBuffer / 1024 / 1024 / 1024 * 10) / 10);
    const recommendation = vramGb >= 6 ? MODELS[2] : MODELS[1];
    return { webgpu: true, vramGb, recommendation };
  } catch {
    return fallback;
  }
}
function ModelPanel({ status, progress, onLoad }) {
  const modelId = useResumeStore((s) => s.modelId);
  const setModelId = useResumeStore((s) => s.setModelId);
  const [cap, setCap] = reactExports.useState(null);
  reactExports.useEffect(() => {
    detectDeviceCapability().then(setCap);
  }, []);
  const selected = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const resolvedModel = selected.id === "auto" ? cap?.recommendation ?? MODELS[1] : selected;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft", children: "Local AI Model" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-mono ${cap?.webgpu ? "text-ai" : "text-ink-soft"}`, children: cap === null ? "checking…" : cap.webgpu ? `WebGPU · ~${cap.vramGb}GB` : "WebGPU unavailable" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: MODELS.map((m) => {
      const isSel = m.id === modelId;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setModelId(m.id), className: `w-full text-left rounded-md border p-3 transition ${isSel ? "border-ink bg-paper" : "border-rule hover:border-ink/40"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[12px]", children: m.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono px-1.5 py-0.5 rounded border border-rule", children: m.tag })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-ink-soft mt-1", children: m.blurb }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-3 gap-2 text-[9px] font-mono text-ink-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { label: "quality", v: m.qualityPct }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { label: "speed", v: m.speedPct }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70", children: "VRAM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-ink", children: m.id === "auto" ? "auto" : `${m.vramGb} GB` })
          ] })
        ] })
      ] }, m.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onLoad(resolvedModel.modelId),
        disabled: status === "loading",
        className: "flex-1 rounded-md bg-ink text-paper text-[12px] font-mono py-2 hover:opacity-90 disabled:opacity-50 transition",
        children: status === "loading" ? "Caching…" : status === "ready" ? "Reload model" : "Load model"
      }
    ) }),
    status === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-rule overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: { width: `${Math.round((progress.progress ?? 0) * 100)}%` }, transition: { ease: "linear" }, className: "h-full bg-ai glow-ai" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-ink-soft mt-1.5 truncate animate-shimmer-ai", children: progress.text || "Downloading shards…" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-ink-soft mt-3 leading-snug", children: "Your resume never leaves your device. Inference runs in a Web Worker via WebGPU; the model is cached after first load." })
  ] });
}
function Bar({ label, v }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded bg-rule overflow-hidden mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-ink", style: { width: `${v}%` } }) })
  ] });
}
function wordDiff(a, b) {
  const A = a.split(/(\s+)/);
  const B = b.split(/(\s+)/);
  const m = A.length, n = B.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i2 = m - 1; i2 >= 0; i2--)
    for (let j2 = n - 1; j2 >= 0; j2--)
      dp[i2][j2] = A[i2] === B[j2] ? dp[i2 + 1][j2 + 1] + 1 : Math.max(dp[i2 + 1][j2], dp[i2][j2 + 1]);
  const out = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) {
      out.push({ type: "same", text: A[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "del", text: A[i] });
      i++;
    } else {
      out.push({ type: "add", text: B[j] });
      j++;
    }
  }
  while (i < m) out.push({ type: "del", text: A[i++] });
  while (j < n) out.push({ type: "add", text: B[j++] });
  return out;
}
function AiCopilot({ section, status, generate }) {
  const resume = useResumeStore((s) => s.resume);
  const patch = useResumeStore((s) => s.patchSection);
  const [goal, setGoal] = reactExports.useState("");
  const [streaming, setStreaming] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [proposal, setProposal] = reactExports.useState(null);
  if (!section) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-rule bg-card p-4 text-[12px] text-ink-soft", children: "Select a section to edit." });
  }
  const canRewrite = ["summary", "richtext", "timeline", "projects", "custom"].includes(section.kind);
  const sectionText = sectionToText(section);
  const run = (g) => {
    if (!canRewrite || !g.trim()) return;
    setBusy(true);
    setStreaming("");
    setProposal(null);
    const prompt = rewritePrompt({ section, goal: g, current: sectionText, resume });
    generate(prompt, {
      onToken: (acc) => setStreaming(acc),
      onDone: (text) => {
        setProposal(text.trim());
        setBusy(false);
      },
      onError: () => setBusy(false)
    });
  };
  const apply = () => {
    if (!proposal) return;
    if (section.kind === "summary" || section.kind === "richtext") {
      patch(section.id, (s) => ({ ...s, data: { ...s.data, text: proposal } }));
    } else if (section.kind === "timeline") {
      const bullets = proposal.split(/\n+/).map((s) => s.replace(/^[-•]\s*/, "")).filter(Boolean);
      patch(section.id, (s) => {
        const d = s.data;
        const items = d.items.length === 0 ? [{ id: crypto.randomUUID(), role: "", organization: "", location: "", startDate: "", endDate: "", bullets }] : d.items.map((it, i) => i === 0 ? { ...it, bullets } : it);
        return { ...s, data: { items } };
      });
    } else if (section.kind === "projects") {
      const bullets = proposal.split(/\n+/).map((s) => s.replace(/^[-•]\s*/, "")).filter(Boolean);
      patch(section.id, (s) => {
        const d = s.data;
        const items = d.items.length === 0 ? [{ id: crypto.randomUUID(), name: section.title, link: "", tech: "", bullets }] : d.items.map((it, i) => i === 0 ? { ...it, bullets } : it);
        return { ...s, data: { items } };
      });
    } else if (section.kind === "custom") {
      const bullets = proposal.split(/\n+/).map((s) => s.replace(/^[-•]\s*/, "")).filter(Boolean);
      patch(section.id, (s) => {
        const d = s.data;
        const items = d.items.length === 0 ? [{ id: crypto.randomUUID(), title: section.title, subtitle: "", dateRange: "", bullets }] : d.items.map((it, i) => i === 0 ? { ...it, bullets } : it);
        return { ...s, data: { items } };
      });
    }
    setProposal(null);
    setStreaming("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft", children: [
        "AI Copilot — ",
        section.title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-mono ${status === "ready" ? "text-ai" : "text-ink-soft"}`, children: status === "ready" ? "● ready" : status === "loading" ? "loading" : status === "generating" ? "● streaming" : "demo mode" })
    ] }),
    !canRewrite ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-ink-soft", children: "Rewrites work for prose, timeline, project, and custom sections." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: goal,
            onChange: (e) => setGoal(e.target.value),
            placeholder: "e.g. Optimize for staff-level FAANG",
            className: "flex-1 rounded-md border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            disabled: busy || !goal.trim(),
            onClick: () => run(goal),
            className: "rounded-md bg-ink text-paper px-3 text-[12px] font-mono hover:opacity-90 disabled:opacity-40 transition",
            children: "Rewrite"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mb-3", children: QUICK_GOALS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setGoal(g);
            run(g);
          },
          disabled: busy,
          className: "text-[10px] font-mono px-2 py-1 rounded-full border border-rule hover:border-ink hover:bg-paper transition disabled:opacity-40",
          children: g
        },
        g
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: (busy || streaming || proposal) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 4 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          className: "rounded-md border border-ai/40 bg-paper p-3 mt-2 glow-ai",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ai mb-1", children: proposal ? "Proposed rewrite" : "Streaming…" }),
            proposal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DiffView, { before: sectionText, after: proposal }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] leading-snug whitespace-pre-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ai-caret", children: streaming }) }),
            proposal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: apply, className: "rounded-md bg-ai text-white text-[11px] font-mono px-3 py-1.5 hover:opacity-90", children: "Apply" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setProposal(null);
                setStreaming("");
              }, className: "rounded-md border border-rule text-[11px] font-mono px-3 py-1.5 hover:border-ink", children: "Discard" })
            ] })
          ]
        },
        "output"
      ) })
    ] })
  ] });
}
function DiffView({ before, after }) {
  const parts = wordDiff(before, after);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] leading-snug whitespace-pre-wrap", children: parts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: p.type === "add" ? "bg-ai/15 text-ai" : p.type === "del" ? "line-through opacity-50 text-ink-soft" : "", children: p.text }, i)) });
}
function sectionToText(s) {
  switch (s.kind) {
    case "summary":
    case "richtext":
      return s.data.text;
    case "timeline":
      return s.data.items[0]?.bullets.join("\n") ?? "";
    case "projects":
      return s.data.items[0]?.bullets.join("\n") ?? "";
    case "custom":
      return s.data.items[0]?.bullets.join("\n") ?? "";
    default:
      return "";
  }
}
const TEMPLATES = [
  { key: "ats-minimal", name: "ATS Minimal", blurb: "Pure text-layer. Single column. Maximum parser friendliness.", swatch: ["#0d0d0d", "#f5f3ee"] },
  { key: "faang", name: "FAANG", blurb: "Two-column accent header. Quantified impact bias.", swatch: ["#0d0d0d", "#c9a84c"] },
  { key: "modern-dark", name: "Modern Dark", blurb: "Inverted ink-on-paper preview. Light export for ATS.", swatch: ["#1a1a2e", "#4ade80"] },
  { key: "academic", name: "Academic", blurb: "Serif-tinged hierarchy. Publications-first ordering.", swatch: ["#2d2d2d", "#a78bfa"] },
  { key: "compact", name: "Compact", blurb: "Dense single-column. Fits more on one page.", swatch: ["#0d0d0d", "#9ca3af"] },
  { key: "elegant-serif", name: "Elegant Serif", blurb: "Refined serif with centered hairline header.", swatch: ["#1f1b16", "#8b5e3c"] },
  { key: "two-column", name: "Two Column", blurb: "Sidebar for skills & contact, main column for impact.", swatch: ["#1f2937", "#3b82f6"] },
  { key: "creative-sidebar", name: "Creative Sidebar", blurb: "Bold dark sidebar with name + contact, light content area.", swatch: ["#1a1a1a", "#e85d3a"] },
  { key: "executive", name: "Executive", blurb: "Centered name, double-rule header. Senior-leader feel.", swatch: ["#0c2340", "#c9a84c"] },
  { key: "engineer-mono", name: "Engineer Mono", blurb: "All-mono terminal aesthetic. Hacker-friendly.", swatch: ["#0d0d0d", "#22c55e"] }
];
function TemplateSwitcher() {
  const template = useResumeStore((s) => s.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft mb-2", children: "Template" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: TEMPLATES.map((t) => {
      const sel = t.key === template;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTemplate(t.key), className: `text-left rounded-md border p-2 transition ${sel ? "border-ink bg-paper" : "border-rule hover:border-ink/40"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-1.5", children: t.swatch.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-sm border border-rule", style: { background: c } }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px]", children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] text-ink-soft leading-snug mt-0.5", children: t.blurb })
      ] }, t.key);
    }) })
  ] });
}
const ATS_KEYWORDS = ["led", "shipped", "owned", "built", "designed", "scaled", "improved", "reduced", "increased", "launched", "architected", "drove", "delivered"];
function findEnabled(r, kind) {
  return r.sections.filter((s) => s.enabled && s.kind === kind);
}
function collectBullets(r) {
  const out = [];
  for (const s of r.sections) {
    if (!s.enabled) continue;
    if (s.kind === "timeline") for (const it of s.data.items) out.push(...it.bullets);
    else if (s.kind === "projects") for (const it of s.data.items) out.push(...it.bullets);
    else if (s.kind === "custom") for (const it of s.data.items) out.push(...it.bullets);
  }
  return out;
}
function computeAts(r) {
  const hasContact = !!r.personal.email && !!r.personal.phone ? 15 : 0;
  const summary = findEnabled(r, "summary")[0];
  const summaryText = summary && summary.kind === "summary" ? summary.data.text : "";
  const hasSummary = summaryText.length > 60 ? 10 : 0;
  const bullets = collectBullets(r);
  const total = bullets.length || 1;
  const quantified = bullets.filter((b) => /\d/.test(b)).length;
  const quantifiedImpact = Math.round(quantified / total * 25);
  const text = bullets.join(" ").toLowerCase();
  const matched = ATS_KEYWORDS.filter((k) => text.includes(k)).length;
  const keywordDensity = Math.round(matched / ATS_KEYWORDS.length * 20);
  const goodLen = bullets.filter((b) => b.length >= 60 && b.length <= 220).length;
  const bulletQuality = Math.round(goodLen / total * 15);
  let skillCount = 0;
  for (const s of findEnabled(r, "skills")) {
    if (s.kind === "skills") skillCount += s.data.groups.reduce((a, g) => a + g.items.length, 0);
  }
  const skillsCoverage = Math.min(15, Math.round(skillCount / 12 * 15));
  return {
    total: hasContact + hasSummary + quantifiedImpact + keywordDensity + bulletQuality + skillsCoverage,
    hasContact,
    hasSummary,
    bulletQuality,
    quantifiedImpact,
    keywordDensity,
    skillsCoverage
  };
}
function AtsMeter() {
  const resume = useResumeStore((s) => s.resume);
  const ats = reactExports.useMemo(() => computeAts(resume), [resume]);
  const tier = ats.total >= 85 ? "Top 5%" : ats.total >= 70 ? "Recruiter-ready" : ats.total >= 50 ? "Solid draft" : "Needs work";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft", children: "ATS Score" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-ai", children: tier })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono-display text-5xl font-semibold tabular-nums", children: ats.total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-ink-soft mb-1.5", children: "/ 100" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1.5 w-full rounded-full bg-rule overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { width: 0 }, animate: { width: `${ats.total}%` }, transition: { duration: 0.7, ease: "easeOut" }, className: "h-full bg-ink" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 text-[11px]", children: [["Contact info", ats.hasContact, 15], ["Strong summary", ats.hasSummary, 10], ["Quantified impact", ats.quantifiedImpact, 25], ["Action keywords", ats.keywordDensity, 20], ["Bullet quality", ats.bulletQuality, 15], ["Skills coverage", ats.skillsCoverage, 15]].map(([label, val, max]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between text-ink-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono tabular-nums", children: [
        val,
        "/",
        max
      ] })
    ] }, label)) })
  ] });
}
function Body({ s }) {
  switch (s.kind) {
    case "summary":
    case "richtext": {
      const d = s.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-line", children: d.text });
    }
    case "list": {
      const d = s.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-4", children: d.items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: i.text }, i.id)) });
    }
    case "timeline": {
      const d = s.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: d.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            it.role,
            it.organization ? ` · ${it.organization}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-ink-soft", children: [
            it.startDate,
            it.endDate ? `–${it.endDate}` : ""
          ] })
        ] }),
        it.location ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-ink-soft text-[9.5px]", children: it.location }) : null,
        it.bullets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-4 mt-0.5", children: it.bullets.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b }, i)) })
      ] }, it.id)) });
    }
    case "projects": {
      const d = s.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: d.items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: p.tech })
        ] }),
        p.bullets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-4 mt-0.5", children: p.bullets.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b }, i)) })
      ] }, p.id)) });
    }
    case "skills": {
      const d = s.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: d.groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          g.label,
          ": "
        ] }),
        g.items.join(", ")
      ] }, g.id)) });
    }
    case "links": {
      const d = s.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: d.items.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          l.label,
          ": "
        ] }),
        l.url
      ] }, l.id)) });
    }
    case "custom": {
      const d = s.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: d.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            it.title,
            it.subtitle ? ` · ${it.subtitle}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: it.dateRange })
        ] }),
        it.bullets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-4 mt-0.5", children: it.bullets.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b }, i)) })
      ] }, it.id)) });
    }
  }
}
function isEmpty(s) {
  switch (s.kind) {
    case "summary":
    case "richtext":
      return !s.data.text?.trim();
    case "list":
      return s.data.items.length === 0;
    case "timeline":
      return s.data.items.length === 0;
    case "projects":
      return s.data.items.length === 0;
    case "skills":
      return s.data.groups.length === 0;
    case "links":
      return s.data.items.length === 0;
    case "custom":
      return s.data.items.length === 0;
  }
}
function visibleSections(r) {
  return r.sections.filter((s) => s.enabled && !isEmpty(s));
}
function H({ title }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink border-b border-rule pb-0.5 mb-1.5", children: title });
}
function AtsMinimal({ r }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-sans text-[10.5px] leading-snug text-ink p-10 bg-white", style: { width: 612, minHeight: 792 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-mono font-semibold tracking-tight", children: r.personal.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-ink-soft", children: r.personal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] text-ink-soft mt-1", children: [r.personal.email, r.personal.phone, r.personal.location, r.personal.website, r.personal.github, r.personal.linkedin].filter(Boolean).join(" · ") })
    ] }),
    visibleSections(r).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(H, { title: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id))
  ] });
}
function Faang({ r }) {
  const sections = visibleSections(r);
  const isMain = (k) => k === "summary" || k === "timeline" || k === "projects" || k === "richtext" || k === "custom";
  const main = sections.filter((s) => isMain(s.kind));
  const aside = sections.filter((s) => !isMain(s.kind));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-sans text-[10.5px] leading-snug text-ink bg-white", style: { width: 612, minHeight: 792 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-10 pt-8 pb-4 border-b-4", style: { borderColor: "#c9a84c" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-mono font-bold tracking-tight", children: r.personal.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-ink-soft", children: r.personal.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] text-ink-soft", children: [r.personal.email, r.personal.phone, r.personal.github].filter(Boolean).join(" · ") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-10 py-4 grid grid-cols-[1fr_180px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: main.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(H, { title: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
      ] }, s.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "text-[9.5px]", children: aside.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(H, { title: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
      ] }, s.id)) })
    ] })
  ] });
}
function ModernDark({ r }) {
  const A = "#4ade80";
  const Hdark = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-mono uppercase tracking-[0.18em] mb-1", style: { color: A }, children: t });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-sans text-[10.5px] leading-snug text-paper p-10", style: { width: 612, minHeight: 792, background: "#1a1a2e" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4 border-b pb-3", style: { borderColor: A }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-mono font-bold tracking-tight", style: { color: A }, children: r.personal.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] opacity-80", children: r.personal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] opacity-60 mt-1", children: [r.personal.email, r.personal.phone, r.personal.github, r.personal.linkedin].filter(Boolean).join(" · ") })
    ] }),
    visibleSections(r).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 opacity-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hdark, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id))
  ] });
}
function Academic({ r }) {
  const Hac = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] uppercase tracking-[0.18em] border-b border-ink mb-1", style: { fontFamily: "Georgia, serif" }, children: t });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10.5px] leading-snug text-ink p-12 bg-white", style: { width: 612, minHeight: 792, fontFamily: "Georgia, serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] tracking-tight", children: r.personal.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] italic", children: r.personal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px]", children: [r.personal.email, r.personal.phone, r.personal.location, r.personal.website].filter(Boolean).join(" · ") })
    ] }),
    visibleSections(r).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hac, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id))
  ] });
}
function Compact({ r }) {
  const Hc = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[9px] font-mono uppercase tracking-[0.2em] text-ink border-b border-rule mb-1", children: t });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-sans text-[9.5px] leading-tight text-ink p-8 bg-white", style: { width: 612, minHeight: 792 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-2 flex justify-between items-end border-b border-ink pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[18px] font-mono font-semibold tracking-tight leading-none", children: r.personal.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-ink-soft", children: r.personal.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8.5px] text-ink-soft text-right", children: [
        [r.personal.email, r.personal.phone, r.personal.location].filter(Boolean).join(" · "),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        [r.personal.website, r.personal.github, r.personal.linkedin].filter(Boolean).join(" · ")
      ] })
    ] }),
    visibleSections(r).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hc, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id))
  ] });
}
function ElegantSerif({ r }) {
  const accent = "#8b5e3c";
  const He = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] uppercase tracking-[0.3em] mb-1.5 text-center", style: { fontFamily: "Georgia, serif", color: accent }, children: t });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10.5px] leading-snug text-ink p-12 bg-white", style: { width: 612, minHeight: 792, fontFamily: "Georgia, serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center mb-5 pb-3", style: { borderBottom: `0.5px solid ${accent}` }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[26px] tracking-[0.06em] font-light", children: r.personal.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 inline-block w-10 border-t", style: { borderColor: accent } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] italic", style: { color: accent }, children: r.personal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] mt-1", children: [r.personal.email, r.personal.phone, r.personal.location, r.personal.website].filter(Boolean).join(" · ") })
    ] }),
    visibleSections(r).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(He, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id))
  ] });
}
function TwoColumn({ r }) {
  const accent = "#3b82f6";
  const sections = visibleSections(r);
  const isMain = (k) => k === "summary" || k === "timeline" || k === "projects" || k === "richtext" || k === "custom";
  const main = sections.filter((s) => isMain(s.kind));
  const aside = sections.filter((s) => !isMain(s.kind));
  const Hm = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-sans font-bold uppercase tracking-[0.18em] mb-1", style: { color: accent }, children: t });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-sans text-[10.5px] leading-snug text-ink bg-white", style: { width: 612, minHeight: 792 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[200px_1fr] min-h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "p-6 text-[9.5px]", style: { background: "#f3f4f6" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[18px] font-bold tracking-tight leading-tight", children: r.personal.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] mb-3", style: { color: accent }, children: r.personal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 mb-4 break-words", children: [
        r.personal.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.email }),
        r.personal.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.phone }),
        r.personal.location && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.location }),
        r.personal.website && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.website }),
        r.personal.github && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.github }),
        r.personal.linkedin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.linkedin })
      ] }),
      aside.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hm, { t: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
      ] }, s.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: main.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hm, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id)) })
  ] }) });
}
function CreativeSidebar({ r }) {
  const accent = "#e85d3a";
  const sections = visibleSections(r);
  const isMain = (k) => k === "summary" || k === "timeline" || k === "projects" || k === "richtext" || k === "custom";
  const main = sections.filter((s) => isMain(s.kind));
  const aside = sections.filter((s) => !isMain(s.kind));
  const Hd = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] uppercase tracking-[0.22em] mb-1", style: { color: accent }, children: t });
  const Hl = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-ink border-b border-rule pb-0.5 mb-1.5", children: t });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-sans text-[10.5px] leading-snug text-ink bg-white", style: { width: 612, minHeight: 792 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[210px_1fr] min-h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "p-6 text-[9.5px] text-paper", style: { background: "#1a1a1a" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[20px] font-bold leading-tight", style: { color: accent }, children: r.personal.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] opacity-80 mb-4", children: r.personal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 mb-4 break-words opacity-85", children: [
        r.personal.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.email }),
        r.personal.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.phone }),
        r.personal.location && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.location }),
        r.personal.website && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.website }),
        r.personal.github && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.github }),
        r.personal.linkedin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.personal.linkedin })
      ] }),
      aside.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3 opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hd, { t: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
      ] }, s.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: main.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hl, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id)) })
  ] }) });
}
function Executive({ r }) {
  const accent = "#0c2340";
  const gold = "#c9a84c";
  const Hex = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10.5px] font-bold uppercase tracking-[0.22em] mb-1.5", style: { color: accent, fontFamily: "Georgia, serif" }, children: t });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10.5px] leading-snug text-ink p-12 bg-white", style: { width: 612, minHeight: 792, fontFamily: "Georgia, serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center pb-3 mb-4", style: { borderTop: `2px solid ${accent}`, borderBottom: `0.5px solid ${gold}`, paddingTop: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] tracking-[0.08em] font-semibold", style: { color: accent }, children: r.personal.name.toUpperCase() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] italic mt-0.5", style: { color: gold }, children: r.personal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] mt-1.5", children: [r.personal.email, r.personal.phone, r.personal.location, r.personal.linkedin].filter(Boolean).join("  |  ") })
    ] }),
    visibleSections(r).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hex, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id))
  ] });
}
function EngineerMono({ r }) {
  const accent = "#22c55e";
  const Hm = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] uppercase tracking-[0.2em] mb-1", style: { color: accent }, children: [
    "# ",
    t
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] leading-snug text-ink p-10 bg-white", style: { width: 612, minHeight: 792 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[20px] font-semibold tracking-tight", children: [
        r.personal.name,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: accent }, children: "_" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-ink-soft", children: [
        "// ",
        r.personal.title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-ink-soft mt-1", children: [r.personal.email, r.personal.phone, r.personal.github, r.personal.linkedin, r.personal.website].filter(Boolean).map((v) => `[${v}]`).join(" ") })
    ] }),
    visibleSections(r).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hm, { t: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { s })
    ] }, s.id))
  ] });
}
function Inner({ r, template }) {
  switch (template) {
    case "faang":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Faang, { r });
    case "modern-dark":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ModernDark, { r });
    case "academic":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Academic, { r });
    case "compact":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Compact, { r });
    case "elegant-serif":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ElegantSerif, { r });
    case "two-column":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TwoColumn, { r });
    case "creative-sidebar":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CreativeSidebar, { r });
    case "executive":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Executive, { r });
    case "engineer-mono":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(EngineerMono, { r });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(AtsMinimal, { r });
  }
}
const HtmlPreview = reactExports.memo(Inner);
function useAI() {
  const workerRef = reactExports.useRef(null);
  const [status, setStatus] = reactExports.useState("idle");
  const [progress, setProgress] = reactExports.useState({ progress: 0, text: "" });
  const [error, setError] = reactExports.useState(null);
  const callbacksRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const ensureWorker = reactExports.useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const w = new Worker(new URL("./aiWorker.ts", import.meta.url), { type: "module" });
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === "progress") setProgress({ progress: m.progress ?? 0, text: m.text ?? "" });
      else if (m.type === "ready") setStatus("ready");
      else if (m.type === "token") {
        const cb = callbacksRef.current.get(m.id);
        cb?.onToken(m.acc);
      } else if (m.type === "done") {
        const id = m.id;
        const cb = callbacksRef.current.get(id);
        cb?.onDone(m.text);
        callbacksRef.current.delete(id);
        setStatus("ready");
      } else if (m.type === "error") {
        setError(m.message ?? "Unknown error");
        setStatus("error");
        callbacksRef.current.forEach((cb) => cb.onError(m.message ?? "error"));
        callbacksRef.current.clear();
      }
    };
    workerRef.current = w;
    return w;
  }, []);
  const loadModel = reactExports.useCallback(async (modelId) => {
    setError(null);
    if (!modelId) {
      setStatus("ready");
      return;
    }
    setStatus("loading");
    setProgress({ progress: 0, text: "Initializing WebGPU…" });
    try {
      const w = ensureWorker();
      w.postMessage({ type: "load", modelId });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, [ensureWorker]);
  const generate = reactExports.useCallback(
    (prompt, handlers) => {
      const id = crypto.randomUUID();
      if (!workerRef.current || status !== "ready") {
        runMock(prompt, handlers);
        return id;
      }
      callbacksRef.current.set(id, {
        onToken: handlers.onToken,
        onDone: handlers.onDone,
        onError: handlers.onError ?? (() => {
        })
      });
      setStatus("generating");
      workerRef.current.postMessage({ type: "generate", id, prompt });
      return id;
    },
    [status]
  );
  reactExports.useEffect(() => () => {
    workerRef.current?.terminate();
  }, []);
  return { status, progress, error, loadModel, generate };
}
function runMock(prompt, h) {
  const goalMatch = prompt.match(/goal: "([^"]+)"/);
  const goal = goalMatch?.[1] ?? "improve clarity";
  const text = `Reframed for ${goal.toLowerCase()}: shipped measurable impact across critical surfaces, owning the system end-to-end. Drove 30%+ gains in latency and reliability while mentoring engineers across 3 teams.`;
  let i = 0;
  const tick = () => {
    i = Math.min(text.length, i + 3);
    h.onToken(text.slice(0, i));
    if (i < text.length) setTimeout(tick, 18);
    else h.onDone(text);
  };
  setTimeout(tick, 120);
}
const PdfDownloadButton = reactExports.lazy(() => import("./PdfDownloadButton-MEXK7Lfw.js").then((m) => ({
  default: m.PdfDownloadButton
})));
function EditorPage() {
  const [activeId, setActiveId] = reactExports.useState("personal");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [importOpen, setImportOpen] = reactExports.useState(false);
  const resume = useResumeStore((s) => s.resume);
  const template = useResumeStore((s) => s.template);
  const ai = useAI();
  const activeSection = activeId === "personal" ? null : resume.sections.find((s) => s.id === activeId) ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-rule bg-card/60 backdrop-blur sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 h-14 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-mono-display text-base", children: [
        "ResumeOS",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ai", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-ink-soft hidden md:inline", children: "Local · Private · WebGPU" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setImportOpen(true), className: "flex items-center gap-1.5 rounded-md border border-rule text-[12px] font-mono px-3 py-1.5 hover:border-ink hover:bg-paper transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 12, className: "text-ai" }),
          " Import resume"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-md bg-ink text-paper text-[12px] font-mono px-3 py-1.5", children: "Export PDF" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PdfDownloadButton, {}) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1600px] px-6 py-6 grid grid-cols-12 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "col-span-3 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule bg-card p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft px-1 mb-2", children: "Sections" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionList, { activeId, onSelect: setActiveId, onAdd: () => setAddOpen(true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateSwitcher, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "col-span-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, className: "rounded-lg border border-rule bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono-display text-lg", children: activeSection ? activeSection.title : "Personal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-ink-soft", children: activeSection ? activeSection.enabled ? "enabled" : "disabled" : "always shown" })
          ] }),
          activeSection ? /* @__PURE__ */ jsxRuntimeExports.jsx(SectionForm, { section: activeSection }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PersonalForm, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AiCopilot, { section: activeSection, status: ai.status, generate: ai.generate })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "col-span-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ModelPanel, { status: ai.status, progress: ai.progress, onLoad: ai.loadModel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AtsMeter, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-rule bg-card p-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft mb-2", children: [
            "Live preview · ",
            template
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "origin-top-left scale-[0.62] -mb-[300px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HtmlPreview, { r: resume, template }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddSectionModal, { open: addOpen, onClose: () => setAddOpen(false), onAdded: (id) => setActiveId(id) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImportResumeModal, { open: importOpen, onClose: () => setImportOpen(false), status: ai.status, generate: ai.generate })
  ] });
}
const editor = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  component: EditorPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  editor as e,
  useResumeStore as u
};
