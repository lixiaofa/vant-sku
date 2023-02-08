/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-02-08 10:51:28
 * @LastEditTime: 2023-02-08 10:52:30
 * @LastEditors: 司马老贼
 */
import { Plugin } from "vite";
import _ from "lodash";

const regex = /import (.*?),(.*?)from ["']vue["']/g;
function replaceVue3DefautImport(code: string) {
  return code.replace(regex, 'import * as $1 from "vue"\nimport $2 from "vue"');
}

export default function fixVue3NoMatchingExportDefaultPlugin(opt: {
  fileName?: string;
}): Plugin {
  return {
    name: "vite:fixVue3NoMatchingExportDefaultPlugin",
    enforce: "post",
    apply: "build",
    generateBundle(options, bundle, isWrite) {
      _.each(bundle, (value, fileName) => {
        if (!value.code) {
          return;
        }
        if (opt.fileName) {
          if (fileName === opt.fileName) {
            value.code = replaceVue3DefautImport(value.code);
          }
        } else {
          value.code = replaceVue3DefautImport(value.code);
        }
      });
    },
  };
}
