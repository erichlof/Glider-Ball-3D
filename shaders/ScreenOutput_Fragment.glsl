precision highp float;
precision highp int;
precision highp sampler2D;

uniform sampler2D tPathTracedImageTexture;
uniform float uSampleCounter;
uniform float uOneOverSampleCounter;
uniform float uPixelEdgeSharpness;
uniform float uEdgeSharpenSpeed;
uniform float uFilterDecaySpeed;
uniform bool uSceneIsDynamic;
uniform bool uUseToneMapping;


void main()
{
	// first, start with a large blur kernel (5x5), which will be used on all diffuse
	// surfaces.  It will blur out the noise, giving a smoother, more uniform color.

	// 5x5 kernel
	vec4 m25[25];

	vec2 glFragCoord_xy = gl_FragCoord.xy;

	m25[ 0] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-2, 2)), 0);
	m25[ 1] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-1, 2)), 0);
	m25[ 2] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 0, 2)), 0);
	m25[ 3] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 1, 2)), 0);
	m25[ 4] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 2, 2)), 0);

	m25[ 5] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-2, 1)), 0);
	m25[ 6] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-1, 1)), 0);
	m25[ 7] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 0, 1)), 0);
	m25[ 8] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 1, 1)), 0);
	m25[ 9] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 2, 1)), 0);

	m25[10] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-2, 0)), 0);
	m25[11] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-1, 0)), 0);
	m25[12] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 0, 0)), 0);// center pixel - m25[12]
	m25[13] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 1, 0)), 0);
	m25[14] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 2, 0)), 0);

	m25[15] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-2,-1)), 0);
	m25[16] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-1,-1)), 0);
	m25[17] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 0,-1)), 0);
	m25[18] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 1,-1)), 0);
	m25[19] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 2,-1)), 0);

	m25[20] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-2,-2)), 0);
	m25[21] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2(-1,-2)), 0);
	m25[22] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 0,-2)), 0);
	m25[23] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 1,-2)), 0);
	m25[24] = texelFetch(tPathTracedImageTexture, ivec2(glFragCoord_xy + vec2( 2,-2)), 0);
	
	vec4 centerPixel = m25[12];
	vec3 filteredPixelColor, edgePixelColor;
	float threshold = 1.0;
	int count = 1;

	// start with center pixel
	filteredPixelColor = m25[12].rgb;

	// search left
	if (m25[11].a < threshold)
	{
		filteredPixelColor += m25[11].rgb;
		count++; 
		if (m25[10].a < threshold)
		{
			filteredPixelColor += m25[10].rgb;
			count++; 
		}
		if (m25[5].a < threshold)
		{
			filteredPixelColor += m25[5].rgb;
			count++; 
		}
	}
	// search right
	if (m25[13].a < threshold)
	{
		filteredPixelColor += m25[13].rgb;
		count++; 
		if (m25[14].a < threshold)
		{
			filteredPixelColor += m25[14].rgb;
			count++; 
		}
		if (m25[19].a < threshold)
		{
			filteredPixelColor += m25[19].rgb;
			count++; 
		}
	}
	// search above
	if (m25[7].a < threshold)
	{
		filteredPixelColor += m25[7].rgb;
		count++; 
		if (m25[2].a < threshold)
		{
			filteredPixelColor += m25[2].rgb;
			count++; 
		}
		if (m25[3].a < threshold)
		{
			filteredPixelColor += m25[3].rgb;
			count++; 
		}
	}
	// search below
	if (m25[17].a < threshold)
	{
		filteredPixelColor += m25[17].rgb;
		count++; 
		if (m25[22].a < threshold)
		{
			filteredPixelColor += m25[22].rgb;
			count++; 
		}
		if (m25[21].a < threshold)
		{
			filteredPixelColor += m25[21].rgb;
			count++; 
		}
	}

	// search upper-left
	if (m25[6].a < threshold)
	{
		filteredPixelColor += m25[6].rgb;
		count++; 
		if (m25[0].a < threshold)
		{
			filteredPixelColor += m25[0].rgb;
			count++; 
		}
		if (m25[1].a < threshold)
		{
			filteredPixelColor += m25[1].rgb;
			count++; 
		}
	}
	// search upper-right
	if (m25[8].a < threshold)
	{
		filteredPixelColor += m25[8].rgb;
		count++; 
		if (m25[4].a < threshold)
		{
			filteredPixelColor += m25[4].rgb;
			count++; 
		}
		if (m25[9].a < threshold)
		{
			filteredPixelColor += m25[9].rgb;
			count++; 
		}
	}
	// search lower-left
	if (m25[16].a < threshold)
	{
		filteredPixelColor += m25[16].rgb;
		count++; 
		if (m25[15].a < threshold)
		{
			filteredPixelColor += m25[15].rgb;
			count++; 
		}
		if (m25[20].a < threshold)
		{
			filteredPixelColor += m25[20].rgb;
			count++; 
		}
	}
	// search lower-right
	if (m25[18].a < threshold)
	{
		filteredPixelColor += m25[18].rgb;
		count++; 
		if (m25[23].a < threshold)
		{
			filteredPixelColor += m25[23].rgb;
			count++; 
		}
		if (m25[24].a < threshold)
		{
			filteredPixelColor += m25[24].rgb;
			count++; 
		}
	}
	// divide by total count to get the average
	filteredPixelColor *= (1.0 / float(count));



	// next, use a smaller blur kernel (3x3), to help blend the noisy, sharp edge pixels
	// 3x3 kernel
	vec4 m9[9];
	m9[0] = m25[6];
	m9[1] = m25[7];
	m9[2] = m25[8];

	m9[3] = m25[11];
	m9[4] = m25[12]; // center pixel - m9[4]
	m9[5] = m25[13];

	m9[6] = m25[16];
	m9[7] = m25[17];
	m9[8] = m25[18];

	// start with center pixel
	edgePixelColor = m9[4].rgb;

	if (!uSceneIsDynamic && centerPixel.a == 1.0) // is this an edge pixel?  centerPixel.a == 1.0
	{
		// reset variables
		count = 1;
		// loop over neighbor pixels in the 3x3 grid
		for (int i = 0; i < 9; i++)
		{
			if (i == 4) continue; // do not blend the center pixel with itself
			if (m9[i].a == 1.0)
			{
				edgePixelColor += m9[i].rgb;
				count++;
			}
		}
		// divide by total count to get the average
		edgePixelColor *= (1.0 / float(count));
	}


	
	if ( !uSceneIsDynamic ) // static scene
	{
		// fast progressive convergence from filtered (blurred) pixels to their original sharp center pixel colors  
		if (uSampleCounter > 1.0) // is camera still?
		{
			if (centerPixel.a == 1.0) // 1.0 means pixel is on an edge, must get sharper quickest
				filteredPixelColor = mix(edgePixelColor, centerPixel.rgb, clamp(uSampleCounter * uEdgeSharpenSpeed, 0.0, 1.0));
			else // else this is a diffuse surface, so we can take our time converging. That way, there will be minimal noise 
				filteredPixelColor = mix(filteredPixelColor, centerPixel.rgb, clamp(uSampleCounter * uFilterDecaySpeed, 0.0, 1.0));
		} // else camera is moving
		else if (centerPixel.a == 1.0) // 1.0 means pixel is on an edge, must remain sharper
		{
			filteredPixelColor = mix(filteredPixelColor, centerPixel.rgb, 0.5);
		}
		
	}
	else // scene is dynamic
	{
		if (centerPixel.a == 1.0) // 1.0 means pixel is on an edge, must remain sharper
		{
			filteredPixelColor = mix(filteredPixelColor, centerPixel.rgb, uPixelEdgeSharpness);
		}
	}

	// centerPixel.a == 1.01 means this pixel is a light source, and light sources must be sharpest
	if (centerPixel.a == 1.01) 
	{
		filteredPixelColor = centerPixel.rgb; // no blending, maximum sharpness
	}
	
	// final filteredPixelColor processing ////////////////////////////////////

	// average accumulation buffer
	filteredPixelColor *= uOneOverSampleCounter;

	// apply tone mapping (brings pixel into 0.0-1.0 rgb color range)
	filteredPixelColor = uUseToneMapping ? ReinhardToneMapping(filteredPixelColor) : filteredPixelColor;

	// lastly, apply gamma correction (gives more intensity/brightness range where it's needed)
	pc_fragColor = vec4(sqrt(filteredPixelColor), 1.0);
}