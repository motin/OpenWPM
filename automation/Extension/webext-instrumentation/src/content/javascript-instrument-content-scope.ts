import { instrumentFingerprintingApis } from "../lib/instrument-fingerprinting-apis";
import { jsInstruments } from "../lib/js-instruments";
import { pageScript } from "./javascript-instrument-page-scope";

function getPageScriptAsString() {
  return (
    jsInstruments +
    "\n" +
    instrumentFingerprintingApis +
    "\n" +
    "(" +
    pageScript +
    "({jsInstruments, instrumentFingerprintingApis}));"
  );
}

function insertScript(text, data) {
  const parent = document.documentElement,
    script = document.createElement("script");
  script.text = text;
  script.async = false;

  for (const key of Object.keys(data)) {
    const qualifiedName = "data-" + key.split("_").join("-");
    script.setAttribute(qualifiedName, data[key]);
  }

  parent.insertBefore(script, parent.firstChild);
  parent.removeChild(script);
}

function emitMsg(type, msg) {
  msg.timeStamp = new Date().toISOString();
  browser.runtime.sendMessage({
    namespace: "javascript-instrumentation",
    type,
    data: msg,
  });
}

export function injectJavascriptInstrumentPageScript(contentScriptConfig) {
  const event_id = Math.random();

  // listen for messages from the script we are about to insert
  document.addEventListener(event_id.toString(), function(e: CustomEvent) {
    // pass these on to the background page
    const msgs = e.detail;
    if (Array.isArray(msgs)) {
      msgs.forEach(function(msg) {
        emitMsg(msg.type, msg.content);
      });
    } else {
      emitMsg(msgs.type, msgs.content);
    }
  });

  insertScript(getPageScriptAsString(), {
    event_id,
    ...contentScriptConfig,
  });
}
