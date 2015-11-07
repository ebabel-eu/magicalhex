import THREE from 'three';

import loadModel from '../../loadModel';
import heartbeat from './heartbeat';

const mob = function mob (input) {

    const scene = input.scene;

    loadModel({
        url: '/models/monkey/monkey.json',
        material: new THREE.MeshLambertMaterial({color: 0xA52A2A}),
        modelName: 'monkey',
        scene: scene,
        firebaseEndpoint: 'mobs/monkey',
        userData: {
            life: 10,
            dead: false,

            // List all the corpses this sprite currently has.
            corpses: [],

            // Start is a fallback, in case there is no data in Firebase.
            start: {
                x: -5,
                y: 25,
                z: -45
            },

            equipment: [
                'banana',
                'monkey pelt'
            ],

            heartbeat: heartbeat
        }
    });
    
}

module.exports = mob;