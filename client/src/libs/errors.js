// lỗi 5XX
export function HttpError(data, res) {
  this.name = "HttpError";
  this.error = data.error || data.title || data.Message || res.statusText || res.status || "Request error";
  this.message = data.message || data.error_description || data.MessageDetail || data.ExceptionMessage || res.statusText || this.error;
  this.status = res.status;
  this.statusText = res.statusText;
  this.url = res.url;
  this.stack = new Error().stack.split("\n").slice(1).join("\n");
  this.type = "http";
  this.responseData = data;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.toString = function () {
  return `Http: ${this.error}\n${this.message}`;
};

//không kết nối được tới server
export function NetworkError(error, url) {
  this.name = "NetworkError";
  this.error = error.error || error.title || "Network error";
  this.message = error.message == "Failed to fetch" ? "Error connect to server" : error.message || "Not connect";
  this.stack = error.stack && error.stack.replace("TypeError", "NetworkError");
  this.url = url;
  this.type = "network";
}
NetworkError.prototype = Object.create(Error.prototype);
NetworkError.prototype.toString = function () {
  return `Network: ${this.error}\n${this.message}`;
};

//Lỗi 4xx
export function DataError(data, res) {
  if (data.title && data.errors && typeof data.errors == "object") {
    this.error = data.title;
    this.errorDetails = data.errors;
    this.message = Object.values(data.errors)
      .map((v) => v.join("; "))
      .join("; ")
      .replace(/\.;/g, ";");
  } else {
    this.error = data.error || data.title || data.Message || res.statusText || res.status || "Data error";
    this.message = data.message || data.error_description || data.MessageDetail || data.ExceptionMessage || res.statusText || this.error;
  }
  this.name = "DataError";
  this.status = res.status;
  this.statusText = res.statusText;
  this.url = res.url;
  this.type = "data";
  this.responseData = data;
}
DataError.prototype = Object.create(Error.prototype);
DataError.prototype.toString = function () {
  return `Data: ${this.error}\n${this.message}`;
};
