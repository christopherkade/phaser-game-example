Updated result of the [Making your first Phaser game tutorial](https://phaser.io/tutorials/making-your-first-phaser-game).

- Cleaned up the tutorial's code by splitting it into distinct methods (for example `setUpStars()` which simply creates our star group and its content)
- Added enemies to the game using the 'baddie.png' asset, when a user touches an ennemy, he dies and may restart the game by pressing [Space]
- Added an 'end' to this little game, when all of our stars are collected, the user is congratulated and may restart the game by pressing [Space]

## Run it

You need an HTTP server to run this localy.

```bash
git clone https://github.com/christopherkade/phaser-game-example.git
npm install -g http-server
cd phase-game-example
http-server .
```

Open one of the links displayed by http-server and navigate to `game.html`.

Voilà ! Use the arrow keys to move around & jump.
