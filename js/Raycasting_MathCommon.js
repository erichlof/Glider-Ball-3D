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
	// X^2 - Z^2 + Y = 0
	a = (rayD.x * rayD.x) - (rayD.z * rayD.z);
	b = 2 * ((rayD.x * rayO.x) - (rayD.z * rayO.z)) + rayD.y;
	c = (rayO.x * rayO.x) - (rayO.z * rayO.z) + rayO.y;

	if (solveQuadratic(a, b, c) == true)
	{
		if (t0 > 0)
		{	
			normal.getPointAlongRay(rayO, rayD, t0);
			normal.x *= 2; normal.y = 1; normal.z *= -2;
			normal.negate();
			return t0;
		}

		if (t1 > 0)
		{	
			normal.getPointAlongRay(rayO, rayD, t1);
			normal.x *= 2; normal.y = 1; normal.z *= -2;
			normal.negate();
			return t1;
		}
	}
}

function intersectUnitCapsule(rayO, rayD, K, normal)
{
	// Unit Cylinder (along Z axis) implicit equation
	// X^2 + Y^2 - 1 = 0
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y));
	c = ((rayO.x * rayO.x) + (rayO.y * rayO.y)) - 1; // this '1' = (1 * 1) or unit cylinder radius squared

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (Math.abs(normal.z) <= K && t1 > 0)
		{
			normal.z = 0;
			return t1;
		}
	}

	// now check the negative Z sphere cap
	rayO.z += K;

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
	rayO.z -= (K * 2);

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
let initialRayO = new THREE.Vector3();
let oneMinusK = 0;
let K_squared = 0;

function intersectUnitRoundedBox(rayO, rayD, K, normal)
{
	initialRayO.copy(rayO);
	oneMinusK = 1 - K;
	K_squared = K * K;

	// check the left lower back sphere cap
	rayO.x += oneMinusK; rayO.y += oneMinusK; rayO.z += oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0.0 && normal.y < 0.0 && normal.z < 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check the right lower back sphere cap
	rayO.x -= oneMinusK; rayO.y += oneMinusK; rayO.z += oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0.0 && normal.y < 0.0 && normal.z < 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check the left upper back sphere cap
	rayO.x += oneMinusK; rayO.y -= oneMinusK; rayO.z += oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0.0 && normal.y > 0.0 && normal.z < 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check the right upper back sphere cap
	rayO.x -= oneMinusK; rayO.y -= oneMinusK; rayO.z += oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0.0 && normal.y > 0.0 && normal.z < 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check the left lower front sphere cap
	rayO.x += oneMinusK; rayO.y += oneMinusK; rayO.z -= oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0.0 && normal.y < 0.0 && normal.z > 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check the right lower front sphere cap
	rayO.x -= oneMinusK; rayO.y += oneMinusK; rayO.z -= oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0.0 && normal.y < 0.0 && normal.z > 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check the left upper front sphere cap
	rayO.x += oneMinusK; rayO.y -= oneMinusK; rayO.z -= oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0.0 && normal.y > 0.0 && normal.z > 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check the right upper front sphere cap
	rayO.x -= oneMinusK; rayO.y -= oneMinusK; rayO.z -= oneMinusK;
	// K-radius size Sphere implicit equation
	// X^2 + Y^2 + Z^2 - K^2 = 0
	a = rayD.dot(rayD);
	b = 2 * rayD.dot(rayO);
	c = rayO.dot(rayO) - K_squared;

	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0.0 && normal.y > 0.0 && normal.z > 0.0 && t1 > 0)
		{
			return t1;
		}
	}
	rayO.copy(initialRayO);
	

	// check lower left cylinder along Z axis
	rayO.x += oneMinusK;
	rayO.y += oneMinusK;
	// K-radius size Cylinder (along Z axis) implicit equation
	// X^2 + Y^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y));
	c = ((rayO.x * rayO.x) + (rayO.y * rayO.y)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0 && normal.y < 0 && Math.abs(normal.z) <= oneMinusK && t1 > 0)
		{
			normal.z = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check lower right cylinder along Z axis
	rayO.x -= oneMinusK;
	rayO.y += oneMinusK;
	// K-radius size Cylinder (along Z axis) implicit equation
	// X^2 + Y^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y));
	c = ((rayO.x * rayO.x) + (rayO.y * rayO.y)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0 && normal.y < 0 && Math.abs(normal.z) <= oneMinusK && t1 > 0)
		{
			normal.z = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check upper left cylinder along Z axis
	rayO.x += oneMinusK;
	rayO.y -= oneMinusK;
	// K-radius size Cylinder (along Z axis) implicit equation
	// X^2 + Y^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y));
	c = ((rayO.x * rayO.x) + (rayO.y * rayO.y)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0 && normal.y > 0 && Math.abs(normal.z) <= oneMinusK && t1 > 0)
		{
			normal.z = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check upper right cylinder along Z axis
	rayO.x -= oneMinusK;
	rayO.y -= oneMinusK;
	// K-radius size Cylinder (along Z axis) implicit equation
	// X^2 + Y^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.y * rayD.y);
	b = 2 * ((rayD.x * rayO.x) + (rayD.y * rayO.y));
	c = ((rayO.x * rayO.x) + (rayO.y * rayO.y)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0 && normal.y > 0 && Math.abs(normal.z) <= oneMinusK && t1 > 0)
		{
			normal.z = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check lower back cylinder along X axis
	rayO.y += oneMinusK;
	rayO.z += oneMinusK;
	// K-radius size Cylinder (along X axis) implicit equation
	// Y^2 + Z^2 - K^2 = 0
	a = (rayD.y * rayD.y) + (rayD.z * rayD.z);
	b = 2 * ((rayD.y * rayO.y) + (rayD.z * rayO.z));
	c = ((rayO.y * rayO.y) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (Math.abs(normal.x) <= oneMinusK && normal.y < 0 && normal.z < 0 && t1 > 0)
		{
			normal.x = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check lower front cylinder along X axis
	rayO.y += oneMinusK;
	rayO.z -= oneMinusK;
	// K-radius size Cylinder (along X axis) implicit equation
	// Y^2 + Z^2 - K^2 = 0
	a = (rayD.y * rayD.y) + (rayD.z * rayD.z);
	b = 2 * ((rayD.y * rayO.y) + (rayD.z * rayO.z));
	c = ((rayO.y * rayO.y) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (Math.abs(normal.x) <= oneMinusK && normal.y < 0 && normal.z > 0 && t1 > 0)
		{
			normal.x = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check upper back cylinder along X axis
	rayO.y -= oneMinusK;
	rayO.z += oneMinusK;
	// K-radius size Cylinder (along X axis) implicit equation
	// Y^2 + Z^2 - K^2 = 0
	a = (rayD.y * rayD.y) + (rayD.z * rayD.z);
	b = 2 * ((rayD.y * rayO.y) + (rayD.z * rayO.z));
	c = ((rayO.y * rayO.y) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (Math.abs(normal.x) <= oneMinusK && normal.y > 0 && normal.z < 0 && t1 > 0)
		{
			normal.x = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check upper front cylinder along X axis
	rayO.y -= oneMinusK;
	rayO.z -= oneMinusK;
	// K-radius size Cylinder (along X axis) implicit equation
	// Y^2 + Z^2 - K^2 = 0
	a = (rayD.y * rayD.y) + (rayD.z * rayD.z);
	b = 2 * ((rayD.y * rayO.y) + (rayD.z * rayO.z));
	c = ((rayO.y * rayO.y) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (Math.abs(normal.x) <= oneMinusK && normal.y > 0 && normal.z > 0 && t1 > 0)
		{
			normal.x = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check back left cylinder along Y axis
	rayO.x += oneMinusK;
	rayO.z += oneMinusK;
	// K-radius size Cylinder (along Y axis) implicit equation
	// X^2 + Z^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.z * rayD.z);
	b = 2 * ((rayD.x * rayO.x) + (rayD.z * rayO.z));
	c = ((rayO.x * rayO.x) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0 && Math.abs(normal.y) <= oneMinusK && normal.z < 0 && t1 > 0)
		{
			normal.y = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check back right cylinder along Y axis
	rayO.x -= oneMinusK;
	rayO.z += oneMinusK;
	// K-radius size Cylinder (along Y axis) implicit equation
	// X^2 + Z^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.z * rayD.z);
	b = 2 * ((rayD.x * rayO.x) + (rayD.z * rayO.z));
	c = ((rayO.x * rayO.x) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0 && Math.abs(normal.y) <= oneMinusK && normal.z < 0 && t1 > 0)
		{
			normal.y = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check front left cylinder along Y axis
	rayO.x += oneMinusK;
	rayO.z -= oneMinusK;
	// K-radius size Cylinder (along Y axis) implicit equation
	// X^2 + Z^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.z * rayD.z);
	b = 2 * ((rayD.x * rayO.x) + (rayD.z * rayO.z));
	c = ((rayO.x * rayO.x) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x < 0 && Math.abs(normal.y) <= oneMinusK && normal.z > 0 && t1 > 0)
		{
			normal.y = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	// check front right cylinder along Y axis
	rayO.x -= oneMinusK;
	rayO.z -= oneMinusK;
	// K-radius size Cylinder (along Y axis) implicit equation
	// X^2 + Z^2 - K^2 = 0
	a = (rayD.x * rayD.x) + (rayD.z * rayD.z);
	b = 2 * ((rayD.x * rayO.x) + (rayD.z * rayO.z));
	c = ((rayO.x * rayO.x) + (rayO.z * rayO.z)) - K_squared;
	if (solveQuadratic(a, b, c) == true)
	{
		normal.getPointAlongRay(rayO, rayD, t1);
		if (normal.x > 0 && Math.abs(normal.y) <= oneMinusK && normal.z > 0 && t1 > 0)
		{
			normal.y = 0;
			return t1;
		}
	}
	rayO.copy(initialRayO);

	
	// finally, intersect the box interior
	inverseDir.set(1 / rayD.x, 1 / rayD.y, 1 / rayD.z);
	near.set(-1,-1,-1).sub(rayO);
	near.multiply(inverseDir);
	far.set(1, 1, 1).sub(rayO);
	far.multiply(inverseDir);
	tmin.copy(near).min(far);
	tmax.copy(near).max(far);
	t0 = Math.max(Math.max(tmin.x, tmin.y), tmin.z);
	t1 = Math.min(Math.min(tmax.x, tmax.y), tmax.z);

	if (t1 > t0 && t1 > 0) // if we are inside the box
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
} // end function intersectUnitRoundedBox(rayO, rayD, K, normal)

// TORUS ////////////////////////////////////////////////////

let count = 0;
let h = 0;
let q = 0;
let V = new THREE.Vector2();
// standard modern quadratic solver (degree 2)
function root_find2(r, a, b, c) 
{
	count = 0;
	d = (b*b) - (4*a*c);
	if (d < 0)
		return count;
	h = Math.sqrt(d);
	q = -0.5 * (b + (b > 0 ? h : -h));
	V.set(q/a, c/q);
	if (V.x > V.y) V.set(V.y, V.x); // keep them ordered
	if (V.x >= 0) r[count++] = V.x;
	if (V.y >= 0) r[count++] = V.y;
	return count;
}

function poly4(a, b, c, d, e, t) 
{
	return (((a * t + b) * t + c) * t + d) * t + e;
}

// Newton bisection
//
// a,b,c,d,e: 4th degree polynomial parameters
// t: x-axis boundaries
// v: respectively f(t.x) and f(t.y)

let x = 0;
let y = 0;
let s = 0;
let next = 0;
function bisect4(a, b, c, d, e, t, v) 
{
	x = (t.x+t.y) * 0.5; // mid point
	s = v.x < v.y ? 1 : -1; // sign flip
	for (let i = 0; i < 32; i++) 
	{
		// Evaluate polynomial (y) and its derivative (q) using Horner's method in one pass
		y = a*x + b, q = a*x + y;
		y = y*x + c; q = q*x + y;
		y = y*x + d; q = q*x + y;
		y = y*x + e;

		if (s*y < 0) 
			t.set(x, t.y) 
		else t.set(t.x, x);
		next = x - y/q; // Newton iteration
		next = next >= t.x && next <= t.y ? next : (t.x+t.y) * 0.5;
		if (Math.abs(next - x) < 1e-4) // eps
		return next;
		x = next;
	}

    	return x;
}

let P = new THREE.Vector2();
let P1 = new THREE.Vector2();
let P2 = new THREE.Vector2();
let v = 0;
// Quartic: solve ax⁴+bx³+cx²+dx+e=0
function cy_find4(r, r4, n, a, b, c, d, e, upper_bound) 
{
	count = 0;
	P.set(0, poly4(a,b,c,d,e, 0));
	for (let i = 0; i <= n; i++) 
	{
		x = i == n ? upper_bound : r4[i],
		y = poly4(a,b,c,d,e, x);
		if (P.y * y > 0)
			continue;
		P1.set(P.x,x); P2.set(P.y,y);
		v = bisect4(a,b,c,d,e, P1, P2);
		r[count++] = v;
		P.set(x, y);
	}
	return count;
}

let r2 = [];
let r3 = [];
let n = 0;
// f4(x) =   ax^4 +  bx^3 +  cx^2 + dx + e;
// f3(x) =  4ax^3 + 3bx^2 + 2cx   + d;
// f2(x) = 12ax^2 + 6bx   + 2c; can be simplified by dividing all coefficients by 2
//         /2      /2      /2  now becomes...
// f2(x) =  6ax^2 + 3bx   +  c;
function root_find4_cy(r, a, b, c, d, e, upper_bound) 
{
	
	n = root_find2(        r2, 6*a, 3*b,   c);                   // degree 2
	n = cy_find4(r3, r2, n, 0, 4*a, 3*b, 2*c, d,    upper_bound);// degree 3
	n = cy_find4( r, r3, n,      a,   b,   c, d, e, upper_bound);// degree 4
	return n;
}

let e = 0;
let w = 0;
let torusR2 = 0;
let torusr2 = 0;
let roots = [];
let numRoots = 0;
let pos = new THREE.Vector3();


function intersectUnitTorus(rayO, rayD, torus_r, upper_bound, normal) 
{
	//torus_R is the distance (Major-Radius) from the torus center to the middle of the surrounding tubing
	//  in this implementation, torus_R is set to unit radius of 1.0, which makes instancing easier
	//torus_r is the user-defined thickness (minor-radius) of circular tubing part of torus/ring, range: 0.01 to 1.0
	torusR2 = 1; // Unit torus with torus_R (Major-Radius) of 1.0, torus_R * torus_R = 1.0 * 1.0
	torusr2 = torus_r * torus_r; // user-defined minor-radius, range: 0.01 to 1.0
	// Note: the vec3 'rd' might not be normalized to unit length of 1, 
	//  in order to allow for inverse transform of intersecting rays into Torus' object space
	u = rayD.dot(rayD)
	v = 2 * rayO.dot(rayD);
	w = rayO.dot(rayO) - (torusR2 + torusr2);
	// at^4 + bt^3 + ct^2 + dt + e = 0
	a = u * u;
	b = 2 * u * v;
	c = (v * v) + (2 * u * w) + (4 * torusR2 * rayD.z * rayD.z);
	d = (2 * v * w) + (8 * torusR2 * rayO.z * rayD.z);
	e = (w * w) + (4 * torusR2 * ((rayO.z * rayO.z) - torusr2));

	numRoots = root_find4_cy(roots, a, b, c, d, e, upper_bound);
	
	pos.getPointAlongRay(rayO, rayD, roots[0]);
	//n = pos * (dot(pos, pos) - torusr2 - (torusR2 * vec3(1, 1, -1)));
	normal.x = pos.x * (pos.dot(pos) - torusr2 - torusR2);
	normal.y = pos.y * (pos.dot(pos) - torusr2 - torusR2);
	normal.z = pos.z * (pos.dot(pos) - torusr2 + torusR2);

	if (roots[0] > 0)
		return roots[0];
}


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
let q00 = new THREE.Vector3();
let q10 = new THREE.Vector3();
let q11 = new THREE.Vector3();
let q01 = new THREE.Vector3();
let qn = new THREE.Vector3();
let e10 = new THREE.Vector3();
let e11 = new THREE.Vector3();
let e00 = new THREE.Vector3();
let pa = new THREE.Vector3();
let pb = new THREE.Vector3();
let pn = new THREE.Vector3();
let VecA = new THREE.Vector3();
let VecB = new THREE.Vector3();
let det = 0;
let u0 = 0;
let u1 = 0;
let v0 = 0;
let v1 = 0;

function intersectBilinearPatch( p0, p1, p2, p3, rayO, rayD, normal )
{
	q00.copy(p0); q10.copy(p1); q11.copy(p2); q01.copy(p3);
	VecA.copy(q10).sub(q00); VecB.copy(q01).sub(q11);
	qn.crossVectors(VecA, VecB);	
	e10.copy(q10).sub(q00); e11.copy(q11).sub(q10); e00.copy(q01).sub(q00);
	q00.sub(rayO);
	q10.sub(rayO);
	VecA.crossVectors(q00, rayD); VecB.crossVectors(q10, rayD);
	a = VecA.dot(e00);
	b = VecB.dot(e11);
	c = qn.dot(rayD);
	b -= (a + c);
	det = (b * b) - (4 * a * c);
	if (det < 0) 
		return;

	t = Infinity;
	det = Math.sqrt(det);
	det = (b < 0) ? -det : det;
	u0 = (-b - det) * 0.5;
	u1 = a / u0;
	u0 /= c;

	if (u0 >= 0 && u0 <= 1)
	{ 
		pa.lerpVectors(q00, q10, u0);
		pb.lerpVectors(e00, e11, u0);
		pn.crossVectors(rayD, pb);
		det = pn.dot(pn);
		pn.crossVectors(pn, pa);
		t0 = pn.dot(pb);
		v0 = pn.dot(rayD);
		if (t0 > 0 && t0 < t && v0 >= 0 && v0 <= det)
		{
			t = t0 / det;
			u = u0;
			v = v0 / det;
		} 
	}

	if (u1 >= 0 && u1 <= 1) 
	{	
		pa.lerpVectors(q00, q10, u1);
		pb.lerpVectors(e00, e11, u1);
		pn.crossVectors(rayD, pb);
		det = pn.dot(pn);
		pn.crossVectors(pn, pa);
		t1 = pn.dot(pb) / det;
		v1 = pn.dot(rayD);
		if (t1 > 0 && t1 < t && v1 >= 0 && v1 <= det) 
		{
			t = t1;
			u = u1;
			v = v1 / det;
		}
	}

	tempVec.copy(q11).sub(q01);
	VecA.lerpVectors(e10, tempVec, v); VecB.lerpVectors(e00, e11, u);
	normal.crossVectors(VecA, VecB).negate(); //geometric normal

	return t;
}

let testNormal = new THREE.Vector3();
let finalT = 0;

function intersectBilinearPatchGroup( p0, p1, p2, p3, p4, p5, p6, p7, p8, rayO, rayD, normal )
{
	finalT = Infinity;
	// left front quad
	d = intersectBilinearPatch( p0, p1, p2, p3, rayO, rayD, testNormal );
	if (d < finalT)
	{
		finalT = d;
		normal.copy(testNormal);
	}
	// right front quad
	d = intersectBilinearPatch( p1, p4, p5, p2, rayO, rayD, testNormal );
	if (d < finalT)
	{
		finalT = d;
		normal.copy(testNormal);
	}
	// right back quad
	d = intersectBilinearPatch( p2, p5, p6, p7, rayO, rayD, testNormal );
	if (d < finalT)
	{
		finalT = d;
		normal.copy(testNormal);
	}
	// left back quad
	d = intersectBilinearPatch( p3, p2, p7, p8, rayO, rayD, testNormal );
	if (d < finalT)
	{
		finalT = d;
		normal.copy(testNormal);
	}

	if (finalT < Infinity)
		return finalT;
} 
*/



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
