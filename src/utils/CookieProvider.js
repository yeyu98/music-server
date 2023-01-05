// 猜测是在伪造cookie
class CookieProvider {
    data = {};
    domain = "";

    constructor(url) {
      this.domain = this.getDomain(url)
    }

    // 获取domain
    getDomain(url) {
        const [origin, domain = ""] = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
        return domain;
    }
  
    // 目前没看到使用区域
    getCookie(name, callback) {
      const domain = this.domain
      if (this.data[domain] == null) {
        return callback('');
      }
      return callback(this.data[domain][name]);
    }
  
    // 设置cookie
    setCookie(name, value) {
      const domain = this.domain
      const data = this.data[domain]
      if (data == null) {
        data = {};
      }
      data[name] = value;
    }
  
    // 获取请求头中的cookie 
    getCookieForHTTPHeader() {
      const domain = this.domain
      const data = this.data[domain]
      if (data == null) {
        return '';
      }
      const cookies = [];
      Object.keys(data).forEach((k) => {
        const v = data[k];
        cookies.push(`${k}=${v}`);
      });
      return `${cookies.join(';')};`;
    }


}

export default CookieProvider