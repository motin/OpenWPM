import { injectResponseBodyListenerPageScript } from "openwpm-webext-instrumentation";

injectResponseBodyListenerPageScript(window.openWpmResponseBodyListenerContentScriptConfig || {});
delete window.openWpmResponseBodyListenerContentScriptConfig;
