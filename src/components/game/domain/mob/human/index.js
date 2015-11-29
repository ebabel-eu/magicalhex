import THREE from 'three';

import Mob from '../index';

class Human extends Mob {
    constructor (input) {
        super(input);

        const material = new THREE.MeshLambertMaterial({ color: 0xfeb186, fog: true, transparent: true, opacity: 1 });

        const head = new THREE.Mesh(new THREE.SphereGeometry(1, 5, 8), material);
        head.position.set(0, 6.5, 0);
        head.name = 'head';

        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 1.75, 0.75, 8), material);
        neck.position.set(0, 5.25, 0);
        neck.name = 'neck';

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 0.2, 4, 8), material);
        trunk.position.set(0, 2.875, 0);
        trunk.name = 'trunk';

        // Human.
        const human = new THREE.Group();
        human.add(head);
        human.add(neck);
        human.add(trunk);

        human.name = input && input.humanName || 'human';

        return human;
    }
}

module.exports = Human;