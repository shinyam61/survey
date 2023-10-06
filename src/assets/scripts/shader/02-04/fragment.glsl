precision mediump float;

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
  // 法線を
  vec3 n = normalize((nMatrix * vec4(vNormal, 0.0)).xyz);

  // ディレクショナルライトの拡散値を算出
  float diffuseDirectional  = clamp(dot(n, normalize(directionalLightPos)), 0.0, 1.0);

  // 関連するベクトルの算出：ライトから頂点まで、ライトから光が向いている（光を当てる）箇所
  vec3 spotLight2Pos = spotLightPos - vPosition;
  vec3 spotLight2Target = spotLightPos - spotLightTarget;
  // 内積をとりスポットライトを当てる位置から頂点までの距離を測る
  float spotEffect = dot(normalize(spotLight2Target), normalize(spotLight2Pos));
  // 光が当たる領域の光の強さを算出
  float spotCircleRange = smoothstep(spotLightOuter, spotLightInner, spotEffect);
  // 光の向きから拡散値を算出
  float diffuseSpot = spotCircleRange * clamp(dot(n, spotLight2Pos), 0.0, 1.0);

  // ディレクショナルライトによって生じるポリゴンの陰影
  // スポットライトによって生じるポリゴンの陰影
  // 上記の陰影を合成する
  vec3 combinedLight = vec3(1.0, 1.0, 1.0) * diffuseDirectional + vec3(1.0, 0.0, 0.0) * diffuseSpot;

  gl_FragColor = vec4(vColor.rgb * combinedLight, 1.0);
  // gl_FragColor = vec4(1.0);
}