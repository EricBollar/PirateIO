// let lastTime = (new Date()).getTime();
// export function updateOcean(ocean, camera) {
//     var currentTime = new Date().getTime();
//     ocean.deltaTime = ( currentTime - lastTime ) / 1000 || 0.0;
//     lastTime = currentTime;
//     ocean.render(ocean.deltaTime);
//     ocean.overrideMaterial = ocean.materialOcean;

//     ocean.materialOcean.uniforms[ "u_normalMap" ].value = ocean.normalMapFramebuffer.texture;
//     ocean.materialOcean.uniforms[ "u_displacementMap" ].value = ocean.displacementMapFramebuffer.texture;
//     ocean.materialOcean.uniforms[ "u_projectionMatrix" ].value = camera.projectionMatrix;
//     ocean.materialOcean.uniforms[ "u_viewMatrix" ].value = camera.matrixWorldInverse;
//     ocean.materialOcean.uniforms[ "u_cameraPosition" ].value = camera.position;
//     ocean.materialOcean.depthTest = true;
// }