// 猜测是在伪造cookie
class CookieProvider {
  constructor(url) {
    this.data = {};
    this.domain = this.getDomain(url);
  }

  // 获取domain
  // NOTE 这里使用static的原因是eslint针对未通过this调用类方法或属性的方法应该被定义为静态方法
  static getDomain(url) {
    // eslint-disable-next-line no-unused-vars
    const [origin, domain = ""] = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    return domain;
  }

  // 目前没看到使用区域
  getCookie(name, callback) {
    const { domain } = this;
    if (this.data[domain] == null) {
      return callback("");
    }
    return callback(this.data[domain][name]);
  }

  // 设置cookie
  setCookie(name, value) {
    const { domain } = this;
    const data = this.data[domain] || {};
    data[name] = value;
  }

  // 获取请求头中的cookie
  getCookieForHTTPHeader() {
    const { domain } = this;
    const data = this.data[domain];
    if (data == null) {
      return "";
    }
    const cookies = [];
    Object.keys(data).forEach((k) => {
      const v = data[k];
      cookies.push(`${k}=${v}`);
    });
    return `${cookies.join(";")};`;
  }
}

export default CookieProvider;
