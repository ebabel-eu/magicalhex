# Enchantment & RetroQuest

Enchantment is a bleeding edge MMORPG game engine. RetroQuest is an attempt to rebuild the magic of EverQuest with the web technologies of today.

## Installation

```
npm install
bower install
```

## Build the game

```
grunt
```

## Start running the game during development

```
http-server src
```

If you haven't installed http-server already, install it by following instructions on https://www.npmjs.com/package/http-server

```
npm install http-server -g
```

Browse to

  http:192.168.1.69:8080
  http:127.0.0.1:8080



## todo

* Move to three.js and Firebase
* Authenticate with Firebase, login with Facebook, create a character.
* Start interface in Chrome. Ignore other browsers, only focus on Chrome.
* Add Grunt.
* Use unit testing in spec (Jasmine) and add test coverage reporting.

### Next steps

* Activity logging
* Zone#attackers should be an IdSet. IdSet should probably support some underscore methods
* Rename world in the tests to just w
* Spell modifiers (Spirit of Wolf-esque spell, Invincibility, Debuffs)
* Inventory
* Worn item stat modifiers
* Ability to cast spells to do damage.
* Use a spell modifier to remove all randomness for easier testing
* Rolling for damage
* Initialization of game within the network server
* Levels
* Respawning of mobs
* Experience
* Stats-based damage
* Re-integration of physics changes
* Deploy to Heroku
* Spells (duration-based actions, not tick-based)
* UI (HP, mana, stamina chat, buffs, spell slots)
* Can loot items from dead mob.
* Chat system (Jabber?!)
* Zoning
* Dying and going back to zone point

### Epics

* Pathfinding
* Mob animations
* UI
* Character / Account creation
* Better content
* Map editor for defining mob patrols, fear lines, etc

### Features (that are already implemented)

* 3D world
* Realtime networking


## Versions

### Next release tag

* 0.3.0 Migration to client side only with Firebase backend, Grunt and Bower.

### Released tags

* 0.2.0 Original version from https://github.com/jicksta/Enchantment