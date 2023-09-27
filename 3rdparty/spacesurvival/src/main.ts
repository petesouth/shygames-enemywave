import Game from './game';

window.onload = () => {
  const game = new Game();


  (window as any).handleResize = function () {
    // Your resizing logic goes here.

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Update game size
    game.scale.setGameSize(w, h);

    // Additional adjustments if necessary (e.g., repositioning game objects, etc.)
  };

};

