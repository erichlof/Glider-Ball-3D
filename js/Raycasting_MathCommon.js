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
Vector3.transformAsPoint(m4_MatrixInverse) is a method that is called on a THREE.Vector3 
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
THREE.Vector3.prototype.transformAsPoint = function(m4_MatrixInverse)
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
};

/*
Vector3.transformAsDirection(m4_MatrixInverse) is a method that is called on a THREE.Vector3 
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

THREE.Vector3.prototype.transformAsDirection = function(m4_MatrixInverse)
{
	const el = m4_MatrixInverse.elements;
	vx = this.x;
	vy = this.y;
	vz = this.z;

	this.x = vx * el[0] + vy * el[4] + vz * el[8];
	this.y = vx * el[1] + vy * el[5] + vz * el[9];
	this.z = vx * el[2] + vy * el[6] + vz * el[10];
	return this;
};

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
	// multiply the surface normal vector by the Transpose of this matrixInverse instead (matrix rows and columns are simply switched - compare with the function above)
	this.x = vx * el[0] + vy * el[1] + vz * el[2];
	this.y = vx * el[4] + vy * el[5] + vz * el[6];
	this.z = vx * el[8] + vy * el[9] + vz * el[10];
};


let t = Infinity;
let testT = Infinity;
let nearestT = Infinity;

function intersectXZPlane(rayO, rayD, normal)
{
	normal.set(0, 1, 0);
	t = -(rayO.dot(normal)) / rayD.dot(normal);
	normal.set(0, -1, 0);
	if (t > 0)
		return t;
}


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

function intersectUnitSphere(rayO, rayD, normal)
{
	// Unit Sphere implicit equation
	// X^2 + Y^2 + Z^2 - 1 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - 1; // this '1' = (1 * 1) or unit sphere radius squared

	if (solveQuadratic(a, b, c) == true)
	{
		if (t0 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t0);
			return t0;
		}
		if (t1 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t1);
			return t1;
		}
	}
}

function intersectUnitCylinder(rayO, rayD, normal)
{
	// Unit Cylinder (along Z axis) implicit equation
	// X^2 + Y^2 - 1 = 0
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y));
	c = ((rayO.x * rayO.x) + (rayO.y * rayO.y)) - 1; // this '1' = (1 * 1) or unit cylinder radius squared

	if (solveQuadratic(a, b, c) == true)
	{
		if (t0 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t0);
			normal.z = 0;
			return t0;
		}
		if (t1 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t1);
			normal.z = 0;
			return t1;
		}
	}
}

function intersectUnitParaboloid(rayO, rayD, K, normal)
{
	// Unit Paraboloid (along Z axis) implicit equation
	// X^2 + Y^2 + Z = 0
	// code below centers the paraboloid so that its rounded apex is at positive Z(+1.0) and 
	//   its circular opening is of unit radius (1) and is located at negative Z(-1.0)
	// K value of 0.5 opens up the paraboloid less so when it reaches negativeZ axis, the circular opening will have unit radius
	//K = 0.5; //default value
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y)) + (K * rayD.z);
	c = (rayO.x * rayO.x) + (rayO.y * rayO.y) + (K * (rayO.z - 1));

	if (solveQuadratic(a, b, c) == true)
	{
		if (t0 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t0);
			normal.x *= 2; normal.y *= 2; normal.z = K;
			return t0;
		}
		if (t1 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t1);
			normal.x *= 2; normal.y *= 2; normal.z = K;
			return t1;
		}
	}
}

let J = 0;
let H = 0;
function intersectUnitCone(rayO, rayD, K, normal)
{
	// Unit Cone (along Z axis) implicit equation
	// X^2 + Y^2 - Z^2 = 0
	K = 1 - K; // K is the inverse of the cone's opening width (apex radius)
	// valid range for K: 0.01 to 1 (a value of 1 makes a cone with a sharp, pointed apex)
	K = Math.max(K, 0.01); 
	K = Math.min(K, 1);
	
	J = 1 / K;
	// the '(rayO.z - H)' parts below truncate the top half of the double-cone, leaving a single cone with apex at top
	H = J * 2 - 1;		   // (K * 0.25) makes the normal cone's bottom circular opening have a unit radius of 1
	a = (J * rayD.x * rayD.x) + (J * rayD.y * rayD.y) - ((K * 0.25) * rayD.z * rayD.z);
    	b = 2 * ((J * rayD.x * rayO.x) + (J * rayD.y * rayO.y) - ((K * 0.25) * rayD.z * (rayO.z - H)));
    	c = (J * rayO.x * rayO.x) + (J * rayO.y * rayO.y) - ((K * 0.25) * (rayO.z - H) * (rayO.z - H));

	if (solveQuadratic(a, b, c) == true)
	{
		if (t0 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t0);
			normal.x *= J; normal.y *= J; normal.z = (K * 0.25) * (H - normal.z);
			return t0;
		}
		if (t1 > 0)
		{
			normal.getPointAlongRay(rayO, rayD, t1);
			normal.x *= J; normal.y *= J; normal.z = (K * 0.25) * (H - normal.z);
			return t1;
		}
	}
}

function intersectUnitHyperboloid(rayO, rayD, K, normal)
{
	// Unit Hyperboloid of 1 sheet (along Z axis) implicit equation
	// X^2 + Y^2 - Z^2 - 1 = 0
	K = 1 - K;
	K *= 100;
	J = K - 1;
	a = (K * rayD.x * rayD.x) + (K * rayD.y * rayD.y) - (J * rayD.z * rayD.z);
	b = 2 * ((K * rayD.x * rayO.x) + (K * rayD.y * rayO.y) - (J * rayD.z * rayO.z));
	c = (K * rayO.x * rayO.x) + (K * rayO.y * rayO.y) - (J * rayO.z * rayO.z) - 1;

	if (solveQuadratic(a, b, c) == true)
	{
		if (t0 > 0)
		{	
			normal.getPointAlongRay(rayO, rayD, t0);
			normal.x *= K; normal.y *= K; normal.z *= J * -1;
			return t0;
		}
		
		if (t1 > 0)
		{	
			normal.getPointAlongRay(rayO, rayD, t1);
			normal.x *= K; normal.y *= K; normal.z *= J * -1;
			return t1;
		}
	}
}

function intersectUnitHyperbolicParaboloid(rayO, rayD, normal)
{
	// Unit Hyperbolic Paraboloid (saddle shape) implicit equation
	// X^2 - Z^2 - Y = 0
	a = (rayD.x * rayD.x) - (rayD.z * rayD.z);
	b = 2 * ((rayD.x * rayO.x) - (rayD.z * rayO.z)) - rayD.y;
	c = (rayO.x * rayO.x) - (rayO.z * rayO.z) - rayO.y;

	if (solveQuadratic(a, b, c) == true)
	{
		if (t0 > 0)
		{	
			normal.getPointAlongRay(rayO, rayD, t0);
			normal.x *= 2; normal.y = -1; normal.z *= -2;
			return t0;
		}
		
		if (t1 > 0)
		{	
			normal.getPointAlongRay(rayO, rayD, t1);
			normal.x *= 2; normal.y = -1; normal.z *= -2;
			return t1;
		}
	}
}

function intersectUnitCapsule(rayO, rayD, normal)
{
	// Unit Cylinder (along Z axis) implicit equation
	// X^2 + Y^2 - 1 = 0
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y));
	c = ((rayO.x * rayO.x) + (rayO.y * rayO.y)) - 1; // this '1' = (1 * 1) or unit cylinder radius squared

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (Math.abs(normal.z) <= 1.0 && t1 > 0)
		{
			normal.z = 0;
			return t1;
		}
	}

	// now check the negative Z sphere cap
	rayO.z += 1;

	// Unit Sphere implicit equation
	// X^2 + Y^2 + Z^2 - 1 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - 1;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.z < 0.0 && t1 > 0)
		{
			return t1;
		}
	}

	// finally, check the positive Z sphere cap
	rayO.z -= 2;

	// Unit Sphere implicit equation
	// X^2 + Y^2 + Z^2 - 1 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - 1;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.z > 0.0 && t1 > 0)
		{
			return t1;
		}
	}
}


let inverseDir = new THREE.Vector3();
let near = new THREE.Vector3();
let far = new THREE.Vector3();
let tmin = new THREE.Vector3();
let tmax = new THREE.Vector3();

function raycastUnitBox(rayO, rayD)
{
	inverseDir.set(1 / rayD.x, 1 / rayD.y, 1 / rayD.z);
	near.set(-1,-1,-1).sub(rayO);
	near.multiply(inverseDir);
	far.set(1, 1, 1).sub(rayO);
	far.multiply(inverseDir);
	tmin.copy(near).min(far);
	tmax.copy(near).max(far);
	t0 = Math.max(Math.max(tmin.x, tmin.y), tmin.z);
	t1 = Math.min(Math.min(tmax.x, tmax.y), tmax.z);
	if (t0 > t1)
		return Infinity;

	if (t0 > 0) // if we are outside the box
		return t0;

	if (t1 > 0) // if we are inside the box
		return t1;

	return Infinity;
}


/* 
function intersectUnitBox(rayO, rayD, normal)
{
	inverseDir.set(1 / rayD.x, 1 / rayD.y, 1 / rayD.z);
	near.set(-1,-1,-1).sub(rayO);
	near.multiply(inverseDir);
	far.set(1, 1, 1).sub(rayO);
	far.multiply(inverseDir);
	tmin.copy(near).min(far);
	tmax.copy(near).max(far);
	t0 = Math.max(Math.max(tmin.x, tmin.y), tmin.z);
	t1 = Math.min(Math.min(tmax.x, tmax.y), tmax.z);
	if (t0 > t1)
		return Infinity;

	if (t0 > 0) // if we are outside the box
	{
		intersectionPoint.getPointAlongRay(rayO, rayD, t0); // intersection in box's object space, vec3(-1,-1,-1) to vec3(+1,+1,+1)
		// start out with default Z normal of (0,0,-1) or (0,0,+1)
		normal.set(0, 0, intersectionPoint.z);
		if (Math.abs(intersectionPoint.x) > Math.abs(intersectionPoint.y) && Math.abs(intersectionPoint.x) >= Math.abs(intersectionPoint.z))
			normal.set(intersectionPoint.x, 0, 0);	
		else if (Math.abs(intersectionPoint.y) > Math.abs(intersectionPoint.x) && Math.abs(intersectionPoint.y) >= Math.abs(intersectionPoint.z))
			normal.set(0, intersectionPoint.y, 0);
		return t0;
	}
		
	if (t1 > 0) // if we are inside the box
	{
		intersectionPoint.getPointAlongRay(rayO, rayD, t1); // intersection in box's object space, vec3(-1,-1,-1) to vec3(+1,+1,+1)
		// start out with default Z normal of (0,0,-1) or (0,0,+1)
		normal.set(0, 0, intersectionPoint.z);
		if (Math.abs(intersectionPoint.x) > Math.abs(intersectionPoint.y) && Math.abs(intersectionPoint.x) >= Math.abs(intersectionPoint.z))
			normal.set(intersectionPoint.x, 0, 0);	
		else if (Math.abs(intersectionPoint.y) > Math.abs(intersectionPoint.x) && Math.abs(intersectionPoint.y) >= Math.abs(intersectionPoint.z))
			normal.set(0, intersectionPoint.y, 0);
		return t1;
	}
		
	return Infinity;
} */
