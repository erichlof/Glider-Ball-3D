# Glider Ball 3D (w.i.p.)
A fully path traced 3D action game for all devices with a browser.  This game is a work in progress:  Core gameplay and more courses will be added soon! <br>
Click to Play --> https://erichlof.github.io/Glider-Ball-3D/Glider_Ball_3D.html
<br> <br>

<h3> March 14, 2025 NOTE: Workaround for Black Screen Bug (Mobile devices only) in latest Chromium Browsers (mobile Chrome, Edge, Brave, Opera) </h3>

* In latest Chrome 134.0 (and all Chromium-based browsers), there is a major bug that occurs on touch devices (happens on my Android phone - iPhone and iPad not tested yet)
* At demo startup, when you touch your screen for the first time, the entire screen suddenly turns black. There is no recovering - the webpage must be reloaded to see anything again.
* THE WORKAROUND: After starting up the demo, do a 'pinch' gesture with 2 fingers.  You can tell if you did it because the camera (FOV) will zoom in or out.
* Once you have done this simple 2-finger pinch gesture, you can interact with the demo as normal - the screen will not turn black on you for the duration of the webpage.
* I have no idea why this is happening.  I hooked my phone up to my PC's Chrome dev tools, and there are no warnings or errors in my phone's browser console output when the black screen occurs.
* I don't know why a 2-finger pinch gesture gets around this issue and prevents the black screen from occuring.
* I have done my own debug output on the demo webpage (inside an HTML element), and from what I can see, all the recorded touch events (like touchstart, touchmove, etc.) and camera variables appear valid and are working like they always do.
* The WebGL context isn't being lost and the webpage is not crashing, because the demo keeps running and the cameraInfo element (that is in the lower left-hand corner) on all demos, still outputs correct data - it's like the app is still running, taking user input, and doing path tracing calculations, but all that is displayed to the user is a black screen.
* I may open up a new issue on the Chromium bug tracker, but I can't even tell what error is occuring.  Plus my use case (path tracing fullscreen quad shader on top of three.js) is pretty rare, so I don't know how fast the Chromium team would get around to it, if at all.
* In my experience, these bugs have a way of working themselves out when the next update of Chromium comes out (which shouldn't be too long from now).  I love targeting the web platform because it is the only platform where you can truly "write the code once, run everywhere" - but one of the downsides of coding for this platform are the occasional bugs that are introduced into the browser itself, even though nothing has changed in your own code.  Hopefully this will be resolved soon, either by a targeted bug fix, or by happy accident with the next release of Chromium.  <br> <br>

<h4>Goal of this game</h4>
The goal of Glider Ball 3D is simple, yet challenging: Drive your Glider and knock the ball into the opponent's goal! <br>
Think 'Rocket League' car-soccer gameplay, but instead of playing on boring, flat levels, our futuristic Glider vehicles battle it out on interesting curve-shaped courses (more courses coming soon!).  And instead of having normal Earth-type gravity, Glider Ball 3D features Anti-Gravity, allowing the Gliders and ball to follow and hug the course surface wherever it leads, even if that means going upside down! 

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

* Add core gameplay: hovering Gliders race around the course trying to knock the ball into opponent's goal.  I'm not using any physics libraries for this custom gameplay (gravity working in all directions), so I am rolling my own collision detection and collision response. You can currently drive your Glider around the sphere-shaped course (and jump upwards) and it correctly follows the ground, even when the course goes upside down.  This took me 2 weeks straight to get working correctly (ha), but now that I have the proof of concept, adding other interesting curve-shaped courses should be relatively easy. 
* Add 2 rectangular goals, one for the Player, and one for the AI opponent.  Must detect collisions between the ball and these goals, and then award 1 point to the scoring Glider. 
* Add more courses that have interesting curved interior shapes. I'm planning on adding classic quadric-shaped courses such as Cylinder, Cone, Paraboloid, Hyperboloid, Torus (donut shape), Capsule, and variants of these classic math shapes by transforming them (non-uniform scaling, rotating, shearing, slicing, etc.)
* Make the Glider models more interesting looking, by using CSG (Constructive Solid Geometry) modeling.  This technique makes cool models (think 1982 TRON light cycles) and is easy for my ray tracing renderer to handle, because the game objects are made from a combination of smaller ray tracing-friendly shapes (spheres, paraboloids, capsules, cones, cylinders, etc).  The blue metal Paraboloid that you drive around now is just a placeholder.  As soon as I incorporate CSG modeling, the player and AI Gliders will look much more interesting.  I may even add the option of cycling through different Glider models that can be selected at the start of the game.
* At first, add basic AI to the opponent Glider.  It must be able to locate and target the ball while everything is moving fast.  Must be able to line up a shot towards player's goal. This will probably be really challenging, but I will start with very simple target/follow mechanics for the AI Glider, and then refine further.
* After basic AI is working, consider allowing 2 human players to play against each other online over a p2p network connection.  This would have to use WebSockets or similar Web technology (WebRTC Data Channels?).  I've done this before on my old game, Deep Space Pong, but that was many years ago.  I'm sure the technology and networking APIs have changed.
* Add a couple of game sound effects: maybe a low humming sound as the Gliders hover around the 3D courses, and a sound when the Gliders collide with each other, a sound when a Glider hits the ball, and a sound when the ball goes into the goal.

<h2>ABOUT</h2>

Glider Ball 3D is the original game that I always wanted to make, but didn't fully know how - until now. This game represents the culmination of all my graphics/game programming skills over 25 years (I started game programming with OpenGL 1.1 and C for Windows back in 1998).  By the early 2000s, before I even knew what Ray Tracing was, I was able to make small, simple 3D action games in my spare time.  I made 4 games altogether back then (around 2000 to 2003). When a game was finished, I would upload and send the raw game executable (yeah I know lol) and a few screenshots to free games websites, where anyone in the world could see the gameplay screenshots and then download my games for free. At one point, my younger brother Brian helped create and host our own game website.  We called ourselves the Binary Brotherz (with a z).  I forget who got to be the number "1" and who had to be the "0" (lol), but we thought it was a cool game developer team name.  If you want to see what our Binary Brotherz website looked like all those years ago, check it out: https://web.archive.org/web/20010405004141/http://www.binarybrotherz.com/games.html <br>
<br>
I'm so grateful for the Internet Archive WayBack Machine for preserving our old website for history.  Shortly after 2002, my brother and I could no longer afford to keep hosting our own website, so sadly we had to let the domain name go.  If it wasn't for the Internet Archive, this happy little piece of my past would be lost forever.  During this time period (around 2001 probably), I got the idea to make a game like Glider Ball 3D, where 2 players would drive fast hovering vehicles around a large course and knock a large glowing ball into their opponent's goal (basically car soccer, but much faster-paced and futuristic).  I drew inspiration from the classic 1983 LucasArts game, BallBlazer, but wanted slightly different vehicle and ball mechanics. I even wrote about it on the Projects page at our Binary Brotherz website: https://web.archive.org/web/20010406023749/http://www.binarybrotherz.com/projects.html <br>
<br>

![ballblazer](https://github.com/user-attachments/assets/0838be71-2888-42d4-bc3a-c64513a343ef)

I began making prototypes of Glider Ball 3D (first in QBasic for DOS, then later with OpenGL 1.1 and C for Windows 98). But sadly, the source code and executables were lost over the years.  Not to worry though, they were just prototypes - the playing course was a boring flat ground plane, and the AI opponent Glider was barely serviceable. I didn't have a clue how to add interesting-looking curved 3D courses, because I hadn't yet entered the world of Ray Tracing and ray casting those math-type shapes. Visually, my OpenGL 1.1 prototype didn't have any special lighting (except maybe stock 90's OpenGL diffuse lighting), so it looked kind of dull and basic. <br>
<br>
Fast-forward to today, and with Glider Ball 3D we have the entire game rendered with beautiful photo-realistic Ray Tracing at 60fps, on any device with a browser (even mobile!).  And since I have been learning how to do efficient Ray Tracing in the browser, I finally was able to realize my dream of having different curve-shaped 3D courses for players to navigate with their Glider vehicles. This game's simple type of car-soccer gameplay was pretty fun when I had it running on a flat ground plane course, all those years ago. But now I am so excited to update and enhance my original game idea by using sophisticated Ray Tracing for the graphics, and by using the same intersection routines for physics raycasting against the large curved course interiors. This will allow players to navigate fun and interesting courses as they play, often going up the sides of large curved walls and even going totally upside down, riding along the ceiling. I believe that having interesting, curve-shaped courses for players to compete on will take Glider Ball's gameplay and fun-factor to the next level! 
