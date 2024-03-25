import vShader from './shader/05-05/vertex.glsl?raw'
import fShader from './shader/05-05/fragment.glsl?raw'

import App from "./05";

window.addEventListener('DOMContentLoaded', () => {
  new App(vShader, fShader);
})
