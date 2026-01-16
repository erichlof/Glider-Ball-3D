// scene/demo-specific variables go here
let rayObjectOrigin = new THREE.Vector3();
let rayObjectDirection = new THREE.Vector3();
let intersectionPoint = new THREE.Vector3();
let intersectionNormal = new THREE.Vector3();
let tempVec = new THREE.Vector3();

let courseShape = new THREE.Object3D();
let courseShape_invMatrix = new THREE.Matrix4();
let courseMinBounds = new THREE.Vector3(-1, -1, -1);
let courseMaxBounds = new THREE.Vector3( 1, 1, 1);
let torusUpperBound = 0;
let light1StartingPosition = new THREE.Vector3();
let light2StartingPosition = new THREE.Vector3();
let light3StartingPosition = new THREE.Vector3();
let light1Position = new THREE.Vector3();
let light2Position = new THREE.Vector3();
let light3Position = new THREE.Vector3();
let ONETHIRD_PI = Math.PI / 3;
let torusLight1PositionVec = new THREE.Vector3(Math.cos(ONETHIRD_PI * 1), Math.sin(ONETHIRD_PI * 1), 0);
let torusLight2PositionVec = new THREE.Vector3(Math.cos(ONETHIRD_PI * 3), Math.sin(ONETHIRD_PI * 3), 0);
let torusLight3PositionVec = new THREE.Vector3(Math.cos(ONETHIRD_PI * 5), Math.sin(ONETHIRD_PI * 5), 0);

let glider1Base = new THREE.Object3D();
let glider1CollisionVolume = new THREE.Object3D();
let glider1RotationMatrix = new THREE.Matrix4();
let glider1_invMatrix = new THREE.Matrix4();
let glider1Thrusters = new THREE.Object3D();
let glider1RayOrigin = new THREE.Vector3();
let glider1RayDirection = new THREE.Vector3();
let glider1OldPosition = new THREE.Vector3();
let glider1RaySegment = new THREE.Vector3();
let glider1RaySegmentLength = 0;
let glider1BaseRight = new THREE.Vector3();
let glider1BaseUp = new THREE.Vector3();
let glider1BaseForward = new THREE.Vector3();
let glider1ThrustersRight = new THREE.Vector3(1,0,0);
let glider1ThrustersUp = new THREE.Vector3(0,1,0);
let glider1ThrustersForward = new THREE.Vector3(0,0,1);
let glider1LocalVelocity = new THREE.Vector3();
let glider1WorldVelocity = new THREE.Vector3();
let glider1StartingPosition = new THREE.Vector3();
let glider1IsInAir = false;
let glider1IsAcceleratingRight = false;
let glider1IsAcceleratingUp = false;
let glider1IsAcceleratingForward = false;

let glider2Base = new THREE.Object3D();
let glider2CollisionVolume = new THREE.Object3D();
let glider2RotationMatrix = new THREE.Matrix4();
let glider2_invMatrix = new THREE.Matrix4();
let glider2Thrusters = new THREE.Object3D();
let glider2RayOrigin = new THREE.Vector3();
let glider2RayDirection = new THREE.Vector3();
let glider2OldPosition = new THREE.Vector3();
let glider2RaySegment = new THREE.Vector3();
let glider2RaySegmentLength = 0;
let glider2BaseRight = new THREE.Vector3();
let glider2BaseUp = new THREE.Vector3();
let glider2BaseForward = new THREE.Vector3();
let glider2ThrustersRight = new THREE.Vector3(1,0,0);
let glider2ThrustersUp = new THREE.Vector3(0,1,0);
let glider2ThrustersForward = new THREE.Vector3(0,0,1);
let glider2LocalVelocity = new THREE.Vector3();
let glider2WorldVelocity = new THREE.Vector3();
let glider2StartingPosition = new THREE.Vector3();
let glider2IsInAir = false;
let glider2IsAcceleratingRight = false;
let glider2IsAcceleratingUp = false;
let glider2IsAcceleratingForward = false;

let ball = new THREE.Object3D();
let ballCollisionVolume = new THREE.Object3D();
let ballRotationMatrix = new THREE.Matrix4();
let ball_invMatrix = new THREE.Matrix4();
let ballRayOrigin = new THREE.Vector3();
let ballRayDirection = new THREE.Vector3();
let ballOldPosition = new THREE.Vector3();
let ballRaySegment = new THREE.Vector3();
let ballRaySegmentLength = 0;
let ballRight = new THREE.Vector3();
let ballUp = new THREE.Vector3();
let ballForward = new THREE.Vector3();
let ballLocalVelocity = new THREE.Vector3();
let ballWorldVelocity = new THREE.Vector3();
let ballStartingPosition = new THREE.Vector3();
let ballIsInAir = false;
let ballYRotateAngle = 0;

let playerGoal = new THREE.Object3D();
let playerGoalRotationMatrix = new THREE.Matrix4();
let playerGoal_invMatrix = new THREE.Matrix4();
let playerGoalRayOrigin = new THREE.Vector3();
let playerGoalRayDirection = new THREE.Vector3();
let playerGoalOldPosition = new THREE.Vector3();
let playerGoalRaySegment = new THREE.Vector3();
let playerGoalRaySegmentLength = 0;
let playerGoalRight = new THREE.Vector3();
let playerGoalUp = new THREE.Vector3();
let playerGoalForward = new THREE.Vector3();
let playerGoalLocalVelocity = new THREE.Vector3();
let playerGoalWorldVelocity = new THREE.Vector3();
let playerGoalStartingPosition = new THREE.Vector3();
let playerGoalIsInAir = false;
let playerGoalYRotateAngle = 0;

let computerGoal = new THREE.Object3D();
let computerGoalRotationMatrix = new THREE.Matrix4();
let computerGoal_invMatrix = new THREE.Matrix4();
let computerGoalRayOrigin = new THREE.Vector3();
let computerGoalRayDirection = new THREE.Vector3();
let computerGoalOldPosition = new THREE.Vector3();
let computerGoalRaySegment = new THREE.Vector3();
let computerGoalRaySegmentLength = 0;
let computerGoalRight = new THREE.Vector3();
let computerGoalUp = new THREE.Vector3();
let computerGoalForward = new THREE.Vector3();
let computerGoalLocalVelocity = new THREE.Vector3();
let computerGoalWorldVelocity = new THREE.Vector3();
let computerGoalStartingPosition = new THREE.Vector3();
let computerGoalIsInAir = false;
let computerGoalYRotateAngle = 0;

let impulseGlider1 = new THREE.Vector3();
let impulseGlider2 = new THREE.Vector3();
let impulseBall = new THREE.Vector3();
let impulsePlayerGoal = new THREE.Vector3();
let impulseComputerGoal = new THREE.Vector3();
let relativeVelocity = new THREE.Vector3();
let unitCollisionNormal = new THREE.Vector3();
let collisionNormal = new THREE.Vector3();
let rV_dot_cN = 0;
let separatingDistance = 0;
let combinedInverseMasses = 0;
let impulseAmount = 0;
let gliderMass = 100;
let ballMass = 10;
let collisionCounter = 0;

let canPress_Space = true;
let jumpWasTriggered = false;
let levelBeginFlag = true;

let course_TypeObject, course_TypeController;
let needChangeCourseType = false;
let courseShapeType = 0;
let courseUniformScale = 500;
let courseShapeKparameter = 1;
let course_ShapeKparameterController, course_ShapeKparameterObject;
let needChangeCourseShapeKparameter = false;
let scale_Folder;
let course_ScaleUniformController, course_ScaleUniformObject;
let course_ScaleXController, course_ScaleXObject;
let course_ScaleYController, course_ScaleYObject;
let course_ScaleZController, course_ScaleZObject;
let needChangeCourseScaleUniform = false;
let needChangeCourseScale = false;
let clipBoundaries_Folder;
let course_ClipMinXObject, course_ClipMinXController;
let course_ClipMaxXObject, course_ClipMaxXController;
let course_ClipMinYObject, course_ClipMinYController;
let course_ClipMaxYObject, course_ClipMaxYController;
let course_ClipMinZObject, course_ClipMinZController;
let course_ClipMaxZObject, course_ClipMaxZController;
let needChangeCourseClipXYZBounds = false;
let level_RestartObject;

let p0 = new THREE.Vector3(-1, 1, 1);
let p1 = new THREE.Vector3( 1,-1, 1);
let p2 = new THREE.Vector3( 1, 1,-1);
let p3 = new THREE.Vector3(-1, 0,-1);

let demoInfoElement = document.getElementById('demoInfo');


let courseT = 0;
function intersectCourse()
{
	courseT = Infinity;
	if (courseShapeType == 'Sphere' || courseShapeType == 'Ellipsoid')
		courseT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	else if (courseShapeType == 'Cylinder')
		courseT = intersectUnitCylinder(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	else if (courseShapeType == 'Paraboloid')
		courseT = intersectUnitParaboloid(rayObjectOrigin, rayObjectDirection, courseShapeKparameter, intersectionNormal);
	else if (courseShapeType == 'Cone')
		courseT = intersectUnitCone(rayObjectOrigin, rayObjectDirection, courseShapeKparameter, intersectionNormal);
	else if (courseShapeType == 'Hyperboloid')
		courseT = intersectUnitHyperboloid(rayObjectOrigin, rayObjectDirection, courseShapeKparameter, intersectionNormal);
	// else if (courseShapeType == 'HyperbolicParaboloid')
	// 	courseT = intersectUnitHyperbolicParaboloid(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	else if (courseShapeType == 'Plane')
		courseT = intersectXZPlane(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	else if (courseShapeType == 'Capsule')
		courseT = intersectUnitCapsule(rayObjectOrigin, rayObjectDirection, courseShapeKparameter, intersectionNormal);
	else if (courseShapeType == 'RoundedBox')
		courseT = intersectUnitRoundedBox(rayObjectOrigin, rayObjectDirection, courseShapeKparameter, intersectionNormal);
	else if (courseShapeType == 'Torus')
		courseT = intersectUnitTorus(rayObjectOrigin, rayObjectDirection, courseShapeKparameter, torusUpperBound, intersectionNormal);
	else if (courseShapeType == 'BilinearPatch')
		courseT = intersectBilinearPatch(p0, p1, p2, p3, rayObjectOrigin, rayObjectDirection, intersectionNormal);
	
	return courseT;
}

function beginLevel() 
{ 
	levelBeginFlag = true; 
}


// called automatically from within initTHREEjs() function (located in InitCommon.js file)
function initSceneData()
{
	demoFragmentShaderFileName = 'Glider_Ball_3D_Fragment.glsl';

	// scene/demo-specific three.js objects setup goes here
	sceneIsDynamic = true;

	useGenericInput = false;
	
	cameraFlightSpeed = 60;

	// pixelRatio is resolution - range: 0.5(half resolution) to 1.0(full resolution)
	pixelRatio = mouseControl ? 1.0 : 0.75;
	
	EPS_intersect = 0.01;

	// set camera's field of view
	worldCamera.fov = 80;


	// COURSE 
	courseShape.visible = false; // don't need Three.js to render this - we will ray trace it ourselves
	courseShape.position.set(0, 0, 0);
	courseShape.scale.set(500, 500, 500); // Sphere-shaped
	// must call this each time we change an object's transform
	courseShape.updateMatrixWorld();
	courseShape_invMatrix.copy(courseShape.matrixWorld).invert();

	// GLIDER 1 (player)
	glider1Base.visible = false;
	glider1Base.scale.set(20, 22, 6);
	glider1CollisionVolume.scale.set(25, 25, 25);

	// GLIDER 2 (AI controlled)
	glider2Base.visible = false;
	glider2Base.scale.set(20, 22, 6);
	glider2CollisionVolume.scale.set(25, 25, 25);

	// BALL
	ball.visible = false;
	ball.scale.set(25, 4, 25);
	ballCollisionVolume.scale.set(33, 33, 33);

	// PLAYER's GOAL
	playerGoal.visible = false;
	playerGoal.scale.set(3, 20, 110);

	// COMPUTER's GOAL
	computerGoal.visible = false;
	computerGoal.scale.set(3, 20, 110);
	

	
	// In addition to the default GUI on all demos/games, add any special GUI elements that this particular game requires

	course_TypeObject = { Course_Type: 'Sphere' };
	course_ScaleUniformObject = { uniformScale: 500 };
	course_ScaleXObject = { scaleX: 500 };
	course_ScaleYObject = { scaleY: 500 };
	course_ScaleZObject = { scaleZ: 500 };
	course_ClipMinXObject = { clipMinX: -1.0 };
	course_ClipMaxXObject = { clipMaxX: 1.0 };
	course_ClipMinYObject = { clipMinY: -1.0 };
	course_ClipMaxYObject = { clipMaxY: 1.0 };
	course_ClipMinZObject = { clipMinZ: -1.0 };
	course_ClipMaxZObject = { clipMaxZ: 1.0 };
	course_ShapeKparameterObject = { shape_Kparam: 1.0 };
	level_RestartObject = { 'restart level' : beginLevel };

	function handleCourseTypeChange() { needChangeCourseType = true; }
	function handleCourseScaleUniformChange() { needChangeCourseScaleUniform = true; }
	function handleCourseScaleChange() { needChangeCourseScale = true; }
	function handleCourseClipXYZChange() { needChangeCourseClipXYZBounds = true; }
	function handleCourseShapeKparamChange() { needChangeCourseShapeKparameter = true; }

	course_TypeController = gui.add(course_TypeObject, 'Course_Type', ['Sphere', 'Ellipsoid', 'Cylinder', 'Paraboloid', 'Cone', 'Hyperboloid',//'HyperbolicParaboloid', 
		'Plane', 'Capsule', 'RoundedBox', 'Torus', 'BilinearPatch']).onChange(handleCourseTypeChange);
	
	scale_Folder = gui.addFolder('Scale');
	course_ScaleUniformController = scale_Folder.add(course_ScaleUniformObject, 'uniformScale', 200, 1500, 1).onChange(handleCourseScaleUniformChange);
	course_ScaleXController = scale_Folder.add(course_ScaleXObject, 'scaleX', 200, 1500, 1).onChange(handleCourseScaleChange);
	course_ScaleYController = scale_Folder.add(course_ScaleYObject, 'scaleY', 200, 1500, 1).onChange(handleCourseScaleChange);
	course_ScaleZController = scale_Folder.add(course_ScaleZObject, 'scaleZ', 200, 1500, 1).onChange(handleCourseScaleChange);

	clipBoundaries_Folder = gui.addFolder('Clip Boundaries');
	course_ClipMinXController = clipBoundaries_Folder.add(course_ClipMinXObject, 'clipMinX',-1.0,-0.1, 0.01).onChange(handleCourseClipXYZChange);
	course_ClipMaxXController = clipBoundaries_Folder.add(course_ClipMaxXObject, 'clipMaxX', 0.1, 1.0, 0.01).onChange(handleCourseClipXYZChange);
	course_ClipMinYController = clipBoundaries_Folder.add(course_ClipMinYObject, 'clipMinY',-1.0,-0.1, 0.01).onChange(handleCourseClipXYZChange);
	course_ClipMaxYController = clipBoundaries_Folder.add(course_ClipMaxYObject, 'clipMaxY', 0.1, 1.0, 0.01).onChange(handleCourseClipXYZChange);
	course_ClipMinZController = clipBoundaries_Folder.add(course_ClipMinZObject, 'clipMinZ',-1.0,-0.1, 0.01).onChange(handleCourseClipXYZChange);
	course_ClipMaxZController = clipBoundaries_Folder.add(course_ClipMaxZObject, 'clipMaxZ', 0.1, 1.0, 0.01).onChange(handleCourseClipXYZChange);
	clipBoundaries_Folder.close();

	course_ShapeKparameterController = gui.add(course_ShapeKparameterObject, 'shape_Kparam', 0.01, 1.0, 0.01).onChange(handleCourseShapeKparamChange);

	gui.add(level_RestartObject, 'restart level');

	handleCourseTypeChange();
	handleCourseScaleUniformChange();
	handleCourseScaleChange();
	handleCourseClipXYZChange();
	handleCourseShapeKparamChange();

	// scene/demo-specific uniforms go here
	pathTracingUniforms.uCourseShape_invMatrix = { value: courseShape_invMatrix };
	pathTracingUniforms.uGlider1InvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uGlider2InvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uBallInvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uPlayerGoalInvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uComputerGoalInvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uBallCollisionVolumeInvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uGlider1CollisionVolumeInvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uGlider2CollisionVolumeInvMatrix = { value: new THREE.Matrix4() };
	pathTracingUniforms.uLight1Position = { value: light1Position };
	pathTracingUniforms.uLight2Position = { value: light2Position };
	pathTracingUniforms.uLight3Position = { value: light3Position };
	pathTracingUniforms.uCourseMinBounds = { value: courseMinBounds };
	pathTracingUniforms.uCourseMaxBounds = { value: courseMaxBounds };
	pathTracingUniforms.uCourseShapeScale = { value: new THREE.Vector3() };
	pathTracingUniforms.uCourseShapeType = { value: 0 };
	pathTracingUniforms.uCourseShapeKparameter = { value: 1.0 };
	pathTracingUniforms.uTorusUpperBound = { value: 0.0 };

} // end function initSceneData()



// called automatically from within the animate() function (located in InitCommon.js file)
function updateVariablesAndUniforms()
{
	// handle any GUI menu changes

	if (needChangeCourseType)
	{
		courseShapeType = course_TypeController.getValue();

		if (courseShapeType == 'Sphere')
		{
			glider1StartingPosition.set(0.5, -50, 150);
			glider2StartingPosition.set(-0.5, -50, -150);
			ballStartingPosition.set(0, -50, 0);
			playerGoalStartingPosition.set(150, -50, 0);
			computerGoalStartingPosition.set(-150, -50, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.3, 0.3, -0.3);
			light3StartingPosition.set(0.3, -0.3, 0.3);
			courseShape.position.set(0, 0, 0);
			course_ScaleUniformController.setValue(500);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(500);
			course_ScaleYController.setValue(500);
			course_ScaleZController.setValue(500);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			course_ShapeKparameterController.hide();
			pathTracingUniforms.uCourseShapeType.value = 0;
		}
		else if (courseShapeType == 'Ellipsoid')
		{
			glider1StartingPosition.set(0.5, -50, 175);
			glider2StartingPosition.set(-0.5, -50, -175);
			ballStartingPosition.set(0, -50, 0);
			playerGoalStartingPosition.set(175, -50, 0);
			computerGoalStartingPosition.set(-175, -50, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.3, 0.3, -0.3);
			light3StartingPosition.set(0.3, -0.3, 0.3);
			courseShape.position.set(0, 0, 0);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(600);
			course_ScaleYController.setValue(300);
			course_ScaleZController.setValue(600);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			course_ShapeKparameterController.hide();
			pathTracingUniforms.uCourseShapeType.value = 1;
		}
		else if (courseShapeType == 'Cylinder')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.3, 0.3, -0.5);
			light3StartingPosition.set(0.3, -0.3, 0.5);
			courseShape.position.set(0, 0, 0);
			course_ScaleUniformController.setValue(500);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(500);
			course_ScaleYController.setValue(500);
			course_ScaleZController.setValue(500);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			course_ShapeKparameterController.hide();
			pathTracingUniforms.uCourseShapeType.value = 2;
		}
		else if (courseShapeType == 'Paraboloid')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.05, 0.05, -0.5);
			light3StartingPosition.set(0.05, -0.05, 0.5);
			courseShape.position.set(0, 0, 0);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(1000);
			course_ScaleYController.setValue(1000);
			course_ScaleZController.setValue(600);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			courseShapeKparameter = 0.1;
			course_ShapeKparameterController.min(0.1); course_ShapeKparameterController.max(0.5);
			course_ShapeKparameterController.setValue(courseShapeKparameter);
			course_ShapeKparameterController.hide();
			pathTracingUniforms.uCourseShapeKparameter.value = courseShapeKparameter;
			pathTracingUniforms.uCourseShapeType.value = 3;
		}
		else if (courseShapeType == 'Cone')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.05, 0.05, -0.5);
			light3StartingPosition.set(0.05, -0.05, 0.5);
			courseShape.position.set(0, 0, 0);
			course_ScaleUniformController.setValue(1000);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(1000);
			course_ScaleYController.setValue(1000);
			course_ScaleZController.setValue(1000);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			courseShapeKparameter = 0.1;
			course_ShapeKparameterController.show();
			course_ShapeKparameterController.min(0.1); course_ShapeKparameterController.max(0.5);
			course_ShapeKparameterController.setValue(courseShapeKparameter);
			pathTracingUniforms.uCourseShapeKparameter.value = courseShapeKparameter;
			pathTracingUniforms.uCourseShapeType.value = 4;
		}
		else if (courseShapeType == 'Hyperboloid')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.05, 0.05, -0.8);
			light3StartingPosition.set(0.05, -0.05, 0.8);
			courseShape.position.set(0, 0, 0);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(500);
			course_ScaleYController.setValue(500);
			course_ScaleZController.setValue(800);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			courseShapeKparameter = 0.94;
			course_ShapeKparameterController.show();
			course_ShapeKparameterController.min(0.0); course_ShapeKparameterController.max(0.97);
			course_ShapeKparameterController.setValue(courseShapeKparameter);
			pathTracingUniforms.uCourseShapeKparameter.value = courseShapeKparameter;
			pathTracingUniforms.uCourseShapeType.value = 5;
		}
		/* else if (courseShapeType == 'HyperbolicParaboloid')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			light1StartingPosition.set(0, -0.3, 0);
			light2StartingPosition.set(-0.3, -0.3, -0.3);
			light3StartingPosition.set(0.3, -0.3, 0.3);
			courseShape.position.set(0, -200, 0);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(500);
			course_ScaleYController.setValue(500);
			course_ScaleZController.setValue(500);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			course_ShapeKparameterController.hide();
			pathTracingUniforms.uCourseShapeType.value = 6;
		} */
		else if (courseShapeType == 'Plane')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			// light1StartingPosition.set(0, 0.3, 0);
			// light2StartingPosition.set(-0.3, 0.3, -0.3);
			// light3StartingPosition.set(0.3, 0.3, 0.3);
			light1StartingPosition.set(Math.cos(ONETHIRD_PI * 0) * 0.5, 0.3, Math.sin(ONETHIRD_PI * 0) * 0.5);
			light2StartingPosition.set(Math.cos(ONETHIRD_PI * 2) * 0.5, 0.3, Math.sin(ONETHIRD_PI * 2) * 0.5);
			light3StartingPosition.set(Math.cos(ONETHIRD_PI * 4) * 0.5, 0.3, Math.sin(ONETHIRD_PI * 4) * 0.5);
			courseShape.position.set(0, -200, 0);
			course_ScaleUniformController.setValue(1000);
			course_ScaleXController.show();
			course_ScaleYController.hide();
			course_ScaleZController.show();
			course_ScaleXController.setValue(1000);
			//course_ScaleYController.setValue(1000);
			course_ScaleZController.setValue(1000);
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			course_ClipMinZController.setValue(-1); course_ClipMaxZController.setValue(1);
			clipBoundaries_Folder.hide();
			course_ShapeKparameterController.hide();
			pathTracingUniforms.uCourseShapeType.value = 6;
		}
		else if (courseShapeType == 'Capsule')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.3, 0.3, -1);
			light3StartingPosition.set(0.3, -0.3, 1);
			courseShape.position.set(0, 0, 0);
			course_ScaleUniformController.setValue(500);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(500);
			course_ScaleYController.setValue(500);
			course_ScaleZController.setValue(500);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(1);
			course_ClipMinXController.setValue(-1); course_ClipMaxXController.setValue(1);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(1);
			courseShapeKparameter = 1;
			course_ClipMinZController.min(-courseShapeKparameter - 1); course_ClipMaxZController.max(courseShapeKparameter + 1);
			course_ClipMinZController.setValue(-courseShapeKparameter - 1); course_ClipMaxZController.setValue(courseShapeKparameter + 1);
			course_ShapeKparameterController.show();
			course_ShapeKparameterController.min(0.5); course_ShapeKparameterController.max(3);
			course_ShapeKparameterController.setValue(courseShapeKparameter);
			pathTracingUniforms.uCourseShapeKparameter.value = courseShapeKparameter;
			pathTracingUniforms.uCourseShapeType.value = 7;
		}
		else if (courseShapeType == 'RoundedBox')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			light1StartingPosition.set(0, 0, 0);
			light2StartingPosition.set(-0.4, 0.4, -0.4);
			light3StartingPosition.set(0.4, -0.4, 0.4);
			courseShape.position.set(0, 0, 0);
			course_ScaleUniformController.setValue(500);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(500);
			course_ScaleYController.setValue(500);
			course_ScaleZController.setValue(500);
			course_ClipMinXController.min(-2); course_ClipMaxXController.max(2);
			course_ClipMinYController.min(-2); course_ClipMaxYController.max(2);
			course_ClipMinZController.min(-2); course_ClipMaxZController.max(2);
			course_ClipMinXController.setValue(-2); course_ClipMaxXController.setValue(2);
			course_ClipMinYController.setValue(-2); course_ClipMaxYController.setValue(2);
			course_ClipMinZController.setValue(-2); course_ClipMaxZController.setValue(2);
			clipBoundaries_Folder.hide();
			courseShapeKparameter = 0.1;
			course_ShapeKparameterController.show();
			course_ShapeKparameterController.min(0.05); course_ShapeKparameterController.max(0.5);
			course_ShapeKparameterController.setValue(courseShapeKparameter);
			pathTracingUniforms.uCourseShapeKparameter.value = courseShapeKparameter;
			pathTracingUniforms.uCourseShapeType.value = 8;
		}
		else if (courseShapeType == 'Torus')
		{
			glider1StartingPosition.set(0 + course_ScaleXController.getValue(), -10, 75);
			glider2StartingPosition.set(0 - course_ScaleXController.getValue(), -10, -75);
			ballStartingPosition.set(0 + course_ScaleXController.getValue(), -10, 0);
			playerGoalStartingPosition.set(75 + course_ScaleXController.getValue(), -10, 0);
			computerGoalStartingPosition.set(-75 - course_ScaleXController.getValue(), -10, 0);
			// (lights position placement is handled in needChangeCourseScale code further down)
			courseShape.position.set(0, 0, 0);
			course_ScaleUniformController.setValue(500);
			course_ScaleXController.show();
			course_ScaleYController.show();
			course_ScaleZController.show();
			course_ScaleXController.setValue(500);
			course_ScaleYController.setValue(500);
			course_ScaleZController.setValue(500);
			clipBoundaries_Folder.show();
			course_ClipMinXController.min(-2); course_ClipMaxXController.max(2);
			course_ClipMinYController.min(-2); course_ClipMaxYController.max(2);
			course_ClipMinZController.min(-2); course_ClipMaxZController.max(2);
			course_ClipMinXController.setValue(-2); course_ClipMaxXController.setValue(2);
			course_ClipMinYController.setValue(-2); course_ClipMaxYController.setValue(2);
			course_ClipMinZController.setValue(-2); course_ClipMaxZController.setValue(2);
			courseShapeKparameter = 0.5;
			course_ShapeKparameterController.show();
			course_ShapeKparameterController.min(0.2); course_ShapeKparameterController.max(0.99);
			course_ShapeKparameterController.setValue(courseShapeKparameter);
			pathTracingUniforms.uCourseShapeKparameter.value = courseShapeKparameter;
			pathTracingUniforms.uCourseShapeType.value = 9;
		}
		else if (courseShapeType == 'BilinearPatch')
		{
			glider1StartingPosition.set(0.5, -10, 75);
			glider2StartingPosition.set(-0.5, -10, -75);
			ballStartingPosition.set(0, -10, 0);
			playerGoalStartingPosition.set(75, -10, 0);
			computerGoalStartingPosition.set(-75, -10, 0);
			// light1StartingPosition.set(0, 0.2, 0);
			// light2StartingPosition.set(-0.5, 0.2, -0.5);
			// light3StartingPosition.set(0.5, 0.2, 0.5);
			light1StartingPosition.set( Math.cos(ONETHIRD_PI * 0) * 1.0, 0.3,  Math.sin(ONETHIRD_PI * 0) * 1.0);
			light2StartingPosition.set( Math.cos(ONETHIRD_PI * 4) * 1.0, 0.3,  Math.sin(ONETHIRD_PI * 4) * 1.0);
			light3StartingPosition.set( Math.cos(ONETHIRD_PI * 2) * 1.0, 0.3,  Math.sin(ONETHIRD_PI * 2) * 1.0);
			courseShape.position.set(0, -700, 0);
			course_ScaleUniformController.setValue(800);
			course_ScaleXController.setValue(800);
			course_ScaleYController.setValue(800);
			course_ScaleZController.setValue(800);
			course_ScaleXController.hide();
			course_ScaleYController.hide();
			course_ScaleZController.hide();
			course_ClipMinXController.min(-1); course_ClipMaxXController.max(1);
			course_ClipMinYController.min(-1); course_ClipMaxYController.max(2);
			course_ClipMinZController.min(-1); course_ClipMaxZController.max(1);
			course_ClipMinXController.setValue(-0.97); course_ClipMaxXController.setValue(0.97);
			course_ClipMinYController.setValue(-1); course_ClipMaxYController.setValue(2);
			course_ClipMinZController.setValue(-0.97); course_ClipMaxZController.setValue(0.97);
			clipBoundaries_Folder.hide();
			course_ShapeKparameterController.hide();
			pathTracingUniforms.uCourseShapeType.value = 10;
		}

		cameraIsMoving = true;
		needChangeCourseType = false;
		beginLevel();
	}

	if (needChangeCourseScaleUniform)
	{
		courseUniformScale = course_ScaleUniformController.getValue();
		courseShape.scale.set(courseUniformScale, courseUniformScale, courseUniformScale);

		course_ScaleXController.setValue(courseUniformScale);
		course_ScaleYController.setValue(courseUniformScale);
		course_ScaleZController.setValue(courseUniformScale);

		courseShape.updateMatrixWorld();
		courseShape_invMatrix.copy(courseShape.matrixWorld).invert();
		pathTracingUniforms.uCourseShape_invMatrix.value.copy(courseShape_invMatrix);

		cameraIsMoving = true;
		needChangeCourseScaleUniform = false;
		beginLevel();
	}

	if (needChangeCourseScale)
	{
		courseShape.scale.set(course_ScaleXController.getValue(),
			course_ScaleYController.getValue(),
			course_ScaleZController.getValue());

		if (courseShapeType == 'Plane')
			courseShape.scale.y = 1000;

		
		light1Position.copy(light1StartingPosition).multiply(courseShape.scale); 
		light2Position.copy(light2StartingPosition).multiply(courseShape.scale); 
		light3Position.copy(light3StartingPosition).multiply(courseShape.scale);

		if (courseShapeType == 'Capsule')
		{
			light1Position.z *= courseShapeKparameter;
			light2Position.z *= courseShapeKparameter;
			light3Position.z *= courseShapeKparameter;
		}
		

		if (courseShapeType == 'Torus')
		{
			glider1StartingPosition.set(0 + course_ScaleXController.getValue(), -10, 75);
			glider2StartingPosition.set(0 - course_ScaleXController.getValue(), -10, -75);
			ballStartingPosition.set(0 + course_ScaleXController.getValue(), -10, 0);
			playerGoalStartingPosition.set(75 + course_ScaleXController.getValue(), -10, 0);
			computerGoalStartingPosition.set(-75 - course_ScaleXController.getValue(), -10, 0);

			// light1Position.set(-10 - course_ScaleXController.getValue(), -15, 5);
			// light2Position.set(10 + course_ScaleXController.getValue(), -10, -15);
			// light3Position.set(5, course_ScaleYController.getValue(), 5);

			light1Position.copy(torusLight1PositionVec).multiply(courseShape.scale);
			light2Position.copy(torusLight2PositionVec).multiply(courseShape.scale);
			light3Position.copy(torusLight3PositionVec).multiply(courseShape.scale);

			torusUpperBound = courseShape.scale.x;
			if (courseShape.scale.y > torusUpperBound) torusUpperBound = courseShape.scale.y;
			if (courseShape.scale.z > torusUpperBound) torusUpperBound = courseShape.scale.z;

			torusUpperBound *= 4;
			pathTracingUniforms.uTorusUpperBound.value = torusUpperBound;
		}

		pathTracingUniforms.uCourseShapeScale.value.copy(courseShape.scale);

		courseShape.updateMatrixWorld();
		courseShape_invMatrix.copy(courseShape.matrixWorld).invert();
		pathTracingUniforms.uCourseShape_invMatrix.value.copy(courseShape_invMatrix);

		cameraIsMoving = true;
		needChangeCourseScale = false;
		beginLevel();
	}

	if (needChangeCourseClipXYZBounds)
	{
		courseMinBounds.set(course_ClipMinXController.getValue(),
				    course_ClipMinYController.getValue(),
				    course_ClipMinZController.getValue());

		courseMaxBounds.set(course_ClipMaxXController.getValue(),
				    course_ClipMaxYController.getValue(),
				    course_ClipMaxZController.getValue());

		pathTracingUniforms.uCourseMinBounds.value.copy(courseMinBounds);
		pathTracingUniforms.uCourseMaxBounds.value.copy(courseMaxBounds);

		cameraIsMoving = true;
		needChangeCourseClipXYZBounds = false;
	}

	if (needChangeCourseShapeKparameter)
	{
		courseShapeKparameter = course_ShapeKparameterController.getValue();

		if (courseShapeType == 'Capsule')
		{
			course_ClipMinZController.min(-courseShapeKparameter - 1); 
			course_ClipMaxZController.max(courseShapeKparameter + 1);
			course_ClipMinZController.setValue(-courseShapeKparameter - 1); 
			course_ClipMaxZController.setValue(courseShapeKparameter + 1);

			light1Position.z = light1StartingPosition.z * courseShape.scale.z;// * courseShape.scale.z * 0.1;
			light1Position.z *= courseShapeKparameter;
			light2Position.z = light2StartingPosition.z * courseShape.scale.z;// * courseShape.scale.z * 0.1;
			light2Position.z *= courseShapeKparameter;
			light3Position.z = light3StartingPosition.z * courseShape.scale.z;// * courseShape.scale.z * 0.1;
			light3Position.z *= courseShapeKparameter;
		}
		
		pathTracingUniforms.uCourseShapeKparameter.value = courseShapeKparameter;

		cameraIsMoving = true;
		needChangeCourseShapeKparameter = false;
		beginLevel();
	}


	if (levelBeginFlag)
	{
		// GLIDER 1 (player)
		glider1Base.position.copy(glider1StartingPosition);
		glider1OldPosition.copy(glider1Base.position);
		glider1CollisionVolume.position.copy(glider1Base.position);
		glider1BaseRight.set(1, 0, 0);
		glider1BaseUp.set(0, 1, 0);
		glider1BaseForward.set(0, 0, 1);
		glider1LocalVelocity.set(0, 0, 0);
		glider1IsInAir = true;

		// GLIDER 2 (AI controlled)
		glider2Base.position.copy(glider2StartingPosition);
		glider2OldPosition.copy(glider2Base.position);
		glider2CollisionVolume.position.copy(glider2Base.position);
		glider2BaseRight.set(1, 0, 0);
		glider2BaseUp.set(0, 1, 0);
		glider2BaseForward.set(0, 0, 1);
		glider2LocalVelocity.set(0, 0, 0);
		glider2IsInAir = true;

		// BALL
		ball.position.copy(ballStartingPosition);
		ballOldPosition.copy(ball.position);
		ballCollisionVolume.position.copy(ball.position);
		ballRight.set(1, 0, 0);
		ballUp.set(0, 1, 0);
		ballForward.set(0, 0, 1);
		ballLocalVelocity.set(0, 0, 0);
		ballIsInAir = true;

		// PLAYER's GOAL
		playerGoal.position.copy(playerGoalStartingPosition);
		playerGoalOldPosition.copy(playerGoal.position);
		playerGoalRight.set(1, 0, 0);
		playerGoalUp.set(0, 1, 0);
		playerGoalForward.set(0, 0, 1);
		playerGoalLocalVelocity.set(10, 0, 0);
		playerGoalIsInAir = true;

		// COMPUTER's GOAL
		computerGoal.position.copy(computerGoalStartingPosition);
		computerGoalOldPosition.copy(computerGoal.position);
		computerGoalRight.set(1, 0, 0);
		computerGoalUp.set(0, 1, 0);
		computerGoalForward.set(0, 0, 1);
		computerGoalLocalVelocity.set(10, 0, 0);
		computerGoalIsInAir = true;

		levelBeginFlag = false;
	} // end if (levelBeginFlag)



	// START OF GAME LOOP

	// reset some variables at start of game loop
	glider1IsAcceleratingRight = false;
	glider1IsAcceleratingUp = false;
	glider1IsAcceleratingForward = false;

	glider2IsAcceleratingRight = false;
	glider2IsAcceleratingUp = false;
	glider2IsAcceleratingForward = false;
	
	// get user input and apply it to Glider1's Local velocity
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
		
		//if (!glider1IsInAir)
		/* {
			if ((keyPressed('KeyS') || button4Pressed) && !(keyPressed('KeyW') || button3Pressed))
			{
				glider1LocalVelocity.z += (glider1ThrustersForward.dot(glider1BaseForward) * 300 * frameTime); 
				glider1LocalVelocity.x += (glider1ThrustersForward.dot(glider1BaseRight) * 300 * frameTime);
				glider1IsAcceleratingForward = true;
				
			}
			if ((keyPressed('KeyW') || button3Pressed) && !(keyPressed('KeyS') || button4Pressed))
			{
				glider1LocalVelocity.z += (glider1ThrustersForward.dot(glider1BaseForward) * -300 * frameTime); 
				glider1LocalVelocity.x += (glider1ThrustersForward.dot(glider1BaseRight) * -300 * frameTime);
				glider1IsAcceleratingForward = true;
			}
			if ((keyPressed('KeyA') || button1Pressed) && !(keyPressed('KeyD') || button2Pressed))
			{
				glider1LocalVelocity.z += (glider1ThrustersRight.dot(glider1BaseForward) * -300 * frameTime); 
				glider1LocalVelocity.x += (glider1ThrustersRight.dot(glider1BaseRight) * -300 * frameTime);
				glider1IsAcceleratingRight = true;
			}
			if ((keyPressed('KeyD') || button2Pressed) && !(keyPressed('KeyA') || button1Pressed))
			{
				glider1LocalVelocity.z += (glider1ThrustersRight.dot(glider1BaseForward) * 300 * frameTime); 
				glider1LocalVelocity.x += (glider1ThrustersRight.dot(glider1BaseRight) * 300 * frameTime);
				glider1IsAcceleratingRight = true;
			}
		} */

		// Or use the following controls for a constantly-steerable Glider (even steers when no thrust is being applied and Glider is slowing down)
		// Behaves more like a car with wheels.  This is less realistic physics-wise for a hovering Glider, but I may ultimately keep it for max player-steering control.
		// When everything is moving really fast, it may be helpful to 'steer' the floating Glider, in order to maximize ball-targeting ability, and thus fun factor.
		
		//if (!glider1IsInAir)
		{
			if ((keyPressed('KeyW') || button3Pressed) && !(keyPressed('KeyS') || button4Pressed))
			{
				glider1LocalVelocity.z -= (300 * frameTime); 
				glider1IsAcceleratingForward = true;
				
			}
			if ((keyPressed('KeyS') || button4Pressed) && !(keyPressed('KeyW') || button3Pressed))
			{
				glider1LocalVelocity.z += (300 * frameTime); 
				glider1IsAcceleratingForward = true;
			}
			if ((keyPressed('KeyA') || button1Pressed) && !(keyPressed('KeyD') || button2Pressed))
			{
				glider1LocalVelocity.x -= (300 * frameTime);
				glider1IsAcceleratingRight = true;
			}
			if ((keyPressed('KeyD') || button2Pressed) && !(keyPressed('KeyA') || button1Pressed))
			{ 
				glider1LocalVelocity.x += (300 * frameTime);
				glider1IsAcceleratingRight = true;
			}
		}


		// Note: the following is temporary input code for testing red opponent glider movement
		// will be removed when red opponent glider is fully controlled by AI code
		//if (!glider2IsInAir)
		/* {
			if ( keyPressed('KeyI') && !keyPressed('KeyK') )
			{
				glider2LocalVelocity.z += (glider2ThrustersForward.dot(glider2BaseForward) * -300 * frameTime); 
				glider2LocalVelocity.x += (glider2ThrustersForward.dot(glider2BaseRight) * -300 * frameTime);
				glider2IsAcceleratingForward = true;
				
			}
			if ( keyPressed('KeyK') && !keyPressed('KeyI') )
			{
				glider2LocalVelocity.z += (glider2ThrustersForward.dot(glider2BaseForward) * 300 * frameTime); 
				glider2LocalVelocity.x += (glider2ThrustersForward.dot(glider2BaseRight) * 300 * frameTime);
				glider2IsAcceleratingForward = true;
			}
			if ( keyPressed('KeyJ') && !keyPressed('KeyL') )
			{
				glider2LocalVelocity.z += (glider2ThrustersRight.dot(glider2BaseForward) * -300 * frameTime); 
				glider2LocalVelocity.x += (glider2ThrustersRight.dot(glider2BaseRight) * -300 * frameTime);
				glider2IsAcceleratingRight = true;
			}
			if ( keyPressed('KeyL') && !keyPressed('KeyJ') )
			{
				glider2LocalVelocity.z += (glider2ThrustersRight.dot(glider2BaseForward) * 300 * frameTime); 
				glider2LocalVelocity.x += (glider2ThrustersRight.dot(glider2BaseRight) * 300 * frameTime);
				glider2IsAcceleratingRight = true;
			}
		} */

		// Note: the following is temporary input code for testing red opponent glider movement
		// will be removed when red opponent glider is fully controlled by AI code
		//if (!glider2IsInAir)
		{
			if ( keyPressed('KeyI') && !keyPressed('KeyK') )
			{
				glider2LocalVelocity.z -= (300 * frameTime); 
				glider2IsAcceleratingForward = true;
				
			}
			if ( keyPressed('KeyK') && !keyPressed('KeyI') )
			{
				glider2LocalVelocity.z += (300 * frameTime); 
				glider2IsAcceleratingForward = true;
			}
			if ( keyPressed('KeyJ') && !keyPressed('KeyL') )
			{
				glider2LocalVelocity.x -= (300 * frameTime);
				glider2IsAcceleratingRight = true;
			}
			if ( keyPressed('KeyL') && !keyPressed('KeyJ') )
			{ 
				glider2LocalVelocity.x += (300 * frameTime);
				glider2IsAcceleratingRight = true;
			}
		}
		
	} // end if (!isPaused)

	// if camera is not rotating and Glider motion has almost fully stopped, set cameraIsMoving to false,
	// otherwise set cameraIsMoving to true because there must be some action or movement going on in the game.
	// This helps with the temporal/spatial denoiser in the final shader, which tries to get rid of noise from edges (which must remain sharp)
	if (!cameraIsMoving && glider1LocalVelocity.x * glider1LocalVelocity.x < 20 && glider1LocalVelocity.z * glider1LocalVelocity.z  < 20)
		cameraIsMoving = false;
	else 
		cameraIsMoving = true;


	

	// UPDATE GLIDER 1 ////////////////////////////////////////////////////////////////////////////////

	
	// if glider is on the ground (touching the large course), allow player to jump again
	if (!glider1IsInAir)
	{
		glider1LocalVelocity.y = 0;
		glider1IsAcceleratingUp = false;
		canPress_Space = true;
	}
	// if in air, apply gravity (actually anti-gravity: pulls Glider down to the large course surface in all directions)
	if (glider1IsInAir)
	{
		canPress_Space = false;
		glider1LocalVelocity.y -= (200 * frameTime);
		glider1IsAcceleratingUp = true;
	}
	// if a legal jump action was triggered, apply a short, upward impulse to glider
	if (jumpWasTriggered)
	{
		glider1IsInAir = true;
		glider1LocalVelocity.y = 150;
		glider1IsAcceleratingUp = true;
		jumpWasTriggered = false;
	}
	
	// apply friction to glider1's Local velocity
	if (!glider1IsAcceleratingForward && !glider1IsAcceleratingUp && !glider1IsAcceleratingRight)
	{
		glider1LocalVelocity.z -= (glider1LocalVelocity.z * 1 * frameTime);
		glider1LocalVelocity.x -= (glider1LocalVelocity.x * 1 * frameTime);
	}

	// the following gives a very slight invisible movement to glider1, so that a ray can be created from its old position to its new position 
	if (Math.abs(glider1LocalVelocity.x) < 0.0001 && Math.abs(glider1LocalVelocity.z) < 0.0001)
	{
		glider1LocalVelocity.x = (Math.random() * 2 - 1) * 0.001;
		glider1LocalVelocity.z = (Math.random() * 2 - 1) * 0.001;
	}
	

	// update glider1's World velocity and position 

	// Use the following code for setting position according to glider world positional basis (basis vectors only based on glider Up vector). Will behave more like the real world,
	// where the glider has momentum and will travel in the thrusted direction (only slowing due to artificial 'friction'), and will continue in that direction unless a
	// thrust is applied in a different direction. A perfect 2D example of this behavior is found in the classic Asteroids arcade game.  The player's ship
	// travels in the thrusted direction, and will continue in that direction (just like a real spacecraft), unless acted upon by a different force, i.e. another thrust 
	// in a different direction, or applying fake 'friction' to the environment, which is used to artificially slow the craft down, even in outer space. 
	// This realistic behavior, although cool, makes it more challenging to target and hit the ball with your glider, especially when everything is moving fast in-game. 
	
	// get glider world velocity vector from its local velocity ()

	/* glider1WorldVelocity.set(0, 0, 0);
	glider1WorldVelocity.addScaledVector(glider1BaseRight, glider1LocalVelocity.x);
	glider1WorldVelocity.addScaledVector(glider1BaseUp, glider1LocalVelocity.y);
	glider1WorldVelocity.addScaledVector(glider1BaseForward, glider1LocalVelocity.z);
	
	glider1Base.position.addScaledVector(glider1WorldVelocity, frameTime); */
 	

	// Or use the following code for setting position according to glider1Thrusters rotational basis (which way glider is facing). Will constantly steer the glider in that
	// facing direction, even when no engine thrusting is being applied and glider is slowing down due to friction (glider will continue to perfectly steer until fully stopped).
	// Behaves more like a car with wheels. This is less realistic physics-wise for a hovering glider, but I may ultimately keep it for max player-steering control.
	// When everything is moving really fast, it may be helpful to 'steer' your floating glider, in order to maximize ball-targeting ability, and thus fun factor.
	
	glider1WorldVelocity.set(0, 0, 0);
	glider1WorldVelocity.addScaledVector(glider1ThrustersRight, glider1LocalVelocity.x);
	glider1WorldVelocity.addScaledVector(glider1ThrustersUp, glider1LocalVelocity.y);
	glider1WorldVelocity.addScaledVector(glider1ThrustersForward, glider1LocalVelocity.z);
	
	glider1Base.position.addScaledVector(glider1WorldVelocity, frameTime);
	

	// now that the glider1 has moved, record its new position minus its old position (from the previous frame) as a line segment
	glider1RaySegment.copy(glider1Base.position).sub(glider1OldPosition);
	glider1RaySegmentLength = glider1RaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the glider1's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	glider1RayOrigin.copy(glider1OldPosition); // must use glider's old position for this to work
	glider1RayDirection.copy(glider1RaySegment).normalize();


	// PHYSICS for Glider1 vs. Glider2

	glider1CollisionVolume.position.copy(glider1OldPosition);
	///glider1CollisionVolume.position.addScaledVector(glider1BaseUp, 15);
	///glider1CollisionVolume.rotation.copy(glider1Base.rotation);
	glider1CollisionVolume.updateMatrixWorld();
	glider1_invMatrix.copy(glider1CollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uGlider1CollisionVolumeInvMatrix.value.copy(glider1_invMatrix);

	rayObjectOrigin.copy(glider1RayOrigin);
	///rayObjectOrigin.addScaledVector(glider1BaseUp, 15);
	rayObjectDirection.copy(glider1RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of Glider2
	glider2CollisionVolume.position.copy(glider2Base.position);
	///glider2CollisionVolume.position.addScaledVector(glider2BaseUp, 15);
	///glider2CollisionVolume.rotation.copy(glider2Base.rotation);
	glider2CollisionVolume.scale.multiplyScalar(2);
	glider2CollisionVolume.updateMatrixWorld();
	glider2_invMatrix.copy(glider2CollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uGlider2CollisionVolumeInvMatrix.value.copy(glider2_invMatrix);
	glider2CollisionVolume.scale.multiplyScalar(1/2);
	glider2CollisionVolume.updateMatrixWorld();
	rayObjectOrigin.transformAsPoint(glider2_invMatrix);
	rayObjectDirection.transformAsDirection(glider2_invMatrix);

	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < glider1RaySegmentLength)// || testT < 10)
	{
		collisionNormal.subVectors(glider1Base.position, glider2Base.position);
		relativeVelocity.subVectors(glider1WorldVelocity, glider2WorldVelocity);
		rV_dot_cN = relativeVelocity.dot(collisionNormal);

		if (rV_dot_cN < 0)
		{
			//console.log("collision detected");
			collisionCounter++;
			unitCollisionNormal.copy(collisionNormal).normalize();
			intersectionPoint.getPointAlongRay(glider1RayOrigin, glider1RayDirection, testT);
			glider1Base.position.copy(intersectionPoint);
			//glider1Base.position.addScaledVector(glider1BaseUp, -15);
			glider1Base.position.addScaledVector(unitCollisionNormal, glider1CollisionVolume.scale.x);
			//glider1Base.updateMatrixWorld();

			combinedInverseMasses = 1 / (gliderMass + gliderMass);
			impulseAmount = -2 * 0.02 * rV_dot_cN * combinedInverseMasses; // / collisionNormal.dot(collisionNormal);
			unitCollisionNormal.multiplyScalar(impulseAmount);
			impulseGlider1.copy(unitCollisionNormal).multiplyScalar(gliderMass);
			impulseGlider2.copy(unitCollisionNormal).multiplyScalar(-gliderMass);
			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider1LocalVelocity.x += impulseGlider1.dot(glider1BaseRight);
			// glider1LocalVelocity.y += impulseGlider1.dot(glider1BaseUp);
			// glider1LocalVelocity.z += impulseGlider1.dot(glider1BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider1LocalVelocity.x += impulseGlider1.dot(glider1ThrustersRight);
			glider1LocalVelocity.y += impulseGlider1.dot(glider1ThrustersUp);
			glider1LocalVelocity.z += impulseGlider1.dot(glider1ThrustersForward);

			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider2LocalVelocity.x += impulseGlider2.dot(glider2BaseRight);
			// glider2LocalVelocity.y += impulseGlider2.dot(glider2BaseUp);
			// glider2LocalVelocity.z += impulseGlider2.dot(glider2BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider2LocalVelocity.x += impulseGlider2.dot(glider2ThrustersRight);
			glider2LocalVelocity.y += impulseGlider2.dot(glider2ThrustersUp);
			glider2LocalVelocity.z += impulseGlider2.dot(glider2ThrustersForward);
		}
	}


	// PHYSICS for Glider1 vs. Ball

	rayObjectOrigin.copy(glider1RayOrigin);
	///rayObjectOrigin.addScaledVector(glider1BaseUp, 15);
	rayObjectDirection.copy(glider1RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the ball
	ballCollisionVolume.position.copy(ball.position);
	///ballCollisionVolume.position.addScaledVector(ballUp, 15);
	///ballCollisionVolume.rotation.copy(ball.rotation);
	ballCollisionVolume.updateMatrixWorld();
	ball_invMatrix.copy(ballCollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uBallCollisionVolumeInvMatrix.value.copy(ball_invMatrix);
	rayObjectOrigin.transformAsPoint(ball_invMatrix);
	rayObjectDirection.transformAsDirection(ball_invMatrix);

	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < glider1RaySegmentLength)// || testT < 10)
	{
		collisionNormal.subVectors(glider1Base.position, ball.position);
		relativeVelocity.subVectors(glider1WorldVelocity, ballWorldVelocity);
		rV_dot_cN = relativeVelocity.dot(collisionNormal);

		if (rV_dot_cN < 0)
		{
			//console.log("collision detected");
			collisionCounter++;
			unitCollisionNormal.copy(collisionNormal).normalize();
			intersectionPoint.getPointAlongRay(glider1RayOrigin, glider1RayDirection, testT);
			glider1Base.position.copy(intersectionPoint);
			///glider1Base.position.addScaledVector(glider1BaseUp, -15);
			glider1Base.position.addScaledVector(unitCollisionNormal, glider1CollisionVolume.scale.x);
			//glider1Base.updateMatrixWorld();

			combinedInverseMasses = 1 / (gliderMass + ballMass);
			impulseAmount = -2 * 0.04 * rV_dot_cN * combinedInverseMasses;// / collisionNormal.dot(collisionNormal);
			unitCollisionNormal.multiplyScalar(impulseAmount);
			impulseGlider1.copy(unitCollisionNormal).multiplyScalar(ballMass);
			impulseBall.copy(unitCollisionNormal).multiplyScalar(-gliderMass);
			
			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider1LocalVelocity.x += impulseGlider1.dot(glider1BaseRight);
			// glider1LocalVelocity.y += impulseGlider1.dot(glider1BaseUp);
			// glider1LocalVelocity.z += impulseGlider1.dot(glider1BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider1LocalVelocity.x += impulseGlider1.dot(glider1ThrustersRight);
			glider1LocalVelocity.y += impulseGlider1.dot(glider1ThrustersUp);
			glider1LocalVelocity.z += impulseGlider1.dot(glider1ThrustersForward);

			ballLocalVelocity.x += impulseBall.dot(ballRight);
			ballLocalVelocity.y += impulseBall.dot(ballUp);
			ballLocalVelocity.z += impulseBall.dot(ballForward);
		}
	}

	// CHECK FOR GLIDER1 vs MIN/MAX BOUNDARY WALLS
	
	if (glider1Base.position.x > courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x))
	{
		glider1Base.position.x = courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x);
		unitCollisionNormal.set(-1, 0, 0);
		impulseGlider1.copy(glider1WorldVelocity);
		impulseGlider1.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider1).normalize();
		impulseGlider1.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider1LocalVelocity.x = impulseGlider1.dot(glider1BaseRight);
		// glider1LocalVelocity.z = impulseGlider1.dot(glider1BaseForward);
		glider1LocalVelocity.x = impulseGlider1.dot(glider1ThrustersRight);
		glider1LocalVelocity.z = impulseGlider1.dot(glider1ThrustersForward);
	}
	if (glider1Base.position.x < courseShape.position.x + (courseShape.scale.x * courseMinBounds.x))
	{
		glider1Base.position.x = courseShape.position.x + (courseShape.scale.x * courseMinBounds.x);
		unitCollisionNormal.set(1, 0, 0);
		impulseGlider1.copy(glider1WorldVelocity);
		impulseGlider1.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider1).normalize();
		impulseGlider1.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider1LocalVelocity.x = impulseGlider1.dot(glider1BaseRight);
		// glider1LocalVelocity.z = impulseGlider1.dot(glider1BaseForward);
		glider1LocalVelocity.x = impulseGlider1.dot(glider1ThrustersRight);
		glider1LocalVelocity.z = impulseGlider1.dot(glider1ThrustersForward);
	}
	if (glider1Base.position.y > courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y))
	{
		glider1Base.position.y = courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y);
		unitCollisionNormal.set(0, -1, 0);
		impulseGlider1.copy(glider1WorldVelocity);
		impulseGlider1.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider1).normalize();
		impulseGlider1.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider1LocalVelocity.x = impulseGlider1.dot(glider1BaseRight);
		// glider1LocalVelocity.z = impulseGlider1.dot(glider1BaseForward);
		glider1LocalVelocity.x = impulseGlider1.dot(glider1ThrustersRight);
		glider1LocalVelocity.z = impulseGlider1.dot(glider1ThrustersForward);
	}
	if (glider1Base.position.y < courseShape.position.y + (courseShape.scale.y * courseMinBounds.y))
	{
		glider1Base.position.y = courseShape.position.y + (courseShape.scale.y * courseMinBounds.y);
		unitCollisionNormal.set(0, 1, 0);
		impulseGlider1.copy(glider1WorldVelocity);
		impulseGlider1.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider1).normalize();
		impulseGlider1.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider1LocalVelocity.x = impulseGlider1.dot(glider1BaseRight);
		// glider1LocalVelocity.z = impulseGlider1.dot(glider1BaseForward);
		glider1LocalVelocity.x = impulseGlider1.dot(glider1ThrustersRight);
		glider1LocalVelocity.z = impulseGlider1.dot(glider1ThrustersForward);
	}
	if (glider1Base.position.z > courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z))
	{
		glider1Base.position.z = courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z);
		unitCollisionNormal.set(0, 0, -1);
		impulseGlider1.copy(glider1WorldVelocity);
		impulseGlider1.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider1).normalize();
		impulseGlider1.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider1LocalVelocity.x = impulseGlider1.dot(glider1BaseRight);
		// glider1LocalVelocity.z = impulseGlider1.dot(glider1BaseForward);
		glider1LocalVelocity.x = impulseGlider1.dot(glider1ThrustersRight);
		glider1LocalVelocity.z = impulseGlider1.dot(glider1ThrustersForward);
	}
	if (glider1Base.position.z < courseShape.position.z + (courseShape.scale.z * courseMinBounds.z))
	{
		glider1Base.position.z = courseShape.position.z + (courseShape.scale.z * courseMinBounds.z);
		unitCollisionNormal.set(0, 0, 1);
		impulseGlider1.copy(glider1WorldVelocity);
		impulseGlider1.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider1).normalize();
		impulseGlider1.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider1LocalVelocity.x = impulseGlider1.dot(glider1BaseRight);
		// glider1LocalVelocity.z = impulseGlider1.dot(glider1BaseForward);
		glider1LocalVelocity.x = impulseGlider1.dot(glider1ThrustersRight);
		glider1LocalVelocity.z = impulseGlider1.dot(glider1ThrustersForward);
	}
		


	// now that the glider1 has possibly moved again (due to physics interactions), record its new position minus its old position as a line segment
	glider1RaySegment.copy(glider1Base.position).sub(glider1OldPosition);
	glider1RaySegmentLength = glider1RaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the glider1's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	glider1RayOrigin.copy(glider1OldPosition); // must use glider's old position for this to work
	glider1RayDirection.copy(glider1RaySegment).normalize();

	
	// CHECK FOR GLIDER1 OUT-OF-BOUNDS (see if glider1's current position has left the course)
	
	// first check glider1 forward motion probe for intersection with course (a ray is cast from glider1's position in the direction of its forward motion)
	rayObjectOrigin.copy(glider1RayOrigin);
	rayObjectDirection.copy(glider1RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	
	// If the test t value from the raycast comes back smaller than the distance that the glider is trying to cover during
	//   this animation frame, that means that the glider's future position would step out of bounds of the course.
	//   Therefore, we must snap the glider back into position at the raycast intersectionPoint on the course surface.
	if (testT < glider1RaySegmentLength)
	{
		glider1IsInAir = false;
		glider1LocalVelocity.y = 0;
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(glider1RayOrigin, glider1RayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		glider1Base.position.copy(intersectionPoint);
		//glider1Base.updateMatrixWorld();
		glider1BaseUp.copy(intersectionNormal);
		glider1BaseRight.crossVectors(glider1BaseUp, glider1BaseForward).normalize();
		glider1BaseForward.crossVectors(glider1BaseRight, glider1BaseUp).normalize();
	}
	else if (testT == Infinity)
	{// bail out and snap the glider1 back to its starting position
		//console.log("Glider1 bailed out");
		glider1IsInAir = true;
		glider1LocalVelocity.set(0, 0, 0);
		glider1Base.position.copy(glider1StartingPosition);
		//glider1Base.updateMatrixWorld();
		glider1BaseRight.set(1, 0, 0);
		glider1BaseUp.set(0, 1, 0);
		glider1BaseForward.set(0, 0, 1);
	}
	

	// CHECK FOR GLIDER1 BASE vs. LARGE COURSE INTERACTIONS
	// handling these interactions is what makes the glider1 glide smoothly on the surface of the large course

	// check glider1 base center probe for intersection with course (a ray is cast from glider1's position downward towards the floor beneath)
	
	glider1RayOrigin.copy(glider1Base.position);
	glider1RayDirection.copy(glider1BaseUp).negate();

	rayObjectOrigin.copy(glider1RayOrigin);
	rayObjectDirection.copy(glider1RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	if (testT < Infinity)
	{
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(glider1RayOrigin, glider1RayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		glider1BaseUp.copy(intersectionNormal);
		glider1BaseRight.crossVectors(glider1BaseUp, glider1BaseForward).normalize();
		glider1BaseForward.crossVectors(glider1BaseRight, glider1BaseUp).normalize();
	}
	if (testT <= 1)
	{
		glider1IsInAir = false;
		glider1LocalVelocity.y = 0;
		glider1Base.position.copy(intersectionPoint);
	}
	if (testT > 1) // " > 1.01" instead of " > 1" to account for floating point precision
	{
		glider1IsInAir = true;
	}
	/* if (testT == Infinity)
	{// bail out and snap the glider1 back to its old position
		console.log("Glider1 base could not intersect with the ground below it");
		glider1Base.position.copy(glider1OldPosition);
	} */

	

	// now that the glider1 position is in its final place for this frame, copy it to glider1OldPosition
	glider1OldPosition.copy(glider1Base.position);

	// build up a rotation matrix, using the glider's 3 basis vectors (right,up,forward) that were calculated as it moves around the course
	glider1RotationMatrix.makeBasis(glider1BaseRight, glider1BaseUp, glider1BaseForward);
	glider1Base.rotation.setFromRotationMatrix(glider1RotationMatrix);
	glider1Base.updateMatrixWorld();
	// copy glider's transform into the 'Thrusters' transform, which is kind of like a space vehicle's rocket engine propellant in the back
	glider1Thrusters.position.copy(glider1Base.position);
	glider1Thrusters.rotation.copy(glider1Base.rotation);
	glider1Thrusters.scale.copy(glider1Base.scale);
	// the glider's thrusters can rotate separately from the glider's fixed base, which only slowly rotates as glider moves around the course
	glider1Thrusters.rotateY(inputRotationHorizontal); // allows player to rotate the glider with mouse
	glider1Thrusters.updateMatrixWorld();
	glider1Thrusters.matrixWorld.extractBasis(glider1ThrustersRight, glider1ThrustersUp, glider1ThrustersForward);
	glider1ThrustersRight.normalize(); glider1ThrustersUp.normalize(); glider1ThrustersForward.normalize();


	// temporarily move glider up out of the ground for final render
	glider1Thrusters.position.addScaledVector(glider1ThrustersUp, 8);
	
	// move 3rd-person camera back and up from player's glider
	cameraControlsObject.position.copy(glider1Thrusters.position);
	cameraControlsObject.position.addScaledVector(glider1ThrustersForward, 70);
	cameraControlsObject.position.addScaledVector(glider1ThrustersUp, 20);
	// match the 3rd-person camera rotation to player's glider rotation
	cameraControlsObject.rotation.copy(glider1Thrusters.rotation);
	cameraControlsPitchObject.rotation.x = inputRotationVertical; // glider doesn't rotate on x axis, but camera can (look up and down)
	// rotate glider paraboloid (temporary stand-in for more complex game model), so its apex faces in the forward direction
	glider1Thrusters.rotateX(-Math.PI * 0.5);
	glider1Thrusters.updateMatrixWorld();

	// send final Glider transform (as an inverted matrix), so that the ray tracer can render it in the correct position and orientation
	pathTracingUniforms.uGlider1InvMatrix.value.copy(glider1Thrusters.matrixWorld).invert();

	// after rendering, reset glider position back down so that its center is right on the ground (this helps with ray casting against large course)
	glider1Thrusters.position.addScaledVector(glider1ThrustersUp, -8);
	// after rendering, reset glider rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	glider1Thrusters.rotateX(Math.PI * 0.5);
	glider1Thrusters.updateMatrixWorld();
	
		


	// UPDATE GLIDER 2 ////////////////////////////////////////////////////////////////////////////////


	// if glider2 is on the ground (touching the large course), allow computer player to jump again
	if (!glider2IsInAir)
	{
		glider2LocalVelocity.y = 0;
		glider2IsAcceleratingUp = false;
		//canPress_Space = true;
	}
	// if in air, apply gravity (actually anti-gravity: pulls Glider2 down to the large course surface in all directions)
	if (glider2IsInAir)
	{
		//canPress_Space = false;
		glider2LocalVelocity.y -= (200 * frameTime);
		glider2IsAcceleratingUp = true;
	}
	// if a legal jump action was triggered, apply a short, upward impulse to glider2
	/* if (jumpWasTriggered)
	{
		glider2IsInAir = true;
		glider2LocalVelocity.y = 150;
		glider2IsAcceleratingUp = true;
		jumpWasTriggered = false;
	} */
	
	// apply friction to glider2
	if (!glider2IsAcceleratingForward && !glider2IsAcceleratingUp && !glider2IsAcceleratingRight)
	{
		glider2LocalVelocity.z -= (glider2LocalVelocity.z * 1 * frameTime);
		glider2LocalVelocity.x -= (glider2LocalVelocity.x * 1 * frameTime);
	}

	// the following gives a very slight invisible movement to glider2, so that a ray can be created from its old position to its new position 
	if (Math.abs(glider2LocalVelocity.x) < 0.0001 && Math.abs(glider2LocalVelocity.z) < 0.0001)
	{
		glider2LocalVelocity.x = (Math.random() * 2 - 1) * 0.001;
		glider2LocalVelocity.z = (Math.random() * 2 - 1) * 0.001;
	}
		

	// update glider2 position

	// use for more accurate floating glider physics simulation
	/* glider2WorldVelocity.set(0, 0, 0);
	glider2WorldVelocity.addScaledVector(glider2BaseRight, glider2LocalVelocity.x);
	glider2WorldVelocity.addScaledVector(glider2BaseUp, glider2LocalVelocity.y);
	glider2WorldVelocity.addScaledVector(glider2BaseForward, glider2LocalVelocity.z);
	
	glider2Base.position.addScaledVector(glider2WorldVelocity, frameTime); */

	// or use for constantly-steerable glider
	glider2WorldVelocity.set(0, 0, 0);
	glider2WorldVelocity.addScaledVector(glider2ThrustersRight, glider2LocalVelocity.x);
	glider2WorldVelocity.addScaledVector(glider2ThrustersUp, glider2LocalVelocity.y);
	glider2WorldVelocity.addScaledVector(glider2ThrustersForward, glider2LocalVelocity.z);
	
	glider2Base.position.addScaledVector(glider2WorldVelocity, frameTime);
	

	// now that the glider2 has moved, record its new position minus its old position as a line segment
	glider2RaySegment.copy(glider2Base.position).sub(glider2OldPosition);
	glider2RaySegmentLength = glider2RaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the glider2's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	glider2RayOrigin.copy(glider2OldPosition); // must use glider2's old position for this to work
	glider2RayDirection.copy(glider2RaySegment).normalize();


	// PHYSICS for Glider2 vs. Glider1

	glider2CollisionVolume.position.copy(glider2OldPosition);
	///glider2CollisionVolume.position.addScaledVector(glider2BaseUp, 15);
	///glider2CollisionVolume.rotation.copy(glider2Base.rotation);
	glider2CollisionVolume.updateMatrixWorld();
	glider2_invMatrix.copy(glider2CollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uGlider2CollisionVolumeInvMatrix.value.copy(glider2_invMatrix);

	rayObjectOrigin.copy(glider2RayOrigin);
	///rayObjectOrigin.addScaledVector(glider2BaseUp, 15);
	rayObjectDirection.copy(glider2RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of Glider1
	glider1CollisionVolume.position.copy(glider1Base.position);
	///glider1CollisionVolume.position.addScaledVector(glider1BaseUp, 15);
	///glider1CollisionVolume.rotation.copy(glider1Base.rotation);
	glider1CollisionVolume.scale.multiplyScalar(2);
	glider1CollisionVolume.updateMatrixWorld();
	glider1_invMatrix.copy(glider1CollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uGlider1CollisionVolumeInvMatrix.value.copy(glider1_invMatrix);
	glider1CollisionVolume.scale.multiplyScalar(1/2);
	glider1CollisionVolume.updateMatrixWorld();
	rayObjectOrigin.transformAsPoint(glider1_invMatrix);
	rayObjectDirection.transformAsDirection(glider1_invMatrix);

	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < glider2RaySegmentLength)// || testT < 10)
	{
		collisionNormal.subVectors(glider2Base.position, glider1Base.position);
		relativeVelocity.subVectors(glider2WorldVelocity, glider1WorldVelocity);
		rV_dot_cN = relativeVelocity.dot(collisionNormal);

		if (rV_dot_cN < 0)
		{
			//console.log("collision detected");
			collisionCounter++;
			unitCollisionNormal.copy(collisionNormal).normalize();
			intersectionPoint.getPointAlongRay(glider2RayOrigin, glider2RayDirection, testT);
			glider2Base.position.copy(intersectionPoint);
			//glider2Base.position.addScaledVector(glider2BaseUp, -15);
			glider2Base.position.addScaledVector(unitCollisionNormal, glider2CollisionVolume.scale.x);
			//glider2Base.updateMatrixWorld();

			combinedInverseMasses = 1 / (gliderMass + gliderMass);
			impulseAmount = -2 * 0.02 * rV_dot_cN * combinedInverseMasses; // / collisionNormal.dot(collisionNormal);
			unitCollisionNormal.multiplyScalar(impulseAmount);
			impulseGlider2.copy(unitCollisionNormal).multiplyScalar(gliderMass);
			impulseGlider1.copy(unitCollisionNormal).multiplyScalar(-gliderMass);
			
			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider2LocalVelocity.x += impulseGlider2.dot(glider2BaseRight);
			// glider2LocalVelocity.y += impulseGlider2.dot(glider2BaseUp);
			// glider2LocalVelocity.z += impulseGlider2.dot(glider2BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider2LocalVelocity.x += impulseGlider2.dot(glider2ThrustersRight);
			glider2LocalVelocity.y += impulseGlider2.dot(glider2ThrustersUp);
			glider2LocalVelocity.z += impulseGlider2.dot(glider2ThrustersForward);

			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider1LocalVelocity.x += impulseGlider1.dot(glider1BaseRight);
			// glider1LocalVelocity.y += impulseGlider1.dot(glider1BaseUp);
			// glider1LocalVelocity.z += impulseGlider1.dot(glider1BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider1LocalVelocity.x += impulseGlider1.dot(glider1ThrustersRight);
			glider1LocalVelocity.y += impulseGlider1.dot(glider1ThrustersUp);
			glider1LocalVelocity.z += impulseGlider1.dot(glider1ThrustersForward);
		}
	}


	// PHYSICS for Glider2 vs. Ball

	rayObjectOrigin.copy(glider2RayOrigin);
	///rayObjectOrigin.addScaledVector(glider2BaseUp, 15);
	rayObjectDirection.copy(glider2RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the ball
	ballCollisionVolume.position.copy(ball.position);
	///ballCollisionVolume.position.addScaledVector(ballUp, 15);
	///ballCollisionVolume.rotation.copy(ball.rotation);
	ballCollisionVolume.updateMatrixWorld();
	ball_invMatrix.copy(ballCollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uBallCollisionVolumeInvMatrix.value.copy(ball_invMatrix);
	rayObjectOrigin.transformAsPoint(ball_invMatrix);
	rayObjectDirection.transformAsDirection(ball_invMatrix);

	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < glider2RaySegmentLength)// || testT < 10)
	{
		collisionNormal.subVectors(glider2Base.position, ball.position);
		relativeVelocity.subVectors(glider2WorldVelocity, ballWorldVelocity);
		rV_dot_cN = relativeVelocity.dot(collisionNormal);

		if (rV_dot_cN < 0)
		{
			//console.log("collision detected");
			collisionCounter++;
			unitCollisionNormal.copy(collisionNormal).normalize();
			intersectionPoint.getPointAlongRay(glider2RayOrigin, glider2RayDirection, testT);
			glider2Base.position.copy(intersectionPoint);
			///glider2Base.position.addScaledVector(glider2BaseUp, -15);
			glider2Base.position.addScaledVector(unitCollisionNormal, glider2CollisionVolume.scale.x);
			//glider2Base.updateMatrixWorld();

			combinedInverseMasses = 1 / (gliderMass + ballMass);
			impulseAmount = -2 * 0.04 * rV_dot_cN * combinedInverseMasses;// / collisionNormal.dot(collisionNormal);
			unitCollisionNormal.multiplyScalar(impulseAmount);
			impulseGlider2.copy(unitCollisionNormal).multiplyScalar(ballMass);
			impulseBall.copy(unitCollisionNormal).multiplyScalar(-gliderMass);
			
			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider2LocalVelocity.x += impulseGlider2.dot(glider2BaseRight);
			// glider2LocalVelocity.y += impulseGlider2.dot(glider2BaseUp);
			// glider2LocalVelocity.z += impulseGlider2.dot(glider2BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider2LocalVelocity.x += impulseGlider2.dot(glider2ThrustersRight);
			glider2LocalVelocity.y += impulseGlider2.dot(glider2ThrustersUp);
			glider2LocalVelocity.z += impulseGlider2.dot(glider2ThrustersForward);

			ballLocalVelocity.x += impulseBall.dot(ballRight);
			ballLocalVelocity.y += impulseBall.dot(ballUp);
			ballLocalVelocity.z += impulseBall.dot(ballForward);
		}
	}


	// CHECK FOR GLIDER2 vs MIN/MAX BOUNDARY WALLS
	
	if (glider2Base.position.x > courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x))
	{
		glider2Base.position.x = courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x);
		unitCollisionNormal.set(-1, 0, 0);
		impulseGlider2.copy(glider2WorldVelocity);
		impulseGlider2.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider2).normalize();
		impulseGlider2.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider2LocalVelocity.x = impulseGlider2.dot(glider2BaseRight);
		// glider2LocalVelocity.z = impulseGlider2.dot(glider2BaseForward);
		glider2LocalVelocity.x = impulseGlider2.dot(glider2ThrustersRight);
		glider2LocalVelocity.z = impulseGlider2.dot(glider2ThrustersForward);
	}
	if (glider2Base.position.x < courseShape.position.x + (courseShape.scale.x * courseMinBounds.x))
	{
		glider2Base.position.x = courseShape.position.x + (courseShape.scale.x * courseMinBounds.x);
		unitCollisionNormal.set(1, 0, 0);
		impulseGlider2.copy(glider2WorldVelocity);
		impulseGlider2.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider2).normalize();
		impulseGlider2.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider2LocalVelocity.x = impulseGlider2.dot(glider2BaseRight);
		// glider2LocalVelocity.z = impulseGlider2.dot(glider2BaseForward);
		glider2LocalVelocity.x = impulseGlider2.dot(glider2ThrustersRight);
		glider2LocalVelocity.z = impulseGlider2.dot(glider2ThrustersForward);
	}
	if (glider2Base.position.y > courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y))
	{
		glider2Base.position.y = courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y);
		unitCollisionNormal.set(0, -1, 0);
		impulseGlider2.copy(glider2WorldVelocity);
		impulseGlider2.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider2).normalize();
		impulseGlider2.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider2LocalVelocity.x = impulseGlider2.dot(glider2BaseRight);
		// glider2LocalVelocity.z = impulseGlider2.dot(glider2BaseForward);
		glider2LocalVelocity.x = impulseGlider2.dot(glider2ThrustersRight);
		glider2LocalVelocity.z = impulseGlider2.dot(glider2ThrustersForward);
	}
	if (glider2Base.position.y < courseShape.position.y + (courseShape.scale.y * courseMinBounds.y))
	{
		glider2Base.position.y = courseShape.position.y + (courseShape.scale.y * courseMinBounds.y);
		unitCollisionNormal.set(0, 1, 0);
		impulseGlider2.copy(glider2WorldVelocity);
		impulseGlider2.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider2).normalize();
		impulseGlider2.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider2LocalVelocity.x = impulseGlider2.dot(glider2BaseRight);
		// glider2LocalVelocity.z = impulseGlider2.dot(glider2BaseForward);
		glider2LocalVelocity.x = impulseGlider2.dot(glider2ThrustersRight);
		glider2LocalVelocity.z = impulseGlider2.dot(glider2ThrustersForward);
	}
	if (glider2Base.position.z > courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z))
	{
		glider2Base.position.z = courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z);
		unitCollisionNormal.set(0, 0, -1);
		impulseGlider2.copy(glider2WorldVelocity);
		impulseGlider2.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider2).normalize();
		impulseGlider2.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider2LocalVelocity.x = impulseGlider2.dot(glider2BaseRight);
		// glider2LocalVelocity.z = impulseGlider2.dot(glider2BaseForward);
		glider2LocalVelocity.x = impulseGlider2.dot(glider2ThrustersRight);
		glider2LocalVelocity.z = impulseGlider2.dot(glider2ThrustersForward);
	}
	if (glider2Base.position.z < courseShape.position.z + (courseShape.scale.z * courseMinBounds.z))
	{
		glider2Base.position.z = courseShape.position.z + (courseShape.scale.z * courseMinBounds.z);
		unitCollisionNormal.set(0, 0, 1);
		impulseGlider2.copy(glider2WorldVelocity);
		impulseGlider2.reflect(unitCollisionNormal);
		tempVec.copy(impulseGlider2).normalize();
		impulseGlider2.multiplyScalar( Math.max(0.3, 1-tempVec.dot(unitCollisionNormal)) );
		// glider2LocalVelocity.x = impulseGlider2.dot(glider2BaseRight);
		// glider2LocalVelocity.z = impulseGlider2.dot(glider2BaseForward);
		glider2LocalVelocity.x = impulseGlider2.dot(glider2ThrustersRight);
		glider2LocalVelocity.z = impulseGlider2.dot(glider2ThrustersForward);
	}



	// now that the glider2 has possibly moved again (due to physics interactions), record its new position minus its old position as a line segment
	glider2RaySegment.copy(glider2Base.position).sub(glider2OldPosition);
	glider2RaySegmentLength = glider2RaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the glider2's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	glider2RayOrigin.copy(glider2OldPosition); // must use glider2's old position for this to work
	glider2RayDirection.copy(glider2RaySegment).normalize();


	// CHECK FOR GLIDER2 OUT-OF-BOUNDS (see if glider2's current position has left the course)

	// first check glider2 forward motion probe for intersection with course (a ray is cast from glider2's position in the direction of its forward motion)
	rayObjectOrigin.copy(glider2RayOrigin);
	rayObjectDirection.copy(glider2RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	// If the test t value from the raycast comes back smaller than the distance that the glider2 is trying to cover during
	//   this animation frame, that means that the glider2's future position would step out of bounds of the course.
	//   Therefore, we must snap the glider back into position at the raycast intersectionPoint on the course surface.
	if (testT < glider2RaySegmentLength)
	{
		glider2IsInAir = false;
		glider2LocalVelocity.y = 0;
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(glider2RayOrigin, glider2RayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		glider2Base.position.copy(intersectionPoint);
		glider2BaseUp.copy(intersectionNormal);
		glider2BaseRight.crossVectors(glider2BaseUp, glider2BaseForward).normalize();
		glider2BaseForward.crossVectors(glider2BaseRight, glider2BaseUp).normalize();
	}
	else if (testT == Infinity)
	{// bail out and snap the glider2 back to its starting position
		//console.log("Glider2 bailed out");
		glider2IsInAir = true;
		glider2LocalVelocity.set(0, 0, 0);
		glider2Base.position.copy(glider2StartingPosition);
		glider2BaseRight.set(1, 0, 0);
		glider2BaseUp.set(0, 1, 0);
		glider2BaseForward.set(0, 0, 1);
	}


	// CHECK FOR GLIDER2 BASE vs. LARGE COURSE INTERACTIONS
	// handling these interactions is what makes the glider2 glide smoothly on the surface of the large course

	// now check glider2 base center probe for intersection with course (a ray is cast from glider2's position downward towards the floor beneath)
	
	glider2RayOrigin.copy(glider2Base.position);
	glider2RayDirection.copy(glider2BaseUp).negate();

	rayObjectOrigin.copy(glider2RayOrigin);
	rayObjectDirection.copy(glider2RayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	if (testT < Infinity)
	{
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(glider2RayOrigin, glider2RayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		glider2BaseUp.copy(intersectionNormal);
		glider2BaseRight.crossVectors(glider2BaseUp, glider2BaseForward).normalize();
		glider2BaseForward.crossVectors(glider2BaseRight, glider2BaseUp).normalize();
	}
	if (testT <= 1)
	{
		glider2IsInAir = false;
		glider2LocalVelocity.y = 0;
		glider2Base.position.copy(intersectionPoint);
	}
	if (testT > 1) // " > 1.01" instead of " > 1" to account for floating point precision
	{
		glider2IsInAir = true;
	}
	/* if (testT == Infinity)
	{// bail out and snap the glider2 back to its old position
		console.log("Glider2 base could not intersect with the ground below it");
		glider2Base.position.copy(glider2OldPosition);
	} */


	// now that the glider2 position is in its final place for this frame, copy it to glider2OldPosition
	glider2OldPosition.copy(glider2Base.position);

	glider2RotationMatrix.makeBasis(glider2BaseRight, glider2BaseUp, glider2BaseForward);
	glider2Base.rotation.setFromRotationMatrix(glider2RotationMatrix);
	glider2Base.updateMatrixWorld();
	
	glider2Thrusters.position.copy(glider2Base.position);
	glider2Thrusters.rotation.copy(glider2Base.rotation);
	glider2Thrusters.scale.copy(glider2Base.scale);

	glider2Thrusters.rotateY(Math.PI);
	glider2Thrusters.rotateY(inputRotationHorizontal);
	//glider2Thrusters.rotateY(ballYRotateAngle);
	glider2Thrusters.updateMatrixWorld();
	glider2Thrusters.matrixWorld.extractBasis(glider2ThrustersRight, glider2ThrustersUp, glider2ThrustersForward);
	glider2ThrustersRight.normalize(); glider2ThrustersUp.normalize(); glider2ThrustersForward.normalize();

	
	// temporarily move glider2 up out of the ground for final render
	glider2Thrusters.position.addScaledVector(glider2ThrustersUp, 8);

	// cameraControlsObject.position.copy(glider2Thrusters.position);
	// cameraControlsObject.position.addScaledVector(glider2ThrustersForward, 70);
	// cameraControlsObject.position.addScaledVector(glider2ThrustersUp, 20);
	// cameraControlsObject.rotation.copy(glider2Thrusters.rotation);
	// cameraControlsPitchObject.rotation.x = inputRotationVertical;

	// rotate glider2 paraboloid (temporary stand-in for more complex game model), so its apex faces in the forward direction
	glider2Thrusters.rotateX(-Math.PI * 0.5);
	glider2Thrusters.updateMatrixWorld();

	// send final Glider2 transform (as an inverted matrix), so that the ray tracer can render it in the correct position and orientation
	pathTracingUniforms.uGlider2InvMatrix.value.copy(glider2Thrusters.matrixWorld).invert();

	// after rendering, reset glider2 position back down so that its center is right on the ground (this helps with ray casting against course)
	glider2Thrusters.position.addScaledVector(glider2ThrustersUp, -8);
	// after rendering, reset glider2 rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	glider2Thrusters.rotateX(Math.PI * 0.5);
	glider2Thrusters.updateMatrixWorld();
		
	


	// UPDATE BALL ///////////////////////////////////////////////////////////////////////////////////

	// if in air, apply gravity (actually anti-gravity: pulls ball down to the large course surface in all directions)
	if (ballIsInAir)
	{
		ballLocalVelocity.y -= (200 * frameTime);
	}

	// the following gives a very slight invisible movement to the ball, so that a ray can be created from its old position to its new position 
	if (Math.abs(ballLocalVelocity.x) < 0.0001 && Math.abs(ballLocalVelocity.z) < 0.0001)
	{
		ballLocalVelocity.x = (Math.random() * 2 - 1) * 0.001;
		ballLocalVelocity.z = (Math.random() * 2 - 1) * 0.001;
	}
		

	ballWorldVelocity.set(0, 0, 0);
	ballWorldVelocity.addScaledVector(ballRight, ballLocalVelocity.x);
	ballWorldVelocity.addScaledVector(ballUp, ballLocalVelocity.y);
	ballWorldVelocity.addScaledVector(ballForward, ballLocalVelocity.z);
	
	ball.position.addScaledVector(ballWorldVelocity, frameTime);


	// now that the ball has moved, record its new position minus its old position as a line segment
	ballRaySegment.copy(ball.position).sub(ballOldPosition);
	ballRaySegmentLength = ballRaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the ball's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	ballRayOrigin.copy(ballOldPosition); // must use ball's old position for this to work
	ballRayDirection.copy(ballRaySegment).normalize();

	// check for collision between ball and computer A.I.'s goal (red goal)

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the computer A.I.'s goal box
	computerGoal_invMatrix.copy(computerGoal.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(computerGoal_invMatrix);
	rayObjectDirection.transformAsDirection(computerGoal_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the goal box using a more simple unit-box intersection routine
	testT = raycastUnitBox(rayObjectOrigin, rayObjectDirection);
	// If the test t value from the raycast comes back smaller than the distance that the ball is trying to cover during
	//   this animation frame, that means that the ball's future position would step beyond the goal box.
	//   Therefore, a goal has been made - reset the ball to its starting position
	if (testT < ballRaySegmentLength)
	{
		ballIsInAir = true;
		ballLocalVelocity.set(0, 0, 0);
		ball.position.copy(ballStartingPosition);
		ballRight.set(1, 0, 0);
		ballUp.set(0, 1, 0);
		ballForward.set(0, 0, 1);
	}

	// check for collision between ball and player's goal (blue goal)

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the player's goal box
	playerGoal_invMatrix.copy(playerGoal.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(playerGoal_invMatrix);
	rayObjectDirection.transformAsDirection(playerGoal_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the goal box using a more simple unit-box intersection routine
	testT = raycastUnitBox(rayObjectOrigin, rayObjectDirection);
	// If the test t value from the raycast comes back smaller than the distance that the ball is trying to cover during
	//   this animation frame, that means that the ball's future position would step beyond the goal box.
	//   Therefore, a goal has been made - reset the ball to its starting position
	if (testT < ballRaySegmentLength)
	{
		ballIsInAir = true;
		ballLocalVelocity.set(0, 0, 0);
		ball.position.copy(ballStartingPosition);
		ballRight.set(1, 0, 0);
		ballUp.set(0, 1, 0);
		ballForward.set(0, 0, 1);
	}


	// PHYSICS for Ball vs. Glider1

	rayObjectOrigin.copy(ballRayOrigin);
	///rayObjectOrigin.addScaledVector(ballUp, 15);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of Glider1
	glider1CollisionVolume.position.copy(glider1Base.position);
	///glider1CollisionVolume.position.addScaledVector(glider1BaseUp, 15);
	///glider1CollisionVolume.rotation.copy(glider1Base.rotation);
	glider1CollisionVolume.scale.multiplyScalar(2);
	glider1CollisionVolume.updateMatrixWorld();
	glider1_invMatrix.copy(glider1CollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uGlider1CollisionVolumeInvMatrix.value.copy(glider1_invMatrix);
	glider1CollisionVolume.scale.multiplyScalar(1/2);
	glider1CollisionVolume.updateMatrixWorld();
	rayObjectOrigin.transformAsPoint(glider1_invMatrix);
	rayObjectDirection.transformAsDirection(glider1_invMatrix);

	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < ballRaySegmentLength)// || testT < 10)
	{
		collisionNormal.subVectors(ball.position, glider1Base.position);
		relativeVelocity.subVectors(ballWorldVelocity, glider1WorldVelocity);
		rV_dot_cN = relativeVelocity.dot(collisionNormal);

		if (rV_dot_cN < 0)
		{
			//console.log("collision detected");
			collisionCounter++;
			unitCollisionNormal.copy(collisionNormal).normalize();
			intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
			ball.position.copy(intersectionPoint);
			///ball.position.addScaledVector(ballUp, -15);
			ball.position.addScaledVector(unitCollisionNormal, ballCollisionVolume.scale.x);
			//ball.updateMatrixWorld();

			combinedInverseMasses = 1 / (ballMass + gliderMass);
			impulseAmount = -2 * 0.02 * rV_dot_cN * combinedInverseMasses;// / collisionNormal.dot(collisionNormal);
			unitCollisionNormal.multiplyScalar(impulseAmount);
			impulseBall.copy(unitCollisionNormal).multiplyScalar(gliderMass);
			impulseGlider1.copy(unitCollisionNormal).multiplyScalar(-ballMass);
			
			ballLocalVelocity.x += impulseBall.dot(ballRight);
			ballLocalVelocity.y += impulseBall.dot(ballUp);
			ballLocalVelocity.z += impulseBall.dot(ballForward);

			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider1LocalVelocity.x += impulseGlider1.dot(glider1BaseRight);
			// glider1LocalVelocity.y += impulseGlider1.dot(glider1BaseUp);
			// glider1LocalVelocity.z += impulseGlider1.dot(glider1BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider1LocalVelocity.x += impulseGlider1.dot(glider1ThrustersRight);
			glider1LocalVelocity.y += impulseGlider1.dot(glider1ThrustersUp);
			glider1LocalVelocity.z += impulseGlider1.dot(glider1ThrustersForward);
		}
	}

	// PHYSICS for Ball vs. Glider2

	rayObjectOrigin.copy(ballRayOrigin);
	///rayObjectOrigin.addScaledVector(ballUp, 15);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of Glider2
	glider2CollisionVolume.position.copy(glider2Base.position);
	///glider2CollisionVolume.position.addScaledVector(glider2BaseUp, 15);
	///glider2CollisionVolume.rotation.copy(glider2Base.rotation);
	glider2CollisionVolume.scale.multiplyScalar(2);
	glider2CollisionVolume.updateMatrixWorld();
	glider2_invMatrix.copy(glider2CollisionVolume.matrixWorld).invert(); // only needed if this object moves
	pathTracingUniforms.uGlider2CollisionVolumeInvMatrix.value.copy(glider2_invMatrix);
	glider2CollisionVolume.scale.multiplyScalar(1/2);
	glider2CollisionVolume.updateMatrixWorld();
	rayObjectOrigin.transformAsPoint(glider2_invMatrix);
	rayObjectDirection.transformAsDirection(glider2_invMatrix);

	testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	if (testT < ballRaySegmentLength)// || testT < 10)
	{
		collisionNormal.subVectors(ball.position, glider2Base.position);
		relativeVelocity.subVectors(ballWorldVelocity, glider2WorldVelocity);
		rV_dot_cN = relativeVelocity.dot(collisionNormal);

		if (rV_dot_cN < 0)
		{
			//console.log("collision detected");
			collisionCounter++;
			unitCollisionNormal.copy(collisionNormal).normalize();
			intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
			ball.position.copy(intersectionPoint);
			///ball.position.addScaledVector(ballUp, -15);
			ball.position.addScaledVector(unitCollisionNormal, ballCollisionVolume.scale.x);
			//ball.updateMatrixWorld();

			combinedInverseMasses = 1 / (ballMass + gliderMass);
			impulseAmount = -2 * 0.02 * rV_dot_cN * combinedInverseMasses;// / collisionNormal.dot(collisionNormal);
			unitCollisionNormal.multiplyScalar(impulseAmount);
			impulseBall.copy(unitCollisionNormal).multiplyScalar(gliderMass);
			impulseGlider2.copy(unitCollisionNormal).multiplyScalar(-ballMass);
			
			ballLocalVelocity.x += impulseBall.dot(ballRight);
			ballLocalVelocity.y += impulseBall.dot(ballUp);
			ballLocalVelocity.z += impulseBall.dot(ballForward);

			// use for physics-based floating glider with momentum (more realistic but harder to handle)
			// glider2LocalVelocity.x += impulseGlider2.dot(glider2BaseRight);
			// glider2LocalVelocity.y += impulseGlider2.dot(glider2BaseUp);
			// glider2LocalVelocity.z += impulseGlider2.dot(glider2BaseForward);
			// use for constantly steerable glider (less realistic, but easier to handle)
			glider2LocalVelocity.x += impulseGlider2.dot(glider2ThrustersRight);
			glider2LocalVelocity.y += impulseGlider2.dot(glider2ThrustersUp);
			glider2LocalVelocity.z += impulseGlider2.dot(glider2ThrustersForward);
		}
	}


	// CHECK FOR BALL vs MIN/MAX BOUNDARY WALLS
	
	if (ball.position.x > courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x))
	{
		ball.position.x = courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x);
		unitCollisionNormal.set(-1, 0, 0);
		impulseBall.copy(ballWorldVelocity);
		impulseBall.reflect(unitCollisionNormal);
		tempVec.copy(impulseBall).normalize();
		impulseBall.multiplyScalar( Math.max(0.5, 1-tempVec.dot(unitCollisionNormal)) );
		ballLocalVelocity.x = impulseBall.dot(ballRight);
		ballLocalVelocity.z = impulseBall.dot(ballForward);
	}
	if (ball.position.x < courseShape.position.x + (courseShape.scale.x * courseMinBounds.x))
	{
		ball.position.x = courseShape.position.x + (courseShape.scale.x * courseMinBounds.x);
		unitCollisionNormal.set(1, 0, 0);
		impulseBall.copy(ballWorldVelocity);
		impulseBall.reflect(unitCollisionNormal);
		tempVec.copy(impulseBall).normalize();
		impulseBall.multiplyScalar( Math.max(0.5, 1-tempVec.dot(unitCollisionNormal)) );
		ballLocalVelocity.x = impulseBall.dot(ballRight);
		ballLocalVelocity.z = impulseBall.dot(ballForward);
	}
	if (ball.position.y > courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y))
	{
		ball.position.y = courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y);
		unitCollisionNormal.set(0, -1, 0);
		impulseBall.copy(ballWorldVelocity);
		impulseBall.reflect(unitCollisionNormal);
		tempVec.copy(impulseBall).normalize();
		impulseBall.multiplyScalar( Math.max(0.5, 1-tempVec.dot(unitCollisionNormal)) );
		ballLocalVelocity.x = impulseBall.dot(ballRight);
		ballLocalVelocity.z = impulseBall.dot(ballForward);
	}
	if (ball.position.y < courseShape.position.y + (courseShape.scale.y * courseMinBounds.y))
	{
		ball.position.y = courseShape.position.y + (courseShape.scale.y * courseMinBounds.y);
		unitCollisionNormal.set(0, 1, 0);
		impulseBall.copy(ballWorldVelocity);
		impulseBall.reflect(unitCollisionNormal);
		tempVec.copy(impulseBall).normalize();
		impulseBall.multiplyScalar( Math.max(0.5, 1-tempVec.dot(unitCollisionNormal)) );
		ballLocalVelocity.x = impulseBall.dot(ballRight);
		ballLocalVelocity.z = impulseBall.dot(ballForward);
	}
	if (ball.position.z > courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z))
	{
		ball.position.z = courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z);
		unitCollisionNormal.set(0, 0, -1);
		impulseBall.copy(ballWorldVelocity);
		impulseBall.reflect(unitCollisionNormal);
		tempVec.copy(impulseBall).normalize();
		impulseBall.multiplyScalar( Math.max(0.5, 1-tempVec.dot(unitCollisionNormal)) );
		ballLocalVelocity.x = impulseBall.dot(ballRight);
		ballLocalVelocity.z = impulseBall.dot(ballForward);
	}
	if (ball.position.z < courseShape.position.z + (courseShape.scale.z * courseMinBounds.z))
	{
		ball.position.z = courseShape.position.z + (courseShape.scale.z * courseMinBounds.z);
		unitCollisionNormal.set(0, 0, 1);
		impulseBall.copy(ballWorldVelocity);
		impulseBall.reflect(unitCollisionNormal);
		tempVec.copy(impulseBall).normalize();
		impulseBall.multiplyScalar( Math.max(0.5, 1-tempVec.dot(unitCollisionNormal)) );
		ballLocalVelocity.x = impulseBall.dot(ballRight);
		ballLocalVelocity.z = impulseBall.dot(ballForward);
	}



	// now that the ball has possibly moved again (due to physics interactions), record its new position minus its old position as a line segment
	ballRaySegment.copy(ball.position).sub(ballOldPosition);
	ballRaySegmentLength = ballRaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the ball's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	ballRayOrigin.copy(ballOldPosition); // must use ball's old position for this to work
	ballRayDirection.copy(ballRaySegment).normalize();


	// CHECK FOR BALL OUT-OF-BOUNDS (see if ball's current position has left the course)

	// first check ball forward motion probe for intersection with course (a ray is cast from ball's position in the direction of its forward motion)
	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	// If the test t value from the raycast comes back smaller than the distance that the ball is trying to cover during
	//   this animation frame, that means that the ball's future position would step out of bounds of the course.
	//   Therefore, we must snap the ball back into position at the raycast intersectionPoint on the course surface.
	if (testT < ballRaySegmentLength)
	{
		ballIsInAir = false;
		ballLocalVelocity.y = 0;
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		ball.position.copy(intersectionPoint);
		ballUp.copy(intersectionNormal);
		ballRight.crossVectors(ballUp, ballForward).normalize();
		ballForward.crossVectors(ballRight, ballUp).normalize();
	}
	else if (testT == Infinity)
	{// bail out and snap the ball back to its starting position
		//console.log("Ball bailed out");
		ballIsInAir = true;
		ballLocalVelocity.set(0, 0, 0);
		ball.position.copy(ballStartingPosition);
		ballRight.set(1, 0, 0);
		ballUp.set(0, 1, 0);
		ballForward.set(0, 0, 1);
	}
	

	// CHECK FOR BALL vs. LARGE COURSE INTERACTIONS
	// handling these interactions is what makes the ball glide smoothly on the surface of the large course
	
	// now check ball base center probe for intersection with course (a ray is cast from ball's position downward towards the floor beneath)
	
	ballRayOrigin.copy(ball.position);
	ballRayDirection.copy(ballUp).negate();

	rayObjectOrigin.copy(ballRayOrigin);
	rayObjectDirection.copy(ballRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	if (testT < Infinity)
	{
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(ballRayOrigin, ballRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		ballUp.copy(intersectionNormal);
		ballRight.crossVectors(ballUp, ballForward).normalize();
		ballForward.crossVectors(ballRight, ballUp).normalize();	
	}
	if (testT <= 1)
	{
		ballIsInAir = false;
		ballLocalVelocity.y = 0;
		ball.position.copy(intersectionPoint);
	}
	if (testT > 1) // " > 1.01" instead of " > 1" to account for floating point precision
	{
		ballIsInAir = true;
	}
	/* if (testT == Infinity)
	{// bail out and snap the ball back to its old position
		console.log("Ball could not intersect with the ground below it");
		ball.position.copy(ballOldPosition);
	} */
	
	
	// apply friction to ball
	if (!ballIsInAir)
	{
		ballLocalVelocity.z -= (ballLocalVelocity.z * 0.7 * frameTime);
		ballLocalVelocity.x -= (ballLocalVelocity.x * 0.7 * frameTime);
	}


	ballOldPosition.copy(ball.position);

	ballRotationMatrix.makeBasis(ballRight, ballUp, ballForward);
	ball.rotation.setFromRotationMatrix(ballRotationMatrix);
	ball.updateMatrixWorld();

	// temporarily move ball up out of the ground for final render
	ball.position.addScaledVector(ballUp, 15);
	//ball.updateMatrixWorld();

	
	ballYRotateAngle += 1 * frameTime;
	ballYRotateAngle %= TWO_PI;
	ball.rotateY(ballYRotateAngle);
	//ball.rotateX(-Math.PI * 0.5);
	ball.updateMatrixWorld();

	// if ball is on the ground (touching the large course), set its up velocity to 0
	if (!ballIsInAir)
	{
		ballLocalVelocity.y = 0;
	}

	// send final ball transform (as an inverted matrix), so that the ray tracer can render it in the correct position and orientation
	pathTracingUniforms.uBallInvMatrix.value.copy(ball.matrixWorld).invert();

	// after rendering, reset ball position back down so that its center is right on the ground (this helps with ray casting against course)
	ball.position.addScaledVector(ballUp, -15);
	// after rendering, reset ball rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	//ball.rotateX(Math.PI * 0.5);
	ball.updateMatrixWorld();




	// UPDATE PLAYER's GOAL ///////////////////////////////////////////////////////////////////////////////////

	// if in air, apply gravity (actually anti-gravity: pulls playerGoal down to the large course surface in all directions)
	if (playerGoalIsInAir)
	{
		playerGoalLocalVelocity.y -= (200 * frameTime);
	}

	// the following gives a very slight invisible movement to the playerGoal, so that a ray can be created from its old position to its new position 
	if (Math.abs(playerGoalLocalVelocity.x) < 0.0001 && Math.abs(playerGoalLocalVelocity.z) < 0.0001)
	{
		playerGoalLocalVelocity.x = (Math.random() * 2 - 1) * 0.001;
		playerGoalLocalVelocity.z = (Math.random() * 2 - 1) * 0.001;
	}
		

	playerGoalWorldVelocity.set(0, 0, 0);
	playerGoalWorldVelocity.addScaledVector(playerGoalRight, playerGoalLocalVelocity.x);
	playerGoalWorldVelocity.addScaledVector(playerGoalUp, playerGoalLocalVelocity.y);
	playerGoalWorldVelocity.addScaledVector(playerGoalForward, playerGoalLocalVelocity.z);
	
	playerGoal.position.addScaledVector(playerGoalWorldVelocity, frameTime);



	// CHECK FOR PLAYER GOAL vs MIN/MAX BOUNDARY WALLS
	
	if (playerGoal.position.x > courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x))
	{
		playerGoal.position.x = courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x);
		unitCollisionNormal.set(-1, 0, 0);
		impulsePlayerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		playerGoalLocalVelocity.x = impulsePlayerGoal.dot(playerGoalRight);
		playerGoalLocalVelocity.z = impulsePlayerGoal.dot(playerGoalForward);
	}
	if (playerGoal.position.x < courseShape.position.x + (courseShape.scale.x * courseMinBounds.x))
	{
		playerGoal.position.x = courseShape.position.x + (courseShape.scale.x * courseMinBounds.x);
		unitCollisionNormal.set(1, 0, 0);
		impulsePlayerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		playerGoalLocalVelocity.x = impulsePlayerGoal.dot(playerGoalRight);
		playerGoalLocalVelocity.z = impulsePlayerGoal.dot(playerGoalForward);
	}
	if (playerGoal.position.y > courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y))
	{
		playerGoal.position.y = courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y);
		unitCollisionNormal.set(0, -1, 0);
		impulsePlayerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		playerGoalLocalVelocity.x = impulsePlayerGoal.dot(playerGoalRight);
		playerGoalLocalVelocity.z = impulsePlayerGoal.dot(playerGoalForward);
	}
	if (playerGoal.position.y < courseShape.position.y + (courseShape.scale.y * courseMinBounds.y))
	{
		playerGoal.position.y = courseShape.position.y + (courseShape.scale.y * courseMinBounds.y);
		unitCollisionNormal.set(0, 1, 0);
		impulsePlayerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		playerGoalLocalVelocity.x = impulsePlayerGoal.dot(playerGoalRight);
		playerGoalLocalVelocity.z = impulsePlayerGoal.dot(playerGoalForward);
	}
	if (playerGoal.position.z > courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z))
	{
		playerGoal.position.z = courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z);
		unitCollisionNormal.set(0, 0, -1);
		impulsePlayerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		playerGoalLocalVelocity.x = impulsePlayerGoal.dot(playerGoalRight);
		playerGoalLocalVelocity.z = impulsePlayerGoal.dot(playerGoalForward);
	}
	if (playerGoal.position.z < courseShape.position.z + (courseShape.scale.z * courseMinBounds.z))
	{
		playerGoal.position.z = courseShape.position.z + (courseShape.scale.z * courseMinBounds.z);
		unitCollisionNormal.set(0, 0, 1);
		impulsePlayerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		playerGoalLocalVelocity.x = impulsePlayerGoal.dot(playerGoalRight);
		playerGoalLocalVelocity.z = impulsePlayerGoal.dot(playerGoalForward);
	}


	// now that the playerGoal has moved, record its new position minus its old position as a line segment
	playerGoalRaySegment.copy(playerGoal.position).sub(playerGoalOldPosition);
	playerGoalRaySegmentLength = playerGoalRaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the playerGoal's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	playerGoalRayOrigin.copy(playerGoalOldPosition); // must use playerGoal's old position for this to work
	playerGoalRayDirection.copy(playerGoalRaySegment).normalize();


	// CHECK FOR PLAYER GOAL OUT-OF-BOUNDS (see if playerGoal's current position has left the course)

	// first check playerGoal forward motion probe for intersection with course (a ray is cast from playerGoal's position in the direction of its forward motion)
	rayObjectOrigin.copy(playerGoalRayOrigin);
	rayObjectDirection.copy(playerGoalRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	// If the test t value from the raycast comes back smaller than the distance that the playerGoal is trying to cover during
	//   this animation frame, that means that the playerGoal's future position would step out of bounds of the course.
	//   Therefore, we must snap the playerGoal back into position at the raycast intersectionPoint on the course surface.
	if (testT < playerGoalRaySegmentLength)
	{
		playerGoalIsInAir = false;
		playerGoalLocalVelocity.y = 0;
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(playerGoalRayOrigin, playerGoalRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		playerGoal.position.copy(intersectionPoint);
		playerGoalUp.copy(intersectionNormal);
		playerGoalRight.crossVectors(playerGoalUp, playerGoalForward).normalize();
		playerGoalForward.crossVectors(playerGoalRight, playerGoalUp).normalize();
	}
	else if (testT == Infinity)
	{// bail out and snap the playerGoal back to its starting position
		//console.log("PlayerGoal bailed out");
		playerGoalIsInAir = true;
		playerGoalLocalVelocity.set(10, 0, 0);
		playerGoal.position.copy(playerGoalStartingPosition);
		playerGoalRight.set(1, 0, 0);
		playerGoalUp.set(0, 1, 0);
		playerGoalForward.set(0, 0, 1);
	}
	

	// CHECK FOR PLAYER GOAL vs. LARGE COURSE INTERACTIONS
	// handling these interactions is what makes the playerGoal glide smoothly on the surface of the large course
	
	// now check playerGoal base center probe for intersection with course (a ray is cast from playerGoal's position downward towards the floor beneath)
	
	playerGoalRayOrigin.copy(playerGoal.position);
	playerGoalRayDirection.copy(playerGoalUp).negate();

	rayObjectOrigin.copy(playerGoalRayOrigin);
	rayObjectDirection.copy(playerGoalRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	if (testT < Infinity)
	{
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(playerGoalRayOrigin, playerGoalRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		playerGoalUp.copy(intersectionNormal);
		playerGoalRight.crossVectors(playerGoalUp, playerGoalForward).normalize();
		playerGoalForward.crossVectors(playerGoalRight, playerGoalUp).normalize();	
	}
	if (testT <= 1)
	{
		playerGoalIsInAir = false;
		playerGoalLocalVelocity.y = 0;
		playerGoal.position.copy(intersectionPoint);
	}
	if (testT > 1) // " > 1.01" instead of " > 1" to account for floating point precision
	{
		playerGoalIsInAir = true;
	}
	/* if (testT == Infinity)
	{// bail out and snap the playerGoal back to its old position
		console.log("playerGoal could not intersect with the ground below it");
		playerGoal.position.copy(playerGoalOldPosition);
	} */
	

	playerGoalOldPosition.copy(playerGoal.position);
	
	playerGoalRotationMatrix.makeBasis(playerGoalRight, playerGoalUp, playerGoalForward);
	playerGoal.rotation.setFromRotationMatrix(playerGoalRotationMatrix);
	playerGoal.updateMatrixWorld();

	// temporarily move playerGoal up out of the ground for final render
	playerGoal.position.addScaledVector(playerGoalUp, 30);
	playerGoal.updateMatrixWorld();

	// playerGoalYRotateAngle += 0.1 * frameTime;
	// playerGoalYRotateAngle %= TWO_PI;
	// playerGoal.rotateY(playerGoalYRotateAngle);
	// playerGoal.updateMatrixWorld();

	// if playerGoal is on the ground (touching the large course), set its up velocity to 0
	if (!playerGoalIsInAir)
	{
		playerGoalLocalVelocity.y = 0;
	}


	// send final playerGoal transform (as an inverted matrix), so that the ray tracer can render it in the correct position and orientation
	pathTracingUniforms.uPlayerGoalInvMatrix.value.copy(playerGoal.matrixWorld).invert();

	// after rendering, reset playerGoal position back down so that its center is right on the ground (this helps with ray casting against course)
	playerGoal.position.addScaledVector(playerGoalUp, -30);
	// after rendering, reset playerGoal rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	//playerGoal.rotateX(Math.PI * 0.5);
	playerGoal.updateMatrixWorld();



	// UPDATE COMPUTER's GOAL ///////////////////////////////////////////////////////////////////////////////////

	// if in air, apply gravity (actually anti-gravity: pulls computerGoal down to the large course surface in all directions)
	if (computerGoalIsInAir)
	{
		computerGoalLocalVelocity.y -= (200 * frameTime);
	}

	// the following gives a very slight invisible movement to the playerGoal, so that a ray can be created from its old position to its new position 
	if (Math.abs(computerGoalLocalVelocity.x) < 0.0001 && Math.abs(computerGoalLocalVelocity.z) < 0.0001)
	{
		computerGoalLocalVelocity.x = (Math.random() * 2 - 1) * 0.001;
		computerGoalLocalVelocity.z = (Math.random() * 2 - 1) * 0.001;
	}
		

	computerGoalWorldVelocity.set(0, 0, 0);
	computerGoalWorldVelocity.addScaledVector(computerGoalRight, computerGoalLocalVelocity.x);
	computerGoalWorldVelocity.addScaledVector(computerGoalUp, computerGoalLocalVelocity.y);
	computerGoalWorldVelocity.addScaledVector(computerGoalForward, computerGoalLocalVelocity.z);
	
	computerGoal.position.addScaledVector(computerGoalWorldVelocity, frameTime);



	// CHECK FOR COMPUTER GOAL vs MIN/MAX BOUNDARY WALLS
	
	if (computerGoal.position.x > courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x))
	{
		computerGoal.position.x = courseShape.position.x + (courseShape.scale.x * courseMaxBounds.x);
		unitCollisionNormal.set(-1, 0, 0);
		impulseComputerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		computerGoalLocalVelocity.x = impulseComputerGoal.dot(computerGoalRight);
		computerGoalLocalVelocity.z = impulseComputerGoal.dot(computerGoalForward);
	}
	if (computerGoal.position.x < courseShape.position.x + (courseShape.scale.x * courseMinBounds.x))
	{
		computerGoal.position.x = courseShape.position.x + (courseShape.scale.x * courseMinBounds.x);
		unitCollisionNormal.set(1, 0, 0);
		impulseComputerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		computerGoalLocalVelocity.x = impulseComputerGoal.dot(computerGoalRight);
		computerGoalLocalVelocity.z = impulseComputerGoal.dot(computerGoalForward);
	}
	if (computerGoal.position.y > courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y))
	{
		computerGoal.position.y = courseShape.position.y + (courseShape.scale.y * courseMaxBounds.y);
		unitCollisionNormal.set(0, -1, 0);
		impulseComputerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		computerGoalLocalVelocity.x = impulseComputerGoal.dot(computerGoalRight);
		computerGoalLocalVelocity.z = impulseComputerGoal.dot(computerGoalForward);
	}
	if (computerGoal.position.y < courseShape.position.y + (courseShape.scale.y * courseMinBounds.y))
	{
		computerGoal.position.y = courseShape.position.y + (courseShape.scale.y * courseMinBounds.y);
		unitCollisionNormal.set(0, 1, 0);
		impulseComputerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		computerGoalLocalVelocity.x = impulseComputerGoal.dot(computerGoalRight);
		computerGoalLocalVelocity.z = impulseComputerGoal.dot(computerGoalForward);
	}
	if (computerGoal.position.z > courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z))
	{
		computerGoal.position.z = courseShape.position.z + (courseShape.scale.z * courseMaxBounds.z);
		unitCollisionNormal.set(0, 0, -1);
		impulseComputerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		computerGoalLocalVelocity.x = impulseComputerGoal.dot(computerGoalRight);
		computerGoalLocalVelocity.z = impulseComputerGoal.dot(computerGoalForward);
	}
	if (computerGoal.position.z < courseShape.position.z + (courseShape.scale.z * courseMinBounds.z))
	{
		computerGoal.position.z = courseShape.position.z + (courseShape.scale.z * courseMinBounds.z);
		unitCollisionNormal.set(0, 0, 1);
		impulseComputerGoal.copy(unitCollisionNormal).multiplyScalar(10);
		computerGoalLocalVelocity.x = impulseComputerGoal.dot(computerGoalRight);
		computerGoalLocalVelocity.z = impulseComputerGoal.dot(computerGoalForward);
	}


	// now that the computerGoal has moved, record its new position minus its old position as a line segment
	computerGoalRaySegment.copy(computerGoal.position).sub(computerGoalOldPosition);
	computerGoalRaySegmentLength = computerGoalRaySegment.length(); // will be used later as an out-of-bounds check

	// now make a ray using the computerGoal's old position (rayOrigin) and the direction it is trying to move in (rayDirection)
	computerGoalRayOrigin.copy(computerGoalOldPosition); // must use computerGoal's old position for this to work
	computerGoalRayDirection.copy(computerGoalRaySegment).normalize();


	// CHECK FOR COMPUTER GOAL OUT-OF-BOUNDS (see if computerGoal's current position has left the course)

	// first check computerGoal forward motion probe for intersection with course (a ray is cast from computerGoal's position in the direction of its forward motion)
	rayObjectOrigin.copy(computerGoalRayOrigin);
	rayObjectDirection.copy(computerGoalRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	// If the test t value from the raycast comes back smaller than the distance that the computerGoal is trying to cover during
	//   this animation frame, that means that the computerGoal's future position would step out of bounds of the course.
	//   Therefore, we must snap the computerGoal back into position at the raycast intersectionPoint on the course surface.
	if (testT < computerGoalRaySegmentLength)
	{
		computerGoalIsInAir = false;
		computerGoalLocalVelocity.y = 0;
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(computerGoalRayOrigin, computerGoalRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		computerGoal.position.copy(intersectionPoint);
		computerGoalUp.copy(intersectionNormal);
		computerGoalRight.crossVectors(computerGoalUp, computerGoalForward).normalize();
		computerGoalForward.crossVectors(computerGoalRight, computerGoalUp).normalize();
	}
	else if (testT == Infinity)
	{// bail out and snap the computerGoal back to its starting position
		//console.log("ComputerGoal bailed out");
		computerGoalIsInAir = true;
		computerGoalLocalVelocity.set(10, 0, 0);
		computerGoal.position.copy(computerGoalStartingPosition);
		computerGoalRight.set(1, 0, 0);
		computerGoalUp.set(0, 1, 0);
		computerGoalForward.set(0, 0, 1);
	}


	
	// CHECK FOR COMPUTER GOAL vs. LARGE COURSE INTERACTIONS
	// handling these interactions is what makes the computerGoal glide smoothly on the surface of the large course
	
	// now check computerGoal base center probe for intersection with course (a ray is cast from computerGoal's position downward towards the floor beneath)
	
	computerGoalRayOrigin.copy(computerGoal.position);
	computerGoalRayDirection.copy(computerGoalUp).negate();

	rayObjectOrigin.copy(computerGoalRayOrigin);
	rayObjectDirection.copy(computerGoalRayDirection);
	// put the rayObjectOrigin and rayObjectDirection in the object space of the large course
	// the line below is not needed, because the large course never moves (it is fixed in place)
	//courseShape_invMatrix.copy(courseShape.matrixWorld).invert(); // only needed if this object moves
	rayObjectOrigin.transformAsPoint(courseShape_invMatrix);
	rayObjectDirection.transformAsDirection(courseShape_invMatrix);
	// now that the ray's origin and direction are in object space, we can raycast against the course using a very simple unit-shape intersection routine
	//testT = intersectUnitSphere(rayObjectOrigin, rayObjectDirection, intersectionNormal);
	testT = intersectCourse();
	if (testT < Infinity)
	{
		intersectionNormal.transformSurfaceNormal(courseShape_invMatrix); // bring intersected object-space normal back into world space
		intersectionNormal.negate(); // normals usually point outward on shapes, but since we are inside the shape, must flip it
		intersectionNormal.normalize(); // after the various transformations, make sure normal is a unit-length vector (length of 1)
		intersectionPoint.getPointAlongRay(computerGoalRayOrigin, computerGoalRayDirection, testT);
		intersectionPoint.addScaledVector(intersectionNormal, 1);
		computerGoalUp.copy(intersectionNormal);
		computerGoalRight.crossVectors(computerGoalUp, computerGoalForward).normalize();
		computerGoalForward.crossVectors(computerGoalRight, computerGoalUp).normalize();	
	}
	if (testT <= 1)
	{
		computerGoalIsInAir = false;
		computerGoalLocalVelocity.y = 0;
		computerGoal.position.copy(intersectionPoint);
	}
	if (testT > 1) // " > 1.01" instead of " > 1" to account for floating point precision
	{
		computerGoalIsInAir = true;
	}
	/* if (testT == Infinity)
	{// bail out and snap the computerGoal back to its old position
		console.log("computerGoal could not intersect with the ground below it");
		computerGoal.position.copy(computerGoalOldPosition);
	} */
	

	computerGoalOldPosition.copy(computerGoal.position);

	computerGoalRotationMatrix.makeBasis(computerGoalRight, computerGoalUp, computerGoalForward);
	computerGoal.rotation.setFromRotationMatrix(computerGoalRotationMatrix);
	computerGoal.updateMatrixWorld();

	// temporarily move computerGoal up out of the ground for final render
	computerGoal.position.addScaledVector(computerGoalUp, 30);
	computerGoal.updateMatrixWorld();

	// computerGoalYRotateAngle += 0.1 * frameTime;
	// computerGoalYRotateAngle %= TWO_PI;
	// computerGoal.rotateY(computerGoalYRotateAngle);
	// computerGoal.updateMatrixWorld();

	// if computerGoal is on the ground (touching the large course), set its up velocity to 0
	if (!computerGoalIsInAir)
	{
		computerGoalLocalVelocity.y = 0;
	}

	// send final computerGoal transform (as an inverted matrix), so that the ray tracer can render it in the correct position and orientation
	pathTracingUniforms.uComputerGoalInvMatrix.value.copy(computerGoal.matrixWorld).invert();

	// after rendering, reset computerGoal position back down so that its center is right on the ground (this helps with ray casting against course)
	computerGoal.position.addScaledVector(computerGoalUp, -30);
	// after rendering, reset computerGoal rotation to be default upright (aligned with ground surface normal), so that rotation calculation code above will be easier
	//computerGoal.rotateX(Math.PI * 0.5);
	computerGoal.updateMatrixWorld();

	

	
	// DEBUG INFO
	
	demoInfoElement.innerHTML = "collisions: " + collisionCounter;

	/* demoInfoElement.innerHTML += " glider1IsInAir: " + glider1IsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"glider1BaseRight: " + "(" + glider1BaseRight.x.toFixed(1) + " " + glider1BaseRight.y.toFixed(1) + " " + glider1BaseRight.z.toFixed(1) + ")" + " " + 
	"glider1BaseUp: " + "(" + glider1BaseUp.x.toFixed(1) + " " + glider1BaseUp.y.toFixed(1) + " " + glider1BaseUp.z.toFixed(1) + ")" + " " + 
	"glider1BaseForward: " + "(" + glider1BaseForward.x.toFixed(1) + " " + glider1BaseForward.y.toFixed(1) + " " + glider1BaseForward.z.toFixed(1) + ")" + "<br>" + 
	
	"glider1LocalVelocity: " + "(" + glider1LocalVelocity.x.toFixed(1) + " " + glider1LocalVelocity.y.toFixed(1) + " " + glider1LocalVelocity.z.toFixed(1) + ")" + "<br>" + 
	"glider1WorldVelocity: " + "(" + glider1WorldVelocity.x.toFixed(1) + " " + glider1WorldVelocity.y.toFixed(1) + " " + glider1WorldVelocity.z.toFixed(1) + ")";
 	 */

	/* demoInfoElement.innerHTML += "glider1IsInAir: " + glider1IsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"glider1ThrustersRight: " + "(" + glider1ThrustersRight.x.toFixed(1) + " " + glider1ThrustersRight.y.toFixed(1) + " " + glider1ThrustersRight.z.toFixed(1) + ")" + " " + 
	"glider1ThrustersUp: " + "(" + glider1ThrustersUp.x.toFixed(1) + " " + glider1ThrustersUp.y.toFixed(1) + " " + glider1ThrustersUp.z.toFixed(1) + ")" + " " + 
	"glider1ThrustersForward: " + "(" + glider1ThrustersForward.x.toFixed(1) + " " + glider1ThrustersForward.y.toFixed(1) + " " + glider1ThrustersForward.z.toFixed(1) + ")" + "<br>" + 
	
	"glider1LocalVelocity: " + "(" + glider1LocalVelocity.x.toFixed(1) + " " + glider1LocalVelocity.y.toFixed(1) + " " + glider1LocalVelocity.z.toFixed(1) + ")" + "<br>" + 
	"glider1WorldVelocity: " + "(" + glider1WorldVelocity.x.toFixed(1) + " " + glider1WorldVelocity.y.toFixed(1) + " " + glider1WorldVelocity.z.toFixed(1) + ")";
 	*/

	/* demoInfoElement.innerHTML += "glider2IsInAir: " + glider2IsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"glider2BaseRight: " + "(" + glider2BaseRight.x.toFixed(1) + " " + glider2BaseRight.y.toFixed(1) + " " + glider2BaseRight.z.toFixed(1) + ")" + " " + 
	"glider2BaseUp: " + "(" + glider2BaseUp.x.toFixed(1) + " " + glider2BaseUp.y.toFixed(1) + " " + glider2BaseUp.z.toFixed(1) + ")" + " " + 
	"glider2BaseForward: " + "(" + glider2BaseForward.x.toFixed(1) + " " + glider2BaseForward.y.toFixed(1) + " " + glider2BaseForward.z.toFixed(1) + ")" + "<br>" + 
	
	"glider2LocalVelocity: " + "(" + glider2LocalVelocity.x.toFixed(1) + " " + glider2LocalVelocity.y.toFixed(1) + " " + glider2LocalVelocity.z.toFixed(1) + ")" + "<br>" + 
	"glider2WorldVelocity: " + "(" + glider2WorldVelocity.x.toFixed(1) + " " + glider2WorldVelocity.y.toFixed(1) + " " + glider2WorldVelocity.z.toFixed(1) + ")";
 	*/

	/* demoInfoElement.innerHTML += "glider2IsInAir: " + glider2IsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"glider2ThrustersRight: " + "(" + glider2ThrustersRight.x.toFixed(1) + " " + glider2ThrustersRight.y.toFixed(1) + " " + glider2ThrustersRight.z.toFixed(1) + ")" + " " + 
	"glider2ThrustersUp: " + "(" + glider2ThrustersUp.x.toFixed(1) + " " + glider2ThrustersUp.y.toFixed(1) + " " + glider2ThrustersUp.z.toFixed(1) + ")" + " " + 
	"glider2ThrustersForward: " + "(" + glider2ThrustersForward.x.toFixed(1) + " " + glider2ThrustersForward.y.toFixed(1) + " " + glider2ThrustersForward.z.toFixed(1) + ")" + "<br>" + 
	
	"glider2LocalVelocity: " + "(" + glider2LocalVelocity.x.toFixed(1) + " " + glider2LocalVelocity.y.toFixed(1) + " " + glider2LocalVelocity.z.toFixed(1) + ")" + "<br>" + 
	"glider2WorldVelocity: " + "(" + glider2WorldVelocity.x.toFixed(1) + " " + glider2WorldVelocity.y.toFixed(1) + " " + glider2WorldVelocity.z.toFixed(1) + ")";
	*/

	/* demoInfoElement.innerHTML += " ballIsInAir: " + ballIsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"ballRight: " + "(" + ballRight.x.toFixed(1) + " " + ballRight.y.toFixed(1) + " " + ballRight.z.toFixed(1) + ")" + " " + 
	"ballUp: " + "(" + ballUp.x.toFixed(1) + " " + ballUp.y.toFixed(1) + " " + ballUp.z.toFixed(1) + ")" + " " + 
	"ballForward: " + "(" + ballForward.x.toFixed(1) + " " + ballForward.y.toFixed(1) + " " + ballForward.z.toFixed(1) + ")" + "<br>" + 
	
	"ballLocalVelocity: " + "(" + ballLocalVelocity.x.toFixed(1) + " " + ballLocalVelocity.y.toFixed(1) + " " + ballLocalVelocity.z.toFixed(1) + ")" + "<br>" + 
	"ballWorldVelocity: " + "(" + ballWorldVelocity.x.toFixed(1) + " " + ballWorldVelocity.y.toFixed(1) + " " + ballWorldVelocity.z.toFixed(1) + ")";
 	 */
	
	/* demoInfoElement.innerHTML += " playerGoalIsInAir: " + playerGoalIsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"playerGoalRight: " + "(" + playerGoalRight.x.toFixed(1) + " " + playerGoalRight.y.toFixed(1) + " " + playerGoalRight.z.toFixed(1) + ")" + " " + 
	"playerGoalUp: " + "(" + playerGoalUp.x.toFixed(1) + " " + playerGoalUp.y.toFixed(1) + " " + playerGoalUp.z.toFixed(1) + ")" + " " + 
	"playerGoalForward: " + "(" + playerGoalForward.x.toFixed(1) + " " + playerGoalForward.y.toFixed(1) + " " + playerGoalForward.z.toFixed(1) + ")" + "<br>" + 
	
	"playerGoalLocalVelocity: " + "(" + playerGoalLocalVelocity.x.toFixed(1) + " " + playerGoalLocalVelocity.y.toFixed(1) + " " + playerGoalLocalVelocity.z.toFixed(1) + ")" + "<br>" + 
	"playerGoalWorldVelocity: " + "(" + playerGoalWorldVelocity.x.toFixed(1) + " " + playerGoalWorldVelocity.y.toFixed(1) + " " + playerGoalWorldVelocity.z.toFixed(1) + ")"; 
	*/

	/* demoInfoElement.innerHTML += " computerGoalIsInAir: " + computerGoalIsInAir + " " + "cameraIsMoving: " + cameraIsMoving + "<br>" + 
	"computerGoalRight: " + "(" + computerGoalRight.x.toFixed(1) + " " + computerGoalRight.y.toFixed(1) + " " + computerGoalRight.z.toFixed(1) + ")" + " " + 
	"computerGoalUp: " + "(" + computerGoalUp.x.toFixed(1) + " " + computerGoalUp.y.toFixed(1) + " " + computerGoalUp.z.toFixed(1) + ")" + " " + 
	"computerGoalForward: " + "(" + computerGoalForward.x.toFixed(1) + " " + computerGoalForward.y.toFixed(1) + " " + computerGoalForward.z.toFixed(1) + ")" + "<br>" + 
	
	"computerGoalLocalVelocity: " + "(" + computerGoalLocalVelocity.x.toFixed(1) + " " + computerGoalLocalVelocity.y.toFixed(1) + " " + computerGoalLocalVelocity.z.toFixed(1) + ")" + "<br>" + 
	"computerGoalWorldVelocity: " + "(" + computerGoalWorldVelocity.x.toFixed(1) + " " + computerGoalWorldVelocity.y.toFixed(1) + " " + computerGoalWorldVelocity.z.toFixed(1) + ")"; 
	*/
	
	// CAMERA INFO
	///cameraInfoElement.innerHTML = "FOV: " + worldCamera.fov + " / Aperture: " + apertureSize.toFixed(2) + " / FocusDistance: " + focusDistance + "<br>" + "Samples: " + sampleCounter;

} // end function updateUniforms()



init(); // init app and start animating
