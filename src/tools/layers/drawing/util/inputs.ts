/**
 * @author Andrej Tlcina
 */

/**
 * creates a slider with displayed value on side
 */
export const createIntervalInput = (
  label: string,
  min: number | string,
  max: number | string,
  onChange: (val: number) => void,
  value: string,
  step = 1
): HTMLDivElement => {
  const controlWrapper = document.createElement("div");
  controlWrapper.style.display = "flex";
  controlWrapper.style.justifyContent = "space-between";
  controlWrapper.style.alignItems = "center";

  const inputWrapper = document.createElement("div");
  inputWrapper.appendChild(document.createTextNode(label));
  const control = document.createElement("input");
  control.setAttribute("type", "range");
  control.setAttribute("min", String(min));
  control.setAttribute("max", String(max));
  control.setAttribute("step", String(step));
  control.onchange = (e) => {
    onChange(Number((<HTMLInputElement>e.target).value));
    displayAmount.innerText = (<HTMLInputElement>e.target).value;
  };
  control.value = value;
  inputWrapper.appendChild(control);

  controlWrapper.appendChild(inputWrapper);

  const displayAmount = document.createElement("span");
  displayAmount.innerText = value;
  controlWrapper.appendChild(displayAmount);

  return controlWrapper;
};

/**
 * creates checkbox
 */
export const createCheck = (
  value: boolean,
  onCheck: (val: boolean) => void,
  prefix: string,
  label: string
): HTMLDivElement => {
  const onChange = (e: Event) => {
    const val = (<HTMLInputElement>e.target).checked;
    onCheck(val);
  };
  const ID = prefix + "-check-input";
  const inputWrapper = document.createElement("div");
  inputWrapper.className = `${ID}-wrapper check-wrapper`;
  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = value;
  check.id = ID;
  check.onchange = onChange;
  const checkLabel = document.createElement("label");
  // checkLabel.for = ID;
  checkLabel.innerText = label;
  inputWrapper.appendChild(check);
  inputWrapper.appendChild(checkLabel);
  return inputWrapper;
};

/**
 * creates a grid of options, when a tile is clicked passed function runs
 * was made for colors and icons, if img is true it expects icon urls as options
 */
export const createPalette = (
  label: string,
  opts: string[],
  activeIdx: number,
  changeAction: (opt: string) => void,
  img = false
): HTMLDivElement => {
  const inputPalette = document.createElement("div");
  if (label) inputPalette.appendChild(document.createTextNode(label + ": "));
  const wrapper = document.createElement("div");
  wrapper.style.display = "grid";
  wrapper.style.width = "100%";
  wrapper.style.gridTemplateColumns = "repeat(4, 1fr)";
  inputPalette.appendChild(wrapper);
  opts.forEach((opt, idx) => {
    const elem = document.createElement("div");
    elem.style.boxSizing = "border-box";
    elem.style.background = img ? `url(${opt})` : opt;
    elem.style.backgroundRepeat = "no-repeat";
    elem.style.backgroundPosition = "center";
    elem.style.backgroundSize = "contain";
    elem.style.height = "20px";
    elem.style.display = "inline-block";
    elem.style.cursor = "pointer";
    if (idx === activeIdx) {
      elem.style.border = "1px solid #333";
    }
    elem.addEventListener("click", () => changeAction(opt));
    wrapper.appendChild(elem);
  });
  return inputPalette;
};

export const createButton = (
  text: string,
  onClick: () => void,
  disabled: boolean
): HTMLButtonElement => {
  const btn = document.createElement("button");
  btn.innerText = text;
  btn.addEventListener("click", onClick);
  if (disabled) {
    btn.setAttribute("disabled", String(disabled));
  } else {
    btn.removeAttribute("disabled");
  }
  return btn;
};
