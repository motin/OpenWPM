// tslint:disable:no-expression-statement
import test from "ava";
import { escapeString, escapeUrl } from "./string-utils";

test("escapeString with a number", t => {
  t.is(escapeString(123), "123");
});

test("escapeUrl", t => {
  t.is(escapeUrl("https://mozilla.org"), "https://mozilla.org");
});

test("escapeUrl with stripDataUrlData=true", t => {
  const stripDataUrlData = true;
  t.is(
    escapeUrl("data:,abcdef0123456789", stripDataUrlData),
    "data:,<data-stripped>",
  );
});

test("escapeUrl with stripDataUrlData=false", t => {
  const stripDataUrlData = false;
  t.is(
    escapeUrl("data:,abcdef0123456789", stripDataUrlData),
    "data:,abcdef0123456789",
  );
});
