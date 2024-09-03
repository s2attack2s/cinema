class Request {
  host = null;

  constructor(location) {
    this.host = location.protocol + "//" + location.host;
  }

  url = (path) => {
    if (path && !path.match(/^\s*\//)) {
      path = "/" + path;
    }
    return this.host + (path || "");
  };

  decode = (path) => {
    return decodeURIComponent(path);
  };

  encode = (path) => {
    return encodeURIComponent(path);
  };
}

// Sử dụng lớp Request trong môi trường trình duyệt
const request = new Request(window.location);
console.log(request.url("/api/data"));
