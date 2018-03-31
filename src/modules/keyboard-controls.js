define(['constants', 'round', 'player-movement'], (C, round, PlayerMovement) => {
  // Control the movement of the main player via keyboard keys.
  class KeyboardControls {
    constructor(camera) {
      this.playerMovement = new PlayerMovement(camera);

      window.document.addEventListener('keydown', (e) => {
        this.handleKey(e, true);
      }, false);

      window.document.addEventListener('keyup', (e) => {
        this.handleKey(e, false);
      }, false);

      return this;
    }

    handleKey(e, isEnabled) {
      switch (e.keyCode) {
        case C.KEY.UP:
        case C.KEY.W:
          this.playerMovement.moveForward = isEnabled;
          break;
        case C.KEY.DOWN:
        case C.KEY.S:
          this.playerMovement.moveBackward = isEnabled;
          e.preventDefault(); // Prevent the whole page scrolling down when using the down arrow key.
          break;
        case C.KEY.LEFT:
        case C.KEY.A:
          this.playerMovement.turnLeft = isEnabled;
          break;
        case C.KEY.RIGHT:
        case C.KEY.D:
          this.playerMovement.turnRight = isEnabled;
          break;
        case C.KEY.ESC:
          document.dispatchEvent(new CustomEvent(C.EVENTS.TOGGLE_STATS));
          break;
        case C.KEY.BACKTICK_TILDE:
          document.dispatchEvent(new CustomEvent(C.EVENTS.TOGGLE_DEBUG));
          break;
      }
    }
  }

  return KeyboardControls;
});