import { HttpError, NetworkError, DataError } from "./errors";
import request from "./request";
var qs = require("qs");

export default ({ dispatch, getState }) => {
  return (next) => {
    return (action) => {
      if (typeof action === "object" && action.url && !action.type) {
        return apiCall({
          action,
          dispatch,
          getState,
        });
      }
      return next(action);
    };
  };
};

const apiCall = ({ action, dispatch, getState }) => {
  var { host, url, json, method, params, meta, retry, body, contentType, abortController, download, onStart, onSuccess, onError } = action;

  host = host || request.host;

  url = host + url;

  method = !method ? "GET" : method.toUpperCase();

  retry = retry == undefined ? (method == "GET" ? 1 : 0) : retry;

  dispatchAction(onStart, {
    params,
    meta,
  });

  if (!contentType && !body) {
    contentType = json != false ? "application/json" : "application/x-www-form-urlencoded";
  }

  if (params && !body) {
    if (method != "GET" && method != "DELETE") {
      if (json !== false) {
        body = JSON.stringify(params);
      } else {
        body = qs.stringify(params, { skipNulls: true });
      }
    } else {
      url +=
        "?" +
        qs.stringify(params, {
          allowDots: true,
          skipNulls: true,
        });
    }
  }

  const opts = {
    method: method,
    headers: {
      "X-Requested-With": "AjaxMiddleware",
    },
    body: body,
  };

  if (contentType) {
    opts.headers["Content-Type"] = contentType;
  }

  // if (token) {
  //     opts.headers['Authorization'] = 'Bearer ' + token;
  // }

  if (abortController && abortController.signal) {
    opts.signal = abortController.signal;
  }

  return new Promise(function (resolve, reject) {
    function onFetchComplete(res, autoRefreshToken) {
      var type = res.headers.get("Content-Type");
      if (!res.ok) {
        if (type && type.match(/application\/(problem\+)?json/)) {
          return res
            .json()
            .catch((e) => ({}))
            .then((data) => {
              if (res.status == 401 && (data.message || data.title) == "Unauthorized") {
                if (autoRefreshToken && res.headers.get("X-Token-Expired") == "true") {
                  //try refresh token, if ok then fetch again, otherwise dispatch logout
                  fetch("/auth/refresh-token", { method: "POST", "Content-Type": "application/json" })
                    .then((res) => res.json())
                    .then(() => {
                      startFetch(false);
                    })
                    .catch(async (error) => {
                      dispatch({
                        type: "account/logoutSuccess",
                      });

                      await handleError(new DataError(data, res), reject);
                    });
                  return;
                } else {
                  dispatch({
                    type: "account/logoutSuccess",
                  });
                }
              }

              if (res.status < 500) {
                throw new DataError(data, res);
              }
              throw new HttpError(data, res);
            });
        } else {
          return res
            .text()
            .catch((e) => null)
            .then((data) => {
              throw new HttpError(
                {
                  message: data,
                },
                res
              );
            });
        }
      }
      if (download) {
        const filename = res.headers.get("Content-Disposition").match(/filename=([^;]+);/)[1];

        res.blob().then((data) => {
          const href = window.URL.createObjectURL(data);
          const link = document.createElement("a");
          link.href = href;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
        return;
      }

      if (type && type.match(/application\/json/)) {
        return res.json();
      }

      return Promise.resolve(null);
    }

    function startFetch(autoRefreshToken = true) {
      fetch(url, opts)
        .then((res) => onFetchComplete(res, autoRefreshToken))
        .then(async (data) => {
          if (data === undefined) return;

          return await handleSuccess(data, resolve, reject);
        })
        .catch(async (error) => {
          if (error.name === "AbortError") return;

          return await handleError(error, reject);
        });
    }

    startFetch();
  });

  async function handleError(error, reject) {
    error = error instanceof HttpError || error instanceof DataError ? error : new NetworkError(error, url);

    var noConnection = error instanceof NetworkError || error.status >= 500;

    reportError(url, method, opts.headers, body, error.responseData ?? error, error.status);

    await dispatchAction(onError, {
      params,
      meta,
      url,
      noConnection,
    });

    return reject(error);
  }

  async function handleSuccess(data, resolve, reject) {
    if (data && data.error) {
      return onError(new DataError(data), reject);
    }

    await dispatchAction(onSuccess, {
      params,
      data,
      meta,
    });
    return resolve(data);
  }

  async function dispatchAction(action, data) {
    if (action) {
      if (Array.isArray(action)) {
        for (let actionFunc of action) {
          await dispatch(actionFunc(data));
        }
      } else {
        await dispatch(action(data));
      }
    }
  }
};
