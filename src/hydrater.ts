import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import MyApp from "./MyApp";



var data = JSON.parse(document.getElementById('STARTER_DATA')!.textContent)

const root = document.getElementById("root");
hydrateRoot(root!, createElement(MyApp, data));
