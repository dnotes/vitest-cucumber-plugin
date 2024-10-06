import { expect } from "vitest";
import { Given, Then } from "../dist";

Given("I run the tests", () => {
  console.log("Running tests");
});

Then("They should pass", () => {
  expect(true).to.be.true;
})