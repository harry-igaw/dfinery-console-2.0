const StyleDictionary = require("style-dictionary");
const path = require("path");

// parser start

// https://amzn.github.io/style-dictionary/#/parsers
// https://github.com/amzn/style-dictionary/blob/main/examples/advanced/custom-parser/sd.config.js
StyleDictionary.registerParser({
  pattern: /\.json$/,
  // eslint-disable-next-line consistent-return
  parse: ({ contents, filePath }) => {
    // Probably a good idea to wrap this in a try/catch block
    try {
      const object = JSON.parse(contents);
      const tokenKeys = object.$metadata.tokenSetOrder;
      const output = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const key in object) {
        if (tokenKeys.includes(key) && key !== "dfn") {
          Object.assign(output, object[key]);
        }
      }
      return output;
    } catch (error) {
      console.error("registerParser: ", error);
    }
  },
});

// parser end

// format start

StyleDictionary.registerFormat({
  name: "scss/variables",
  formatter: ({ dictionary, platform, file, options }) =>
    dictionary.allProperties
      .map((token) => {
        let value = JSON.stringify(token.value);
        if (dictionary.usesReference(token.original.value)) {
          const refs = dictionary.getReferences(token.original.value);
          refs.forEach((ref) => {
            value = value.replace(ref.value, () => `var(--${ref.name})`);
          });
        }
        value = value.replace(/"/g, "");

        // font 스타일을 한 번에 설정하기 위한 parser 작업
        // #{}을 추가하지 않으면, font-size 나누기 line-height가 됨
        if (token.type === "typography") {
          value = value
            .split(" ")
            .map((fontAttribute) => {
              if (fontAttribute.includes("/")) {
                return fontAttribute
                  .split("/")
                  .map((sizeOrLineHeight) => `#{${sizeOrLineHeight}}`)
                  .join("/");
              }
              return `#{${fontAttribute}}`;
            })
            .join(" ");
        }

        return `--${token.name}: ${value};`;
      })
      .join("\n"),
});

// format end

// transform start
StyleDictionary.registerTransform({
  name: "scss/border-width",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "borderWidth",
  transformer: (token) => `${token.value}`,
});

StyleDictionary.registerTransform({
  name: "scss/border",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "border",
  transformer: (token) =>
    `${token.value.width} ${token.value.style} ${token.value.color}`,
});

StyleDictionary.registerTransform({
  name: "scss/box-shadow",
  type: "value",
  transitive: true,
  matcher: (token) =>
    token.type === "boxShadow" && !token.path.includes("elevation"),
  transformer: (token) => {
    const value = token.value;
    if (typeof value === "string") {
      return token.value;
    }
    return `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color}`;
  },
});

StyleDictionary.registerTransform({
  name: "scss/typography",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "typography",
  transformer: (token) => {
    if (typeof token.original.value === "string") {
      return token.value;
    }
    return `${token.original.value.fontWeight} ${token.original.value.fontSize}/${token.original.value.lineHeight} ${token.original.value.fontFamily}`;
  },
});

// transform end

// extend start

StyleDictionary.extend({
  source: [path.join(__dirname, "../tokens/*.json")],
  platforms: {
    css: {
      buildPath: path.join(__dirname, "../variables/"),
      // https://amzn.github.io/style-dictionary/#/transforms
      transforms: [
        "name/cti/kebab",
        "scss/typography",
        "scss/border",
        "scss/box-shadow",
      ],
      files: [
        {
          destination: "_color.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "color",
        },
        {
          destination: "_font.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) =>
            /^fontFamilies$|^lineHeights$|^fontSizes$|^fontWeights$/.test(
              token.type,
            ),
        },
        {
          destination: "_border-radius.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "borderRadius",
        },
        {
          destination: "_border-width.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "borderWidth",
        },
        {
          destination: "_border.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "border",
        },
        {
          destination: "_box-shadow.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "boxShadow",
        },
        {
          destination: "_opacity.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "opacity",
        },
        {
          destination: "_sizing.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "sizing",
        },
        {
          destination: "_spacing.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "spacing",
        },
        {
          destination: "_line-height.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "lineHeights",
        },
        {
          destination: "_typography.scss",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
          filter: (token) => token.type === "typography",
        },
      ],
    },
  },
}).buildAllPlatforms();

// extend end
