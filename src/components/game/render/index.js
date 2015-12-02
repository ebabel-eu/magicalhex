import executeMobActions from './executeMobActions';

import error from '../../shared/errorMessages';

// Render the scene and move the player in it with keyboardControls.update().
const render = function render (input) {
    const renderer = input && input.renderer;
    const scene = input && input.scene;
    const camera = input && input.camera;
    const keyboardControls = input && input.keyboardControls;
    const mob = input && input.mob;
    const clock = input && input.clock;

    if (!renderer || !scene || !camera || !keyboardControls) {
        throw new Error(error.input.required);
    }

    keyboardControls.update();

    renderer.render(scene, camera);

    // Mob actions run from here.
    // Display all mob names: input.mob.children.map(function (_mob) { return _mob.userData.targetName });
    mob.children.map(function (_mob) {
        executeMobActions(_mob);
    })

    requestAnimationFrame(function callRender() {
        render(input);
    });

    return this;
};

module.exports = render;
