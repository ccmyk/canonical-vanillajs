#version 300 es
precision highp float;
#define attribute in
#define varying out

in vec3 uv;
in vec3 position;

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

out vec2 vUv;

void main() {

    vUv = uv.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}