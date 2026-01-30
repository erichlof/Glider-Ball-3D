precision highp float;
precision highp int;
precision highp sampler2D;

#include <pathtracing_uniforms_and_defines>

uniform mat4 uCourseShape_invMatrix;
uniform mat4 uGlider1InvMatrix;
uniform mat4 uGlider2InvMatrix;
uniform mat4 uBallInvMatrix;
uniform mat4 uPlayerGoalInvMatrix;
uniform mat4 uComputerGoalInvMatrix;
uniform mat4 uBallCollisionVolumeInvMatrix;
uniform mat4 uGlider1CollisionVolumeInvMatrix;
uniform mat4 uGlider2CollisionVolumeInvMatrix;
uniform vec3 uLight1Position;
uniform vec3 uLight2Position;
uniform vec3 uLight3Position;
uniform vec3 uCourseMinBounds;
uniform vec3 uCourseMaxBounds;
uniform vec3 uCourseShapeScale;
uniform float uCourseShapeKparameter;
uniform float uTorusUpperBound;
uniform int uCourseShapeType;

#define N_LIGHTS 3.0
#define N_SPHERES 3
#define N_UNIT_SPHERES 1
#define N_UNIT_BOXES 3
#define N_UNIT_PARABOLOIDS 2


//-----------------------------------------------------------------------

vec3 rayOrigin, rayDirection;
// recorded intersection data:
vec3 hitNormal, hitEmission, hitColor;
vec2 hitUV;
float hitObjectID = -INFINITY;
int hitType = -100;

struct Sphere { float radius; vec3 position; vec3 emission; vec3 color; int type; };
struct UnitBox { vec3 emission; vec3 color; int type; };
struct UnitParaboloid { vec3 emission; vec3 color; int type; };


Sphere spheres[N_SPHERES];
UnitBox unitBoxes[N_UNIT_BOXES];
UnitParaboloid unitParaboloids[N_UNIT_PARABOLOIDS];


#include <pathtracing_random_functions>

#include <pathtracing_calc_fresnel_reflectance>

#include <pathtracing_sphere_intersect>

#include <pathtracing_unit_sphere_intersect>

#include <pathtracing_unit_box_intersect>

#include <pathtracing_unit_paraboloid_intersect>

#include <pathtracing_sample_sphere_light>


float XZPlane_ParamIntersect( vec3 ro, vec3 rd, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float t;
	n = vec3(0, 1, 0);
	t = -(dot(ro, n)) / dot(rd, n);

	hit = ro + (rd * t);
	// simple XZ-plane mapping
	uv = vec2(hit.x, hit.z);
	uv *= uvScale;
	if ( t > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		return t;
	}
	
	return INFINITY;
}

float UnitSphereInterior_ParamIntersect( vec3 ro, vec3 rd, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float t0, t1;
	float a = dot(rd, rd);
	float b = 2.0 * dot(rd, ro);
	float c = dot(ro, ro) - 1.0;// radius * radius = 1.0 * 1.0 = 1.0 
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	// inverse spherical mapping
	/* phi = atan(-hit.z, hit.x);
	theta = acos(hit.y);
	uv.x = (phi * ONE_OVER_TWO_PI) + 0.5;
	uv.y = theta * ONE_OVER_PI; */

	// tri-planar mapping
	/* abs_hit = abs(hit);
	greatestExtent = max(abs_hit.x, max(abs_hit.y, abs_hit.z));
	uv = vec2(hit.x, hit.y); // assume abs_hit.z is greatestExtent
	if (greatestExtent == abs_hit.x) uv = vec2(hit.z, hit.y);
	else if (greatestExtent == abs_hit.y) uv = vec2(hit.x, hit.z); */

	// simple XZ-plane mapping
	uv = vec2(hit.x, hit.z);
	uv *= uvScale;
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = hit;
		return t1;
	}

	hit = ro + (rd * t0);
	uv = vec2(hit.x, hit.z);
	uv *= uvScale;
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = hit;
		return t0;
	}
	
	return INFINITY;
}

float UnitCylinderInterior_ParamIntersect( vec3 ro, vec3 rd, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float phi, theta;
	float t0, t1;
	float a = (rd.x * rd.x) + (rd.y * rd.y);
	float b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y));
	float c = ((ro.x * ro.x) + (ro.y * ro.y)) - 1.0;// radius * radius = 1.0 * 1.0 = 1.0 
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	// inverse cylindrical mapping
	phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5;
	uv *= uvScale;
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t1;
	}

	hit = ro + (rd * t0);
	phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5;
	uv *= uvScale;
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t0;
	}
	
	return INFINITY;
}

float UnitParaboloidInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float phi, theta;
	float t0, t1;
	float a = (rd.x * rd.x) + (rd.y * rd.y);
	float b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y)) + (k * rd.z);
	float c = (ro.x * ro.x) + (ro.y * ro.y) + (k * (ro.z - 1.0));
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	// inverse cylindrical mapping
	phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5;
	uv *= uvScale;
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 2.0 * hit.y, k);
		return t1;
	}

	hit = ro + (rd * t0);
	phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5;
	uv *= uvScale;
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 2.0 * hit.y, k);
		return t0;
	}
	
	return INFINITY;
}

float UnitConeInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float phi, theta;
	float t0, t1;
	k = 1.0 - k; // k is the inverse of the cone's opening width
	// valid range for k: 0.01 to 1.0 (a value of 1.0 makes a cone with a sharp, pointed apex)
	k = clamp(k, 0.01, 1.0);
	
	float j = 1.0 / k;
	// the '(ro.y - h)' parts below truncate the top half of the double-cone, leaving a single cone with apex at top
	float h = j * 2.0 - 1.0;		   // (k * 0.25) makes the normal cone's bottom circular base have a unit radius of 1.0
	float a = (j * rd.x * rd.x) + (j * rd.y * rd.y) - ((k * 0.25) * rd.z * rd.z);
    	float b = 2.0 * ((j * rd.x * ro.x) + (j * rd.y * ro.y) - ((k * 0.25) * rd.z * (ro.z - h)));
    	float c = (j * ro.x * ro.x) + (j * ro.y * ro.y) - ((k * 0.25) * (ro.z - h) * (ro.z - h));
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	// inverse cylindrical mapping
	phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5;
	uv *= uvScale;
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(j * hit.x, j * hit.y, (k * 0.25) * (h - hit.z));
		return t1;
	}

	hit = ro + (rd * t0);
	phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5;
	uv *= uvScale;
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(j * hit.x, j * hit.y, (k * 0.25) * (h - hit.z));
		return t0;
	}

	return INFINITY;
}

float UnitHyperboloidInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float phi, theta;
	float t0, t1;
	float t = INFINITY;
	k = 1.0 - k;
	k *= 100.0;
	float j = k - 1.0;
	float a = (k * rd.x * rd.x) + (k * rd.y * rd.y) - (j * rd.z * rd.z);
	float b = 2.0 * ((k * rd.x * ro.x) + (k * rd.y * ro.y) - (j * rd.z * ro.z));
	float c = (k * ro.x * ro.x) + (k * ro.y * ro.y) - (j * ro.z * ro.z) - 1.0;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(k * hit.x, k * hit.y, j * -hit.z);
		// inverse cylindrical mapping
		phi = atan(-hit.y, hit.x);
		theta = hit.z * 0.5;
		uv.x = phi * ONE_OVER_TWO_PI + 0.5;
		uv.y = -theta + 0.5;
		uv *= uvScale;
		t = t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(k * hit.x, k * hit.y, j * -hit.z);
		phi = atan(-hit.y, hit.x);
		theta = hit.z * 0.5;
		uv.x = phi * ONE_OVER_TWO_PI + 0.5;
		uv.y = -theta + 0.5;
		uv *= uvScale;
		t = t0;
	}

	return t;
}

float UnitHyperbolicParaboloidInterior_ParamIntersect( vec3 ro, vec3 rd, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float t0, t1;
	float t = INFINITY;
	// Unit Hyperbolic Paraboloid (saddle shape) implicit equation
	// X^2 - Z^2 + Y = 0
	float a = (rd.x * rd.x) - (rd.z * rd.z);
	float b = 2.0 * ((rd.x * ro.x) - (rd.z * ro.z)) + rd.y;
	float c = (ro.x * ro.x) - (ro.z * ro.z) + ro.y;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( t1 > 1.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 1.0, 2.0 * -hit.z);
		// simple XZ-plane mapping
		uv = vec2(hit.x, hit.z);
		uv *= uvScale;
		t = t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 1.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 1.0, 2.0 * -hit.z);
		uv = vec2(hit.x, hit.z);
		uv *= uvScale;
		t = t0;
	}

	return t;
}

float UnitCapsuleInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n, out vec2 uv, vec2 uvScale )
{
	vec3 hit;
	float phi, theta;
	float t0, t1;
	
	// first, check the cylinder interior
	float a = (rd.x * rd.x) + (rd.y * rd.y);
	float b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y));
	float c = ((ro.x * ro.x) + (ro.y * ro.y)) - 1.0;// radius * radius = 1.0 * 1.0 = 1.0 
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	// inverse cylindrical mapping
	phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5;
	uv *= uvScale;
	if ( abs(hit.z) <= k && t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t1;
	}

	// now check the negative Z sphere cap
	ro.z += k; // ray origin is displaced in opposite Z direction (positive), the inverse of the sphere located at (0,0,-1)

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - 1.0;// radius * radius = 1.0 * 1.0 = 1.0 
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	// inverse cylindrical mapping
	/* phi = atan(-hit.y, hit.x);
	theta = hit.z * 0.5;
	uv.x = phi * ONE_OVER_TWO_PI + 0.5;
	uv.y = -theta + 0.5; */

	// simple XY-plane mapping
	uv = vec2(hit.x, hit.y);
	uv *= 8.0;//2.0 * PI;
	if ( hit.z < 0.0 && t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds+vec3(0,0,k))) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = hit;
		return t1;
	}

	// finally, check the positive Z sphere cap
	ro.z -= (k * 2.0); // ray origin is moved back in opposite Z direction (negative) double, to compensate for previous(+Z) displacement

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - 1.0;// radius * radius = 1.0 * 1.0 = 1.0 
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	uv = vec2(hit.x, hit.y);
	uv *= 8.0;//2.0 * PI;
	if ( hit.z > 0.0 && t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds-vec3(0,0,k))) )
	{
		n = hit;
		return t1;
	}
	
	return INFINITY;
}

float UnitRoundedBoxInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n, out vec2 uv )
{
	vec3 hit, initialRayO;
	float phi, theta;
	float t0, t1;
	float oneMinusK = 1.0 - k;
	float k_squared = k * k;
	initialRayO = ro;
	// this uv makes all corner sphere caps a dark color when a light-dark checkerboard pattern is applied later
	uv = vec2(0, 0);
	
	// check left lower back sphere cap
	ro += vec3(oneMinusK, oneMinusK, oneMinusK);

	float a = dot(rd, rd);
	float b = 2.0 * dot(rd, ro);
	float c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && hit.y < 0.0 && hit.z < 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// check right lower back sphere cap
	ro += vec3(-oneMinusK, oneMinusK, oneMinusK);

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && hit.y < 0.0 && hit.z < 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// check left upper back sphere cap
	ro += vec3(oneMinusK, -oneMinusK, oneMinusK);

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && hit.y > 0.0 && hit.z < 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// check right upper back sphere cap
	ro += vec3(-oneMinusK, -oneMinusK, oneMinusK);

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && hit.y > 0.0 && hit.z < 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// check left lower front sphere cap
	ro += vec3(oneMinusK, oneMinusK, -oneMinusK);

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && hit.y < 0.0 && hit.z > 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// check right lower front sphere cap
	ro += vec3(-oneMinusK, oneMinusK, -oneMinusK);

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && hit.y < 0.0 && hit.z > 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// check left upper front sphere cap
	ro += vec3(oneMinusK, -oneMinusK, -oneMinusK);

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && hit.y > 0.0 && hit.z > 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// check right upper front sphere cap
	ro += vec3(-oneMinusK, -oneMinusK, -oneMinusK);

	a = dot(rd, rd);
	b = 2.0 * dot(rd, ro);
	c = dot(ro, ro) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && hit.y > 0.0 && hit.z > 0.0 && t1 > 0.0 )
	{
		n = hit;
		return t1;
	}
	ro = initialRayO;

	// this uv makes all box-edge cylinders a light color when a light-dark checkerboard pattern is applied later
	uv = vec2(0, 1);

	// check lower left cylinder along Z axis
	ro.x += oneMinusK;
	ro.y += oneMinusK;

	a = (rd.x * rd.x) + (rd.y * rd.y);
	b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y));
	c = ((ro.x * ro.x) + (ro.y * ro.y)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && hit.y < 0.0 && abs(hit.z) <= oneMinusK && t1 > 0.0 )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t1;
	}
	ro = initialRayO;

	// check lower right cylinder along Z axis
	ro.x -= oneMinusK;
	ro.y += oneMinusK;

	a = (rd.x * rd.x) + (rd.y * rd.y);
	b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y));
	c = ((ro.x * ro.x) + (ro.y * ro.y)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && hit.y < 0.0 && abs(hit.z) <= oneMinusK && t1 > 0.0 )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t1;
	}
	ro = initialRayO;

	// check upper left cylinder along Z axis
	ro.x += oneMinusK;
	ro.y -= oneMinusK;

	a = (rd.x * rd.x) + (rd.y * rd.y);
	b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y));
	c = ((ro.x * ro.x) + (ro.y * ro.y)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && hit.y > 0.0 && abs(hit.z) <= oneMinusK && t1 > 0.0 )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t1;
	}
	ro = initialRayO;

	// check upper right cylinder along Z axis
	ro.x -= oneMinusK;
	ro.y -= oneMinusK;

	a = (rd.x * rd.x) + (rd.y * rd.y);
	b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y));
	c = ((ro.x * ro.x) + (ro.y * ro.y)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && hit.y > 0.0 && abs(hit.z) <= oneMinusK && t1 > 0.0 )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t1;
	}
	ro = initialRayO;

	// check lower back cylinder along X axis
	ro.y += oneMinusK;
	ro.z += oneMinusK;

	a = (rd.y * rd.y) + (rd.z * rd.z);
	b = 2.0 * ((rd.y * ro.y) + (rd.z * ro.z));
	c = ((ro.y * ro.y) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( abs(hit.x) <= oneMinusK && hit.y < 0.0 && hit.z < 0.0 && t1 > 0.0 )
	{
		n = vec3(0.0, hit.y, hit.z);
		return t1;
	}
	ro = initialRayO;

	// check lower front cylinder along X axis
	ro.y += oneMinusK;
	ro.z -= oneMinusK;

	a = (rd.y * rd.y) + (rd.z * rd.z);
	b = 2.0 * ((rd.y * ro.y) + (rd.z * ro.z));
	c = ((ro.y * ro.y) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( abs(hit.x) <= oneMinusK && hit.y < 0.0 && hit.z > 0.0 && t1 > 0.0 )
	{
		n = vec3(0.0, hit.y, hit.z);
		return t1;
	}
	ro = initialRayO;

	// check upper back cylinder along X axis
	ro.y -= oneMinusK;
	ro.z += oneMinusK;

	a = (rd.y * rd.y) + (rd.z * rd.z);
	b = 2.0 * ((rd.y * ro.y) + (rd.z * ro.z));
	c = ((ro.y * ro.y) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( abs(hit.x) <= oneMinusK && hit.y > 0.0 && hit.z < 0.0 && t1 > 0.0 )
	{
		n = vec3(0.0, hit.y, hit.z);
		return t1;
	}
	ro = initialRayO;

	// check upper front cylinder along X axis
	ro.y -= oneMinusK;
	ro.z -= oneMinusK;

	a = (rd.y * rd.y) + (rd.z * rd.z);
	b = 2.0 * ((rd.y * ro.y) + (rd.z * ro.z));
	c = ((ro.y * ro.y) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( abs(hit.x) <= oneMinusK && hit.y > 0.0 && hit.z > 0.0 && t1 > 0.0 )
	{
		n = vec3(0.0, hit.y, hit.z);
		return t1;
	}
	ro = initialRayO;

	// check back left cylinder along Y axis
	ro.x += oneMinusK;
	ro.z += oneMinusK;

	a = (rd.x * rd.x) + (rd.z * rd.z);
	b = 2.0 * ((rd.x * ro.x) + (rd.z * ro.z));
	c = ((ro.x * ro.x) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && abs(hit.y) <= oneMinusK && hit.z < 0.0 && t1 > 0.0 )
	{
		n = vec3(hit.x, 0.0, hit.z);
		return t1;
	}
	ro = initialRayO;

	// check back right cylinder along Y axis
	ro.x -= oneMinusK;
	ro.z += oneMinusK;

	a = (rd.x * rd.x) + (rd.z * rd.z);
	b = 2.0 * ((rd.x * ro.x) + (rd.z * ro.z));
	c = ((ro.x * ro.x) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && abs(hit.y) <= oneMinusK && hit.z < 0.0 && t1 > 0.0 )
	{
		n = vec3(hit.x, 0.0, hit.z);
		return t1;
	}
	ro = initialRayO;

	// check front left cylinder along Y axis
	ro.x += oneMinusK;
	ro.z -= oneMinusK;

	a = (rd.x * rd.x) + (rd.z * rd.z);
	b = 2.0 * ((rd.x * ro.x) + (rd.z * ro.z));
	c = ((ro.x * ro.x) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x < 0.0 && abs(hit.y) <= oneMinusK && hit.z > 0.0 && t1 > 0.0 )
	{
		n = vec3(hit.x, 0.0, hit.z);
		return t1;
	}
	ro = initialRayO;

	// check front right cylinder along Y axis
	ro.x -= oneMinusK;
	ro.z -= oneMinusK;

	a = (rd.x * rd.x) + (rd.z * rd.z);
	b = 2.0 * ((rd.x * ro.x) + (rd.z * ro.z));
	c = ((ro.x * ro.x) + (ro.z * ro.z)) - k_squared;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( hit.x > 0.0 && abs(hit.y) <= oneMinusK && hit.z > 0.0 && t1 > 0.0 )
	{
		n = vec3(hit.x, 0.0, hit.z);
		return t1;
	}
	ro = initialRayO;


	vec3 invDir = 1.0 / rd;
	vec3 near = (vec3(-1) - ro) * invDir; // unit radius box: vec3(-1,-1,-1) min corner
	vec3 far  = (vec3( 1) - ro) * invDir;  // unit radius box: vec3(+1,+1,+1) max corner
	
	vec3 tmin = min(near, far);
	vec3 tmax = max(near, far);
	t0 = max( max(tmin.x, tmin.y), tmin.z);
	t1 = min( min(tmax.x, tmax.y), tmax.z);

	hit = ro + (rd * t1);
	if ( t1 > t0 && t1 > 0.0 )
	{
		n = -sign(rd) * step(tmax, tmax.yzx) * step(tmax, tmax.zxy);
		// tri-planar mapping
		if (n.z != 0.0)
			uv = (vec2( hit.x, hit.y) * 0.5 + 0.5) * 0.04 * vec2(uCourseShapeScale.x, uCourseShapeScale.y);
		else if (n.y != 0.0) 
			uv = (vec2( hit.x, hit.z) * 0.5 + 0.5) * 0.04 * vec2(uCourseShapeScale.x, uCourseShapeScale.z);
		else // (n.x != 0.0)
			uv = (vec2( hit.z, hit.y) * 0.5 + 0.5) * 0.04 * vec2(uCourseShapeScale.z, uCourseShapeScale.y);
		
		return t1;
	}
	
	return INFINITY;
}

// TORUS ////////////////////////////////////////////////////

// standard modern quadratic solver (degree 2)
int root_find2(out float r[4], float a, float b, float c) 
{
	int count = 0;
	float d = b*b - 4.*a*c;
	if (d < 0.)
		return count;
	float h = sqrt(d);
	float q = -.5 * (b + (b > 0. ? h : -h));
	vec2 v = vec2(q/a, c/q);
	if (v.x > v.y) v.xy = v.yx; // keep them ordered
	if (v.x >= 0.) r[count++] = v.x;
	if (v.y >= 0.) r[count++] = v.y;
	return count;
}

float poly4(float a, float b, float c, float d, float e, float t) 
{
	return (((a * t + b) * t + c) * t + d) * t + e;
}

// Newton bisection
//
// a,b,c,d,e: 4th degree polynomial parameters
// t: x-axis boundaries
// v: respectively f(t.x) and f(t.y)
float bisect4(float a, float b, float c, float d, float e, vec2 t, vec2 v) {
    float x = (t.x+t.y) * .5; // mid point
    float s = v.x < v.y ? 1. : -1.; // sign flip
    for (int i = 0; i < 32; i++) {
        // Evaluate polynomial (y) and its derivative (q) using Horner's method in one pass
        float y = a*x + b, q = a*x + y;
              y = y*x + c; q = q*x + y;
              y = y*x + d; q = q*x + y;
              y = y*x + e;

        t = s*y < 0. ? vec2(x, t.y) : vec2(t.x, x);
        float next = x - y/q; // Newton iteration
        next = next >= t.x && next <= t.y ? next : (t.x+t.y) * .5;
        if (abs(next - x) < 1e-4) // eps
            return next;
        x = next;
    }
    return x;
}

// Quartic: solve ax⁴+bx³+cx²+dx+e=0
int cy_find4(out float r[4], float r4[4], int n, float a, float b, float c, float d, float e, float upper_bound) 
{
	int count = 0;
	vec2 p = vec2(0, poly4(a,b,c,d,e, 0.));
	for (int i = 0; i <= n; i++) 
	{
		float x = i == n ? upper_bound : r4[i],
		y = poly4(a,b,c,d,e, x);
		if (p.y * y > 0.)
			continue;
		float v = bisect4(a,b,c,d,e, vec2(p.x,x), vec2(p.y,y));
		r[count++] = v;
		p = vec2(x, y);
	}
	return count;
}

// f4(x) =   ax^4 +  bx^3 +  cx^2 + dx + e;
// f3(x) =  4ax^3 + 3bx^2 + 2cx   + d;
// f2(x) = 12ax^2 + 6bx   + 2c; can be simplified by dividing all coefficients by 2
//         /2      /2      /2  now becomes...
// f2(x) =  6ax^2 + 3bx   +  c;
int root_find4_cy(out float r[4], float a, float b, float c, float d, float e, float upper_bound) 
{
	float r2[4], r3[4];
	int n = root_find2(r2,      6.*a, 3.*b,    c);                   // degree 2
	n = cy_find4(r3, r2, n, 0., 4.*a, 3.*b, 2.*c, d,    upper_bound);// degree 3
	n = cy_find4(r,  r3, n,        a,    b,    c, d, e, upper_bound);// degree 4
	return n;
}

float UnitTorusInterior_ParamIntersect(vec3 ro, vec3 rd, float torus_r, float upper_bound, out vec3 n, out vec2 uv, vec2 uvScale) 
{
	//torus_R is the distance (Major-Radius) from the torus center to the middle of the surrounding tubing
	//  in this implementation, torus_R is set to unit radius of 1.0, which makes instancing easier
	//torus_r is the user-defined thickness (minor-radius) of circular tubing part of torus/ring, range: 0.01 to 1.0
	float torusR2 = 1.0; // Unit torus with torus_R (Major-Radius) of 1.0, torus_R * torus_R = 1.0 * 1.0
	float torusr2 = torus_r * torus_r; // user-defined minor-radius, range: 0.01 to 1.0
	// Note: the vec3 'rd' might not be normalized to unit length of 1, 
	//  in order to allow for inverse transform of intersecting rays into Torus' object space
	float u = dot(rd, rd);
	float v = 2.0 * dot(ro, rd);
	float w = dot(ro, ro) - (torusR2 + torusr2);
	// at^4 + bt^3 + ct^2 + dt + e = 0
	float a = u * u;
	float b = 2.0 * u * v;
	float c = (v * v) + (2.0 * u * w) + (4.0 * torusR2 * rd.z * rd.z);
	float d = (2.0 * v * w) + (8.0 * torusR2 * ro.z * rd.z);
	float e = (w * w) + (4.0 * torusR2 * ((ro.z * ro.z) - torusr2));

	float roots[4];
	int numRoots = root_find4_cy(roots, a, b, c, d, e, upper_bound);
	
	vec3 hit = ro + (roots[0] * rd);
	// inverse torus mapping
	uv = vec2( -(atan(hit.x, hit.y) + PI) * ONE_OVER_TWO_PI, -(atan(hit.z, length(hit.xy) - 1.0) + PI) * ONE_OVER_TWO_PI );
	uv *= uvScale;
	n = hit * (dot(hit, hit) - torusr2 - (torusR2 * vec3(1, 1, -1)));
	if ( roots[0] > 0.0 && dot(rd, n) > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
		return roots[0];

	hit = ro + (roots[1] * rd);
	uv = vec2( -(atan(hit.x, hit.y) + PI) * ONE_OVER_TWO_PI, -(atan(hit.z, length(hit.xy) - 1.0) + PI) * ONE_OVER_TWO_PI );
	uv *= uvScale;
	n = hit * (dot(hit, hit) - torusr2 - (torusR2 * vec3(1, 1, -1)));
	if ( roots[1] > 0.0 && dot(rd, n) > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
		return roots[1];

	hit = ro + (roots[2] * rd);
	uv = vec2( -(atan(hit.x, hit.y) + PI) * ONE_OVER_TWO_PI, -(atan(hit.z, length(hit.xy) - 1.0) + PI) * ONE_OVER_TWO_PI );
	uv *= uvScale;
	n = hit * (dot(hit, hit) - torusr2 - (torusR2 * vec3(1, 1, -1)));
	if ( roots[2] > 0.0 && dot(rd, n) > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
		return roots[2];

	hit = ro + (roots[3] * rd);
	uv = vec2( -(atan(hit.x, hit.y) + PI) * ONE_OVER_TWO_PI, -(atan(hit.z, length(hit.xy) - 1.0) + PI) * ONE_OVER_TWO_PI );
	uv *= uvScale;
	n = hit * (dot(hit, hit) - torusr2 - (torusR2 * vec3(1, 1, -1)));
	if ( roots[3] > 0.0 && dot(rd, n) > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
		return roots[3];

	return INFINITY;
}

/* 
float BilinearPatch_ParamIntersect( vec3 p0, vec3 p1, vec3 p2, vec3 p3, vec3 rayOrigin, vec3 rayDirection, out vec3 normal, out vec2 uv )
{ // algorithm/code by Alexander Reshetov (NVIDIA), from the book "Ray Tracing Gems", pg 95-109 
	// 4 corners + "normal" qn
	vec3 q00 = p0, q10 = p1, q11 = p2, q01 = p3;
	vec3 qn = cross(q10-q00, q01-q11);	
	vec3 e10 = q10 - q00; // q01 ----------- q11
	vec3 e11 = q11 - q10; // |                 |
	vec3 e00 = q01 - q00; // | e00         e11 |
	q00 -= rayOrigin;     // |       e10       |
	q10 -= rayOrigin;     // q00 ----------- q10
	float a = dot(cross(q00, rayDirection), e00); // the equation is
	float b = dot(cross(q10, rayDirection), e11); // a + b u + c u^2
	float c = dot(qn, rayDirection); 	      // first compute
	b -= (a + c);                                 // a+b+c and then b
	float det = (b * b) - (4.0 * a * c);
	if (det < 0.0) return INFINITY;

	vec3 pa, pb, n;
	float u0, u1; // two roots(u parameter)
	float t = INFINITY; // need solution for the smallest t > 0
	float t0, t1, v0, v1;

	det = sqrt(det);
	det = (b < 0.0) ? -det : det;
	u0 = (-b - det) * 0.5; // numerically "stable" root
	u1 = a / u0; // Viete's formula for u0*u1
	u0 /= c;

	if (u0 >= 0.0 && u0 <= 1.0) // is it inside the patch?
	{ 
		pa = mix(q00, q10, u0); // point on edge e10
		pb = mix(e00, e11, u0); // it is, actually, pb - pa
		n = cross(rayDirection, pb);
		det = dot(n, n);
		n = cross(n, pa);
		t0 = dot(n, pb);
		v0 = dot(n, rayDirection);
		if (t0 > 0.0 && t0 < t && v0 >= 0.0 && v0 <= det)
		{
			t = t0 / det;
			uv.x = u0;
			uv.y = v0 / det;
		} 
	}

	if (u1 >= 0.0 && u1 <= 1.0) 
	{				// it is slightly different,
		pa = mix(q00, q10, u1); // since u0 might be good
		pb = mix(e00, e11, u1); // and we need 0 < t2 < t1
		n = cross(rayDirection, pb);
		det = dot(n, n);
		n = cross(n, pa);
		t1 = dot(n, pb) / det;
		v1 = dot(n, rayDirection);
		if (t1 > 0.0 && t1 < t && v1 >= 0.0 && v1 <= det) 
		{
			t = t1;
			uv.x = u1;
			uv.y = v1 / det;
		}
	}

	//geometric normal
	normal = cross(mix(e10, q11 - q01, uv.y), mix(e00, e11, uv.x)); // geometric normal = cross(du, dv)
	
	return t;
}

float BilinearPatchGroupIntersect( vec3 p0, vec3 p1, vec3 p2, vec3 p3, vec3 p4, vec3 p5, vec3 p6, vec3 p7, vec3 p8, 
				   vec3 rayOrigin, vec3 rayDirection, out vec3 final_normal, out vec2 final_uv, vec2 uvScale )
{
	vec3 normal;
	vec2 uv;
	float d;
	float t = INFINITY;
	// left front quad
	d = BilinearPatch_ParamIntersect( p0, p1, p2, p3, rayOrigin, rayDirection, normal, uv );
	if (d < t)
	{
		t = d;
		final_normal = normal;
		final_uv = uv;
	}
	// right front quad
	d = BilinearPatch_ParamIntersect( p1, p4, p5, p2, rayOrigin, rayDirection, normal, uv );
	if (d < t)
	{
		t = d;
		final_normal = normal;
		final_uv = uv;
	}
	// right back quad
	d = BilinearPatch_ParamIntersect( p2, p5, p6, p7, rayOrigin, rayDirection, normal, uv );
	if (d < t)
	{
		t = d;
		final_normal = normal;
		final_uv = uv;
	}
	// left back quad
	d = BilinearPatch_ParamIntersect( p3, p2, p7, p8, rayOrigin, rayDirection, normal, uv );
	if (d < t)
	{
		t = d;
		final_normal = normal;
		final_uv = uv;
	}

	final_uv *= uvScale;
	return t;
}
 */

//-------------------------------------------------------------------------------------------------------------------
float SceneIntersect(out int finalIsRayExiting)
//-------------------------------------------------------------------------------------------------------------------
{
	vec3 rObjOrigin, rObjDirection;
	vec3 normal;
	vec3 hitPos;
	vec2 uv;
	float q;
	float d, dt;
	float t = INFINITY;
	int isRayExiting = FALSE;
	int objectCount = 0;
	
	
	d = SphereIntersect( spheres[0].radius, spheres[0].position, rayOrigin, rayDirection );
	if (d < t)
	{
		t = d;
		hitNormal = (rayOrigin + rayDirection * t) - spheres[0].position;
		hitEmission = spheres[0].emission;
		hitColor = spheres[0].color;
		hitType = spheres[0].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	d = SphereIntersect( spheres[1].radius, spheres[1].position, rayOrigin, rayDirection );
	if (d < t)
	{
		t = d;
		hitNormal = (rayOrigin + rayDirection * t) - spheres[1].position;
		hitEmission = spheres[1].emission;
		hitColor = spheres[1].color;
		hitType = spheres[1].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;
	
	d = SphereIntersect( spheres[2].radius, spheres[2].position, rayOrigin, rayDirection );
	if (d < t)
	{
		t = d;
		hitNormal = (rayOrigin + rayDirection * t) - spheres[2].position;
		hitEmission = spheres[2].emission;
		hitColor = spheres[2].color;
		hitType = spheres[2].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	vec3 uvFactor = uCourseShapeScale / 500.0;

	// transform ray into courseShape's object space
	rObjOrigin = vec3( uCourseShape_invMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uCourseShape_invMatrix * vec4(rayDirection, 0.0) );
	if (uCourseShapeType < 2)
		d = UnitSphereInterior_ParamIntersect(rObjOrigin, rObjDirection, normal, uv, floor(vec2(12.0 * uvFactor.x, 12.0 * uvFactor.z)));
	else if (uCourseShapeType == 2)
		d = UnitCylinderInterior_ParamIntersect(rObjOrigin, rObjDirection, normal, uv, floor(vec2(32.0  * uvFactor.x, 14.0  * uvFactor.z)));
	else if (uCourseShapeType == 3)
		d = UnitParaboloidInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal, uv, floor(vec2(32.0  * uvFactor.x, 16.0  * uvFactor.z)));
	else if (uCourseShapeType == 4)
		d = UnitConeInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal, uv, floor(vec2(32.0  * uvFactor.x, 16.0  * uvFactor.z)));
	else if (uCourseShapeType == 5)
		d = UnitHyperboloidInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal, uv, floor(vec2(20.0  * uvFactor.x, 10.0  * uvFactor.z)));
	else if (uCourseShapeType == 6)
		d = UnitHyperbolicParaboloidInterior_ParamIntersect(rObjOrigin, rObjDirection, normal, uv, floor(vec2(8.0 * uvFactor.x, 8.0 * uvFactor.z)));
	else if (uCourseShapeType == 7)
		d = XZPlane_ParamIntersect(rObjOrigin, rObjDirection, normal, uv, floor(vec2(8.0 * uvFactor.x, 8.0 * uvFactor.z)));
	else if (uCourseShapeType == 8)
		d = UnitCapsuleInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal, uv, floor(vec2(40.0 * uvFactor.x, 12.0 * uvFactor.z)));
	else if (uCourseShapeType == 9)
		d = UnitRoundedBoxInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal, uv);
	else if (uCourseShapeType == 10)
		d = UnitTorusInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, uTorusUpperBound, normal, uv, floor(vec2(32.0  * uvFactor.x, 16.0  * uvFactor.y)));
	// else if (uCourseShapeType == 11)
	// 	d = BilinearPatchGroupIntersect(vec3(-1,1,1), vec3(1,1,1), vec3(1,-1,-1), vec3(-1,1,-1), vec3(2,1,1), vec3(2,1,-1), vec3(2,1,-2), vec3(1,1,-2), vec3(-1,1,-2), 
	// 		rObjOrigin, rObjDirection, normal, uv, floor(vec2(10.0 * uvFactor.x, 10.0 * uvFactor.z)));
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uCourseShape_invMatrix)) * normal;	
		hitEmission = vec3(0);
		hitPos = rayOrigin + (t * rayDirection);
		q = clamp( mod( dot( floor(uv), vec2(1, 1) ), 2.0 ) , 0.0, 1.0 );
		hitColor = mix(vec3(0.5), vec3(1), q);
		hitType = DIFF;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	// transform ray into playerGoal's object space
	rObjOrigin = vec3( uPlayerGoalInvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uPlayerGoalInvMatrix * vec4(rayDirection, 0.0) );
	d = UnitBoxIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uPlayerGoalInvMatrix)) * normal;
		hitEmission = unitBoxes[1].emission;
		hitColor = unitBoxes[1].color;
		hitType = unitBoxes[1].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	// transform ray into computerGoal's object space
	rObjOrigin = vec3( uComputerGoalInvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uComputerGoalInvMatrix * vec4(rayDirection, 0.0) );
	d = UnitBoxIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uComputerGoalInvMatrix)) * normal;
		hitEmission = unitBoxes[2].emission;
		hitColor = unitBoxes[2].color;
		hitType = unitBoxes[2].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	// transform ray into ball's object space
	rObjOrigin = vec3( uBallInvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uBallInvMatrix * vec4(rayDirection, 0.0) );
	d = UnitBoxIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uBallInvMatrix)) * normal;
		hitEmission = vec3(1,0,1);//unitBoxes[0].emission;
		hitColor = vec3(0);//unitBoxes[0].color;
		hitType = LIGHT;//unitBoxes[0].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	// transform ray into ball's collision volume object space
	rObjOrigin = vec3( uBallCollisionVolumeInvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uBallCollisionVolumeInvMatrix * vec4(rayDirection, 0.0) );
	d = UnitSphereIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uBallCollisionVolumeInvMatrix)) * normal;
		hitEmission = vec3(0);
		hitColor = vec3(0.01, 0.0, 0.01);
		hitType = REFR;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	// transform ray into glider1's object space
	rObjOrigin = vec3( uGlider1InvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uGlider1InvMatrix * vec4(rayDirection, 0.0) );
	d = UnitParaboloidIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uGlider1InvMatrix)) * normal;
		hitEmission = unitParaboloids[0].emission;
		hitColor = unitParaboloids[0].color;
		hitType = unitParaboloids[0].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	/* // transform ray into Glider1's collision volume object space
	rObjOrigin = vec3( uGlider1CollisionVolumeInvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uGlider1CollisionVolumeInvMatrix * vec4(rayDirection, 0.0) );
	d = UnitSphereIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uGlider1CollisionVolumeInvMatrix)) * normal;
		hitEmission = vec3(0);
		hitColor = vec3(0.0, 0.0, 1.0);
		hitType = REFR;
		hitObjectID = float(objectCount);
	}
	objectCount++; */

	// transform ray into glider2's object space
	rObjOrigin = vec3( uGlider2InvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uGlider2InvMatrix * vec4(rayDirection, 0.0) );
	d = UnitParaboloidIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uGlider2InvMatrix)) * normal;
		hitEmission = unitParaboloids[1].emission;
		hitColor = unitParaboloids[1].color;
		hitType = unitParaboloids[1].type;
		hitObjectID = float(objectCount);
	}
	objectCount++;

	/* // transform ray into Glider2's collision volume object space
	rObjOrigin = vec3( uGlider2CollisionVolumeInvMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uGlider2CollisionVolumeInvMatrix * vec4(rayDirection, 0.0) );
	d = UnitSphereIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uGlider2CollisionVolumeInvMatrix)) * normal;
		hitEmission = vec3(0);
		hitColor = vec3(1.0, 0.0, 0.0);
		hitType = REFR;
		hitObjectID = float(objectCount);
	}
	objectCount++; */
	
		
	return t;
	
} // end float SceneIntersect(out int finalIsRayExiting)


//-----------------------------------------------------------------------------------------------------------------------------
vec3 CalculateRadiance( out vec3 objectNormal, out vec3 objectColor, out float objectID, out float pixelSharpness )
//-----------------------------------------------------------------------------------------------------------------------------
{

	vec3 accumCol = vec3(0);
        vec3 mask = vec3(1);
	vec3 reflectionMask = vec3(1);
	vec3 reflectionRayOrigin = vec3(0);
	vec3 reflectionRayDirection = vec3(0);
	vec3 checkCol0 = vec3(1);
	vec3 checkCol1 = vec3(0.5);
	vec3 x, n, nl;
        
	float t;
	float nc, nt, ratioIoR, Re, Tr;
	float weight;
	float thickness = 0.1;
	float previousObjectID;
	float newRandom = rand();

	int reflectionBounces = -1;
	int diffuseCount = 0;
	int previousIntersecType = -100;
	hitType = -100;
	
	int bounceIsSpecular = TRUE;
	int sampleLight = FALSE;
	int isRayExiting;
	int willNeedReflectionRay = FALSE;
	int isReflectionTime = FALSE;
	int reflectionNeedsToBeSharp = FALSE;
	

	
	for (int bounces = 0; bounces < 6; bounces++)
	{
		if (isReflectionTime == TRUE)
			reflectionBounces++;

		previousIntersecType = hitType;
		previousObjectID = hitObjectID;

		t = SceneIntersect(isRayExiting);
		

		if (bounces == 0 && t == INFINITY)
		{ // this keeps the boundary edges between the open course shape and the black background sharp 
                        pixelSharpness = 1.0;
		}

		// useful data 
		n = normalize(hitNormal);
                nl = dot(n, rayDirection) < 0.0 ? n : -n;
		x = rayOrigin + rayDirection * t;

		if (bounces == 0)
		{
			objectID = hitObjectID;
		}
		if (isReflectionTime == FALSE && diffuseCount == 0 && hitObjectID != previousObjectID)
		{
			objectNormal += n;
			objectColor += hitColor;
		}
		if (reflectionNeedsToBeSharp == TRUE && reflectionBounces == 0)
		{
			objectNormal += n;
			objectColor += hitColor;
		}
		
		
		
		if (hitType == LIGHT)
		{	
			if (diffuseCount == 0 && isReflectionTime == FALSE)
			{
				pixelSharpness = 1.0;
			}

			if (isReflectionTime == TRUE && bounceIsSpecular == TRUE)
			{
				objectNormal += nl;
				//objectColor = hitColor;
				objectID += hitObjectID;
			}
			
			if (bounceIsSpecular == TRUE || sampleLight == TRUE)
				accumCol += mask * hitEmission;

			if (willNeedReflectionRay == TRUE)
			{
				mask = reflectionMask;
				rayOrigin = reflectionRayOrigin;
				rayDirection = reflectionRayDirection;

				willNeedReflectionRay = FALSE;
				bounceIsSpecular = TRUE;
				sampleLight = FALSE;
				isReflectionTime = TRUE;
				continue;
			}
			// reached a light, so we can exit
			break;
		} // end if (hitType == LIGHT)


		// if we get here and sampleLight is still TRUE, shadow ray failed to find the light source 
		// the ray hit an occluding object along its way to the light
		if (sampleLight == TRUE && hitType != REFR) // (&& hitType != REFR) needed here for caustic trick below to work :)
		{
			if (willNeedReflectionRay == TRUE)
			{
				mask = reflectionMask;
				rayOrigin = reflectionRayOrigin;
				rayDirection = reflectionRayDirection;

				willNeedReflectionRay = FALSE;
				bounceIsSpecular = TRUE;
				sampleLight = FALSE;
				isReflectionTime = TRUE;
				continue;
			}

			break;
		}
			


		    
                if (hitType == DIFF) // Ideal DIFFUSE reflection
		{
			diffuseCount++;

			mask *= hitColor;

			bounceIsSpecular = FALSE;

			/* if (diffuseCount == 1 && rand() < 0.5)
			{
				mask *= 2.0;
				// choose random Diffuse sample vector
				rayDirection = randomCosWeightedDirectionInHemisphere(nl);
				rayOrigin = x + nl * uEPS_intersect;
				continue;
			} */

			if (newRandom < 0.3333)
				rayDirection = sampleSphereLight(x, nl, spheres[0], weight);
			else if (newRandom < 0.6666)
				rayDirection = sampleSphereLight(x, nl, spheres[1], weight);
			else
				rayDirection = sampleSphereLight(x, nl, spheres[2], weight);
			
			//mask *= diffuseCount == 1 ? 2.0 : 1.0;
			mask *= weight * N_LIGHTS;

			rayOrigin = x + nl * uEPS_intersect;

			sampleLight = TRUE;
			continue;
                        
		} // end if (hitType == DIFF)
		
		if (hitType == SPEC)  // Ideal SPECULAR reflection
		{
			mask *= hitColor;

			rayDirection = reflect(rayDirection, nl);
			rayOrigin = x + nl * uEPS_intersect;

			//if (diffuseCount == 1)
			//	bounceIsSpecular = TRUE; // turn on reflective mirror caustics

			continue;
		}
		
		if (hitType == REFR)  // Ideal dielectric REFRACTION
		{
			nc = 1.0; // IOR of Air
			nt = 1.5; // IOR of common Glass
			Re = calcFresnelReflectance(rayDirection, n, nc, nt, ratioIoR);
			Tr = 1.0 - Re;

			if (Re == 1.0)
			{
				rayDirection = reflect(rayDirection, nl);
				rayOrigin = x + nl * uEPS_intersect;
				continue;
			}

			if (diffuseCount == 0 && hitObjectID != previousObjectID && n == nl)
			{
				reflectionMask = mask * Re;
				reflectionRayDirection = reflect(rayDirection, nl); // reflect ray from surface
				reflectionRayOrigin = x + nl * uEPS_intersect;
				willNeedReflectionRay = TRUE;
			}

			// transmit ray through surface

			// is ray leaving a solid object from the inside? 
			// If so, attenuate ray color with object color by how far ray has travelled through the medium
			if (isRayExiting == TRUE)
			{
				isRayExiting = FALSE;
				mask *= exp(log(hitColor) * thickness * t);
			}
			else 
				mask *= hitColor;

			mask *= Tr;
			
			rayDirection = refract(rayDirection, nl, ratioIoR);
			rayOrigin = x - nl * uEPS_intersect;

			// if (diffuseCount == 1)
			// 	bounceIsSpecular = TRUE; // turn on refracting caustics
			// trick to make caustics brighter :)
			if (sampleLight == TRUE && bounces == 1)
				mask *= 5.0;

			continue;
			
		} // end if (hitType == REFR)
		
		if (hitType == COAT)  // Diffuse object underneath with ClearCoat on top
		{
			nc = 1.0; // IOR of Air
			nt = 1.4; // IOR of Clear Coat
			Re = calcFresnelReflectance(rayDirection, nl, nc, nt, ratioIoR);
			Tr = 1.0 - Re;
			
			if (diffuseCount == 0 && hitObjectID != previousObjectID)
			{
				reflectionMask = mask * Re;
				reflectionRayDirection = reflect(rayDirection, nl); // reflect ray from surface
				reflectionRayOrigin = x + nl * uEPS_intersect;
				willNeedReflectionRay = TRUE;
			}

			diffuseCount++;

			mask *= Tr;
			mask *= hitColor;

			bounceIsSpecular = FALSE;

			/* if (diffuseCount == 1 && rand() < 0.5)
			{
				mask *= 2.0;
				// choose random Diffuse sample vector
				rayDirection = randomCosWeightedDirectionInHemisphere(nl);
				rayOrigin = x + nl * uEPS_intersect;
				continue;
			} */
			
			if (newRandom < 0.3333)
				rayDirection = sampleSphereLight(x, nl, spheres[0], weight);
			else if (newRandom < 0.6666)
				rayDirection = sampleSphereLight(x, nl, spheres[1], weight);
			else
				rayDirection = sampleSphereLight(x, nl, spheres[2], weight);
			
			//mask *= diffuseCount == 1 ? 2.0 : 1.0;
			mask *= weight * N_LIGHTS;

			rayOrigin = x + nl * uEPS_intersect;

			sampleLight = TRUE;
			continue;
			
		} //end if (hitType == COAT)

		
	} // end for (int bounces = 0; bounces < 6; bounces++)
	
	
	return max(vec3(0), accumCol);

} // end vec3 CalculateRadiance( out vec3 objectNormal, out vec3 objectColor, out float objectID, out float pixelSharpness )



//-----------------------------------------------------------------------
void SetupScene(void)
//-----------------------------------------------------------------------
{
	float lightPower = (uCourseShapeScale.x + uCourseShapeScale.y + uCourseShapeScale.z) * 0.3333;
	lightPower = 0.00005 * (lightPower * lightPower);
	lightPower = clamp(lightPower, 4.0, 100.0);
	vec3 L1 = vec3(1.0, 1.0, 1.0) * lightPower;// White light
	vec3 L2 = vec3(1.0, 0.8, 0.2) * lightPower;// Yellow light
	vec3 L3 = vec3(0.1, 0.7, 1.0) * lightPower;// Blue light
		
	spheres[0] = Sphere(40.0, uLight1Position, L1, vec3(0), LIGHT);//spherical white Light1 
	spheres[1] = Sphere(30.0, uLight2Position, L2, vec3(0), LIGHT);//spherical yellow Light2
	spheres[2] = Sphere(20.0, uLight3Position, L3, vec3(0), LIGHT);//spherical blue Light3

	unitBoxes[0] = UnitBox(vec3(0), vec3(0.01, 1.0, 0.4), DIFF);//Ball
	unitBoxes[1] = UnitBox(vec3(0), vec3(0.01, 0.2, 1.0), SPEC);//player's Goal
	unitBoxes[2] = UnitBox(vec3(0), vec3(1.0, 0.01, 0.2), SPEC);//computer's Goal

	unitParaboloids[0] = UnitParaboloid(vec3(0), vec3(0.01, 0.2, 1.0), SPEC);//player's Glider1
	unitParaboloids[1] = UnitParaboloid(vec3(0), vec3(1.0, 0.01, 0.4), SPEC);//computer's Glider2
}


//#include <pathtracing_main>

// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60		
float tentFilter(float x)
{
	return (x < 0.5) ? sqrt(2.0 * x) - 1.0 : 1.0 - sqrt(2.0 - (2.0 * x));
}


void main( void )
{
        // not needed, three.js has a built-in uniform named cameraPosition
        //vec3 camPos   = vec3( uCameraMatrix[3][0], uCameraMatrix[3][1], uCameraMatrix[3][2]);
        vec3 camRight   = vec3( uCameraMatrix[0][0],  uCameraMatrix[0][1],  uCameraMatrix[0][2]);
        vec3 camUp      = vec3( uCameraMatrix[1][0],  uCameraMatrix[1][1],  uCameraMatrix[1][2]);
	vec3 camForward = vec3(-uCameraMatrix[2][0], -uCameraMatrix[2][1], -uCameraMatrix[2][2]);
	
        // calculate unique seed for rng() function
	seed = uvec2(uFrameCounter, uFrameCounter + 1.0) * uvec2(gl_FragCoord);
	// initialize rand() variables
	randNumber = 0.0; // the final randomly-generated number (range: 0.0 to 1.0)
	blueNoise = texelFetch(tBlueNoiseTexture, ivec2(mod(floor(gl_FragCoord.xy), 128.0)), 0).r;

	vec2 pixelOffset = vec2( tentFilter(rand()), tentFilter(rand()) );
	pixelOffset *= 0.5;//uCameraIsMoving ? 0.5 : 0.75;

	// we must map pixelPos into the range -1.0 to +1.0
	vec2 pixelPos = ((gl_FragCoord.xy + vec2(0.5) + pixelOffset) / uResolution) * 2.0 - 1.0;

        vec3 rayDir = uUseOrthographicCamera ? camForward : 
					       normalize( pixelPos.x * camRight * uULen + pixelPos.y * camUp * uVLen + camForward );
        
        // depth of field
        vec3 focalPoint = uFocusDistance * rayDir;
        float randomAngle = rng() * TWO_PI; // pick random point on aperture
        float randomRadius = rng() * uApertureSize;
        vec3  randomAperturePos = ( cos(randomAngle) * camRight + sin(randomAngle) * camUp ) * sqrt(randomRadius);
        // point on aperture to focal point
        vec3 finalRayDir = normalize(focalPoint - randomAperturePos);
        
        rayOrigin = uUseOrthographicCamera ? cameraPosition + (camRight * pixelPos.x * uULen * 100.0) + (camUp * pixelPos.y * uVLen * 100.0) + randomAperturePos :
					     cameraPosition + randomAperturePos; 
	rayDirection = finalRayDir;
	

        SetupScene(); 

        // Edge Detection - don't want to blur edges where either surface normals change abruptly (i.e. room wall corners), objects overlap each other (i.e. edge of a foreground sphere in front of another sphere right behind it),
	// or an abrupt color variation on the same smooth surface, even if it has similar surface normals (i.e. checkerboard pattern). Want to keep all of these cases as sharp as possible - no blur filter will be applied.
	vec3 objectNormal, objectColor;
	float objectID = -INFINITY;
	float pixelSharpness = 0.0;
	
	// perform path tracing and get resulting pixel color
	vec4 currentPixel = vec4( vec3(CalculateRadiance(objectNormal, objectColor, objectID, pixelSharpness)), 0.0 );

	// if difference between normals of neighboring pixels is less than the first edge0 threshold, the white edge line effect is considered off (0.0)
	float edge0 = 0.2; // edge0 is the minimum difference required between normals of neighboring pixels to start becoming a white edge line
	// any difference between normals of neighboring pixels that is between edge0 and edge1 smoothly ramps up the white edge line brightness (smoothstep 0.0-1.0)
	float edge1 = 0.6; // once the difference between normals of neighboring pixels is >= this edge1 threshold, the white edge line is considered fully bright (1.0)
	float difference_Nx = fwidth(objectNormal.x);
	float difference_Ny = fwidth(objectNormal.y);
	float difference_Nz = fwidth(objectNormal.z);
	float normalDifference = smoothstep(edge0, edge1, difference_Nx) + smoothstep(edge0, edge1, difference_Ny) + smoothstep(edge0, edge1, difference_Nz);

	float objectDifference = min(fwidth(objectID), 1.0);

	float colorDifference = (fwidth(objectColor.r) + fwidth(objectColor.g) + fwidth(objectColor.b)) > 0.0 ? 1.0 : 0.0;
	// white-line debug visualization for normal difference
	//currentPixel.rgb += (rng() * 1.5) * vec3(normalDifference);
	// white-line debug visualization for object difference
	//currentPixel.rgb += (rng() * 1.5) * vec3(objectDifference);
	// white-line debug visualization for color difference
	//currentPixel.rgb += (rng() * 1.5) * vec3(colorDifference);
	// white-line debug visualization for all 3 differences
	//currentPixel.rgb += (rng() * 1.5) * vec3( clamp(max(normalDifference, max(objectDifference, colorDifference)), 0.0, 1.0) );
	
	vec4 previousPixel = texelFetch(tPreviousTexture, ivec2(gl_FragCoord.xy), 0);

	if (uCameraIsMoving) // camera is currently moving
	{
		previousPixel.rgb *= 0.5; // motion-blur trail amount (old image)
		currentPixel.rgb *= 0.5; // brightness of new image (noisy)

		previousPixel.a = 0.0;
	}
	else
	{
		previousPixel.rgb *= 0.8; // motion-blur trail amount (old image)
		currentPixel.rgb *= 0.2; // brightness of new image (noisy)
	}

	currentPixel.a = pixelSharpness;

	// check for all edges that are not light sources
	if (pixelSharpness < 1.01 && (colorDifference >= 1.0 || normalDifference >= 0.9 || objectDifference >= 1.0)) // all other edges
		currentPixel.a = pixelSharpness = 1.0;

	// makes light source edges (shape boundaries) more stable
	// if (previousPixel.a == 1.01)
	// 	currentPixel.a = 1.01;

	// makes sharp edges more stable
	if (previousPixel.a == 1.0)
		currentPixel.a = 1.0;
		
	// for dynamic scenes (to clear out old, dark, sharp pixel trails left behind from moving objects)
	if (previousPixel.a == 1.0 && rng() < 0.05)
		currentPixel.a = 0.0;

	
	pc_fragColor = vec4(previousPixel.rgb + currentPixel.rgb, currentPixel.a);
}
