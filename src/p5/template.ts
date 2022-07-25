import p5 from "p5";
import opentype from "opentype.js";
import { interpolate_glyphs } from "./common/kinetype";
import { _KT_DataDraw, _KT_DataSetup, _KT_P5 } from "../types";

export interface KT_DataSetup extends _KT_DataSetup {

}

export interface KT_DataDraw extends _KT_DataDraw {

};
export interface KT_P5 extends _KT_P5{
}

const sketch_data_wrap = (data_setup: KT_DataSetup, data_draw: KT_DataDraw) => {
  const sketch = async (p: KT_P5) => {

    p.setup = function () {
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.createCanvas(data_setup.canvasWidth, data_setup.canvasHeight);
    };

    p.reset = async function () {
      console.log("Sketch reset");
      p.clear();
    };

    p.draw = function () {
      p.clear();

    };

  };
  return sketch;
};

export default sketch_data_wrap;
