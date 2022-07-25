import p5 from "p5";
import type { SketchDataClosure, SketchClosure } from "../types";

// TODO: fix typing, there's error as it's unchecked later on

export function useP5Helpers() {
  /**
   * Create a p5 sketch instance in given HTML element
   * @param sketch a closure that returns a p5 sketch (instance mode)
   * @param elementId HTML element id where p5 creates the canvas
   * @returns instance of the p5 sketch
   */
  async function p5_bind_sketch(sketch: SketchClosure, elementId : string) : Promise<p5> {
    try {
      const canvas = document.getElementById(elementId);
      if (!canvas) {
        throw new Error(`Cannot bind P5 sketch with HTMLelement #${elementId}.`);
      }
      return await new p5(sketch, canvas);
    } catch (e) {
      return Promise.reject(new Error(`Couldn't load sketch in element #${elementId}: ` + e));
    }
  }

  /**
   * Connect p5 sketch to the given data
   * @param sketch_closure which accepts setup and draw data
   * @param setup_data data to be used in setup function, hint to redraw the whole sketch on change
   * @param draw_data data to be used in draw
   * @returns closure with p5 sketch
   */
  function p5_bind_data(sketch_closure : SketchDataClosure, setup_data : Object, draw_data: Object) : any {
    return sketch_closure(setup_data, draw_data);
  }

  /**
   * Make a screenshot of canvas and encode it to base64 jpeg
   * @param elementId HTML element id of the canvas
   * @returns string with base64 encoded jpeg image
   */
  function p5_get_canvas_image(elementId : string) : string {
    try {
      const canvas = document.getElementById(elementId) as HTMLCanvasElement;
      if (!canvas) {
        throw new Error(`Cannot find canvas in HTMLelement #${elementId}.`);
      }
      return canvas.toDataURL("image/jpeg").split(';base64,')[1];
    } catch (e) {
      throw new Error("Cannot get canvas image: " + e);
    }
  }

  return { p5_bind_sketch, p5_bind_data, p5_get_canvas_image };
}
