precision mediump float;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 invMatrix;
uniform mat4 nMatrix;
uniform vec3 directionalLightPos;
uniform vec3 spotLightPos;
uniform vec3 spotLightTarget;
uniform float spotLightOuter;
uniform float spotLightInner;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vColor;

void main () {

  // ディレクショナルライトの拡散値を算出
  vec3  invDirectionalLight = normalize(invMatrix * vec4(directionalLightPos, 0.0)).xyz;
  float diffuseDirectional  = clamp(dot(vNormal, invDirectionalLight), 0.1, 1.0);

  // 
  vec3 spotLight2Pos = spotLightPos - vPosition;
  vec3 invSpotLight2Pos = normalize(invMatrix * vec4(spotLight2Pos, 0.0)).xyz;
  vec3 spotLight2Target = spotLightPos - spotLightTarget;
  vec3 invspotLight2Target = normalize(invMatrix * vec4(spotLight2Target, 0.0)).xyz;
  // 内積をとりスポットライトを当てる位置からの距離を測る
  float spotEffect = dot(normalize(invspotLight2Target), normalize(invSpotLight2Pos));
  // 光が当たる領域の光の強さを算出
  float spotCircleRange = smoothstep(spotLightOuter, spotLightInner, spotEffect);
  // 光の向きから拡散値を算出
  float diffuseSpot = spotCircleRange * clamp(dot(vNormal, invSpotLight2Pos), 0.0, 1.0);

  // ディレクショナルライトによって生じるポリゴンの陰影
  // スポットライトによって生じるポリゴンの陰影
  // 上記の陰影を合成する
  vec3 combinedLight = vec3(1.0, 1.0, 1.0) * diffuseDirectional + vec3(1.0, 0.0, 0.0) * diffuseSpot;

  gl_FragColor = vec4(vColor.rgb * combinedLight, 1.0);
  // gl_FragColor = vec4(1.0);
}