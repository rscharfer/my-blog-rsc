import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import Index from "./Index";



var data = JSON.parse(document.getElementById('STARTER_DATA')!.textContent!);

const root = document.getElementById("root");
hydrateRoot(root!, createElement(Index, data));
