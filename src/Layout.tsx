import Header from "./Header";
import * as React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <section className="layout">
        <Header />
        <div className="content">{children}</div>
      </section>
    </>
  );
}
