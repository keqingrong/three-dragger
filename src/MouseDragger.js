import {
  Plane,
  Raycaster,
  Vector2,
  Vector3
} from 'three';
import EventEmitter from 'eventemitter3';
import {
  getMouseNDCPosition,
  isEmptyArray
} from './utils';

const MOUSE = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};

class MouseDragger extends EventEmitter {
  /**
   * Constructor
   * @param {[Object3D]} objects - draggable objects
   * @param {Camera} camera - camera
   * @param {Element} domElement - canvas element
   */
  constructor(objects, camera, domElement) {
    super();

    this.objects = objects;
    this.camera = camera;
    this.domElement = domElement;

    this.mouse = new Vector2(); // normalized device coordinates of the mouse
    this.selected = null; // selected object
    this.offset = new Vector3(); // offset between the mouse and the center of selected object
    this.plane = new Plane(); // plane of the selected object, which is perpendicular to the camera's world space direction

    this.raycaster = new Raycaster();
    this.intersection = new Vector3();

    this.dragging = false;
    this.enabled = true;

    this.attachEvents();
  }

  /**
   * Update draggable objects
   * @param {[Object3D]} objects
   */
  update(objects) {
    this.objects = objects;
  }

  /**
   * Reset
   */
  reset() {
    const self = this;
    self.enabled = true;
  }

  /**
   * Dispose
   */
  dispose() {
    this.detachEvents();
  }

  /**
   * Attach events
   */
  attachEvents() {
    const self = this;
    document.addEventListener('mousedown', self.onDocumentMouseDown, false);
    document.addEventListener('mousemove', self.onDocumentMouseMove, false);
    document.addEventListener('mouseup', self.onDocumentMouseUp, false);
  }

  /**
   * Detach events
   */
  detachEvents() {
    const self = this;
    document.removeEventListener('mousedown', self.onDocumentMouseDown, false);
    document.removeEventListener('mousemove', self.onDocumentMouseMove, false);
    document.removeEventListener('mouseup', self.onDocumentMouseUp, false);
  }

  /**
   * Determine whether the mouse is contained in the canvas element
   * @param {MouseEvent} event
   */
  containsMousePoint(event) {
    const self = this;
    if (!self.domElement.getBoundingClientRect) {
      return true;
    }
    const {
      top,
      right,
      bottom,
      left
    } = self.domElement.getBoundingClientRect();
    const {
      clientX,
      clientY
    } = event;
    // outside of the canvas element
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      return false;
    }
    // inside
    return true;
  }

  /**
   * Ray cast
   * @param {Vector2} - mouse
   * @returns {Object3D|null} - intersected object
   */
  rayCast(mouse) {
    const self = this;
    if (isEmptyArray(self.objects)) {
      return null;
    }
    self.raycaster.setFromCamera(mouse, self.camera);
    const intersects = self.raycaster.intersectObjects(self.objects, true);
    if (intersects.length > 0) {
      return intersects[0].object;
    }
    return null;
  }

  /**
   * Emit event
   * @param {string} eventName - event name
   * @param {Object3D} target - intersected object
   * @param {Vector3} position - position of the intersected object
   * @param {Event} domEvent - DOM event
   */
  emitEvent(eventName, target, position, domEvent) {
    const self = this;
    super.emit(eventName, {
      target: target,
      mouse: self.mouse,
      position: position,
      event: domEvent
    });
  }

  /**
   * Press the left mouse button
   * @param {MouseEvent} event
   */
  onDocumentMouseDown = (event) => {
    const self = this;
    if (!self.enabled) {
      return;
    }
    if (!self.containsMousePoint(event)) {
      return;
    }
    if (event.button === MOUSE.LEFT) {
      event.preventDefault();

      const mouse = getMouseNDCPosition(event, self.domElement);
      const current = self.rayCast(mouse) || null;

      self.mouse = mouse;
      self.selected = current;
      self.emitEvent('mousedown', current, null, event);
    }
  };

  /**
   * Move the mouse
   * @param {MouseEvent} event
   */
  onDocumentMouseMove = (event) => {
    const self = this;
    if (!self.enabled) {
      return;
    }
    event.preventDefault();

    if (self.selected) {
      const mouse = getMouseNDCPosition(event, self.domElement);

      // the NDC is not changed
      if (mouse.equals(self.mouse)) {
        return;
      }

      // Update mouse's coordinates
      self.mouse = mouse;

      // Begin to drag the object
      if (self.dragging === false) {
        // Create a plane with the camera's world space direction (as a normal) and a coplanar point
        self.plane.setFromNormalAndCoplanarPoint(self.camera.getWorldDirection(), self.selected.position);

        // Calculate the offset between the mouse and the center of the selected object
        self.raycaster.setFromCamera(self.mouse, self.camera);
        self.raycaster.ray.intersectPlane(self.plane, self.intersection);
        self.offset.copy(self.intersection).sub(self.selected.position);

        self.domElement.style.cursor = 'move';
        self.emitEvent('dragstart', self.selected, self.selected.position.clone(), event);
        self.dragging = true;
      }

      // Calculate the intersection of the plane and the ray
      self.raycaster.setFromCamera(self.mouse, self.camera);
      self.raycaster.ray.intersectPlane(self.plane, self.intersection);

      // Subtract the offset before emit world coordinates
      self.emitEvent('drag', self.selected, self.intersection.sub(self.offset).clone(), event);
    }
  };

  /**
   * Release the left mouse button
   * @param {MouseEvent} event
   */
  onDocumentMouseUp = (event) => {
    const self = this;
    if (!self.enabled) {
      return;
    }
    if (event.button === MOUSE.LEFT) {
      event.preventDefault();

      // Dargging
      if (self.dragging && self.selected) {
        self.domElement.style.cursor = 'auto';
        self.emitEvent('dragend', self.selected, self.intersection.clone(), event);
        self.selected = null;
        self.dragging = false;
        return;
      }

      self.selected = null;
      self.dragging = false;

      // No dragging
      if (self.containsMousePoint(event)) {
        self.emitEvent('mouseup', null, null, event);
        self.emitEvent('click', null, null, event);
      }
    }
  };
}

export default MouseDragger;
