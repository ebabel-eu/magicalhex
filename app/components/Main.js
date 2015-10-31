var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');
var THREE = require('three');
var collada = require('three-loaders-collada')(THREE);

var ebg = {};

ebg.version = '0.3.1';

// Custom error messages from the game are listed here and used throughout.
ebg.err = {
    input: {
        required: 'Missing required input.'
    },
    player: {
        notFound: 'Player can\'t be found.'
    },
    error: {
        code: 'Missing error code.',
        messages: 'Missing error message.'
    }
};

ebg.ref = new Firebase('https://enchantment.firebaseio.com');





var Main = React.createClass({
    render: function() {
        return (
            <div id='main-container'>
                <Login />
                <CharacterCreation />
            </div>
        )
    }
});

var Login = React.createClass({
    getInitialState: function() {
        return {
            isHidden: false,
            disabled: ''
        };
    },
    render: function () {
        var _html;

        if (this.state.isHidden) {
            return null;
        }

        _html = 
        <div id='login'>
            <p>
                <button onClick={this.handleClick} 
                    disabled={this.state.disabled}>
                    Facebook Login
                </button>
            </p>
        </div>

        return _html;
    },
    handleClick: function (event) {
        var _this = this;

        // Always start by disabling the login button as soon as it's been clicked on,
        // before checking if the login has been succesful or not.
        this.setState({
            disabled: 'disabled',
            isHidden: false
        });

        // todo: show loading spinner.

        ebg.ref.authWithOAuthPopup('facebook', function (error, authData) {
            var _event;
            var _player;

            // todo: hide loading spinner.

            if (error) {
                ebg.ref.child('error/authorisation').push({
                    code: error.code || ebg.err.error.code,
                    message: error.message || ebg.err.error.message,
                    dateLogged: new Date().toJSON()
                });

                // todo: display error message and give advice.

                _this.setState({
                    disabled: '',
                    isHidden: false
                });
            } else {
                _player = {
                    id: authData.facebook.id,
                    displayName: authData.facebook.displayName,
                    profileImageUrl: authData.facebook.profileImageURL,
                    firstName: authData.facebook.cachedUserProfile.first_name,
                    lastName: authData.facebook.cachedUserProfile.last_name,
                    timezone: authData.facebook.cachedUserProfile.timezone,
                    locale: authData.facebook.cachedUserProfile.locale,
                    gender: authData.facebook.cachedUserProfile.gender,
                    ageRange: authData.facebook.cachedUserProfile.age_range.min
                };

                ebg.ref.child('player/' + _player.id).set(_player);
                ebg.ref.child('login/' + _player.id).push({
                    loginDate: new Date().toJSON()
                });

                _this.setState({
                    disabled: '',
                    isHidden: true
                });

                _event = new CustomEvent('show-character-creation', 
                    { 'detail': _player });

                // Set the input data of the React CharacterCreation to player.
                document.dispatchEvent(_event);
            }
        });
    }
});

var CreateCharacterButton = React.createClass({
    getInitialState: function() {
        return {
            disabled: ''
        };
    },
    render: function() {
        return (
            <button onClick={this.handleClick} 
                disabled={this.state.disabled}>
                Create character
            </button>
        )
    },
    handleClick: function (event) {
        var _this = this;

        // Disable the button as soon as it's clicked on.
        this.setState({
            disabled: 'disabled'
        });

        // todo: show loading spinner.

        var playerid = _this.props.playerid;
        var character;

        if (!playerid) {
            throw new Error(ebg.err.player.notFound);
        }

        character = {
            name: document.getElementById('character-name').value,
            strength: document.getElementById('character-strength').value,
            dexterity: document.getElementById('character-dexterity').value,
            intelligence: document.getElementById('character-intelligence').value
        };

        ebg.ref.child('character/' + playerid).set(character, function onComplete (err) {
            // todo: if err, show error, otherwise hide the character creation.
            console.log(err);
        });
    }
});

var CharacterCreation = React.createClass({
    getInitialState: function() {
        return {
            data: null,
            isHidden: true,
            disabled: ''
        };
    },
    componentDidMount: function() {
        document.addEventListener('show-character-creation', this.show, true);
    },
    render: function () {
        var _html;

        if (this.state.isHidden) {
            return null;
        }

        _html =
        <form action='#' id='character-creation' onSubmit={this.handleSubmit}>
            <label>
                <input id='character-name' placeholder='character name' defaultValue={this.state.character.name} />
            </label>
            <p>
                <img src={this.state.data.profileImageUrl} title={this.state.data.displayName} id='profile-image' />
                <span id='creation-points-left'><em className='points'>3</em> creation points left</span>
            </p>
            <label>
                strength <span className='points'>{this.state.character.strength}</span>
                <input id='character-strength' type='range' min='3' max='19' 
                    defaultValue={this.state.character.strength} />
            </label>
            <label>
                dexterity <span className='points'>{this.state.character.dexterity}</span>
                <input id='character-dexterity' type='range' min='3' max='19' 
                    defaultValue={this.state.character.dexterity} />
            </label>
            <label>
                intelligence <span className='points'>{this.state.character.intelligence}</span>
                <input id='character-intelligence' type='range' min='3' max='19' 
                    defaultValue={this.state.character.intelligence} />
            </label>
            <CreateCharacterButton playerid={this.state.data.id} />
        </form>

        return _html;
    },
    show: function (event) {
        var _this = this;
        var _character;

        ebg.ref.child('character/' + event.detail.id).once('value', function getCharacter (snapshot) {
            _character = snapshot.val();

            _this.setState({
                data: event.detail,
                character: _character,
                isHidden: false,
                disabled: ''
            });
        });
    },
    handleSubmit: function (event) {
        event.preventDefault();
    }
});

ReactDOM.render(<Main />, document.getElementById('game'));




// Initialize the scene and return a camera.
ebg.initScene = function initScene (input) {
    var scene = input && input.scene;
    var renderer = input && input.renderer;
    var light = input && input.light;
    var camera = input && input.camera;
    var output;

    if (!scene || !renderer || !light || !camera || 
        !camera.type || !camera.aspectRatio || !camera.nearPlane || !camera.farPlane) {
        throw new Error(ebg.err.input.required);
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game').appendChild(renderer.domElement);

    scene.add(light);

    output = new THREE[camera.type](
        camera.angle, 
        camera.aspectRatio, 
        camera.nearPlane, 
        camera.farPlane
    );

    output.position.set(
        camera.position && camera.position.x || 0,
        camera.position && camera.position.y || 0,
        camera.position && camera.position.z || 100
    );
    
    scene.add(output);

    return output;
};


// Load a collada model and add it to the scene.
ebg.loadModel = function loadModel (input) {
    var loader;
    var path = input && input.path;
    var name = input && input.name;
    var scene = input && input.scene;
    var position = input && input.position || { x: 0, y: 0, z: 0 };
    var rotation = input && input.rotation || { x: 0, y: 0, z: 0 };

    if (!path || !name || !scene) {
        throw new Error(ebg.err.input.required);
    }

    loader = new THREE.ColladaLoader();
    //loader.options.convertUpAxis = true;

    loader.load(
        // Model path.
        path,

        // Model is loaded.
        function loaded (collada) {
            var model = collada.scene;

            model.name = name;
            model.position.set(position.x || 0, position.y || 0, position.z || 0);
            model.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);

            scene.add(model);
        },

        // Model loading in progress.
        function loading (xhr) {
            console.log([
                (xhr.loaded / xhr.total * 100),
                '% loaded'].join(''));
        }
    );
};


// Render the scene and animate the sprites that have been passed in the input.
ebg.render = function render (input) {
    var renderer = input && input.renderer;
    var scene = input && input.scene;
    var camera = input && input.camera;
    var callback = input && input.callback;

    if (!renderer || !scene || !camera) {
        throw new Error(ebg.err.input.required);
    }

    renderer.render(scene, camera);

    if (callback) {
        callback(input);
    }

    requestAnimationFrame(function() {
        ebg.render(input);
    });
};


// Game module.
(function game (THREE) {
    var scene = new THREE.Scene();
    var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
    var light = new THREE.AmbientLight(0xffffff);
    var camera = ebg.initScene({
        scene: scene,
        renderer: renderer,
        light: light,
        camera: {
            type: 'PerspectiveCamera',
            angle: 45,
            aspectRatio: window.innerWidth / window.innerHeight,
            nearPlane: 1,
            farPlane: 500,
            position: {
                z: 15
            }
        }
    });

    // Static spaceship.
    ebg.loadModel({
        path: 'models/spaceship/spaceship.dae',
        name: 'hyper-spaceship',
        scene: scene,
        position: {
            x: -5,
            y: 20,
            z: -50
        },
        rotation: {
            x: 30
        }
    });

    // Animated spaceship.
    ebg.loadModel({
        path: 'models/spaceship/spaceship.dae',
        name: 'fast-spaceship',
        scene: scene,
        position: {
            x: 1.5,
            y: 20,
            z: -25
        },
        rotation: {
            x: 30
        }
    });

    // Animated spaceship.
    ebg.loadModel({
        path: 'models/spaceship/spaceship.dae',
        name: 'slow-spaceship',
        scene: scene,
        position: {
            x: -1,
            y: 20,
            z: -45
        },
        rotation: {
            x: 30
        }
    });

    // Render the scene.
    ebg.render({
        renderer: renderer,
        scene: scene,
        camera: camera,
        sprites: [
            {
                name: 'hyper-spaceship',
                scene: scene,
                heartbeat: function (input) {
                    var name = input && input.name;
                    var scene = input && input.scene;
                    var sprite;

                    if (!name || !scene) {
                        throw new Error(ebg.err.input.required);
                    }

                    sprite = scene.getObjectByName(name);

                    if (!sprite) {
                        return; // Sprite hasn't been found yet, it has probably not finished loading.
                    }

                    // Only run code below this point once the sprite has been found in the scene.
                    
                    if (sprite.position.y > 0) {
                        // First vector: the spaceship slowly comes into view, losing altitude.
                        sprite.position.z += 0.05;
                        sprite.position.y += -0.05;
                    } else {
                        // Second vector: the spaceship speeds away from field of camera.
                        sprite.position.z += 1.2;
                    }

                    if (sprite.position.z > 25) {
                        sprite.position.set(-5, 20, -50); // back to start position.
                    }
                }
            },
            {
                name: 'fast-spaceship',
                scene: scene,
                // The heartbeat of a sprite is run every tick of the main render.
                heartbeat: function (input) {
                    var name = input && input.name;
                    var scene = input && input.scene;
                    var sprite;

                    if (!name || !scene) {
                        throw new Error(ebg.err.input.required);
                    }

                    sprite = scene.getObjectByName(name);

                    if (!sprite) {
                        return; // Sprite hasn't been found yet, it has probably not finished loading.
                    }

                    // Only run code below this point once the sprite has been found in the scene.
                    
                    if (sprite.position.y > 0) {
                        // First vector: the spaceship slowly comes into view, losing altitude.
                        sprite.position.z += 0.05;
                        sprite.position.y += -0.05;
                    } else {
                        // Second vector: the spaceship speeds away from field of camera.
                        sprite.position.z += 1;
                    }

                    if (sprite.position.z > 25) {
                        sprite.position.set(1.5, 20, -25); // back to start position.
                    }
                }
            },
            {
                name: 'slow-spaceship',
                scene: scene,
                // The heartbeat of a sprite is run every tick of the main render.
                heartbeat: function (input) {
                    var name = input && input.name;
                    var scene = input && input.scene;
                    var sprite;

                    if (!name || !scene) {
                        throw new Error(ebg.err.input.required);
                    }

                    sprite = scene.getObjectByName(name);

                    if (!sprite) {
                        return; // Sprite hasn't been found yet, it has probably not finished loading.
                    }

                    // Only run code below this point once the sprite has been found in the scene.
                    
                    if (sprite.position.y > -2) {
                        // First vector: the spaceship slowly comes into view, losing altitude.
                        sprite.position.z += 0.05;
                        sprite.position.y += -0.05;
                    } else {
                        // Second vector: the spaceship moves away from field of camera, slower than fast-spaceship.
                        sprite.position.z += 0.33;
                    }

                    if (sprite.position.z > 25) {
                        sprite.position.set(-1, 20, -45); // back to start position.
                    }
                }
            }
        ],
        // The callback is run every tick of the main render. It co-ordinates running all sprite heartbeats.
        callback: function callback (input) {
            var sprites = input && input.sprites;

            if (!sprites) {
                throw new Error(ebg.err.input.required);
            }

            sprites.map(function (sprite) {
                if (sprite.heartbeat) {
                    sprite.heartbeat(sprite);
                }
            });
        }
    });
}(THREE));



