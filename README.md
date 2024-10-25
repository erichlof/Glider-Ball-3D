# Glider Ball 3D (w.i.p.)
A fully path traced 3D action game for all devices with a browser.  This game is a work in progress:  Core gameplay and more courses will be added soon! <br>
Click to Play --> https://erichlof.github.io/Glider-Ball-3D/Glider_Ball_3D.html
<br>
<h4>Goal of this game</h4>
The goal of Glider Ball 3D is simple, yet challenging: Knock the ball into your opponent's goal! <br>
Think 'Rocket League' car-soccer gameplay, but instead of playing on boring, flat levels, the futuristic Gliders battle it out on interesting curve-shaped courses (more courses coming soon!).  And instead of having normal Earth-type gravity, Glider Ball 3D features Anti-Gravity, allowing the Gliders and ball to follow and hug the course surface wherever it leads, even if that means going upside down! 

<h4>Desktop Controls</h4>

* Click anywhere to capture mouse
* move Mouse left/right to steer your Glider
* move Mouse up/down to look up and down (does not affect Glider steering)
* Mousewheel to zoom camera in or out
* W/S keys thrust Glider forward and backward
* A/D keys strafe Glider left and right
* SPACEBAR to make Glider jump!

<h4>Mobile Controls</h4>

* Swipe left and right to steer your Glider
* Swipe up and down to look up and down (does not affect Glider steering)
* Pinch to zoom camera in or out
* large up/down directional buttons to thrust Glider forward and backward
* large left/right directional buttons to strafe Glider left and right
* small up button above directional controls to make Glider jump!

<h2>TODO</h2>

* Add core gameplay.  I'm not using any physics libraries for this custom gameplay (gravity working in all directions), so I am rolling my own collision detection (ray casting) and collision response. You can currently drive the Glider around the sphere-shaped course (and jump upwards) and it correctly follows the ground, even when the course goes upside down.  This took me 2 weeks straight to get working correctly (ha), but now that I have the proof of concept, adding other interesting shaped courses should be relatively easy.
* Add collision detection/response to Glider-Glider collisions and Glider-ball collisions.  I've done this type of routine before with my 3D Asteroid Patrol game, but the asteroids were gently floating in 3D space and knocking into each other and rebounding.  This Glider Ball game will have much faster-moving game objects (especially the ball), so I will have to learn how to handle this in my custom physics engine. 
* Add 2 rectangular goals, one for the Player, and one for the AI opponent.  Must detect collisions between the ball and these goals, and then award 1 point to the scoring Glider. 
* Add more courses that have interesting interior shapes (I'm planning on adding classic quadric-shaped courses such as Cylinder, Cone, Paraboloid, Hyperboloid, Torus (donut shape), Capsule, and variants of these classic math shapes by transforming them (non-uniform scaling, rotating, shearing, slicing, etc.)
* Make the Glider models more interesting looking, by using CSG (Constructive Solid Geometry) modeling.  This technique makes cool models (think TRON light cycles) and is easy for my ray tracing renderer to handle, because the game objects are made from a combination of smaller ray tracing-friendly shapes (spheres, paraboloids, capsules, cones, cylinders, etc).  The blue metal Paraboloid that you drive around now is just a placeholder.  As soon as I incorporate CSG modeling, the player and AI Gliders will look much more interesting.  I may even add the option of cycling through different Glider models that can be selected at the start of the game.
* At first, add basic AI to the opponent Glider.  It must be able to locate and target the ball while everything is moving fast.  Must be able to line up a shot towards player's goal. This will be challenging, but I will start with very simple target/follow mechanics for the AI Glider, and then refine further.
* After basic AI is working, consider allowing 2 human players to play against each other online over a P2P network.  This would have to use WebSockets or similar Web technology (WebRTC Data Channels?).  I've done this before on my old game, Deep Space Pong, but that was many years ago.  I'm sure the technology and networking APIs have changed.
* Add a couple of game sound effects (maybe a low humming sound as the Gliders hover around the 3D courses, and a sound when the Gliders collide with each other, a sound when a Glider hits the ball, and a sound when the ball goes into the goal.

<h2>ABOUT</h2>

* Glider Ball 3D represents the culmination of all my graphics/game programming skills over 25 years (I started game programming with OpenGL 1.1 and C for Windows 98 back in 1999).  In the early 2000s, before I even knew what Ray Tracing was, I was making small, tight-focused 3D action games in my spare time.  I made 3 games altogether back then (around 2001 to 2003). When a game was finished, I would upload and send the game executable (yeah I know lol) and a few screenshots to free games websites, where anyone in the world could download my games for free and have fun with them. <br>
I had made a prototype of Glider Ball 3D with OpenGL 1.1 and C, but sadly, my code and executable were lost over the years.  Not to worry though, it was just a prototype, and the course was a boring flat ground plane (like Rocket League), and the AI opponent Glider was almost unusable. I didn't have a clue how to add interesting-looking 3D tracks and courses, because I hadn't yet entered the world of Ray Tracing and raycasting those math-type shapes. Visually, my early prototype didn't have any special lighting (except maybe stock 90's OpenGL diffuse/Phong lighting), so it looked kind of dull and basic.  Fast-forward to today, and with Glider Ball 3D we have the entire game rendered with beautiful real-time Ray Tracing and Path Tracing at 60fps, on any device with a browser (even mobile!).  And since I have been learning how to do efficient ray tracing in the browser, I finally was able to realize my dream of having different interestingly-shaped 3D courses for players to navigate with their Glider.  It turns out that the same shapes we like to raytrace (spheres, cylinders, cones, etc) can be used for ray casting those same shapes as large courses, in order to detect collisions between Gliders and the courses and the ball and the courses. This simple type of car-soccer gameplay was fun when I had it running on a flat ground plane course, all those years ago.  But now I am so excited to customize and update my game by using realistic Ray Tracing for the graphics, and by using the same intersection routines for physics raycasting against the large course interiors. This will allow players to navigate fun and interesting courses as they play, often going up the sides of curved walls and even going totally upside down, riding along the ceiling. I really believe that having these interesting, arbitrary-shaped 3D courses for players to compete on, will take this game's experience and fun-factor to the next level! 
