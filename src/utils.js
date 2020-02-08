import {
  Vector2
} from 'three';

const isFunction = (object) => (typeof object === 'function');
const isEmptyArray = (object) => (Array.isArray(object) && object.length === 0);

/**
 * Normalize a number to [-1,1]
 * @param {Number} number
 * @return {Number}
 */
const normalize = (number) => {
  if (number < -1) {
    return -1;
  } else if (number > 1) {
    return 1;
  } else {
    return number;
  }
};

/**
 * Calculate normalized device coordinates of the mouse
 * @param {MouseEvent} event
 * @param {Element} container
 * @return {Vector2}
 */
const getMouseNDCPosition = (event, container) => {
  const rect = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  };
  // the container is Element type
  if (container && isFunction(container.getBoundingClientRect)) {
    Object.assign(rect, container.getBoundingClientRect());
  }
  const {
    left,
    top,
    width,
    height
  } = rect;
  if (event.clientX === undefined || event.clientY === undefined) {
    console.warn(`${event} is not a standard DOM event, which misses clientX and clientY`); // eslint-disable-line no-console
  }
  // relative to the viewport -> relative to the container
  const clientX = event.clientX - left;
  const clientY = event.clientY - top;
  // calculate normalized device coordinates
  const x = (clientX / width) * 2 - 1;
  const y = -(clientY / height) * 2 + 1;
  return new Vector2(normalize(x), normalize(y));
};

export {
  isEmptyArray,
  normalize,
  getMouseNDCPosition
};
