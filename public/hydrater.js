// src/hydrater.ts
import { createElement as createElement2 } from "react";
import { hydrateRoot } from "react-dom/client";

// src/MyApp.tsx
import * as React from "react";
import { useState } from "react";
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, "Count: ", count, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("button", { onClick: increment }, "Increment"));
}

// src/hydrater.ts
var root = document.getElementById("root");
hydrateRoot(root, createElement2(Counter));
