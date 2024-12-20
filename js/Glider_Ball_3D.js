// scene/demo-specific variables go here
let courseSphere = new THREE.Object3D();
let courseSphere_invMatrix = new THREE.Matrix4();
let rayObjectOrigin = new THREE.Vector3();
let rayObjectDirection = new THREE.Vector3();
let intersectionPoint = new THREE.Vector3();
let intersectionNormal = new THREE.Vector3();
let tempVec1 = new THREE.Vector3();
let tempVec2 = new THREE.Vector3();
let glider = new THREE.Object3D();
let gliderRotationMatrix = new THREE.Matrix4();
let gliderThrusters = new THREE.Object3D();
let gliderThrustersRotationMatrix = new THREE.Matrix4();
let gliderRayOrigin = new THREE.Vector3();
let gliderRayDirection = new THREE.Vector3();
let gliderOldPosition = new THREE.Vector3();
let gliderRaySegment = new THREE.Vector3();
let gliderRaySegmentLength = 0;
let gliderRight = new THREE.Vector3();
let gliderUp = new THREE.Vector3();
let gliderForward = new THREE.Vector3();
let gliderThrustersRight = new THREE.Vector3(1,0,0);
let gliderThrustersUp = new THREE.Vector3(0,1,0);
let gliderThrustersForward = new THREE.Vector3(0,0,-1);
let gliderRightVelocity = new THREE.Vector3();
let gliderUpVelocity = new THREE.Vector3();
let gliderForwardVelocity = new THREE.Vector3();
let gliderVelocity = new THREE.Vector3();
let gliderIsInAir = true;
let gliderIsAcceleratingRight = false;
let gliderIsAcceleratingUp = false;
let gliderIsAcceleratingForward = false;
let worldGravity = new THREE.Vector3(0, -1, 0);
let worldRight = new THREE.Vector3(1, 0, 0);
let worldUp = new THREE.Vector3(0, 1, 0);
let worldForward = new THREE.Vector3(0, 0, -1);
let forwardProbe = new THREE.Vector3();
let backwardProbe = new THREE.Vector3();
let rightProbe = new THREE.Vector3();
let leftProbe = new THREE.Vector3();

let ball = new THREE.Object3D();
let ballRotationMatrix = new THREE.Matrix4();
let ballRayOrigin = new THREE.Vector3();
let ballRayDirection = new THREE.Vector3();
let ballOldPosition = new THREE.Vector3();
let ballRaySegment = new THREE.Vector3();
let ballRaySegmentLength = 0;
let ballRight = new THREE.Vector3();
let ballUp = new THREE.Vector3();
let ballForward = new THREE.Vector3();
let ballRightVelocity = new THREE.Vector3();
let ballUpVelocity = new THREE.Vector3();
let ballForwardVelocity = new THREE.Vector3();
let ballIsInAir = true;


let demoInfoElement = document.getElementById('demoInfo');
let canPress_Space = true;
let jumpWasTriggered = false;
let roundBeginFlag = true;


// first, add some new methods to Three.js' Vector3 class

/*
Vector3.getPointAlongRay(rayOrigin, rayDirection, t) is a method that is called on a THREE.Vector3
parameters: this method takes 3 parameters - a 'rayOrigin' and a 'rayDirection' (both of type THREE.Vector3),
and a 't' value (a float number greater than 0)
The rayOrigin is a point in 3D space where the ray begins. The rayDirection is a 3D direction vector that defines 
the direction the ray is pointing in. Note: since the rayDirection is a pure direction vector, it is assumed to be normalized (length of 1) 
before calling this method.  If rayDirection is not normalized to unit length, this method will return incorrect results.
The t parameter can be any real number greater than 0, because a t value of 0 would return no distance along the ray (the rayOrigin itself), 
while negative numbers for t would produce points behind the ray, which is almost never desired.  Positive values of t that are closer to 0 will
give points very near the starting rayOrigin, while larger t values will give points farther and farther out along the rayDirection vector.
return: this method returns the Vector3 that this method was called on, but now this Vector3 has
been changed to a position (point in 3D space) that is the distance (t) out along the specified ray (rayOrigin, rayDirection).
The equation that makes this function work is:  pointAlongRay = rayOrigin + (t * rayDirection)
*/
THREE.Vector3.prototype.getPointAlongRay = function(rayOrigin, rayDirection, t)
{
	// note: rayDirection is assumed to be normalized (a Vector3 of unit length, or length of 1)
	this.x = rayOrigin.x + (t * rayDirection.x);
	this.y = rayOrigin.y + (t * rayDirection.y);
	this.z = rayOrigin.z + (t * rayDirection.z);
	return this;
};



let vx, vy, vz, d;
/*
Vector3.transformRayOriginAsPoint(m4_MatrixInverse) is a method that is called on a THREE.Vector3 
parameters: this method takes 1 parameter - a 'm4_MatrixInverse' (of the type THREE.Matrix4)
return: this method returns the Vector3 that this method was called on, but now this Vector3 has
been changed by transforming it as a 3D point.
This method is useful when instancing unit size objects (unit sphere, unit cylinder, etc) that have been 
transformed by a user-specified transform matrix which has changed the original unit object (its position, rotation, scale, shear).
When raycasting against such transformed objects, we must first transform the ray's origin into the reference of this 
changed object (its object space).  After the ray's origin is transformed with this method, we can get a correct raycast result from the changed object. 
Mathematically, this is accomplished by applying the transformed object's matrixInverse to the rayOrigin as a 3D point.  The result is a changed Vector3
that will be used as the new rayOrigin when performing a raycast against a transformed unit-shape (using a simple unit-shape raycast routine, which is easier).
*/
THREE.Vector3.prototype.transformRayOriginAsPoint = function(m4_MatrixInverse)
{
	const el = m4_MatrixInverse.elements;
	vx = this.x;
	vy = this.y;
	vz = this.z;

	d = 1 / (vx * el[3] + vy * el[7] + vz * el[11] + el[15]);

	this.x = (vx * el[0] + vy * el[4] + vz * el[8] + el[12]) * d;
	this.y = (vx * el[1] + vy * el[5] + vz * el[9] + el[13]) * d;
	this.z = (vx * el[2] + vy * el[6] + vz * el[10] + el[14]) * d;
	return this;
}

/*
Vector3.transformRayDirectionAsDirection(m4_MatrixInverse) is a method that is called on a THREE.Vector3 
parameters: this method takes 1 parameter - a 'm4_MatrixInverse' (of the type THREE.Matrix4)
return: this method returns the Vector3 that this method was called on, but now this Vector3 has
been changed by transforming it as a pure direction vector (like a small, unit-size arrow pointing in 3D space).
This method is useful when instancing unit size objects (unit sphere, unit cylinder, etc) that have been 
transformed by a user-specified transform matrix which has changed the original unit object (its position, rotation, scale, shear).
When raycasting against such transformed objects, we must also transform the ray's direction into the reference of this 
changed object (its object space).  After the ray's direction is transformed with this method, we can get a correct raycast result from the changed object. 
Mathematically, this is accomplished by applying the transformed object's matrixInverse to the rayDirection as a pure direction vector.  This method differs from
the one above because it only operates on the directional part of the supplied matrix (as opposed to the positional part used above).  The result is a changed 
Vector3 that will be used as the new rayDirection when performing a raycast against a transformed unit-shape (using a simple unit-shape raycast routine, which is easier).
*/

THREE.Vector3.prototype.transformRayDirectionAsDirection = function(m4_MatrixInverse)
{
	const el = m4_MatrixInverse.elements;
	vx = this.x;
	vy = this.y;
	vz = this.z;

	this.x = vx * el[0] + vy * el[4] + vz * el[8];
	this.y = vx * el[1] + vy * el[5] + vz * el[9];
	this.z = vx * el[2] + vy * el[6] + vz * el[10];
	return this;
}

/*
Vector3.transformSurfaceNormal(m4_MatrixInverse) is a method that is called on a THREE.Vector3 
parameters: this method takes 1 parameter - a 'm4_MatrixInverse' (of the type THREE.Matrix4)
return: this method returns the Vector3 that this method was called on, but now this Vector3 has
been changed by transforming it as a surface-normal direction vector (like a small arrow pointing at 90 degrees from its surface in 3D space).
This method is useful when instancing unit size objects (unit sphere, unit cylinder, etc) that have been 
transformed by a user-specified transform matrix that has changed the original unit object (its position, rotation, scale, shear).
After raycasting against such transformed objects with the transformed rayOrigin and rayDirection in object space (see above 2 methods), 
we must bring the intersection surface normal (in object space) back into 3D world space.  Surface-normal vectors are special and must be handled differently from other direction vectors. 
It is not enough to simply multiply the object-space surface normal by the user-specified transform matrix.  This would result in incorrect world-space normals that do not point exactly 
90 degrees from their surface.  Rather, we must apply the 'inverse transpose' of that transform matrix to the object-space normal, in order to correctly bring it back into world space. 
Mathematically, this is accomplished by applying the Transpose of the transformed object's matrixInverse to the surface-normal vector (the Vector3 that this method was called on) as a pure 
direction vector. The result is a changed Vector3 that will be the new surface normal of the transformed object (it will point exactly 90 degrees from its surface, even after transformations).
*/

THREE.Vector3.prototype.transformSurfaceNormal = function(m4_MatrixInverse)
{
	const el = m4_MatrixInverse.elements;
	vx = this.x;
	vy = this.y;
	vz = this.z;
	// use the Transpose of this matrixInverse instead (matrix rows and columns are simply switched)
	this.x = vx * el[0] + vy * el[1] + vz * el[2];
	this.y = vx * el[4] + vy * el[5] + vz * el[6];
	this.z = vx * el[8] + vy * el[9] + vz * el[10];
}


let t = Infinity;
let testT = Infinity;
let nearestT = Infinity;

let invA, neg_halfB, u2, u;
let t0, t1;
function solveQuadratic(A, B, C)
{
	invA = 1 / A;
	B *= invA;
	C *= invA;
	neg_halfB = -B * 0.5;
	u2 = neg_halfB * neg_halfB - C;
	if (u2 < 0)
		return false;
	u = Math.sqrt(u2);
	t0 = neg_halfB - u;
	t1 = neg_halfB + u;
	return true;
}

let a = 0;
let b = 0;
let c = 0;

function intersectUnitSphere(rayO, rayD, nl)
{
	// Unit Sphere implicit equation
	// X^2 + Y^2 + Z^2 - 1 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - 1; // this '1' = (1 * 1) or unit sphere radius squared

	if (solveQuadratic(a, b, c) == false)
	{
		return Infinity;
	}

	if (t0 > 0)
	{
		nl.getPointAlongRay(rayO, rayD, t0);
		return t0;
	}
	if (t1 > 0)
	{
		nl.getPointAlongRay(rayO, rayD, t1);
		return t1;
	}
	
	return Infinity;
}




// called automatically from within initTHREEjs() function (located in InitCommon.js file)
function initSceneData()
{
	demoFragmentShaderFileName = 'Glider_Ball_3D_Fragment.glsl';

	// scene/demo-specific three.js objects setup goes here
	sceneIsDynamic = true;

	useGenericInput = false;

	pixelEdgeSharpness = 0.75;
	
	cameraFlightSpeed = 60;

	// pixelRatio is resolution - range: 0.5(half resolution) to 1.0(full resolution)
	pixelRatio = mouseControl ? 0.75 : 0.75;

	EPS_intersect = 0.01;

	// set camera's field of view
	worldCamera.fov = 80;


	// COURSE (Sphere-shaped)
	courseSphere.visible = false;
	courseSphere.position.set(0, 400, 0);
	courseSphere.scale.set(400, 400, 400);
	// must call this each time we change an object's transform
	courseSphere.updateMatrixWorld();
	courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert();

	// GLIDER
	glider.visible = false;
	glider.position.set(0, 300, 30);
	glider.scale.set(15, 22, 5);
	glider.updateMatrixWorld();
	
	gliderRight.set(1, 0, 0);
	gliderUp.set(0, 1, 0);
	gliderForward.set(0, 0, -1);

	// BALL
	ball.visible = false;
	ball.position.set(0, 300, 0);
	ball.scale.set(8, 12, 8);
	ball.updateMatrixWorld();
	
	ballRight.set(1, 0, 0);
	ballUp.set(0, 1, 0);
	ballForward.set(0, 0, -1);


	// scene/demo-specific uniforms go here
	pathTracingUniforms.uCourseSphere_invMatrix = { value: courseSphere_invMatrix };
	pathTracingUniforms.uGliderInvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uBallInvMatrix = { value: new THREE.Matrix4() };

} // end function initSceneData()



// called automatically from within the animate() function (located in InitCommon.js file)
function updateVariablesAndUniforms()
{

	// reset some variables at start of game loop
	gliderIsAcceleratingRight = false;
	gliderIsAcceleratingUp = false;
	gliderIsAcceleratingForward = false;
	
	// get user input
	if (!isPaused)
	{
		if ((keyPressed('Space') || button5Pressed) && canPress_Space)
		{
			jumpWasTriggered = true;
			canPress_Space = false;
		}
		// Use the following controls for a more realistic physics simulation of a floating Glider. You can only travel in the direction of thrust. 
		// Facing direction will not steer the Glider (like you would be able to if the Glider was a car with wheels).  The 2D example of this
		// behavior is piloting your spaceship in the classic Asteroids arcade game.  The spacecraft travels only in the thrust direction and keeps floating
		// in that direction until applying an opposing thrust or an artificial 'friction' force. The Asteroids ship slows from friction, even though there's none in space.
		/* {
			if ((keyPressed('KeyW') || button3Pressed) && !(keyPressed('KeyS') || button4Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, gliderThrustersForward.dot(gliderForward) * -300 * frameTime); 
				gliderRightVelocity.addScaledVector(worldRight, gliderThrustersForward.dot(gliderRight) * 300 * frameTime);
				gliderIsAcceleratingForward = true;
				
			}
			if ((keyPressed('KeyS') || button4Pressed) && !(keyPressed('KeyW') || button3Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, gliderThrustersForward.dot(gliderForward) * 300 * frameTime); 
				gliderRightVelocity.addScaledVector(worldRight, gliderThrustersForward.dot(gliderRight) * -300 * frameTime);
				gliderIsAcceleratingForward = true;
			}
			if ((keyPressed('KeyA') || button1Pressed) && !(keyPressed('KeyD') || button2Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, gliderThrustersRight.dot(gliderForward) * 300 * frameTime); 
				gliderRightVelocity.addScaledVector(worldRight, gliderThrustersRight.dot(gliderRight) * -300 * frameTime);
				gliderIsAcceleratingRight = true;
			}
			if ((keyPressed('KeyD') || button2Pressed) && !(keyPressed('KeyA') || button1Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, gliderThrustersRight.dot(gliderForward) * -300 * frameTime); 
				gliderRightVelocity.addScaledVector(worldRight, gliderThrustersRight.dot(gliderRight) * 300 * frameTime);
				gliderIsAcceleratingRight = true;
			}
		} */
		// Or use the following controls for a constantly-steerable Glider (even steers when no thrust is being applied and Glider is slowing down)
		// Behaves more like a car with wheels.  This is less realistic physics-wise for a hovering Glider, but I may ultimately keep it for max player-steering control.
		// When everything is moving really fast, it may be helpful to 'steer' the floating Glider, in order to maximize ball-targeting ability, and thus fun factor.
		//if (!gliderIsInAir)
		{
			if ((keyPressed('KeyW') || button3Pressed) && !(keyPressed('KeyS') || button4Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, -300 * frameTime); 
				gliderIsAcceleratingForward = true;
				
			}
			if ((keyPressed('KeyS') || button4Pressed) && !(keyPressed('KeyW') || button3Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, 300 * frameTime); 
				gliderIsAcceleratingForward = true;
			}
			if ((keyPressed('KeyA') || button1Pressed) && !(keyPressed('KeyD') || button2Pressed))
			{
				gliderRightVelocity.addScaledVector(worldRight, -300 * frameTime);
				gliderIsAcceleratingRight = true;
			}
			if ((keyPressed('KeyD') || button2Pressed) && !(keyPressed('KeyA') || button1Pressed))
			{ 
				gliderRightVelocity.addScaledVector(worldRight, 300 * frameTime);
				gliderIsAcceleratingRight = true;
			}
		}
		
	} // end if (!isPaused)

	// if camera is not rotating and Glider motion has almost fully stopped, set cameraIsMoving to false,
	// otherwise set cameraIsMoving to true because there must be some action or movement going on in the game.
	// This helps with the temporal/spatial denoiser in the final shader, which tries to get rid of noise from edges (which must remain sharp)
	if (!cameraIsMoving && gliderRightVelocity.lengthSq() < 20 && gliderUpVelocity.lengthSq() < 20 && gliderForwardVelocity.lengthSq() < 20)
		cameraIsMoving = false;
	else cameraIsMoving = true;


	// UPDATE GLIDER ////////////////////////////////////////////////////////////////////////////////


	// if glider is on the ground (touching the large course), allow player to jump again
	if (!gliderIsInAir)
	{
		gliderUpVelocity.set(0, 0, 0);
		gliderIsAcceleratingUp = false;
		canPress_Space = true;
	}
	// if in air, apply gravity (actually anti-gravity: pulls Glider down to the large course surface in all directions)
	if (gliderIsInAir)
	{
		canPress_Space = false;
		gliderUpVelocity.addScaledVector(worldUp, -200 * frameTime);
		gliderIsAcceleratingUp = true;
	}
	// if a legal jump action was triggered, apply a short, upward impulse to glider
	if (jumpWasTriggered)
	{
		gliderIsInAir = true;
		gliderUpVelocity.copy(worldUp).multiplyScalar(150);
		gliderIsAcceleratingUp = true;
		jumpWasTriggered = false;
	}

	
	// apply friction to glider
	if (!gliderIsAcceleratingForward && !gliderIsAcceleratingUp && !gliderIsAcceleratingRight)
	{
		gliderForwardVelocity.z -= (gliderForwardVelocity.z * 1 * frameTime);
		gliderRightVelocity.x -= (gliderRightVelocity.x * 1 * frameTime);
	}
	
	// update glider position

	// Use the following code for setting position according to glider world positional basis (basis vectors only based on glider Up vector). Will behave more like the real world,
	// where the glider has momentum and will travel in the thrusted direction (only slowing due to artificial 'friction'), and will continue in that direction unless a
	// thrust is applied in a different direction. A perfect 2D example of this behavior is found in the classic Asteroids arcade game.  The player's ship
	// travels in the thrusted direction, and will continue in that direction (just like a real spacecraft), unless acted upon by a different force, i.e. another thrust 
	// in a different direction, or applying fake 'friction' to the environment, which is used to artificially slow the craft down, even in outer space. 
	// This realistic behavior, although cool, makes it more challenging to target and hit the ball with your glider, especially when everything is moving fast in-game. 
	/* 
	glider.position.addScaledVector(gliderRight, gliderRightVelocity.x * frameTime);
	glider.position.addScaledVector(gliderUp, gliderUpVelocity.y * frameTime);
	glider.position.addScaledVector(gliderForward, gliderForwardVelocity.z * frameTime);
 	*/

	// Or, use the following code for setting position according to gliderThrusters rotational basis (which way glider is facing). Will constantly steer the glider in that
	// facing direction, even when no engine thrusting is being applied and glider is slowing down due to friction (glider will continue to perfectly steer until fully stopped).
	// Behaves more like a car with wheels. This is less realistic physics-wise for a hovering glider, but I may ultimately keep it for max player-steering control.
	// When everything is moving really fast, it may be helpful to 'steer' your floating glider, in order to maximize ball-targeting ability, and thus fun factor.
	glider.position.addScaledVector(gliderThrustersRight, gliderRightVelocity.x * frameTime);
	glider.position.addScaledVector(gliderThrustersUp, gliderUpVelocity.y * frameTime);
	glider.position.addScaledVector(gliderThrustersForward, gliderForwardVelocity.z * frameTime);

	

	// now that the glider has moved, record its new position minus its old position as a line segment
	gliderRaySegment.copy(glider.position).sub(gliderOldPosition);
	gliderRaySegmentLength = gliderRaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the glider's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	gliderRayOrigin.copy(gliderOldPosition); // must use glider's old position for this to work
	gliderRayDirection.copy(gliderRaySegment).normalize();
	rayObjectOrigin.copy(gliderRayOrigin);
	rayObjectDirection.copy(gliderRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	// If the test t value from the raycast comes back smaller than the distance that the glider is trying to cover during
	//   this animation frame, that means that the glider's future position would step out of bounds of the course.
	//   Therefore, we must snap the glider back into position at the raycast intersectionPoint on the course surface.
	if (testT < gliderRaySegmentLength)
	{
		gliderIsInAir = false;
		gliderUpVelocity.set(0, 0, 0);
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(gliderRayOrigin, gliderRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		glider.position.copy(intersectionPoint);
		gliderUp.copy(intersectionNormal);
		gliderRight.crossVectors(gliderForward, gliderUp).normalize();
		gliderForward.crossVectors(gliderUp, gliderRight).normalize();
	}
	if (testT == Infinity)
	{// bail out and snap the glider back to its old position
		glider.position.copy(gliderOldPosition);
	}

	
	
	// check glider center probe for intersection with course (a ray is cast from glider's position downward towards the floor beneath)
	
	gliderRayOrigin.copy(glider.position);
	gliderRayDirection.copy(gliderUp).negate();

	rayObjectOrigin.copy(gliderRayOrigin);
	rayObjectDirection.copy(gliderRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < Infinity)
	{
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(gliderRayOrigin, gliderRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		gliderUp.copy(intersectionNormal);
		gliderRight.crossVectors(gliderForward, gliderUp).normalize();
		gliderForward.crossVectors(gliderUp, gliderRight).normalize();
	}
	if (testT < 1)
	{
		gliderIsInAir = false;
		gliderUpVelocity.set(0, 0, 0);
		glider.position.copy(intersectionPoint);
	}
	if (testT > 2)
	{
		gliderIsInAir = true;
	}
		
	if (testT == Infinity)
	{// bail out and snap the glider back to its old position
		glider.position.copy(gliderOldPosition);
	}
	

	// now check all 4 probes around the glider (forward, backward, right, and left) for collision with the large course
	
	// reset nearestT to the max probe distance value
	nearestT = 1;
	
	forwardProbe.copy(glider.position).addScaledVector(gliderForward, 1);
	gliderRayOrigin.copy(forwardProbe);
	gliderRayDirection.copy(gliderUp).negate();

	rayObjectOrigin.copy(gliderRayOrigin);
	rayObjectDirection.copy(gliderRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(gliderRayOrigin, gliderRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		forwardProbe.copy(intersectionPoint);
		
		gliderForward.copy(forwardProbe).sub(glider.position).normalize();
		gliderUp.copy(intersectionNormal);
		gliderRight.crossVectors(gliderForward, gliderUp).normalize();
		gliderUp.crossVectors(gliderRight, gliderForward).normalize();
	}


	backwardProbe.copy(glider.position).addScaledVector(gliderForward, -1);
	gliderRayOrigin.copy(backwardProbe);
	gliderRayDirection.copy(gliderUp).negate();

	rayObjectOrigin.copy(gliderRayOrigin);
	rayObjectDirection.copy(gliderRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(gliderRayOrigin, gliderRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		backwardProbe.copy(intersectionPoint);

		gliderForward.copy(backwardProbe).sub(glider.position).negate().normalize();
		gliderUp.copy(intersectionNormal);
		gliderRight.crossVectors(gliderForward, gliderUp).normalize();
		gliderUp.crossVectors(gliderRight, gliderForward).normalize();
	}


	rightProbe.copy(glider.position).addScaledVector(gliderRight, 1);
	gliderRayOrigin.copy(rightProbe);
	gliderRayDirection.copy(gliderUp).negate();

	rayObjectOrigin.copy(gliderRayOrigin);
	rayObjectDirection.copy(gliderRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(gliderRayOrigin, gliderRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		rightProbe.copy(intersectionPoint);

		gliderRight.copy(rightProbe).sub(glider.position).normalize();
		gliderUp.copy(intersectionNormal);
		gliderForward.crossVectors(gliderUp, gliderRight).normalize();
		gliderUp.crossVectors(gliderRight, gliderForward).normalize();
	}


	leftProbe.copy(glider.position).addScaledVector(gliderRight, -1);
	gliderRayOrigin.copy(leftProbe);
	gliderRayDirection.copy(gliderUp).negate();

	rayObjectOrigin.copy(gliderRayOrigin);
	rayObjectDirection.copy(gliderRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(gliderRayOrigin, gliderRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		leftProbe.copy(intersectionPoint);
		
		gliderRight.copy(leftProbe).sub(glider.position).negate().normalize();
		gliderUp.copy(intersectionNormal);
		gliderForward.crossVectors(gliderUp, gliderRight).normalize();
		gliderUp.crossVectors(gliderRight, gliderForward).normalize();
	}

	

	// now that glider position is in its final place for this frame, copy it to gliderOldPosition
	gliderOldPosition.copy(glider.position);


	
	gliderForward.negate();
	gliderRotationMatrix.makeBasis(gliderRight, gliderUp, gliderForward);
	gliderForward.negate();
	glider.rotation.setFromRotationMatrix(gliderRotationMatrix);
	glider.updateMatrixWorld();
	

	gliderThrusters.position.copy(glider.position);
	gliderThrusters.rotation.copy(glider.rotation);
	gliderThrusters.scale.copy(glider.scale);

	gliderThrusters.rotateY(inputRotationHorizontal);
	gliderThrusters.updateMatrixWorld();
	gliderThrusters.matrixWorld.extractBasis(gliderThrustersRight, gliderThrustersUp, gliderThrustersForward);
	gliderThrustersRight.normalize(); gliderThrustersUp.normalize(); gliderThrustersForward.normalize().negate();

	

	// temporarily move glider up out of the ground for final render
	gliderThrusters.position.addScaledVector(gliderThrustersUp, 8);
	gliderThrusters.updateMatrixWorld();

	cameraControlsObject.position.copy(gliderThrusters.position);
	cameraControlsObject.position.addScaledVector(gliderThrustersForward, -70);
	cameraControlsObject.position.addScaledVector(gliderThrustersUp, 20);
	
	cameraControlsObject.rotation.copy(gliderThrusters.rotation);
	cameraControlsPitchObject.rotation.x = inputRotationVertical;
	// rotate glider paraboloid (temporary stand-in for more complex game model), so its apex faces in the forward direction
	gliderThrusters.rotateX(-Math.PI * 0.5);
	gliderThrusters.updateMatrixWorld();


	// send final Glider transform (as an inverted matrix), so that the ray tracer can render it in the correct position and orientation
	pathTracingUniforms.uGliderInvMatrix.value.copy(gliderThrusters.matrixWorld).invert();

	// after rendering, reset glider position back down so that its center is right on the ground (this helps with ray casting against course)
	gliderThrusters.position.addScaledVector(gliderThrustersUp, -8);
	// after rendering, reset glider rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	gliderThrusters.rotateX(Math.PI * 0.5);
	
		



	// UPDATE BALL ///////////////////////////////////////////////////////////////////////////////////


	if (ballIsInAir)
	{
		ballUpVelocity.addScaledVector(worldGravity, 4);
	}

	ballRightVelocity.copy(worldRight).multiplyScalar(200);
	ball.position.addScaledVector(ballRight, worldRight.dot(ballRightVelocity) * frameTime);
	ball.position.addScaledVector(ballUp, worldUp.dot(ballUpVelocity) * frameTime);
	ball.position.addScaledVector(ballForward, worldForward.dot(ballForwardVelocity) * frameTime);

	


	// now that the ball has moved, record its new position minus its old position as a line segment
	ballRaySegment.copy(ball.position);
	ballRaySegment.sub(ballOldPosition);
	ballRaySegmentLength = ballRaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the ball's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	ballRayOrigin.copy(ballOldPosition); // must use ball's old position for this to work
	ballRayDirection.copy(ballRaySegment).normalize();
	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	// If the test t value from the raycast comes back smaller than the distance that the ball is trying to cover during
	//   this animation frame, that means that the ball's future position would step out of bounds of the course.
	//   Therefore, we must snap the ball back into position at the raycast intersectionPoint on the course surface.
	if (testT < ballRaySegmentLength)
	{
		ballIsInAir = false;
		ballUpVelocity.set(0, 0, 0);
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		ball.position.copy(intersectionPoint);
		ballUp.copy(intersectionNormal);
		ballRight.crossVectors(ballForward, ballUp).normalize();
		ballForward.crossVectors(ballUp, ballRight).normalize();
	}
	if (testT == Infinity)
	{// bail out and snap the ball back to its old position
		ball.position.copy(ballOldPosition);
	}

	
	
	// check ball center probe for intersection with course (a ray is cast from ball's position downward towards the floor beneath)
	
	ballRayOrigin.copy(ball.position);
	ballRayDirection.copy(ballUp).negate();

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < Infinity)
	{
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		ballUp.copy(intersectionNormal);
		ballRight.crossVectors(ballForward, ballUp).normalize();
		ballForward.crossVectors(ballUp, ballRight).normalize();	
	}
	if (testT < 1)
	{
		ballIsInAir = false;
		ballUpVelocity.set(0, 0, 0);
		ball.position.copy(intersectionPoint);
	}
	if (testT > 2)
	{
		ballIsInAir = true;
	}
		
	if (testT == Infinity)
	{// bail out and snap the ball back to its old position
		ball.position.copy(ballOldPosition);
	}
	

	// now check all 4 probes around the ball (forward, backward, right, and left) for collision with the large course
	
	// reset nearestT to the max probe distance value
	nearestT = 1;
	
	forwardProbe.copy(ball.position).addScaledVector(ballForward, 1);
	ballRayOrigin.copy(forwardProbe);
	ballRayDirection.copy(ballUp).negate();

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		forwardProbe.copy(intersectionPoint);
		
		ballForward.copy(forwardProbe).sub(ball.position).normalize();
		ballUp.copy(intersectionNormal);
		ballRight.crossVectors(ballForward, ballUp).normalize();
		ballUp.crossVectors(ballRight, ballForward).normalize();
	}


	backwardProbe.copy(ball.position).addScaledVector(ballForward, -1);
	ballRayOrigin.copy(backwardProbe);
	ballRayDirection.copy(ballUp).negate();

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		backwardProbe.copy(intersectionPoint);

		ballForward.copy(backwardProbe).sub(ball.position).negate().normalize();
		ballUp.copy(intersectionNormal);
		ballRight.crossVectors(ballForward, ballUp).normalize();
		ballUp.crossVectors(ballRight, ballForward).normalize();
	}


	rightProbe.copy(ball.position).addScaledVector(ballRight, 1);
	ballRayOrigin.copy(rightProbe);
	ballRayDirection.copy(ballUp).negate();

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		rightProbe.copy(intersectionPoint);

		ballRight.copy(rightProbe).sub(ball.position).normalize();
		ballUp.copy(intersectionNormal);
		ballForward.crossVectors(ballUp, ballRight).normalize();
		ballUp.crossVectors(ballRight, ballForward).normalize();
	}


	leftProbe.copy(ball.position).addScaledVector(ballRight, -1);
	ballRayOrigin.copy(leftProbe);
	ballRayDirection.copy(ballUp).negate();

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformRayOriginAsPoint(courseSphere_invMatrix);
	rayObjectDirection.transformRayDirectionAsDirection(courseSphere_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-sphere intersection routine
	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < nearestT)
	{
		nearestT = testT;
		intersectionNormal.transformSurfaceNormal(courseSphere_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on spheres, but since we are inside the sphere, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		leftProbe.copy(intersectionPoint);
		
		ballRight.copy(leftProbe).sub(ball.position).negate().normalize();
		ballUp.copy(intersectionNormal);
		ballForward.crossVectors(ballUp, ballRight).normalize();
		ballUp.crossVectors(ballRight, ballForward).normalize();
	}

	

	// apply friction to ball
	if (!ballIsInAir)
	{
		//ballForwardVelocity.multiplyScalar(0.97);
		//ballRightVelocity.multiplyScalar(0.97);
		
		/* tempVec1.copy(ballForwardVelocity).normalize();
		ballForwardVelocity.addScaledVector(tempVec1, -1);
		tempVec2.copy(ballRightVelocity).normalize();
		ballRightVelocity.addScaledVector(tempVec2, -1);
		if ( (ballForwardVelocity.lengthSq() < 0.1 && ballRightVelocity.lengthSq() < 0.1) ||
			tempVec1.dot(ballForwardVelocity) > 0 || tempVec2.dot(ballRightVelocity) > 0 )
		{
			ballForwardVelocity.set(0, 0, 0);
			ballRightVelocity.set(0, 0, 0);
		} */
	}


	ballOldPosition.copy(ball.position);


	

	ballForward.negate();
	ballRotationMatrix.makeBasis(ballRight, ballUp, ballForward);
	ball.rotation.setFromRotationMatrix(ballRotationMatrix);
	//ball.rotateY(1 * frameTime);
	ball.updateMatrixWorld();

	ball.matrixWorld.extractBasis(ballRight, ballUp, ballForward);
	ballRight.normalize(); ballUp.normalize(); ballForward.normalize().negate();

	// temporarily move ball up out of the ground for final render
	ball.position.addScaledVector(ballUp, 12);
	ball.updateMatrixWorld();

	// rotate ball so its apex faces up
	//ball.rotateX(-Math.PI * 0.5);
	//ball.updateMatrixWorld();

	// if ball is on the ground (touching the large course), set its up velocity to 0
	if (!ballIsInAir)
	{
		ballUpVelocity.set(0, 0, 0);
	}


	// send final ball transform (as an inverted matrix), so that the ray tracer can render it in the correct position and orientation
	pathTracingUniforms.uBallInvMatrix.value.copy(ball.matrixWorld).invert();

	// after rendering, reset ball position back down so that its center is right on the ground (this helps with ray casting against course)
	ball.position.addScaledVector(ballUp, -12);
	// after rendering, reset ball rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	//ball.rotateX(Math.PI * 0.5);



	// DEBUG INFO
	demoInfoElement.innerHTML = "gliderIsInAir: " + gliderIsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"gliderWorldRight: " + "(" + gliderThrustersRight.x.toFixed(1) + " " + gliderThrustersRight.y.toFixed(1) + " " + gliderThrustersRight.z.toFixed(1) + ")" + " " + 
	"gliderWorldUp: " + "(" + gliderThrustersUp.x.toFixed(1) + " " + gliderThrustersUp.y.toFixed(1) + " " + gliderThrustersUp.z.toFixed(1) + ")" + " " + 
	"gliderWorldForward: " + "(" + gliderThrustersForward.x.toFixed(1) + " " + gliderThrustersForward.y.toFixed(1) + " " + gliderThrustersForward.z.toFixed(1) + ")" + "<br>" + 
	
	"gliderLocalRightVelocity: " + gliderRightVelocity.x.toFixed(1) + " " + "gliderLocalUpVelocity: " + gliderUpVelocity.y.toFixed(1) + " " + "gliderLocalForwardVelocity: " + gliderForwardVelocity.z.toFixed(1);// + "<br>" + 
	//"gliderVelocity: " + gliderVelocity.x.toFixed(1) + " " + gliderVelocity.y.toFixed(1) + " " + gliderVelocity.z.toFixed(1);
	
	// CAMERA INFO
	///cameraInfoElement.innerHTML = "FOV: " + worldCamera.fov + " / Aperture: " + apertureSize.toFixed(2) + " / FocusDistance: " + focusDistance + "<br>" + "Samples: " + sampleCounter;

} // end function updateUniforms()



init(); // init app and start animating
