// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import "./ui-color-picker.scss";

/* eslint-disable */
export default function UIColorPicker() {

	function getElemById(id) {
		return document.getElementById(id);
	}

	const subscribers = [];
	const pickers = [];

	/**
	 * RGBA Color class
	 *
	 * HSV/HSB and HSL (hue, saturation, value / brightness, lightness)
	 * @param hue			0-360
	 * @param saturation	0-100
	 * @param value 		0-100
	 * @param lightness		0-100
	 */

	function Color(color) {
		if (color instanceof Color === true) {
			this.copy(color);
			return;
		}

		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 1;
		this.hue = 0;
		this.saturation = 0;
		this.value = 0;
		this.lightness = 0;
		this.format = 'HSV';
	}

	function RGBColor(r, g, b) {
		const color = new Color();
		color.setRGBA(r, g, b, 1);
		return color;
	}

	function RGBAColor(r, g, b, a) {
		const color = new Color();
		color.setRGBA(r, g, b, a);
		return color;
	}

	function HSVColor(h, s, v) {
		const color = new Color();
		color.setHSV(h, s, v);
		return color;
	}

	function HSVAColor(h, s, v, a) {
		const color = new Color();
		color.setHSV(h, s, v);
		color.a = a;
		return color;
	}

	function HSLColor(h, s, l) {
		const color = new Color();
		color.setHSL(h, s, l);
		return color;
	}

	function HSLAColor(h, s, l, a) {
		const color = new Color();
		color.setHSL(h, s, l);
		color.a = a;
		return color;
	}

	Color.prototype.copy = function copy(obj) {
		if (obj instanceof Color !== true) {
			console.log('Typeof parameter not Color');
			return;
		}

		this.r = obj.r;
		this.g = obj.g;
		this.b = obj.b;
		this.a = obj.a;
		this.hue = obj.hue;
		this.saturation = obj.saturation;
		this.value = obj.value;
		this.format = `${obj.format}`;
		this.lightness = obj.lightness;
	};

	Color.prototype.setFormat = function setFormat(format) {
		if (format === 'HSV') {
		 this.format = 'HSV';
		}
		if (format === 'HSL') {
		 this.format = 'HSL';
		}
	};

	/*= ========= Methods to set Color Properties ========== */

	Color.prototype.isValidRGBValue = function isValidRGBValue(value) {
		return (typeof (value) === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 255);
	};

	Color.prototype.setRGBA = function setRGBA(red, green, blue, alpha) {
		if (this.isValidRGBValue(red) === false ||
			this.isValidRGBValue(green) === false ||
			this.isValidRGBValue(blue) === false) {
				return;
			}

			this.r = red | 0;
			this.g = green | 0;
			this.b = blue | 0;

		if (alpha >= 0 && alpha <= 1) {
		 this.a = alpha;
		}
	};

	Color.prototype.setByName = function setByName(name, value) {
		if (name === 'r' || name === 'g' || name === 'b') {
			if (this.isValidRGBValue(value) === false) {
				return;
			}

			this[name] = value;
			this.updateHSX();
		}
	};

	Color.prototype.setHSV = function setHSV(hue, saturation, value) {
		this.hue = hue;
		this.saturation = saturation;
		this.value = value;
		this.HSVtoRGB();
	};

	Color.prototype.setHSL = function setHSL(hue, saturation, lightness) {
		this.hue = hue;
		this.saturation = saturation;
		this.lightness = lightness;
		this.HSLtoRGB();
	};

	Color.prototype.setHue = function setHue(value) {
		if (typeof (value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 359) {
			return;
		}
		this.hue = value;
		this.updateRGB();
	};

	Color.prototype.setSaturation = function setSaturation(value) {
		if (typeof (value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 100) {
			return;
		}
		this.saturation = value;
		this.updateRGB();
	};

	Color.prototype.setValue = function setValue(value) {
		if (typeof (value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 100) {
			return;
		}
		this.value = value;
		this.HSVtoRGB();
	};

	Color.prototype.setLightness = function setLightness(value) {
		if (typeof (value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 100) {
			return;
		}
		this.lightness = value;
		this.HSLtoRGB();
	};

	Color.prototype.setHexa = function setHexa(value) {
		const valid = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)/i.test(value);

		if (valid !== true) {
			return;
		}

		if (value[0] === '#') {
			value = value.slice(1, value.length);
		}

		if (value.length === 3) {
			value = value.replace(/([0-9A-F])([0-9A-F])([0-9A-F])/i, '$1$1$2$2$3$3');
		}

		this.r = parseInt(value.substr(0, 2), 16);
		this.g = parseInt(value.substr(2, 2), 16);
		this.b = parseInt(value.substr(4, 2), 16);

		this.alpha	= 1;
		this.RGBtoHSV();
	};

	/*= ========= Conversion Methods ========== */

	Color.prototype.convertToHSL = function convertToHSL() {
		if (this.format === 'HSL') {
			return;
		}

		this.setFormat('HSL');
		this.RGBtoHSL();
	};

	Color.prototype.convertToHSV = function convertToHSV() {
		if (this.format === 'HSV') {
			return;
		}

		this.setFormat('HSV');
		this.RGBtoHSV();
	};

	/*= ========= Update Methods ========== */

	Color.prototype.updateRGB = function updateRGB() {
		if (this.format === 'HSV') {
			this.HSVtoRGB();
			return;
		}

		if (this.format === 'HSL') {
			this.HSLtoRGB();
		}
	};

	Color.prototype.updateHSX = function updateHSX() {
		if (this.format === 'HSV') {
			this.RGBtoHSV();
			return;
		}

		if (this.format === 'HSL') {
			this.RGBtoHSL();
		}
	};

	Color.prototype.HSVtoRGB = function HSVtoRGB() {
		const sat = this.saturation / 100;
		const value = this.value / 100;
		let C = sat * value;
		const H = this.hue / 60;
		let X = C * (1 - Math.abs(H % 2 - 1));
		let m = value - C;
		const precision = 255;

		C = (C + m) * precision | 0;
		X = (X + m) * precision | 0;
		m = m * precision | 0;

		if (H >= 0 && H < 1) {
			this.setRGBA(C, X, m);	return;
		}
		if (H >= 1 && H < 2) {
			this.setRGBA(X, C, m);	return;
		}
		if (H >= 2 && H < 3) {
			this.setRGBA(m, C, X);	return;
		}
		if (H >= 3 && H < 4) {
			this.setRGBA(m, X, C);	return;
		}
		if (H >= 4 && H < 5) {
			this.setRGBA(X, m, C);	return;
		}
		if (H >= 5 && H < 6) {
			this.setRGBA(C, m, X);
		}
	};

	Color.prototype.HSLtoRGB = function HSLtoRGB() {
		const sat = this.saturation / 100;
		const light = this.lightness / 100;
		let C = sat * (1 - Math.abs(2 * light - 1));
		const H = this.hue / 60;
		let X = C * (1 - Math.abs(H % 2 - 1));
		let m = light - C / 2;
		const precision = 255;

		C = (C + m) * precision | 0;
		X = (X + m) * precision | 0;
		m = m * precision | 0;

		if (H >= 0 && H < 1) {
			this.setRGBA(C, X, m);	return;
		}
		if (H >= 1 && H < 2) {
			this.setRGBA(X, C, m);	return;
		}
		if (H >= 2 && H < 3) {
			this.setRGBA(m, C, X);	return;
		}
		if (H >= 3 && H < 4) {
			this.setRGBA(m, X, C);	return;
		}
		if (H >= 4 && H < 5) {
			this.setRGBA(X, m, C);	return;
		}
		if (H >= 5 && H < 6) {
			this.setRGBA(C, m, X);
		}
	};

	Color.prototype.RGBtoHSV = function RGBtoHSV() {
		const red		= this.r / 255;
		const green	= this.g / 255;
		const blue	= this.b / 255;

		const cmax = Math.max(red, green, blue);
		const cmin = Math.min(red, green, blue);
		const delta = cmax - cmin;
		let hue = 0;
		let saturation = 0;

		if (delta) {
			if (cmax === red) {
				hue = ((green - blue) / delta);
			}
			if (cmax === green) {
				hue = 2 + (blue - red) / delta;
			}
			if (cmax === blue) {
				hue = 4 + (red - green) / delta;
			}
			if (cmax) {
				saturation = delta / cmax;
			}
		}

		this.hue = 60 * hue | 0;
		if (this.hue < 0) {
			this.hue += 360;
		}
		this.saturation = (saturation * 100) | 0;
		this.value = (cmax * 100) | 0;
	};

	Color.prototype.RGBtoHSL = function RGBtoHSL() {
		const red		= this.r / 255;
		const green	= this.g / 255;
		const blue	= this.b / 255;

		const cmax = Math.max(red, green, blue);
		const cmin = Math.min(red, green, blue);
		const delta = cmax - cmin;
		let hue = 0;
		let saturation = 0;
		const lightness = (cmax + cmin) / 2;
		const X = (1 - Math.abs(2 * lightness - 1));

		if (delta) {
			if (cmax === red) {
				hue = ((green - blue) / delta);
			}
			if (cmax === green) {
				hue = 2 + (blue - red) / delta;
			}
			if (cmax === blue) {
				hue = 4 + (red - green) / delta;
			}
			if (cmax) {
				saturation = delta / X;
			}
		}

		this.hue = 60 * hue | 0;
		if (this.hue < 0) {
			this.hue += 360;
		}
		this.saturation = (saturation * 100) | 0;
		this.lightness = (lightness * 100) | 0;
	};

	/*= ========= Get Methods ========== */

	Color.prototype.getHexa = function getHexa() {
		let r = this.r.toString(16);
		let g = this.g.toString(16);
		let b = this.b.toString(16);
		if (this.r < 16) {
			r = `0${r}`;
		}
		if (this.g < 16) {
			g = `0${g}`;
		}
		if (this.b < 16) {
			b = `0${b}`;
		}
		const value = `#${r}${g}${b}`;
		return value.toUpperCase();
	};

	Color.prototype.getRGBA = function getRGBA() {
		const rgb = `(${this.r}, ${this.g}, ${this.b}`;
		let a = '';
		let v = '';
		const x = parseFloat(this.a);
		if (x !== 1) {
			a = 'a';
			v = `, ${x}`;
		}

		const value = `rgb${a}${rgb}${v})`;
		return value;
	};

	Color.prototype.getHSLA = function getHSLA() {
		if (this.format === 'HSV') {
			const color = new Color(this);
			color.setFormat('HSL');
			color.updateHSX();
			return color.getHSLA();
		}

		let a = '';
		let v = '';
		const hsl = `(${this.hue}, ${this.saturation}%, ${this.lightness}%`;
		const x = parseFloat(this.a);
		if (x !== 1) {
			a = 'a';
			v = `, ${x}`;
		}

		const value = `hsl${a}${hsl}${v})`;
		return value;
	};

	Color.prototype.getColor = function getColor() {
		if (this.a | 0 === 1) {
			return this.getHexa();
		}
		return this.getRGBA();
	};

	/*= ====================================================================== */
	/*= ====================================================================== */

	/*= ========= Capture Mouse Movement ========== */

	const setMouseTracking = function setMouseTracking(elem, callback) {
		elem.addEventListener('mousedown', (e) => {
			callback(e);
			document.addEventListener('mousemove', callback);
		});

		document.addEventListener('mouseup', (e) => {
			document.removeEventListener('mousemove', callback);
		});
	};

	/*= =================== */
	// Color Picker Class
	/*= =================== */

	function ColorPicker(node) {
		this.color = new Color();
		this.node = node;
		this.subscribers = [];

		const type = this.node.getAttribute('data-mode');
		const topic = this.node.getAttribute('data-topic');

		this.topic = topic;
		this.picker_mode = (type === 'HSL') ? 'HSL' : 'HSV';
		this.color.setFormat(this.picker_mode);

    this.newWrapperComponent('recommend-color-wrapper');
    this.newRecommendedColorComponent('#FFFFFF', '#DEE2E6');
    this.newRecommendedColorComponent('#CD384A');
    this.newRecommendedColorComponent('#F28524');
    this.newRecommendedColorComponent('#EEC114');
    this.newRecommendedColorComponent('#46AE00');
    this.newRecommendedColorComponent('#00C292');
    this.newRecommendedColorComponent('#07A1BB');
    this.newRecommendedColorComponent('#228AE6');
    this.newRecommendedColorComponent('#6610F2');
    this.newRecommendedColorComponent('#AE79DB');
    this.newRecommendedColorComponent('#E83E8C');
    this.newRecommendedColorComponent('#212529');

		this.createPickingArea();

		const previewHueAlphaWrapper = document.createElement('div');
		previewHueAlphaWrapper.className = 'preview-hue-alpha-wrapper';
		this.node.appendChild(previewHueAlphaWrapper);

		this.createPreviewBox(previewHueAlphaWrapper);

		this.createHueArea(previewHueAlphaWrapper);

		// this.newInputComponent('H', 'hue', this.inputChangeHue.bind(this));
		// this.newInputComponent('S', 'saturation', this.inputChangeSaturation.bind(this));
		// this.newInputComponent('V', 'value', this.inputChangeValue.bind(this));
		// this.newInputComponent('L', 'lightness', this.inputChangeLightness.bind(this));

		this.createAlphaArea(previewHueAlphaWrapper);

    // this.newWrapperComponent('rgb-input-wrapper');
		// this.newInputComponent('R', 'red', this.inputChangeRed.bind(this), 'rgb-input-wrapper');
		// this.newInputComponent('G', 'green', this.inputChangeGreen.bind(this), 'rgb-input-wrapper');
		// this.newInputComponent('B', 'blue', this.inputChangeBlue.bind(this), 'rgb-input-wrapper');

		this.createChangeModeButton();

		this.newInputComponent('Hex', 'hexa', this.inputChangeHexa.bind(this));
		this.newInputComponent('', 'alpha', this.inputChangeAlpha.bind(this));

		this.setColor(this.color);
		pickers[topic] = this;
	}

	/** ********************************************************************** */
	//				Function for generating the color-picker
	/** ********************************************************************** */

  ColorPicker.prototype.newWrapperComponent = function newWrapperComponent(className) {
    const recommendColorWrapper = document.createElement('div');

    recommendColorWrapper.className = className;

    this.node.appendChild(recommendColorWrapper);
  };

  ColorPicker.prototype.newRecommendedColorComponent = function newRecommendedColorComponent(color, border) {
    const recommendColorWrapperElement = document.querySelector('.recommend-color-wrapper');
    const recommendColor = document.createElement('div');

    recommendColor.className = 'recommend-color';
    recommendColor.style.backgroundColor = color;

    if (!_.isEmpty(border)) {
      recommendColor.style.border = `1px solid ${border}`;
    }

    // this.picking_area = area;
    setMouseTracking(recommendColor, this.onClickRecommendedColor.bind(this, color));
    recommendColorWrapperElement.appendChild(recommendColor);
  };

	ColorPicker.prototype.createPickingArea = function createPickingArea() {
		const area = document.createElement('div');
		const picker = document.createElement('div');

		area.className = 'picking-area';
		picker.className = 'picker';

		this.picking_area = area;
		this.color_picker = picker;
		setMouseTracking(area, this.updateColor.bind(this));

		area.appendChild(picker);
		this.node.appendChild(area);
	};

	ColorPicker.prototype.createHueArea = function createHueArea(wrapper) {
		const area = document.createElement('div');
		const picker = document.createElement('div');

		area.className = 'hue';
		picker.className = 'slider-picker';

		this.hue_area = area;
		this.hue_picker = picker;
		setMouseTracking(area, this.updateHueSlider.bind(this));

		area.appendChild(picker);
		wrapper.appendChild(area);
	};

	ColorPicker.prototype.createAlphaArea = function createAlphaArea(wrapper) {
		const area = document.createElement('div');
		const mask = document.createElement('div');
		const picker = document.createElement('div');

		area.className = 'alpha';
		mask.className = 'alpha-mask';
		picker.className = 'slider-picker';

		this.alpha_area = area;
		this.alpha_mask = mask;
		this.alpha_picker = picker;
		setMouseTracking(area, this.updateAlphaSlider.bind(this));

		area.appendChild(mask);
		mask.appendChild(picker);
		wrapper.appendChild(area);
	};

	ColorPicker.prototype.createPreviewBox = function createPreviewBox(wrapper) {
		const preview_box = document.createElement('div');
		const preview_color = document.createElement('div');

		preview_box.className = 'preview';
		preview_color.className = 'preview-color';

		this.preview_color = preview_color;

		preview_box.appendChild(preview_color);
		wrapper.appendChild(preview_box);
	};

	ColorPicker.prototype.newInputComponent = function newInputComponent(title, topic, onChangeFunc, parentClassName) {
		const wrapper = document.createElement('div');
		const input = document.createElement('input');

    if (!_.isEmpty(title)) {
      const info = document.createElement('span');
      info.textContent = title;
      info.className = 'name';
      wrapper.appendChild(info);
    }
    wrapper.className = 'input';
    wrapper.setAttribute('data-topic', topic);

		input.setAttribute('type', 'text');
		wrapper.appendChild(input);

    if (_.isEmpty(parentClassName)) {
      this.node.appendChild(wrapper);
    } else {
      const parentElement = document.querySelector(`.${parentClassName}`);
      !_.isNil(parentElement) && parentElement.appendChild(wrapper);
    }

		input.addEventListener('change', onChangeFunc);
		input.addEventListener('click', function () {
			this.select();
		});

		this.subscribe(topic, (value) => {
      if (_.isEqual(topic, 'alpha')) {
        input.value = String(Math.floor(value * 100)) + '%';
      } else {
        input.value = value;
      }
		});
	};

	ColorPicker.prototype.createChangeModeButton = function createChangeModeButton() {
		const button = document.createElement('div');
		button.className = 'switch_mode';
		button.addEventListener('click', () => {
			if (this.picker_mode === 'HSV') {
				this.setPickerMode('HSL');
			} else {
				this.setPickerMode('HSV');
			}
		});

		this.node.appendChild(button);
	};

	/** ********************************************************************** */
	//					Updates properties of UI elements
	/** ********************************************************************** */

  ColorPicker.prototype.onClickRecommendedColor = function onClickRecommendedColor(color, e) {
    this.color.setHexa(color);
    this.setColor(this.color);
  }

	ColorPicker.prototype.updateColor = function updateColor(e) {
		const pickingAreaBoundingClientRect = this.picking_area.getBoundingClientRect();
		let x = e.clientX - pickingAreaBoundingClientRect.x;
		let y = e.clientY - pickingAreaBoundingClientRect.y;
		const picker_offset = 5;

		// width and height should be the same (without left right border)
		const size = this.picking_area.clientWidth - 2;

		if (x > size) {
			x = size;
		}
		if (y > size) {
			y = size;
		}
		if (x < 0) {
			x = 0;
		}
		if (y < 0) {
			y = 0;
		}

		const value = 100 - (y * 100 / size) | 0;
		const saturation = x * 100 / size | 0;

		if (this.picker_mode === 'HSV') {
			this.color.setHSV(this.color.hue, saturation, value);
		}
		if (this.picker_mode === 'HSL') {
			this.color.setHSL(this.color.hue, saturation, value);
		}

		this.color_picker.style.left = `${x - picker_offset}px`;
		this.color_picker.style.top = `${y - picker_offset}px`;

		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('value', value);
		this.notify('lightness', value);
		this.notify('saturation', saturation);

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.getHexa());

		notify(this.topic, this.color);
	};

	ColorPicker.prototype.updateHueSlider = function updateHueSlider(e) {
		const hueAreaBoundingClientRect = this.hue_area.getBoundingClientRect();
		let x = e.clientX - hueAreaBoundingClientRect.x;
		const width = this.hue_area.clientWidth;

		if (x < 0) {
			x = 0;
		}
		if (x > width) {
			x = width;
		}

		// TODO 360 => 359
		const hue = ((359 * x) / width) | 0;
		// if (hue === 360) hue = 359;

		this.updateSliderPosition(this.hue_picker, x);
		this.setHue(hue);
	};

	ColorPicker.prototype.updateAlphaSlider = function updateAlphaSlider(e) {
		const alphaAreaBoundingClientRect = this.alpha_area.getBoundingClientRect();
		let x = e.clientX - alphaAreaBoundingClientRect.x;
		const width = this.alpha_area.clientWidth;

		if (x < 0) {
			x = 0;
		}
		if (x > width) {
			x = width;
		}

		this.color.a = (x / width).toFixed(2);

		this.updateSliderPosition(this.alpha_picker, x);
		this.updatePreviewColor();

		this.notify('alpha', this.color.a);
		notify(this.topic, this.color);
	};

	ColorPicker.prototype.setHue = function setHue(value) {
		this.color.setHue(value);

		this.updatePickerBackground();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.getHexa());
		this.notify('hue', this.color.hue);

		notify(this.topic, this.color);
	};

	// Updates when one of Saturation/Value/Lightness changes
	ColorPicker.prototype.updateSLV = function updateSLV() {
		this.updatePickerPosition();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.getHexa());

		notify(this.topic, this.color);
	};

	/** ********************************************************************** */
	//				Update positions of various UI elements
	/** ********************************************************************** */

	ColorPicker.prototype.updatePickerPosition = function updatePickerPosition() {
		const size = this.picking_area.clientWidth;
		let value = 0;
		const offset = 5;

		if (this.picker_mode === 'HSV') {
			value = this.color.value;
		}
		if (this.picker_mode === 'HSL') {
			value = this.color.lightness;
		}

		const x = (this.color.saturation * size / 100) | 0;
		const y = size - (value * size / 100) | 0;

		this.color_picker.style.left = `${x - offset}px`;
		this.color_picker.style.top = `${y - offset}px`;
	};

	ColorPicker.prototype.updateSliderPosition = function updateSliderPosition(elem, pos) {
		elem.style.left = `${Math.max(pos - 3, -2)}px`;
	};

	ColorPicker.prototype.updateHuePicker = function updateHuePicker() {
		const size = this.hue_area.clientWidth;
		const offset = 1;
		const pos = (this.color.hue * size / 360) | 0;
		this.hue_picker.style.left = `${pos - offset}px`;
	};

	ColorPicker.prototype.updateAlphaPicker = function updateAlphaPicker() {
		const size = this.alpha_area.clientWidth;
		const offset = 1;
		const pos = (this.color.a * size) | 0;
		this.alpha_picker.style.left = `${pos - offset}px`;
	};

	/** ********************************************************************** */
	//						Update background colors
	/** ********************************************************************** */

	ColorPicker.prototype.updatePickerBackground = function updatePickerBackground() {
		const nc = new Color(this.color);
		nc.setHSV(nc.hue, 100, 100);
		this.picking_area.style.backgroundColor = nc.getHexa();
	};

	ColorPicker.prototype.updateAlphaGradient = function updateAlphaGradient() {
		this.alpha_mask.style.backgroundColor = this.color.getHexa();
    // this.alpha_picker.style.backgroundColor = this.color.getRGBA();
    // this.hue_picker.style.backgroundColor = this.color.getHexa();
    // this.alpha_picker.style.backgroundColor = this.color.getHexa();
    this.hue_picker.style.setProperty('--background-color', this.color.getHexa());
    this.alpha_picker.style.setProperty('--background-color', this.color.getHexa());
  };

	ColorPicker.prototype.updatePreviewColor = function updatePreviewColor() {
		this.preview_color.style.backgroundColor = this.color.getColor();
    this.hue_picker.style.setProperty('--background-color', this.color.getHexa());
    this.alpha_picker.style.setProperty('--background-color', this.color.getHexa());
  };

	/** ********************************************************************** */
	//						Update input elements
	/** ********************************************************************** */

	ColorPicker.prototype.inputChangeHue = function inputChangeHue(e) {
		const value = parseInt(e.target.value);
		this.setHue(value);
		this.updateHuePicker();
	};

	ColorPicker.prototype.inputChangeSaturation = function inputChangeSaturation(e) {
		const value = parseInt(e.target.value);
		this.color.setSaturation(value);
		e.target.value = this.color.saturation;
		this.updateSLV();
	};

	ColorPicker.prototype.inputChangeValue = function inputChangeValue(e) {
		const value = parseInt(e.target.value);
		this.color.setValue(value);
		e.target.value = this.color.value;
		this.updateSLV();
	};

	ColorPicker.prototype.inputChangeLightness = function inputChangeLightness(e) {
		const value = parseInt(e.target.value);
		this.color.setLightness(value);
		e.target.value = this.color.lightness;
		this.updateSLV();
	};

	ColorPicker.prototype.inputChangeRed = function inputChangeRed(e) {
		const value = parseInt(e.target.value);
		this.color.setByName('r', value);
		e.target.value = this.color.r;
		this.setColor(this.color);
	};

	ColorPicker.prototype.inputChangeGreen = function inputChangeGreen(e) {
		const value = parseInt(e.target.value);
		this.color.setByName('g', value);
		e.target.value = this.color.g;
		this.setColor(this.color);
	};

	ColorPicker.prototype.inputChangeBlue = function inputChangeBlue(e) {
		const value = parseInt(e.target.value);
		this.color.setByName('b', value);
		e.target.value = this.color.b;
		this.setColor(this.color);
	};

	ColorPicker.prototype.inputChangeAlpha = function inputChangeAlpha(e) {
		const value = parseFloat(e.target.value) / 100;

		if (typeof value === 'number' && isNaN(value) === false && value >= 0 && value <= 1) {
			this.color.a = value.toFixed(2);
		}

		e.target.value = this.color.a;
		this.setColor(this.color);
	};

	ColorPicker.prototype.inputChangeHexa = function inputChangeHexa(e) {
		const value = e.target.value;
		this.color.setHexa(value);
		this.setColor(this.color);
	};

	/** ********************************************************************** */
	//							Internal Pub/Sub
	/** ********************************************************************** */

	ColorPicker.prototype.subscribe = function subscribe(topic, callback) {
		this.subscribers[topic] = callback;
	};

	ColorPicker.prototype.notify = function notify(topic, value) {
		if (this.subscribers[topic]) {
		 this.subscribers[topic](value);
		}
	};

	/** ********************************************************************** */
	//							Set Picker Properties
	/** ********************************************************************** */

	ColorPicker.prototype.setColor = function setColor(color) {
		if (color instanceof Color !== true) {
			console.log('Typeof parameter not Color');
			return;
		}

		if (color.format !== this.picker_mode) {
			color.setFormat(this.picker_mode);
			color.updateHSX();
		}

		this.color.copy(color);
		this.updateHuePicker();
		this.updatePickerPosition();
		this.updatePickerBackground();
		this.updateAlphaPicker();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);

		this.notify('hue', this.color.hue);
		this.notify('saturation', this.color.saturation);
		this.notify('value', this.color.value);
		this.notify('lightness', this.color.lightness);

		this.notify('alpha', this.color.a);
		this.notify('hexa', this.color.getHexa());
		notify(this.topic, this.color);
	};

	ColorPicker.prototype.setPickerMode = function setPickerMode(mode) {
		if (mode !== 'HSV' && mode !== 'HSL') {
			return;
		}

		this.picker_mode = mode;
		this.node.setAttribute('data-mode', this.picker_mode);
		this.setColor(this.color);
	};

	/** ********************************************************************** */
	//								UNUSED
	/** ********************************************************************** */

	const setPickerMode = function setPickerMode(topic, mode) {
		if (pickers[topic]) {
			pickers[topic].setPickerMode(mode);
		}
	};

	const setColor = function setColor(topic, color) {
		if (pickers[topic]) {
			pickers[topic].setColor(color);
		}
	};

	const getColor = function getColor(topic) {
		if (pickers[topic]) {
			return new Color(pickers[topic].color);
		}
	};

	const subscribe = function subscribe(topic, callback) {
		if (subscribers[topic] === undefined) {
			subscribers[topic] = [];
		}

		subscribers[topic].push(callback);
	};

	const unsubscribe = function unsubscribe(callback) {
		const index = subscribers.indexOf(callback);
		subscribers.splice(index, 1);
	};

	var notify = function notify(topic, value) {
		if (subscribers[topic] === undefined || subscribers[topic].length === 0) {
			return;
		}

		const color = new Color(value);
		for (const i in subscribers[topic]) {
			subscribers[topic][i](color);
		}
	};

	const init = function init(elem) {
		if (elem?.nodeType === Node.ELEMENT_NODE) {
			new ColorPicker(elem);
		}
	};

	return {
		init,
		Color,
		RGBColor,
		RGBAColor,
		HSVColor,
		HSVAColor,
		HSLColor,
		HSLAColor,
		setColor,
		getColor,
		subscribe,
		unsubscribe,
		setPickerMode,
	};
};
