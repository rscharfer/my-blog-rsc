import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import MyApp from "./MyApp";

const root = document.getElementById("root");
hydrateRoot(root!, createElement(MyApp));
