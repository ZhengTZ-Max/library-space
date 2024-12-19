import * as dd from "dingtalk-jsapi";
import store from "../store";
import {
  wx_login,
  qywx_login,
  // DingTalk_LOGIN,
  // QYWX_LOGIN,
  // getDingTalk_config,
  // APP_LOGIN,
} from "@/request/login";

export async function WX_LOGIN(data) {
  try {
    const res = await wx_login(data);
    console.log("登录成功？", JSON.stringify(res));
    if (res.code !== 1) {
      if (res.open_id) {
        // sessionStorage.setItem("openId", res.open_id);
        localStorage.setItem("openId", res.open_id);
      }
      // toLogin();
      return false;
    }

    if (res) {
      localStorage.setItem("openId", res.open_id);
      sessionStorage.setItem("token", res.member.token);
      store.dispatch("updateLoginInfo", res.member);
    }
    loginSuccess();
  } catch (e) {
    console.log("授权失败...?", JSON.stringify(e));
    // toLogin();
  }
}

export async function QYWX_LOGIN(data) {
  try {
    const res = await qywx_login(data);
    console.log("登录成功？", JSON.stringify(res));
    if (res.code !== 1) {
      // toLogin();
      return false;
    }
    sessionStorage.setItem("token", res.member.token);
    store.dispatch("updateLoginInfo", res.member);

    loginSuccess();
  } catch (e) {
    console.log("授权失败...", JSON.stringify(e));
    // toLogin();
  }
}

export function getAgent() {
  let ua = navigator.userAgent.toLowerCase();
  let isWx = ua.match(/MicroMessenger/i) == "micromessenger";
  let isDingTalk = getDingTalkDev();
  let isUrlToken = sessionStorage.getItem("token");
  if (isUrlToken) {
    return "APP";
  } else if (ua.match(/WxWork/i) == "wxwork") {
    return "QY_WX";
  } else if (isWx) {
    return "WX";
  } else if (isDingTalk) {
    return "DingTalk";
  } else {
    return "DEFAULT";
  }
}

export function getUrlKey(key) {
  let reg = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)");
  let result = reg.exec(window.location.href);
  return result ? decodeURIComponent(result[2] || "") : null;
}

export function getDingTalkDev() {
  return dd.env.platform !== "notInDingTalk";
}
export function getDingTalkCode(corp_id) {
  return new Promise(async (resolve, reject) => {
    try {
      dd.ready(() => {
        //使用SDK 获取免登授权码
        dd.runtime.permission.requestAuthCode({
          corpId: corp_id,
          onSuccess: (info) => {
            // 根据钉钉提供的api 获得code后,再次调用这个callback方法
            // 由于是钉钉获取code是异步操作,不知道什么时候执行完毕
            // callback 函数会等他执行完毕后在自己调用自己
            resolve(info.code);
          },
          onFail: (err) => {
            console.log(err);
            resolve(0);
          },
        });
      });
    } catch (e) {
      console.log(e);
      resolve(0);
    }
  });
}

export async function VerifySystem({ config, router }) {
  console.log("VerifyConfig", config, router, store);

  let agent = getAgent();
  let isVerify = sessionStorage.getItem("verifyLogin");
  let agentSystem = sessionStorage.getItem("agentSystem");
  let token = sessionStorage.getItem("token");
  let originUrl = window.location.href;
  if (!isVerify) {
    sessionStorage.setItem("verifyLogin", true);
  }

  if (!agentSystem) {
    sessionStorage.setItem("agentSystem", agent);
  }

  if (agent == "APP") {
    // token && APP_LOGIN({ token });
  } else if (agent == "DEFAULT" || token) {
    router.replace("/");
  } else if (agent == "WX" && config?.wechat?.app_id) {
    if (config?.wechat?.callback) {
      let openId = getUrlKey("openid");
      if (openId) {
        WX_LOGIN({ openId });
      } else {
        window.location.href = config?.wechat?.callback;
      }
    } else {
      let code = getUrlKey("code") || "";
      let openId = localStorage.getItem("openId") || "";
      if (!code && !openId && !isVerify) {
        let redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize`;
        let params = {
          appid: config?.wechat?.app_id,
          redirect_uri: encodeURIComponent(originUrl),
          response_type: "code",
          scope: "snsapi_base",
        };

        window.location.href = `${redirectUrl}?appid=${params.appid}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&scope=${params.scope}&state=1&connect_redirect=1#wechat_redirect`;
      } else {
        console.log("我是微信授权code", code);
        if (openId) {
          WX_LOGIN({ openId });
        } else if (code) {
          WX_LOGIN({ code });
        }
      }
    }
  } else if (agent == "QY_WX" && config?.wxwork?.app_id) {
    let code = getUrlKey("code");
    // let openId = localStorage.getItem("openId") || "";
    if (!code) {
      let redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize`;
      let params = {
        appid: config?.wxwork?.app_id,
        redirect_uri: encodeURIComponent(originUrl),
        response_type: "code",
        scope: "snsapi_base",
      };
      window.location.href = `${redirectUrl}?appid=${params.appid}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&scope=${params.scope}&state=1&connect_redirect=1#wechat_redirect`;
    } else {
      console.log("企业微信-------------------");
      console.log(window.location.href);
      QYWX_LOGIN({ code });
    }
  } else if (agent == "DingTalk" && config?.dingtalk?.app_key) {
    // let dingCode = await getDingTalkCode(config?.dingtalk?.corp_id);
    // console.log("我获取了钉钉企业id，使用dd.ready获取了授权code", dingCode);
    // let code = dingCode || route.query.code || "";
    // if (!code) {
    //   let redirectUrl = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize`;
    //   // let corpInfo = await getDingTalk_config();
    //   // console.log("钉钉企业ID -------- ", corpInfo);
    //   // if (!corpInfo.app_key) return false;
    //   let params = {
    //     appid: config?.dingtalk?.app_key,
    //     redirect_uri: encodeURIComponent(originUrl),
    //     response_type: "code",
    //     scope: "snsapi_auth",
    //   };
    //   console.log("钉钉企业ID -------- ", JSON.stringify(params));
    //   console.log(
    //     "钉钉跳转地址 -------- ",
    //     `${redirectUrl}?redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&appid=${params.appid}&scope=${params.scope}&state=1`
    //   );
    //   // location.hash = "#/login";
    //   setTimeout(() => {
    //     location.href = `${redirectUrl}?redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&appid=${params.appid}&scope=${params.scope}&state=1`;
    //   }, 0);
    // } else {
    //   console.log("钉钉-------------------");
    //   console.log(window.location.href);
    //   DingTalk_LOGIN({ code });
    // }
  } else {
    sessionStorage.setItem("authError", true);
    router.replace("/");
  }
}

function loginSuccess() {
  try {
    // let qrInfo = sessionStorage.getItem("qrInfo") || "";
    // let touchQRMethod = sessionStorage.getItem("touchQRMethod") || "";
    // if (qrInfo) {
    //   location.hash = "#/booking";
    // } else if (touchQRMethod) {
    //   location.hash = "#/scancheck";
    // } else {
    //   let routePath = localStorage.getItem("toPath");
    //   let routeQuery = localStorage.getItem("toQuery");
    //   let routeInfo = localStorage.getItem("routeInfo");

    //   if (routePath) {
    //     localStorage.removeItem("toPath");
    //     localStorage.removeItem("toQuery");
    //     let goPath = routePath;
    //     if (routeQuery || routeInfo) {
    //       let goQuery = "";

    //       if (routeQuery && routeQuery != "{}") {
    //         goQuery = jsonToUrlParams(JSON.parse(routeQuery));
    //       } else if (routeInfo && routeInfo != "{}") {
    //         goQuery = jsonToUrlParams(JSON.parse(routeInfo));
    //       }
    //       console.log(goQuery, "goQuery-");
    //       goPath = `#${routePath}?${goQuery}`;
    //     } else {
    //       goPath = `#${routePath}`;
    //     }
    //     setTimeout(() => {
    //       location.hash = goPath;
    //     }, 50);
    //   } else {
    //     location.hash = "#/home";
    //   }
    // }

    location.hash = "#/";
  } catch (e) {
    console.log(e);
  }
}
