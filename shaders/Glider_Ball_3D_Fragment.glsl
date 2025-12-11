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
uniform vec3 uCourseMinBounds;
uniform vec3 uCourseMaxBounds;
uniform float uCourseShapeKparameter;
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
struct UnitSphere { vec3 emission; vec3 color; int type; };
struct UnitBox { vec3 emission; vec3 color; int type; };
struct UnitParaboloid { vec3 emission; vec3 color; int type; };


Sphere spheres[N_SPHERES];
UnitSphere unitSpheres[N_UNIT_SPHERES];
UnitBox unitBoxes[N_UNIT_BOXES];
UnitParaboloid unitParaboloids[N_UNIT_PARABOLOIDS];


#include <pathtracing_random_functions>

#include <pathtracing_calc_fresnel_reflectance>

#include <pathtracing_sphere_intersect>

#include <pathtracing_unit_sphere_intersect>

#include <pathtracing_unit_box_intersect>

#include <pathtracing_unit_paraboloid_intersect>

#include <pathtracing_sample_sphere_light>


float UnitSphereInterior_ParamIntersect( vec3 ro, vec3 rd, out vec3 n )
{
	vec3 hit;
	float t0, t1;
	float a = dot(rd, rd);
	float b = 2.0 * dot(rd, ro);
	float c = dot(ro, ro) - 1.0;// radius * radius = 1.0 * 1.0 = 1.0 
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = hit;
		return t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = hit;
		return t0;
	}
	
	return INFINITY;
}

float UnitCylinderInterior_ParamIntersect( vec3 ro, vec3 rd, out vec3 n )
{
	vec3 hit;
	float t0, t1;
	float a = (rd.x * rd.x) + (rd.y * rd.y);
	float b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y));
	float c = ((ro.x * ro.x) + (ro.y * ro.y)) - 1.0;// radius * radius = 1.0 * 1.0 = 1.0 
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(hit.x, hit.y, 0.0);
		return t0;
	}
	
	return INFINITY;
}

float UnitParaboloidInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n )
{
	vec3 hit;
	float t0, t1;
	float a = (rd.x * rd.x) + (rd.y * rd.y);
	float b = 2.0 * ((rd.x * ro.x) + (rd.y * ro.y)) + (k * rd.z);
	float c = (ro.x * ro.x) + (ro.y * ro.y) + (k * (ro.z - 1.0));
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 2.0 * hit.y, k);
		return t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 2.0 * hit.y, k);
		return t0;
	}
	
	return INFINITY;
}

float UnitConeInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n )
{
	vec3 hit;
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
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(j * hit.x, j * hit.y, (k * 0.25) * (h - hit.z));
		return t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(j * hit.x, j * hit.y, (k * 0.25) * (h - hit.z));
		return t0;
	}

	return INFINITY;
}

float UnitHyperboloidInterior_ParamIntersect( vec3 ro, vec3 rd, float k, out vec3 n )
{
	vec3 hit;
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
		t = t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(k * hit.x, k * hit.y, j * -hit.z);
		t = t0;
	}

	return t;
}

float UnitHyperbolicParaboloidInterior_ParamIntersect( vec3 ro, vec3 rd, out vec3 n )
{
	vec3 hit;
	float t0, t1;
	float t = INFINITY;
	float a = (rd.x * rd.x) - (rd.z * rd.z);
	float b = 2.0 * ((rd.x * ro.x) - (rd.z * ro.z)) + rd.y;
	float c = (ro.x * ro.x) - (ro.z * ro.z) + ro.y;
	solveQuadratic(a, b, c, t0, t1);

	hit = ro + (rd * t1);
	if ( t1 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 1.0, 2.0 * -hit.z);
		t = t1;
	}

	hit = ro + (rd * t0);
	if ( t0 > 0.0 && all(greaterThanEqual(hit, uCourseMinBounds)) && all(lessThanEqual(hit, uCourseMaxBounds)) )
	{
		n = vec3(2.0 * hit.x, 1.0, 2.0 * -hit.z);
		t = t0;
	}

	return t;
}


//-------------------------------------------------------------------------------------------------------------------
float SceneIntersect(out int finalIsRayExiting)
//-------------------------------------------------------------------------------------------------------------------
{
	vec3 rObjOrigin, rObjDirection;
	vec3 normal;
	vec3 hitPos;
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

	// transform ray into courseShape's object space
	rObjOrigin = vec3( uCourseShape_invMatrix * vec4(rayOrigin, 1.0) );
	rObjDirection = vec3( uCourseShape_invMatrix * vec4(rayDirection, 0.0) );
	if (uCourseShapeType < 2)
		d = UnitSphereInterior_ParamIntersect(rObjOrigin, rObjDirection, normal);
	else if (uCourseShapeType == 2)
		d = UnitCylinderInterior_ParamIntersect(rObjOrigin, rObjDirection, normal);
	else if (uCourseShapeType == 3)
		d = UnitParaboloidInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal);
	else if (uCourseShapeType == 4)
		d = UnitConeInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal);
	else if (uCourseShapeType == 5)
		d = UnitHyperboloidInterior_ParamIntersect(rObjOrigin, rObjDirection, uCourseShapeKparameter, normal);
	else if (uCourseShapeType == 6)
		d = UnitHyperbolicParaboloidInterior_ParamIntersect(rObjOrigin, rObjDirection, normal);
	if (d < t)
	{
		t = d;
		hitNormal = transpose(mat3(uCourseShape_invMatrix)) * normal;	
		hitEmission = unitSpheres[0].emission;
		hitPos = rayOrigin + (t * rayDirection);
		q = clamp( mod( dot( floor(hitPos.xz * 0.04), vec2(1.0) ), 2.0 ) , 0.0, 1.0 );
		hitColor = mix(vec3(0.5), unitSpheres[0].color, q);
		hitType = unitSpheres[0].type;
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
/* 
	// transform ray into Glider2's collision volume object space
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
	float lightPower = 10.0;
	vec3 L1 = vec3(1.0, 1.0, 1.0) * lightPower;// White light
	vec3 L2 = vec3(1.0, 0.8, 0.2) * lightPower;// Yellow light
	vec3 L3 = vec3(0.1, 0.7, 1.0) * lightPower;// Blue light
		
	spheres[0] = Sphere(30.0, vec3(-100,-150, 50), L1, vec3(0), LIGHT);//spherical white Light1 
	spheres[1] = Sphere(20.0, vec3( 100,-100,-150), L2, vec3(0), LIGHT);//spherical yellow Light2
	spheres[2] = Sphere(10.0, vec3( 150,-120, 50), L3, vec3(0), LIGHT);//spherical blue Light3
	
	unitSpheres[0] = UnitSphere(vec3(0), vec3(1.0, 1.0, 1.0), DIFF);//checkered Course

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
