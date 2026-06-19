import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("renders an application/ld+json script with serialized data", () => {
    const data = { "@type": "WebSite", name: "Ghats Arcade" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script?.innerHTML ?? "{}")).toEqual(data);
  });
});
