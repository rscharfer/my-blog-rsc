import * as React from "react";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <>
      Count: {count}
      <br />
      <button onClick={increment}>Increment</button>
    </>
  );
}
