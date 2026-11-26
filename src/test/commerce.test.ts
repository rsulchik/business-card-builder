import { describe, it, expect } from "vitest";
import { money, reconcileCart, validCustomer, type Customer } from "@/lib/commerce";
import type { Product } from "@/data/products";
const customer: Customer = { name: "Test Customer", phone: "+993 65 123456", email: "test@example.com", country: "Turkmenistan", city: "Ashgabat", address: "Test street 10", note: "", consent: true };
const product: Product = { slug:"p", name:"Cream", price:180, image:"/p.jpg", description:"", category:"skincare" };
describe("checkout validation",()=>{
  it("requires meaningful contact details, address and consent",()=>{
    expect(validCustomer(customer)).toBe(true);
    for(const changed of [{phone:"-------"},{email:"invalid"},{address:"x"},{consent:false},{name:" "},{city:""},{note:"x".repeat(1001)}]) expect(validCustomer({...customer,...changed})).toBe(false);
  });
  it("uses live prices and flags deleted, sold-out and unverified products",()=>{
    const result=reconcileCart([{slug:"p",quantity:2},{slug:"gone",quantity:1}],[product]);
    expect(result[0].product?.price).toBe(180);expect(result[1].unavailable).toBe(true);
    expect(reconcileCart([{slug:"p",quantity:1}],[{...product,priceNeedsReview:true}])[0].unavailable).toBe(true);
    expect(reconcileCart([{slug:"p",quantity:1}],[{...product,badge:"sold-out"}])[0].unavailable).toBe(true);
  });
  it("rejects fractional, negative and excessive quantities",()=>{
    for(const quantity of [0,-1,1.5,100,NaN]) expect(reconcileCart([{slug:"p",quantity}],[product])[0].unavailable).toBe(true);
  });
  it("clearly shows TMT currency",()=>expect(money(672.12)).toBe("672.12 TMT"));
});
