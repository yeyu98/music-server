function getParameterByName(name, url) {
  // 从url上取某个参数的值
  // if (!url) url = window.location.href;
  const replacedName = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${replacedName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

module.exports = {
  getParameterByName,
};
