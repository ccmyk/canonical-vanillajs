#version 300 es
precision highp float;
#define attribute in
#define varying out

attribute vec2 uv;
attribute vec3 position;

                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;

attribute float id;
attribute vec3 index;

uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uMouse;
uniform float uPower;
uniform float uCols;
uniform int uLength;

varying vec2 vUv;
varying vec2 vUvR;

varying vec3 vPos;
varying vec3 vIndex;
varying float vId;

void main() {
    vUv = uv;
    vUvR = vec2(gl_VertexID << 1 & 2, gl_VertexID & 2);

    vPos = position;
    // vPos.x *=.5;
    vId = id;
    vIndex = index;
    
    if(vId == 3.){
      // vPos.x += sin(uTime * .002) * .005;
      // vUvR.x += sin(uTime * .002) * .1;
    }

    // gl_Position = vec4(vPos.x,vPos.y,vPos.z,  1.);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

// gl_Position = position;

}

