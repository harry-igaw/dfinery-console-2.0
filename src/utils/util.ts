import _ from "lodash";

// 10진수 -> Hexacode
export function decimalToHexacode(
  decimal: string | number,
  zeroPaddingLength: number,
): string {
  if (!_.isString(decimal) && !_.isNumber(decimal)) {
    return decimal;
  }
  return _.padStart(
    _.parseInt(decimal.toString()).toString(16),
    zeroPaddingLength,
    "0",
  );
}

// Hexacode -> 10진수
export function hexacodeToDecimal(hexacode: string): number {
  if (!_.isString(hexacode)) {
    return hexacode;
  }
  return parseInt(`0x${hexacode}`, 16);
}

// opacity -> Hexacode
// ex) 0.55 -> 8C
export function opacityToHexacode(opacity: string | number): string {
  if (!_.isString(opacity) && !_.isNumber(opacity)) {
    return opacity;
  }
  const _opacity = !_.isNumber(opacity)
    ? parseFloat(opacity as string)
    : opacity;
  const opacity255Step = _.floor(_opacity * 255);
  return decimalToHexacode(opacity255Step, 2);
}

export function getRGBA(r: string, g: string, b: string, a: string) {
  const alpha = _.isNil(a) ? 1 : _.ceil(hexacodeToDecimal(a) / 255, 2);
  const red = hexacodeToDecimal(r);
  const green = hexacodeToDecimal(g);
  const blue = hexacodeToDecimal(b);
  return { r: red, g: green, b: blue, a: alpha };
}

export function parseHexacodeToRGBA(colorHexacode: string) {
  if (!_.isString(colorHexacode)) {
    return colorHexacode;
  }
  const matchArray = colorHexacode.match(
    /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})*/,
  );

  if (!_.isNil(matchArray)) {
    const [hexa, r, g, b, a] = matchArray;
    return getRGBA(r, g, b, a);
  }
  return null;
}
