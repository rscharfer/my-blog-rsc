// src/hydrater.ts
import { createElement as createElement2 } from "react";
import { hydrateRoot } from "react-dom/client";

// src/MyApp.tsx
import * as React from "react";
import { useState } from "react";
function Counter({
  firstName,
  lastName
}) {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "Hello ", firstName, " ", lastName), "Count: ", count, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("button", { onClick: increment }, "Increment"));
}

// src/hydrater.ts
var data = await fetch("/data").then((response) => response.json());
var root = document.getElementById("root");
hydrateRoot(root, createElement2(Counter, data));
