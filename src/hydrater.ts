import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import MyApp from "./MyApp";



var data = await fetch("/data").then(response => response.json());

const root = document.getElementById("root");
hydrateRoot(root!, createElement(MyApp, data));
