/**
 * @author Andrej Tlcina
 */

/**
 * creates a slider with displayed value on side
 *
 * @param {String} label
 * @param {Number} min
 * @param {Number} max
 * @param {Function} onChange
 * @param {Number} value
 * @param {Number} step
 * @returns {Object} HTML element
 */
export const createIntervalInput = (label, min, max, onChange, value, step = 1) => {
  const controlWrapper = document.createElement('div');
  controlWrapper.style.display = 'flex';
  controlWrapper.style.justifyContent = 'space-between';
  controlWrapper.style.alignItems = 'center';

  const inputWrapper = document.createElement('div');
  inputWrapper.appendChild(document.createTextNode(label));
  const control = document.createElement('input');
  control.setAttribute('type', 'range');
  control.setAttribute('min', min);
  control.setAttribute('max', max);
  control.setAttribute('step', step);
  control.onchange = (e) => {
    onChange(e.target.value);
    displayAmount.innerText = e.target.value;
  };
  control.value = value;
  inputWrapper.appendChild(control);

  controlWrapper.appendChild(inputWrapper);

  const displayAmount = document.createElement('span');
  displayAmount.innerText = value;
  controlWrapper.appendChild(displayAmount);

  return controlWrapper;
};

/**
 * creates checkbox
 *
 * @param {Boolean} value
 * @param {Function} onCheck
 * @param {String} prefix
 * @param {String} label
 * @returns {Object} HTML element
 */
export const createCheck = (value, onCheck, prefix, label) => {
  const onChange = (e) => {
    const val = e.target.checked;
    onCheck(val);
  };
  const ID = prefix + '-check-input';
  const inputWrapper = document.createElement('div');
  inputWrapper.className = `${ID}-wrapper check-wrapper`;
  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = value;
  check.id = ID;
  check.onchange = onChange;
  const checkLabel = document.createElement('label');
  checkLabel.for = ID;
  checkLabel.innerText = label;
  inputWrapper.appendChild(check);
  inputWrapper.appendChild(checkLabel);
  return inputWrapper;
};

/**
 * creates a grid of options, when a tile is clicked passed function runs
 * was made for colors and icons, if img is true it expects icon urls as options
 *
 * @param {String} label
 * @param {Array<String>} opts
 * @param {Number} activeIdx
 * @param {Function} changeAction
 * @param {Boolean} img
 * @returns {Object} HTML element
 */
export const createPalette = (label, opts, activeIdx, changeAction, img = false) => {
  const inputPalette = document.createElement('div');
  if (label) inputPalette.appendChild(document.createTextNode(label + ': '));
  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.width = '100%';
  wrapper.style.gridTemplateColumns = 'repeat(4, 1fr)';
  inputPalette.appendChild(wrapper);
  opts.forEach((opt, idx) => {
    let elem = document.createElement('div');
    elem.style.boxSizing = 'border-box';
    elem.style.background = img ? `url(${opt})` : opt;
    elem.style.backgroundRepeat = 'no-repeat';
    elem.style.backgroundPosition = 'center';
    elem.style.backgroundSize = 'contain';
    elem.style.height = '20px';
    elem.style.display = 'inline-block';
    elem.style.cursor = 'pointer';
    if (idx === activeIdx) {
      elem.style.border = '1px solid #333';
    }
    elem.addEventListener('click', () => changeAction(opt));
    wrapper.appendChild(elem);
  });
  return inputPalette;
};

export const createButton = (text, onClick, disabled) => {
  const btn = document.createElement('button');
  btn.innerText = text;
  btn.addEventListener('click', onClick);
  if (disabled) {
    btn.setAttribute('disabled', disabled);
  } else {
    btn.removeAttribute('disabled');
  }
  return btn;
};
