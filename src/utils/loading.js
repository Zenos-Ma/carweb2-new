import Vue from "vue";
import { Loading } from "element-ui";

let loadOn;
let needLoadingCount = 0;
function startLoading(target) {
  const options = {
    lock: true,
    text: "Loading...",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
    target: document.querySelector(target)
  };
  loadOn = Loading.service(options);
  return loadOn;
}

function endLoading() {
  loadOn.close();
}

export function showFullScreenLoading(target) {
  if (needLoadingCount === 0) {
    startLoading(target);
  }
  needLoadingCount++;
}
export function hideFullScreenLoading() {
  if (needLoadingCount <= 0) return;
  needLoadingCount--;
  if (needLoadingCount === 0) {
    endLoading();
  }
}
