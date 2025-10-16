attribute vec3 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec2 uScreen;
uniform sampler2D tMap;
uniform vec2 uTextureSize;
uniform vec2 uCover;
uniform float uTime;
uniform float uStart;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
    vUv = uv.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}