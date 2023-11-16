const StyleDictionary = require('style-dictionary');
const utils = require('../../../build/utils');

const tokenTypes = [];

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
        if (tokenKeys.includes(key) && key !== 'dfn') {
          Object.assign(output, object[key]);
        }
      }
      return output;
    } catch (error) {
      console.error('registerParser: ', error);
    }
  },
});

// parser end

// format start

StyleDictionary.registerFormat({
  name: 'scss/variables',
  formatter: ({ dictionary, platform, file, options }) => dictionary.allProperties.map((token) => {
      let value = JSON.stringify(token.value);
      if (dictionary.usesReference(token.original.value)) {
        const refs = dictionary.getReferences(token.original.value);
        refs.forEach((ref) => {
          value = value.replace(ref.value, () => `$${ref.name}`);
        });
      }
      value = value.replace(/"/g, '');

      // font 스타일을 한 번에 설정하기 위한 parser 작업
      // #{}을 추가하지 않으면, font-size 나누기 line-height가 됨
      if (token.type === 'typography') {
        value = value.split(' ').map((fontAttribute) => {
          if (fontAttribute.includes('/')) {
            return fontAttribute.split('/').map((sizeOrLineHeight) => `#{${sizeOrLineHeight}}`).join('/');
          }
          return `#{${fontAttribute}}`;
        }).join(' ');
      }

      return `$${token.name}: ${value};`;
    }).join('\n'),
});

// format end

// transform start

// StyleDictionary.registerTransform({
//   name: `scss/transitive`,
//   type: `value`,
//   transitive: true,
//   matcher: (token) => true,
//   transformer: (token) => token.value,
// });

StyleDictionary.registerTransform({
  name: `scss/typeLog`,
  type: `value`,
  transitive: true,
  matcher: (token) => true,
  transformer: (token) => {
    if (!tokenTypes.includes(token.type)) {
      tokenTypes.push(token.type);
    }
    return token.value;
  },
});

StyleDictionary.registerTransform({
  name: 'scss/border-width',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'borderWidth',
  transformer: (token) => `${token.value}`,
});

StyleDictionary.registerTransform({
  name: 'scss/border',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'border',
  transformer: (token) => `${token.value.width} ${token.value.style} ${token.value.color}`,
});

StyleDictionary.registerTransform({
  name: 'scss/box-shadow',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'boxShadow' && !token.path.includes('elevation'),
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'string') {
      return token.value;
    }
    return `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color}`;
  },
});

StyleDictionary.registerTransform({
  name: 'scss/typography',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'typography',
  transformer: (token) => {
    if (typeof token.original.value === 'string') {
      return token.value;
    }
    return `${token.original.value.fontWeight} ${token.original.value.fontSize}/${token.original.value.lineHeight} ${token.original.value.fontFamily}`;
  },
});

// transform end

// extend start

StyleDictionary.extend({
  source: [`${utils.resolve('markup/design-token/tokens')}/*.json`],
  platforms: {
    scss: {
      buildPath: utils.resolve('markup/src/assets/styles/design-system/design-token/'),
      // https://amzn.github.io/style-dictionary/#/transforms
      // transforms: ['name/cti/kebab', 'scss/transitive', 'scss/border', 'scss/box-shadow'],
      transforms: ['name/cti/kebab', 'scss/typeLog', 'scss/typography', 'scss/border', 'scss/box-shadow'],
      files: [
        {
          destination: '_color.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'color',
        },
        {
          destination: '_font.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && /^fontFamilies$|^lineHeights$|^fontSizes$|^fontWeights$/.test(token.type),
        },
        {
          destination: '_border-radius.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'borderRadius',
        },
        {
          destination: '_border-width.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'borderWidth',
        },
        {
          destination: '_border.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'border',
        },
        {
          destination: '_box-shadow.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'boxShadow',
        },
        {
          destination: '_opacity.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'opacity',
        },
        {
          destination: '_sizing.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'sizing',
        },
        {
          destination: '_spacing.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'spacing',
        },
        {
          destination: '_line-height.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'lineHeights',
        },
        {
          destination: '_typography.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] !== 'atd' && token.type === 'typography',
        },
        {
          destination: '_atd.scss',
          format: 'scss/variables',
          filter: (token) => token.path[0] === 'atd',
        },
      ],
    },
  },
}).buildAllPlatforms();

// extend end

console.log(tokenTypes);
