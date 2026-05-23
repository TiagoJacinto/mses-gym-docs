import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, expect } from "bun:test";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});