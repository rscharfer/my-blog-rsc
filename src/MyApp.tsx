import * as React from "react";
import { useState } from "react";

export default function Counter({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <>
      <div>
        Hello {firstName} {lastName}
      </div>
      Count: {count}
      <br />
      <button onClick={increment}>Increment</button>
    </>
  );
}
