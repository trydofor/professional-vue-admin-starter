/**
 * @file json string and js model convertor
 * @author trydofor
 * @since 2021-09-06
 */

/**
 * auto cast json to model
 * @param json json string
 */
export function json2model<T>(json: string): T {
  return JSON.parse(json) as T;
}

/**
 * convert object to json string
 * @param model data object
 */
export function model2json(model: unknown): string {
  return JSON.stringify(model);
}

/**
 * wrapped json and model converter
 */
export default { json2model, model2json };
