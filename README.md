# three-dragger

[![npm version](https://img.shields.io/npm/v/three-dragger.svg)](https://www.npmjs.com/package/three-dragger)

> Drag three.js objects like [THREE.DragControls](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/DragControls.js) without modifying the original's position

## Installation

```sh
npm install --save three-dragger
```

## Usage

```js
import ThreeDragger from 'three-dragger';

const draggableObjects = [];
const mouseDragger = new ThreeDragger(draggableObjects, camera, renderer.domElement);

mouseDragger.on('dragstart', function (data) {
  // Remember to disable other Controls, such as OrbitControls or TrackballControls
});

mouseDragger.on('drag', function (data) {
  const { target, position } = data;
  if (target) {
    target.position.set(position.x, position.y, position.z);
  }
});

mouseDragger.on('dragend', function (data) {
  // Remember to enable other Controls, such as OrbitControls or TrackballControls
});
```

## API

### enabled

Enable or disable the dragger. The default is `true`.

### on(eventName, callback)

Handle with the drag events:

- `dragstart`
- `drag`
- `dragend`

#### callback(data)

- `data.target`: The dragged object.
- `data.mouse`: The normalized device coordinates of the mouse.
- `data.position`: The latest world coordinates of the mouse.
- `data.event`: The original DOM event.

### removeListener()

See [EventEmitter3](https://github.com/primus/EventEmitter3).

### update(objects)

Update the draggable objects.

### dispose()

Remove all events handlers.

## License

MIT
