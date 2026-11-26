import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";

const STORAGE_KEY = "terra-studios-cart";

const sample = {
  slug: "radiance-renewal-serum",
  name: "Radiance Renewal Serum",
  price: 50,
  image: "/img.jpg",
};

function Probe() {
  const { items, addItem, totalItems, subtotal } = useCart();
  return (
    <div>
      <span data-testid="count">{totalItems}</span>
      <span data-testid="subtotal">{subtotal.toFixed(2)}</span>
      <span data-testid="names">{items.map(i => i.slug).join(",")}</span>
      <button onClick={() => addItem(sample, 2)}>add</button>
    </div>
  );
}

describe("cart persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves an added item to local storage", () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("add"));

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ slug: "radiance-renewal-serum", quantity: 2, price: 50 });
  });

  it("restores the cart when the app starts again", () => {
    const first = render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );
    fireEvent.click(screen.getByText("add"));
    first.unmount();

    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("100.00");
    expect(screen.getByTestId("names")).toHaveTextContent("radiance-renewal-serum");
  });

  it("starts empty when stored data is not a valid cart", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");

    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(screen.getByTestId("names")).toHaveTextContent("");
  });

  it("drops stored entries that are missing required fields", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ slug: "ok", name: "Ok", price: 10, image: "i", quantity: 1 }, { junk: true }])
    );

    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("names")).toHaveTextContent("ok");
  });
});
