import { expect } from "vitest";
import { Given, Then } from "../dist";

Given("I run the tests", () => {});

Then("the tests should pass", () => {
  expect(true).to.be.true;
})

Given('I have a number {int}', (world, int) => {
  if (!world.numbers) world.numbers = [int]
  else world.numbers.push(int)
})

Then('the sum should be {int}', (world, int) => {
  expect(world.numbers.reduce((a,b) => a + b, 0)).toBe(int)
})

Then('the test {string} should include/contain {string}', (world, prop, value) => {
  expect(world.info[prop].toString()).toContain(value)
})