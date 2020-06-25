// Code below is not a content script: no Firefox APIs should be used
// Also, no webpack/es6 imports except for type definitions
// may be used in this file since the script
// is exported as a page script as a string

export interface OpenWPMInjectedPageScriptResponseInfo {
  source: "page-script-document-outer-html" | "xhook-after-event";
  ordinal: number;
  response: {
    finalUrl: string;
    headers: any;
    data: string | ArrayBuffer;
    [k: string]: any;
  };
}

export const responseBodyListenerPageScript = function() {
  const injection_uuid = document.currentScript.getAttribute(
    "data-injection-uuid",
  );

  // To keep track of the original order of events
  let ordinal = 0;

  // messages the injected script
  function sendMessagesToLogger(messages) {
    const loggerEvent = new CustomEvent(injection_uuid, {
      detail: messages,
    });
    try {
      const cancelled = !document.dispatchEvent(loggerEvent);
      if (cancelled) {
        console.error("OpenWPM custom event dispatch cancelled");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const testing =
    document.currentScript.getAttribute("data-testing") === "true";

  if (testing) {
    console.log("OpenWPM: Currently testing");
  }

  /*
   * Start Instrumentation
   */
  const startInstrumentation = () => {
    if (!window.openWpmResponseBodyListenerInstrumentationStarted) {
      // Inlined minimized version of the xhook library
      // so that we only run it when the instrumentation ought to be started
      // (it pollutes global variables and enables itself by default when included as an external script)
      // TODO: Inline this at build-time instead, to not have to copy paste on library upgrades
      /*!
       * XHook - v1.5.0 - https://github.com/jpillora/xhook
       * Jaime Pillora <dev@jpillora.com> - MIT Copyright 2020
       */
      /* tslint:disable */
      // prettier-ignore
      // @ts-ignore
      !function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=9)}([function(e,t,n){"use strict";(function(e){n.d(t,"b",(function(){return s})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){return i}));let o=null;"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?o=self:void 0!==e?o=e:a&&(o=a);const r="undefined"!=typeof navigator&&navigator.useragent?navigator.userAgent:"";let s=null;(/msie (\d+)/.test(r.toLowerCase())||/trident\/.*; rv:(\d+)/.test(r.toLowerCase()))&&(s=parseInt(RegExp.$1,10));const a=o,i=o.document}).call(this,n(11))},function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return s})),n.d(t,"d",(function(){return i})),n.d(t,"e",(function(){return c})),n.d(t,"c",(function(){return u}));var o=n(0);const r=["load","loadend","loadstart"],s=["progress","abort","error","timeout"],a=e=>["returnValue","totalSize","position"].includes(e),i=function(e,t){for(let n in e){if(a(n))continue;const o=e[n];try{t[n]=o}catch(e){}}return t},c=function(e,t,n){const o=e=>function(o){const r={};for(let e in o){if(a(e))continue;const s=o[e];r[e]=s===t?n:s}return n.dispatchEvent(e,r)};for(let r of Array.from(e))n._has(r)&&(t[`on${r}`]=o(r))},u=function(e){if(o.a&&null!=o.a.createEventObject){const t=o.a.createEventObject();return t.type=e,t}try{return new Event(e)}catch(t){return{type:e}}}},function(e,t,n){"use strict";var o=n(0),r=n(4),s=o.c.FormData;const a=function(e){this.fd=e?new s(e):new s,this.form=e;const t=[];Object.defineProperty(this,"entries",{get:()=>(e?Object(r.a)(e.querySelectorAll("input,select")).filter(e=>!["checkbox","radio"].includes(e.type)||e.checked).map(e=>[e.name,"file"===e.type?e.files:e.value]):[]).concat(t)}),this.append=function(){const e=Object(r.a)(arguments);return t.push(e),this.fd.append.apply(this.fd,e)}.bind(this)};t.a={patch(){s&&(o.c.FormData=a)},unpatch(){s&&(o.c.FormData=s)},Native:s,Xhook:a}},function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var o=n(4),r=n(1);const s=function(e){let t={};const n=e=>t[e]||[],s={addEventListener:function(e,o,r){t[e]=n(e),t[e].indexOf(o)>=0||(r=void 0===r?t[e].length:r,t[e].splice(r,0,o))},removeEventListener:function(e,o){if(void 0===e)return void(t={});void 0===o&&(t[e]=[]);const r=n(e).indexOf(o);-1!==r&&n(e).splice(r,1)},dispatchEvent:function(){const t=Object(o.a)(arguments),a=t.shift();e||(t[0]=Object(r.d)(t[0],Object(r.c)(a)));const i=s[`on${a}`];i&&i.apply(s,t);const c=n(a).concat(n("*"));for(let e=0;e<c.length;e++){c[e].apply(s,t)}},_has:e=>!(!t[e]&&!s[`on${e}`])};return e&&(s.listeners=e=>Object(o.a)(n(e)),s.on=s.addEventListener,s.off=s.removeEventListener,s.fire=s.dispatchEvent,s.once=function(e,t){var n=function(){return s.off(e,n),t.apply(null,arguments)};return s.on(e,n)},s.destroy=()=>t={}),s}},function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),Array.prototype.indexOf||(Array.prototype.indexOf=function(e){for(let t=0;t<this.length;t++){if(this[t]===e)return t}return-1});const o=(e,t)=>Array.prototype.slice.call(e,t)},function(e,t,n){"use strict";t.a={convert:function(e,t){let n;switch(null==t&&(t={}),typeof e){case"object":var o=[];for(let t in e){const r=e[t];n=t.toLowerCase(),o.push(`${n}:\t${r}`)}return o.join("\n")+"\n";case"string":o=e.split("\n");for(let e of Array.from(o))if(/([^:]+):\s*(.+)/.test(e)){n=null!=RegExp.$1?RegExp.$1.toLowerCase():void 0;const e=RegExp.$2;null==t[n]&&(t[n]=e)}return t}return[]}}},function(e,t,n){"use strict";var o=n(3);const r=Object(o.a)(!0);t.a=r},function(e,t,n){"use strict";var o=n(0),r=n(1),s=n(3),a=n(5),i=n(2);const c=e=>void 0===e?null:e,u=o.c.XMLHttpRequest,f=function(){const e=new u,t={};let n=null,f=void 0,d=void 0,l=void 0;var p=0;const h=function(){if(l.status=n||e.status,-1===n&&o.b<10||(l.statusText=e.statusText),-1===n);else{const t=a.a.convert(e.getAllResponseHeaders());for(let e in t){const n=t[e];if(!l.headers[e]){const t=e.toLowerCase();l.headers[t]=n}}}},y=function(){x.status=l.status,x.statusText=l.statusText},v=function(){f||x.dispatchEvent("load",{}),x.dispatchEvent("loadend",{}),f&&(x.readyState=0)},b=function(e){for(;e>p&&p<4;)x.readyState=++p,1===p&&x.dispatchEvent("loadstart",{}),2===p&&y(),4===p&&(y(),"text"in l&&(x.responseText=l.text),"xml"in l&&(x.responseXML=l.xml),"data"in l&&(x.response=l.data),"finalUrl"in l&&(x.responseURL=l.finalUrl)),x.dispatchEvent("readystatechange",{}),4===p&&(!1===t.async?v():setTimeout(v,0))},g=function(e){if(4!==e)return void b(e);const n=xhook.listeners("after");var o=function(){if(n.length>0){const e=n.shift();2===e.length?(e(t,l),o()):3===e.length&&t.async?e(t,l,o):o()}else b(4)};o()};var x=Object(s.a)();t.xhr=x,e.onreadystatechange=function(t){try{2===e.readyState&&h()}catch(e){}4===e.readyState&&(d=!1,h(),function(){if(e.responseType&&"text"!==e.responseType)"document"===e.responseType?(l.xml=e.responseXML,l.data=e.responseXML):l.data=e.response;else{l.text=e.responseText,l.data=e.responseText;try{l.xml=e.responseXML}catch(e){}}"responseURL"in e&&(l.finalUrl=e.responseURL)}()),g(e.readyState)};const m=function(){f=!0};x.addEventListener("error",m),x.addEventListener("timeout",m),x.addEventListener("abort",m),x.addEventListener("progress",(function(t){p<3?g(3):e.readyState<=3&&x.dispatchEvent("readystatechange",{})})),("withCredentials"in e||xhook.addWithCredentials)&&(x.withCredentials=!1),x.status=0;for(let e of Array.from(r.a.concat(r.b)))x[`on${e}`]=null;if(x.open=function(e,n,o,r,s){p=0,f=!1,d=!1,t.headers={},t.headerNames={},t.status=0,t.method=e,t.url=n,t.async=!1!==o,t.user=r,t.pass=s,l={},l.headers={},g(1)},x.send=function(n){let o,s;for(o of["type","timeout","withCredentials"])s="type"===o?"responseType":o,s in x&&(t[o]=x[s]);t.body=n;const a=xhook.listeners("before");var c=function(){if(!a.length)return function(){for(o of(Object(r.e)(r.a,e,x),x.upload&&Object(r.e)(r.a.concat(r.b),e.upload,x.upload),d=!0,e.open(t.method,t.url,t.async,t.user,t.pass),["type","timeout","withCredentials"]))s="type"===o?"responseType":o,o in t&&(e[s]=t[o]);for(let n in t.headers){const o=t.headers[n];n&&e.setRequestHeader(n,o)}t.body instanceof i.a.Xhook&&(t.body=t.body.fd),e.send(t.body)}();const n=function(e){if("object"==typeof e&&("number"==typeof e.status||"number"==typeof l.status))return Object(r.d)(e,l),"data"in e||(e.data=e.response||e.text),void g(4);c()};n.head=function(e){Object(r.d)(e,l),g(2)},n.progress=function(e){Object(r.d)(e,l),g(3)};const u=a.shift();1===u.length?n(u(t)):2===u.length&&t.async?u(t,n):n()};c()},x.abort=function(){n=-1,d?e.abort():x.dispatchEvent("abort",{})},x.setRequestHeader=function(e,n){const o=null!=e?e.toLowerCase():void 0,r=t.headerNames[o]=t.headerNames[o]||e;t.headers[r]&&(n=t.headers[r]+", "+n),t.headers[r]=n},x.getResponseHeader=e=>c(l.headers[e?e.toLowerCase():void 0]),x.getAllResponseHeaders=()=>c(a.a.convert(l.headers)),e.overrideMimeType&&(x.overrideMimeType=function(){e.overrideMimeType.apply(e,arguments)}),e.upload){let e=Object(s.a)();x.upload=e,t.upload=e}return x.UNSENT=0,x.OPENED=1,x.HEADERS_RECEIVED=2,x.LOADING=3,x.DONE=4,x.response="",x.responseText="",x.responseXML=null,x.readyState=0,x.statusText="",x};f.UNSENT=0,f.OPENED=1,f.HEADERS_RECEIVED=2,f.LOADING=3,f.DONE=4,t.a={patch(){u&&(o.c.XMLHttpRequest=f)},unpatch(){u&&(o.c.XMLHttpRequest=u)},Native:u,Xhook:f}},function(e,t,n){"use strict";var o=n(0),r=n(1),s=n(6),a=n(2);const i=o.c.fetch,c=function(e,t){null==t&&(t={headers:{}}),t.url=e;let n=null;const o=s.a.listeners("before"),c=s.a.listeners("after");return new Promise((function(e,s){const u=function(){return t.body instanceof a.a.Xhook&&(t.body=t.body.fd),t.headers&&(t.headers=new Headers(t.headers)),n||(n=new Request(t.url,t)),Object(r.d)(t,n)};var f=function(t){if(!c.length)return e(t);const n=c.shift();return 2===n.length?(n(u(),t),f(t)):3===n.length?n(u(),t,f):f(t)};const d=function(t){if(void 0!==t){const n=new Response(t.body||t.text,t);return e(n),void f(n)}l()};var l=function(){if(!o.length)return void p();const e=o.shift();return 1===e.length?d(e(t)):2===e.length?e(u(),d):void 0},p=()=>i(u()).then(e=>f(e)).catch((function(e){return f(e),s(e)}));l()}))};t.a={patch(){i&&(o.c.fetch=c)},unpatch(){i&&(o.c.fetch=i)},Native:i,Xhook:c}},function(e,t,n){"use strict";n.r(t),function(e){var t=n(3),o=n(0),r=n(5),s=n(7),a=n(8),i=n(2);const c=n(6).a;c.EventEmitter=t.a,c.before=function(e,t){if(e.length<1||e.length>2)throw"invalid hook";return c.on("before",e,t)},c.after=function(e,t){if(e.length<2||e.length>3)throw"invalid hook";return c.on("after",e,t)},c.enable=function(){s.a.patch(),a.a.patch(),i.a.patch()},c.disable=function(){s.a.unpatch(),a.a.unpatch(),i.a.unpatch()},c.XMLHttpRequest=s.a.Native,c.fetch=a.a.Native,c.FormData=i.a.Native,c.headers=r.a.convert,c.enable(),"function"==typeof define&&n(12)?define("xhook",[],()=>c):e&&"object"==typeof e&&e.exports?e.exports={xhook:c}:o.c&&(o.c.xhook=c)}.call(this,n(10)(e))},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){(function(t){e.exports=t}).call(this,{})}]);
      /* tslint:enable */

      // @ts-ignore
      const xhook = window.xhook;

      // send the closest thing we have to the response body of the document
      const responseInfo: OpenWPMInjectedPageScriptResponseInfo = {
        source: "page-script-document-outer-html",
        ordinal: ordinal++,
        response: {
          finalUrl: window.location.href,
          data: window.document.documentElement.outerHTML,
          headers: null,
        },
      };
      sendMessagesToLogger([responseInfo]);

      xhook.enable();
      xhook.after(function(_request, response) {
        const xhookEventResponseInfo: OpenWPMInjectedPageScriptResponseInfo = {
          source: "xhook-after-event",
          ordinal: ordinal++,
          response: {
            finalUrl: response.finalUrl,
            data: response.data,
            headers: response.headers,
          },
        };
        sendMessagesToLogger([xhookEventResponseInfo]);
      });
      window.openWpmResponseBodyListenerInstrumentationStarted = true;
      if (testing) {
        console.log(
          "OpenWPM: Content-side response body listener started",
          new Date().toISOString(),
        );
      }
    }
  };

  if (document.body) {
    startInstrumentation();
  } else {
    window.addEventListener("DOMContentLoaded", startInstrumentation);
  }
};
