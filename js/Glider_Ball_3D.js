// scene/demo-specific variables go here
let courseSphere = new THREE.Object3D();
let courseSphere_invMatrix = new THREE.Matrix4();
let cameraRayOrigin = new THREE.Vector3();
let cameraRayDirection = new THREE.Vector3();
let chaseCameraPosition = new THREE.Vector3();
let rayObjectOrigin = new THREE.Vector3();
let rayObjectDirection = new THREE.Vector3();
let intersectionPoint = new THREE.Vector3();
let intersectionNormal = new THREE.Vector3();
let glider = new THREE.Object3D();
let gliderRotationMatrix = new THREE.Matrix4();
let YRotationMatrix = new THREE.Matrix4();
let gliderInvMatrix = new THREE.Matrix4();
let gliderRayOrigin = new THREE.Vector3();
let gliderRayDirection = new THREE.Vector3();
let gliderOldPosition = new THREE.Vector3();
let gliderRaySegment = new THREE.Vector3();
let gliderRaySegmentLength = 0;
let gliderRight = new THREE.Vector3();
let gliderUp = new THREE.Vector3();
let gliderForward = new THREE.Vector3();
let gliderRightVelocity = new THREE.Vector3();
let gliderUpVelocity = new THREE.Vector3();
let gliderForwardVelocity = new THREE.Vector3();
let worldGravity = new THREE.Vector3(0, -1, 0);
let gliderRotationY = 0;
let gliderIsInAir = true;
let frictionVec = new THREE.Vector3();
let worldRight = new THREE.Vector3(1, 0, 0);
let worldUp = new THREE.Vector3(0, 1, 0);
let worldForward = new THREE.Vector3(0, 0, -1);
let pullGravity = 0;
let gliderIsAccelerating = false;
let forwardProbe = new THREE.Vector3();
let backwardProbe = new THREE.Vector3();
let rightProbe = new THREE.Vector3();
let leftProbe = new THREE.Vector3();


let demoInfoElement = document.getElementById('demoInfo');
let canPress_Space = true;
let jumpWasTriggered = false;


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
that will be used as the new rayOrigin when performing a raycast against a transformed unit-shape (using a simple unit-shape rayscast routine, which is easier).
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
Vector3 that will be used as the new rayDirection when performing a raycast against a transformed unit-shape (using a simple unit-shape rayscast routine, which is easier).
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
	worldCamera.fov = 60;
	focusDistance = 130.0;

	// position and orient camera
	cameraControlsObject.position.set(0, 150, 250);
	///cameraControlsYawObject.rotation.y = 0.0;
	// look slightly downward
	//cameraControlsPitchObject.rotation.x = -0.4;

	// COURSE (Sphere-shaped)
	courseSphere.visible = false;
	courseSphere.position.set(0, 400, 0);
	courseSphere.scale.set(400, 400, 400);
	// must call this each time we change an object's transform
	courseSphere.updateMatrixWorld();
	courseSphere_invMatrix.copy(courseSphere.matrixWorld).invert();

	// GLIDER
	glider.visible = false;
	glider.position.set(0, 300, 0);
	glider.scale.set(15, 22, 5);
	glider.updateMatrixWorld();
	
	gliderRight.set(1, 0, 0);
	gliderUp.set(0, 1, 0);
	gliderForward.set(0, 0, -1);


	// scene/demo-specific uniforms go here
	pathTracingUniforms.uCourseSphere_invMatrix = { value: courseSphere_invMatrix };
	pathTracingUniforms.uGliderInvMatrix = { value: new THREE.Matrix4() };

} // end function initSceneData()



// called automatically from within the animate() function (located in InitCommon.js file)
function updateVariablesAndUniforms()
{
	// reset variables at start of game loop
	gliderIsAccelerating = false;
	
	// get user input
	if (!isPaused)
	{
		if ((keyPressed('Space') || button5Pressed) && canPress_Space)
		{
			jumpWasTriggered = true;
			canPress_Space = false;
		}
		if (!gliderIsInAir)
		{
			if ((keyPressed('KeyW') || button3Pressed) && !(keyPressed('KeyS') || button4Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, 200 * frameTime);
				gliderIsAccelerating = true;
			}
			if ((keyPressed('KeyS') || button4Pressed) && !(keyPressed('KeyW') || button3Pressed))
			{
				gliderForwardVelocity.addScaledVector(worldForward, -200 * frameTime);
				gliderIsAccelerating = true;
			}
			if ((keyPressed('KeyA') || button1Pressed) && !(keyPressed('KeyD') || button2Pressed))
			{
				gliderRightVelocity.addScaledVector(worldRight, -200 * frameTime);
				gliderIsAccelerating = true;
			}
			if ((keyPressed('KeyD') || button2Pressed) && !(keyPressed('KeyA') || button1Pressed))
			{
				gliderRightVelocity.addScaledVector(worldRight, 200 * frameTime);
				gliderIsAccelerating = true;
			}
		}
		// if (!gliderIsAccelerating)
		// {	
		// 	gliderForwardVelocity.
		// }

	} // end if (!isPaused)

	// update glider position
	if (gliderIsInAir)
	{
		gliderUpVelocity.addScaledVector(worldGravity, 200 * frameTime);
	}

	glider.position.addScaledVector(gliderRight, worldRight.dot(gliderRightVelocity) * frameTime);
	glider.position.addScaledVector(gliderUp, worldUp.dot(gliderUpVelocity) * frameTime);
	glider.position.addScaledVector(gliderForward, worldForward.dot(gliderForwardVelocity) * frameTime);
	
	

	// must reset nearestT each animation frame, in order to start ray casting
	//nearestT = Infinity;
	
	// now that the glider has moved, record its new position minus its old position as a line segment
	gliderRaySegment.copy(glider.position);
	gliderRaySegment.sub(gliderOldPosition);
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

	

	// apply friction to glider
	if (!gliderIsAccelerating && !gliderIsInAir)
	{
		gliderForwardVelocity.multiplyScalar(0.97);
		gliderRightVelocity.multiplyScalar(0.97);
		
		/* tempVec1.copy(gliderForwardVelocity).normalize().negate();
		gliderForwardVelocity.addScaledVector(tempVec1, 100 * frameTime);
		tempVec2.copy(gliderRightVelocity).normalize().negate();
		gliderRightVelocity.addScaledVector(tempVec2, 100 * frameTime);
		if ( (gliderForwardVelocity.lengthSq() < 0.1 && gliderRightVelocity.lengthSq() < 0.1) ||
			tempVec1.dot(gliderForwardVelocity) > 0 || tempVec2.dot(gliderRightVelocity) > 0 )
		{
			gliderForwardVelocity.set(0, 0, 0);
			gliderRightVelocity.set(0, 0, 0);
		} */
	}


	gliderOldPosition.copy(glider.position);


	

	gliderForward.negate();
	gliderRotationMatrix.makeBasis(gliderRight, gliderUp, gliderForward);
	glider.rotation.setFromRotationMatrix(gliderRotationMatrix);
	glider.rotateY(inputMovementHorizontal);
	glider.updateMatrixWorld();

	glider.matrixWorld.extractBasis(gliderRight, gliderUp, gliderForward);
	gliderRight.normalize(); gliderUp.normalize(); gliderForward.normalize().negate();

	// temporarily move glider up out of the ground for final render
	glider.position.addScaledVector(gliderUp, 8);
	glider.updateMatrixWorld();

	cameraControlsObject.position.copy(glider.position);
	cameraControlsObject.position.addScaledVector(gliderForward, -70);
	cameraControlsObject.position.addScaledVector(gliderUp, 20);
	
	cameraControlsObject.rotation.copy(glider.rotation);
	cameraControlsPitchObject.rotation.x = inputRotationVertical;
	// rotate glider paraboloid (temporary stand-in for more complex game model), so its apex faces in the forward direction
	glider.rotateX(-Math.PI * 0.5);
	glider.updateMatrixWorld();
	
	if (jumpWasTriggered)
	{
		gliderIsInAir = true;
		gliderUpVelocity.copy(worldUp).multiplyScalar(150);
		jumpWasTriggered = false;
	}

	// if glider is on the ground (touching the large course), allow player to jump again
	if (!gliderIsInAir)
	{
		gliderUpVelocity.set(0, 0, 0);
		canPress_Space = true;
	}
	else canPress_Space = false;


	// send final 
	pathTracingUniforms.uGliderInvMatrix.value.copy(glider.matrixWorld).invert();

	// after rendering, reset glider position back down so that its center is right on the ground (this helps with ray casting against course)
	glider.position.addScaledVector(gliderUp, -8);
	// after rendering, reset glider rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	glider.rotateX(Math.PI * 0.5);
	//glider.updateMatrixWorld();
	

	// DEBUG INFO
	demoInfoElement.innerHTML = "gliderIsInAir: " + gliderIsInAir + "<br>" + " gliderRight: " + gliderRight.x.toFixed(1) + " " + gliderRight.y.toFixed(1) + " " + gliderRight.z.toFixed(1) + " " + 
	" gliderUp: " + gliderUp.x.toFixed(1) + " " + gliderUp.y.toFixed(1) + " " + gliderUp.z.toFixed(1) + " " + 
	" gliderForward: " + gliderForward.x.toFixed(1) + " " + gliderForward.y.toFixed(1) + " " + gliderForward.z.toFixed(1) + "<br>" + 
	" gliderRightVelocity: " + gliderRightVelocity.x.toFixed(1) + " " + gliderRightVelocity.y.toFixed(1) + " " + gliderRightVelocity.z.toFixed(1) + " " +
	" gliderUpVelocity: " + gliderUpVelocity.x.toFixed(1) + " " + gliderUpVelocity.y.toFixed(1) + " " + gliderUpVelocity.z.toFixed(1) + " " +
	" gliderForwardVelocity: " + gliderForwardVelocity.x.toFixed(1) + " " + gliderForwardVelocity.y.toFixed(1) + " " + gliderForwardVelocity.z.toFixed(1);
	
	// CAMERA INFO
	///cameraInfoElement.innerHTML = "FOV: " + worldCamera.fov + " / Aperture: " + apertureSize.toFixed(2) + " / FocusDistance: " + focusDistance + "<br>" + "Samples: " + sampleCounter;

} // end function updateUniforms()



init(); // init app and start animating