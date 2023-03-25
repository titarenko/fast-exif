import { describe, expect, test } from "@jest/globals";
import { read } from "../src";

describe("fast-exif", () => {
  test("should work", async () => {
    // http://www.exiv2.org/sample.html
    const info = await read(`${__dirname}/assets/img_1771.jpg`);
    expect(info?.exif?.ApertureValue).toBe(4.65625);
  });

  test("should not hang up if no exif found (shallow search)", async () => {
    const info = await read(`${__dirname}/assets/img_1771_no_exif.jpg`);
    expect(info).toBe(undefined);
  });

  test("should not hang up if no exif found (deep search)", async () => {
    const info = await read(`${__dirname}/assets/img_1771_no_exif.jpg`, true);
    expect(info).toBe(undefined);
  });

  test("should not skip exif if 0xFF byte precedes marker (issue #2)", async () => {
    const info = await read(`${__dirname}/assets/issue2.jpg`, true);
    expect(info?.exif?.ApertureValue).toBe(5.655638);
  });
});
