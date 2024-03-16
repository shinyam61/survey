import vShader from './shader/05-04/vertex.glsl?raw'
import fShader from './shader/05-04/fragment.glsl?raw'

import App from "./05";

window.addEventListener('DOMContentLoaded', () => {
  new App(vShader, fShader);
})
