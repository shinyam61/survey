precision mediump float;

// uniform float progress;
uniform sampler2D tex1;
uniform sampler2D tex2;
// uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

float noise(float time,vec2 resolution) {vec2 coord=gl_FragCoord.xy/resolution;vec2 signedCoord=coord*2.0-1.0;return (sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,0.6666666666666665)))*19.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,0.6666666666666665)))*-13.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,0.6666666666666665)))*-9.0)+sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,-5.551115123125783e-17)))*10.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,-5.551115123125783e-17)))*14.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,-5.551115123125783e-17)))*7.0)+sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,-0.6666666666666667)))*17.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,-0.6666666666666667)))*13.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,-0.6666666666666667)))*16.0))/18.0+.5;}

void main () {

  float n = noise(time * 5., resolution) * .075;
  float p = clamp((cos(time / .5) * .6) + .5, 0., 1.);

  vec2 uv = 1.0 - vUv;

  // gl_FragColor = vec4(step(progress, vDelay), .0, .0, 1.0);
  vec4 texColor1 = texture2D(tex1, uv);
  vec4 texColor2 = texture2D(tex2, uv);

  // float x = step(uv.x, clamp(n * .15 + p * 2.0 - 1., .0, 1.));

  float p2 = p * 2.0 - 1.;
  float edgeWidth = 0.1; // ぼかしの幅を調整する
  float edgeStart = smoothstep(.0, 1.0, clamp(n + p2 - edgeWidth, 0., 1.));
  float edgeEnd = clamp(n + p2 + edgeWidth, 0., 1.);
  float x = smoothstep(p2 == 1. ? edgeEnd: edgeStart, edgeEnd, uv.x);

  bool isToRight = sign(mod(time / .5, (3.14 * 2.)) - 3.14) < 0.;
  float y = smoothstep(0.3, .5, x) * smoothstep(0.7, 0.6, x);
  float fireInten = smoothstep(isToRight ? 0.3 : 0.4, isToRight ? 0.6 : 0.7, x);
  vec4 texture = mix(texColor1, texColor2, x);
  vec4 fireColor = vec4(0.87, 0.15, 0.02, 0.89);
  vec4 ashColor = vec4(0.95, 0.72, 0.59, 0.96);
  vec4 leftColor = isToRight ? fireColor : ashColor;
  vec4 rightColor = isToRight ? ashColor : fireColor;
  vec4 color = mix(texture, mix(leftColor, rightColor, fireInten), y);
  // color = mix(texColor1, texColor2, x);

  gl_FragColor = color;
  // gl_FragColor = vec4(vec3(n + p * 2.0 - 1.), 1.0);
}