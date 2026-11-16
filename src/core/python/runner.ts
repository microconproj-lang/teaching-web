/**
 * Client-side Python 3 Interpreter & Test Grader
 * ทำงานใน Browser ทันที (<10ms) ไม่ต้องรอโหลด WASM จากอินเทอร์เน็ต
 * รองรับเนื้อหา ม.1–ม.3: Variables, String Slicing, List/Tuple/Dict/Set, Loops, Functions, f-strings
 */

export interface PythonRunResult {
  ok: boolean;
  stdout: string[];
  error: string | null;
  stepsExecuted: number;
}

export interface PythonTestCase {
  label: string;
  stdin?: string[];
  expectedOutput: string;
}

export interface PythonTestCaseResult {
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export interface PythonGradeResult {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  score: number;
  results: PythonTestCaseResult[];
}

type PyVal = unknown;

class ReturnSignal {
  constructor(public value: PyVal) {}
}
class BreakSignal {}
class ContinueSignal {}

function hasOwn(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function createNullDict(): Record<string, unknown> {
  return Object.create(null) as Record<string, unknown>;
}

function setDictEntry(dict: Record<string, unknown>, key: string, value: unknown): void {
  Object.defineProperty(dict, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function isDict(v: PyVal): v is Record<string, unknown> {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    !(v instanceof Set) &&
    !(v instanceof PyTuple)
  );
}

class PyTuple {
  constructor(public items: PyVal[]) {}
}

function toArray(v: PyVal): PyVal[] {
  if (Array.isArray(v)) return v;
  if (v instanceof PyTuple) return v.items;
  if (v instanceof Set) return Array.from(v);
  if (typeof v === "string") return Array.from(v);
  if (isDict(v)) return Object.keys(v);
  throw new Error(`TypeError: '${pyTypeName(v)}' object is not iterable`);
}

function pyTypeName(v: PyVal): string {
  if (v === null || v === undefined) return "NoneType";
  if (typeof v === "boolean") return "bool";
  if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";
  if (typeof v === "string") return "str";
  if (Array.isArray(v)) return "list";
  if (v instanceof PyTuple) return "tuple";
  if (v instanceof Set) return "set";
  if (typeof v === "function") return "function";
  return "dict";
}

function pyBool(v: PyVal): boolean {
  if (v === null || v === undefined || v === false) return false;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof PyTuple) return v.items.length > 0;
  if (v instanceof Set) return v.size > 0;
  if (isDict(v)) return Object.keys(v).length > 0;
  return true;
}

function pyRepr(v: PyVal): string {
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return `'${v}'`;
  if (Array.isArray(v)) return `[${v.map(pyRepr).join(", ")}]`;
  if (v instanceof PyTuple) {
    if (v.items.length === 1) return `(${pyRepr(v.items[0])},)`;
    return `(${v.items.map(pyRepr).join(", ")})`;
  }
  if (v instanceof Set) {
    if (v.size === 0) return "set()";
    return `{${Array.from(v).map(pyRepr).join(", ")}}`;
  }
  if (isDict(v)) {
    const entries = Object.entries(v).map(([k, val]) => `${pyRepr(k)}: ${pyRepr(val)}`);
    return `{${entries.join(", ")}}`;
  }
  return String(v);
}

export function pyStr(v: PyVal): string {
  if (typeof v === "string") return v;
  return pyRepr(v);
}

function pyEquals(a: PyVal, b: PyVal): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => pyEquals(item, b[i]));
  }
  if (a instanceof PyTuple && b instanceof PyTuple) {
    return a.items.length === b.items.length && a.items.every((item, i) => pyEquals(item, b.items[i]));
  }
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) if (!b.has(item)) return false;
    return true;
  }
  if (isDict(a) && isDict(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every((k) => k in b && pyEquals(a[k], b[k]));
  }
  return false;
}

// ============================================================================
// Expression Tokenizer & Recursive-Descent Evaluator
// ============================================================================

type TokKind = "num" | "str" | "fstr" | "id" | "op" | "punc";
interface Tok {
  kind: TokKind;
  val: string;
}

const MULTI_OPS = ["**", "//", "==", "!=", "<=", ">="];
const WORD_OPS = new Set(["and", "or", "not", "in", "is"]);

function tokenizeExpr(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === " " || ch === "\t" || ch === "\r") {
      i++;
      continue;
    }
    if (ch === "#") break;

    // f-string
    if ((ch === "f" || ch === "F") && (src[i + 1] === '"' || src[i + 1] === "'")) {
      const q = src[i + 1];
      i += 2;
      let buf = "";
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\" && i + 1 < src.length) {
          const esc = src[i + 1];
          buf += esc === "n" ? "\n" : esc === "t" ? "\t" : esc;
          i += 2;
        } else {
          buf += src[i++];
        }
      }
      if (i >= src.length) throw new Error("SyntaxError: unterminated f-string literal");
      i++;
      toks.push({ kind: "fstr", val: buf });
      continue;
    }

    // String literal
    if (ch === '"' || ch === "'") {
      const q = ch;
      i++;
      let buf = "";
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\" && i + 1 < src.length) {
          const esc = src[i + 1];
          buf += esc === "n" ? "\n" : esc === "t" ? "\t" : esc;
          i += 2;
        } else {
          buf += src[i++];
        }
      }
      if (i >= src.length) throw new Error("SyntaxError: unterminated string literal");
      i++;
      toks.push({ kind: "str", val: buf });
      continue;
    }

    // Number
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      toks.push({ kind: "num", val: src.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier or word operator
    if (/[A-Za-z_\u0E00-\u0E7F]/.test(ch)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_\u0E00-\u0E7F]/.test(src[j])) j++;
      const word = src.slice(i, j);
      toks.push({ kind: WORD_OPS.has(word) ? "op" : "id", val: word });
      i = j;
      continue;
    }

    // Two-char operator
    const two = src.slice(i, i + 2);
    if (MULTI_OPS.includes(two)) {
      toks.push({ kind: "op", val: two });
      i += 2;
      continue;
    }

    if ("+-*/%<>=".includes(ch)) {
      toks.push({ kind: "op", val: ch });
      i++;
      continue;
    }

    if ("()[]{},.:".includes(ch)) {
      toks.push({ kind: "punc", val: ch });
      i++;
      continue;
    }

    throw new Error(`SyntaxError: unexpected character '${ch}'`);
  }
  return toks;
}

class Scope {
  vars: Record<string, PyVal> = createNullDict();
  constructor(public parent: Scope | null = null) {}
  get(name: string): PyVal {
    if (hasOwn(this.vars, name)) return this.vars[name];
    if (this.parent) return this.parent.get(name);
    throw new Error(`NameError: name '${name}' is not defined`);
  }
  has(name: string): boolean {
    if (hasOwn(this.vars, name)) return true;
    return this.parent ? this.parent.has(name) : false;
  }
  set(name: string, value: PyVal) {
    setDictEntry(this.vars, name, value);
  }
}

interface ExecCtx {
  stdout: string[];
  stdin: string[];
  stdinIdx: number;
  steps: number;
  depth: number;
}

function tickStep(ctx: ExecCtx) {
  ctx.steps++;
  if (ctx.steps > 12_000) {
    throw new Error("TimeoutError: โค้ดทำงานเกิน 12,000 รอบ (โปรดตรวจสอบลูป while)");
  }
}

function evalExprString(expr: string, scope: Scope, ctx: ExecCtx): PyVal {
  const toks = tokenizeExpr(expr);
  if (toks.length === 0) return null;
  let pos = 0;

  const peek = () => toks[pos];
  const consume = () => toks[pos++];
  const matchPunc = (v: string) => {
    if (peek()?.kind === "punc" && peek()?.val === v) {
      pos++;
      return true;
    }
    return false;
  };

  function parseExpr(): PyVal {
    // Support ternary: a if cond else b
    const val = parseOr();
    if (peek()?.kind === "id" && peek()?.val === "if") {
      // Wait: 'if' is not in WORD_OPS so its kind is 'id' unless matched
    }
    return val;
  }

  function parseExprWithTernary(): PyVal {
    const val = parseOr();
    if (peek()?.kind === "id" && peek()?.val === "if") {
      consume();
      const cond = parseOr();
      if (!(peek()?.kind === "id" && peek()?.val === "else")) {
        throw new Error("SyntaxError: expected 'else' in conditional expression");
      }
      consume();
      const alt = parseExprWithTernary();
      return pyBool(cond) ? val : alt;
    }
    return val;
  }

  function parseOr(): PyVal {
    let left = parseAnd();
    while (peek()?.kind === "op" && peek()?.val === "or") {
      consume();
      const right = parseAnd();
      left = pyBool(left) ? left : right;
    }
    return left;
  }

  function parseAnd(): PyVal {
    let left = parseNot();
    while (peek()?.kind === "op" && peek()?.val === "and") {
      consume();
      const right = parseNot();
      left = pyBool(left) ? right : left;
    }
    return left;
  }

  function parseNot(): PyVal {
    if (peek()?.kind === "op" && peek()?.val === "not") {
      consume();
      return !pyBool(parseNot());
    }
    return parseComparison();
  }

  function parseComparison(): PyVal {
    let left = parseAdd();
    const cmpOps = new Set(["==", "!=", "<", "<=", ">", ">=", "in", "is"]);
    let result = true;
    let hadCmp = false;

    while (peek()?.kind === "op") {
      const opVal = peek()!.val;
      if (opVal === "not" && toks[pos + 1]?.kind === "op" && toks[pos + 1]?.val === "in") {
        pos += 2;
        const right = parseAdd();
        hadCmp = true;
        result = result && !checkIn(left, right);
        left = right;
        continue;
      }
      if (!cmpOps.has(opVal)) break;
      consume();
      let isNot = false;
      if (opVal === "is" && peek()?.kind === "op" && peek()?.val === "not") {
        consume();
        isNot = true;
      }
      const right = parseAdd();
      hadCmp = true;
      let ok = false;
      switch (opVal) {
        case "==":
          ok = pyEquals(left, right);
          break;
        case "!=":
          ok = !pyEquals(left, right);
          break;
        case "<":
          ok = (left as number) < (right as number);
          break;
        case "<=":
          ok = (left as number) <= (right as number);
          break;
        case ">":
          ok = (left as number) > (right as number);
          break;
        case ">=":
          ok = (left as number) >= (right as number);
          break;
        case "in":
          ok = checkIn(left, right);
          break;
        case "is":
          ok = isNot ? left !== right : left === right;
          break;
      }
      result = result && ok;
      left = right;
    }

    return hadCmp ? result : left;
  }

  function checkIn(item: PyVal, container: PyVal): boolean {
    if (typeof container === "string") return container.includes(String(item));
    if (Array.isArray(container)) return container.some((x) => pyEquals(x, item));
    if (container instanceof PyTuple) return container.items.some((x) => pyEquals(x, item));
    if (container instanceof Set) return container.has(item);
    if (isDict(container)) return hasOwn(container, String(item));
    throw new Error(`TypeError: argument of type '${pyTypeName(container)}' is not iterable`);
  }

  function parseAdd(): PyVal {
    let left = parseMul();
    while (peek()?.kind === "op" && (peek()?.val === "+" || peek()?.val === "-")) {
      const op = consume().val;
      const right = parseMul();
      if (op === "+") {
        if (typeof left === "string" && typeof right === "string") left = left + right;
        else if (Array.isArray(left) && Array.isArray(right)) left = [...left, ...right];
        else if (typeof left === "number" && typeof right === "number") left = left + right;
        else throw new Error(`TypeError: unsupported operand type(s) for +`);
      } else {
        if (typeof left === "number" && typeof right === "number") left = left - right;
        else if (left instanceof Set && right instanceof Set) {
          left = new Set([...left].filter((x) => !right.has(x)));
        } else throw new Error(`TypeError: unsupported operand type(s) for -`);
      }
    }
    return left;
  }

  function parseMul(): PyVal {
    let left = parseUnary();
    while (peek()?.kind === "op" && ["*", "/", "//", "%"].includes(peek()!.val)) {
      const op = consume().val;
      const right = parseUnary();
      if (op === "*") {
        if (typeof left === "string" && typeof right === "number") left = left.repeat(Math.max(0, right));
        else if (typeof left === "number" && typeof right === "string") left = right.repeat(Math.max(0, left));
        else if (Array.isArray(left) && typeof right === "number") {
          const out: PyVal[] = [];
          for (let k = 0; k < Math.max(0, right); k++) out.push(...left);
          left = out;
        } else if (typeof left === "number" && typeof right === "number") left = left * right;
        else throw new Error("TypeError: invalid operands for *");
      } else if (op === "/") {
        if (Number(right) === 0) throw new Error("ZeroDivisionError: division by zero");
        left = Number(left) / Number(right);
      } else if (op === "//") {
        if (Number(right) === 0) throw new Error("ZeroDivisionError: integer division by zero");
        left = Math.floor(Number(left) / Number(right));
      } else if (op === "%") {
        if (Number(right) === 0) throw new Error("ZeroDivisionError: integer modulo by zero");
        const n = Number(left);
        const m = Number(right);
        left = ((n % m) + m) % m;
      }
    }
    return left;
  }

  function parseUnary(): PyVal {
    if (peek()?.kind === "op" && (peek()?.val === "-" || peek()?.val === "+")) {
      const op = consume().val;
      const val = Number(parseUnary());
      return op === "-" ? -val : val;
    }
    return parsePower();
  }

  function parsePower(): PyVal {
    const base = parsePostfix();
    if (peek()?.kind === "op" && peek()?.val === "**") {
      consume();
      const exp = parseUnary();
      return Math.pow(Number(base), Number(exp));
    }
    return base;
  }

  function parsePostfix(): PyVal {
    let target = parsePrimary();

    while (peek()?.kind === "punc") {
      const p = peek()!.val;
      if (p === ".") {
        consume();
        const attrTok = consume();
        if (!attrTok || attrTok.kind !== "id") throw new Error("SyntaxError: expected attribute name");
        const methodName = attrTok.val;
        if (matchPunc("(")) {
          const args: PyVal[] = [];
          const kwargs: Record<string, PyVal> = createNullDict();
          parseCallArgs(args, kwargs);
          target = invokeMethod(target, methodName, args, kwargs);
        } else {
          throw new Error(`AttributeError: '${pyTypeName(target)}' object has no attribute '${methodName}'`);
        }
      } else if (p === "(") {
        consume();
        const args: PyVal[] = [];
        const kwargs: Record<string, PyVal> = createNullDict();
        parseCallArgs(args, kwargs);
        if (typeof target !== "function") {
          throw new Error(`TypeError: '${pyTypeName(target)}' object is not callable`);
        }
        target = (target as (...a: PyVal[]) => PyVal)(args, kwargs);
      } else if (p === "[") {
        consume();
        // Check slice syntax a[start:stop:step]
        const s1 = peek()?.val === ":" ? undefined : parseExprWithTernary();
        if (matchPunc(":")) {
          const s2 =
            peek()?.val === ":" || peek()?.val === "]" ? undefined : parseExprWithTernary();
          let s3: PyVal = undefined;
          if (matchPunc(":")) {
            s3 = peek()?.val === "]" ? undefined : parseExprWithTernary();
          }
          if (!matchPunc("]")) throw new Error("SyntaxError: expected ']' after slice");
          target = applySlice(target, s1 as number | undefined, s2 as number | undefined, s3 as number | undefined);
        } else {
          if (!matchPunc("]")) throw new Error("SyntaxError: expected ']'");
          target = applyIndex(target, s1);
        }
      } else {
        break;
      }
    }

    return target;
  }

  function parseCallArgs(args: PyVal[], kwargs: Record<string, PyVal>) {
    while (peek() && peek()!.val !== ")") {
      if (
        peek()!.kind === "id" &&
        toks[pos + 1]?.kind === "op" &&
        toks[pos + 1]?.val === "="
      ) {
        const key = consume().val;
        consume(); // =
        setDictEntry(kwargs, key, parseExprWithTernary());
      } else {
        args.push(parseExprWithTernary());
      }
      if (!matchPunc(",")) break;
    }
    if (!matchPunc(")")) throw new Error("SyntaxError: expected ')'");
  }

  function parsePrimary(): PyVal {
    const t = peek();
    if (!t) throw new Error("SyntaxError: unexpected end of expression");

    if (t.kind === "num") {
      consume();
      return t.val.includes(".") ? parseFloat(t.val) : parseInt(t.val, 10);
    }

    if (t.kind === "str") {
      consume();
      return t.val;
    }

    if (t.kind === "fstr") {
      consume();
      return evalFString(t.val, scope, ctx);
    }

    if (t.kind === "id") {
      consume();
      if (t.val === "True") return true;
      if (t.val === "False") return false;
      if (t.val === "None") return null;
      return resolveIdentifier(t.val, scope, ctx);
    }

    if (t.kind === "punc" && t.val === "(") {
      consume();
      if (matchPunc(")")) return new PyTuple([]);
      const first = parseExprWithTernary();
      if (matchPunc(",")) {
        const items: PyVal[] = [first];
        while (peek() && peek()!.val !== ")") {
          items.push(parseExprWithTernary());
          if (!matchPunc(",")) break;
        }
        if (!matchPunc(")")) throw new Error("SyntaxError: expected ')'");
        return new PyTuple(items);
      }
      if (!matchPunc(")")) throw new Error("SyntaxError: expected ')'");
      return first;
    }

    if (t.kind === "punc" && t.val === "[") {
      consume();
      if (matchPunc("]")) return [];
      // Check simple list comprehension by scanning ahead inside [...] up to depth 0
      const compRange = findListCompSplit(toks, pos);
      if (compRange) {
        const exprSlice = toks.slice(pos, compRange.forIdx);
        const varTok = toks[compRange.forIdx + 1];
        const iterEnd = compRange.ifIdx ?? compRange.endIdx;
        const iterSlice = toks.slice(compRange.forIdx + 3, iterEnd);
        const condSlice = compRange.ifIdx
          ? toks.slice(compRange.ifIdx + 1, compRange.endIdx)
          : null;
        pos = compRange.endIdx + 1;

        const iterVal = toArray(evalTokenSlice(iterSlice, scope, ctx));
        const out: PyVal[] = [];
        const loopScope = new Scope(scope);
        for (const item of iterVal) {
          tickStep(ctx);
          loopScope.set(varTok.val, item);
          if (condSlice && !pyBool(evalTokenSlice(condSlice, loopScope, ctx))) continue;
          out.push(evalTokenSlice(exprSlice, loopScope, ctx));
        }
        return out;
      }

      const items: PyVal[] = [];
      while (peek() && peek()!.val !== "]") {
        items.push(parseExprWithTernary());
        if (!matchPunc(",")) break;
      }
      if (!matchPunc("]")) throw new Error("SyntaxError: expected ']'");
      return items;
    }

    if (t.kind === "punc" && t.val === "{") {
      consume();
      if (matchPunc("}")) return createNullDict();
      const first = parseExprWithTernary();
      if (matchPunc(":")) {
        const firstVal = parseExprWithTernary();
        const dict = createNullDict();
        setDictEntry(dict, String(first), firstVal);
        while (matchPunc(",") && peek() && peek()!.val !== "}") {
          const k = parseExprWithTernary();
          if (!matchPunc(":")) throw new Error("SyntaxError: expected ':' in dict literal");
          setDictEntry(dict, String(k), parseExprWithTernary());
        }
        if (!matchPunc("}")) throw new Error("SyntaxError: expected '}'");
        return dict;
      } else {
        const s = new Set<PyVal>([first]);
        while (matchPunc(",") && peek() && peek()!.val !== "}") {
          s.add(parseExprWithTernary());
        }
        if (!matchPunc("}")) throw new Error("SyntaxError: expected '}'");
        return s;
      }
    }

    throw new Error(`SyntaxError: unexpected token '${t.val}'`);
  }

  return parseExprWithTernary();
}

function findListCompSplit(
  toks: Tok[],
  startPos: number
): { forIdx: number; ifIdx: number | null; endIdx: number } | null {
  let depth = 0;
  let forIdx = -1;
  let ifIdx: number | null = null;
  for (let i = startPos; i < toks.length; i++) {
    const t = toks[i];
    if (t.kind === "punc" && "([{".includes(t.val)) depth++;
    else if (t.kind === "punc" && ")]}".includes(t.val)) {
      if (depth === 0 && t.val === "]") {
        if (
          forIdx !== -1 &&
          toks[forIdx + 1]?.kind === "id" &&
          toks[forIdx + 2]?.kind === "op" &&
          toks[forIdx + 2]?.val === "in"
        ) {
          return { forIdx, ifIdx, endIdx: i };
        }
        return null;
      }
      depth--;
    } else if (depth === 0 && t.kind === "id" && t.val === "for" && forIdx === -1) {
      forIdx = i;
    } else if (depth === 0 && t.kind === "id" && t.val === "if" && forIdx !== -1 && ifIdx === null) {
      ifIdx = i;
    }
  }
  return null;
}

function evalTokenSlice(slice: Tok[], scope: Scope, ctx: ExecCtx): PyVal {
  const reconstructed = slice
    .map((t) =>
      t.kind === "str"
        ? JSON.stringify(t.val)
        : t.kind === "fstr"
          ? `f${JSON.stringify(t.val)}`
          : t.val
    )
    .join(" ");
  return evalExprString(reconstructed, scope, ctx);
}

function evalFString(template: string, scope: Scope, ctx: ExecCtx): string {
  let out = "";
  let i = 0;
  while (i < template.length) {
    if (template[i] === "{") {
      if (template[i + 1] === "{") {
        out += "{";
        i += 2;
        continue;
      }
      const close = template.indexOf("}", i + 1);
      if (close === -1) throw new Error("SyntaxError: f-string single '{' not closed");
      const inner = template.slice(i + 1, close);
      const colonIdx = inner.indexOf(":");
      const exprText = colonIdx !== -1 ? inner.slice(0, colonIdx) : inner;
      const fmtSpec = colonIdx !== -1 ? inner.slice(colonIdx + 1) : "";
      const val = evalExprString(exprText, scope, ctx);
      if (fmtSpec.endsWith("f") && typeof val === "number") {
        const match = /\.(\d+)f$/.exec(fmtSpec);
        const digits = match ? parseInt(match[1], 10) : 2;
        out += val.toFixed(digits);
      } else {
        out += pyStr(val);
      }
      i = close + 1;
    } else if (template[i] === "}" && template[i + 1] === "}") {
      out += "}";
      i += 2;
    } else {
      out += template[i++];
    }
  }
  return out;
}

function applyIndex(target: PyVal, index: PyVal): PyVal {
  if (typeof target === "string" || Array.isArray(target) || target instanceof PyTuple) {
    const seq = target instanceof PyTuple ? target.items : target;
    let idx = Number(index);
    if (!Number.isInteger(idx)) throw new Error("TypeError: indices must be integers");
    if (idx < 0) idx = seq.length + idx;
    if (idx < 0 || idx >= seq.length) throw new Error("IndexError: index out of range");
    return seq[idx];
  }
  if (isDict(target)) {
    const key = String(index);
    if (!hasOwn(target, key)) throw new Error(`KeyError: '${key}'`);
    return target[key];
  }
  throw new Error(`TypeError: '${pyTypeName(target)}' object is not subscriptable`);
}

function applySlice(
  target: PyVal,
  startRaw: number | undefined,
  stopRaw: number | undefined,
  stepRaw: number | undefined
): PyVal {
  const isStr = typeof target === "string";
  const isTup = target instanceof PyTuple;
  const seq = isStr
    ? Array.from(target)
    : isTup
      ? target.items
      : Array.isArray(target)
        ? target
        : null;
  if (!seq) throw new Error(`TypeError: '${pyTypeName(target)}' object is not subscriptable`);

  const n = seq.length;
  const step = stepRaw === undefined ? 1 : Number(stepRaw);
  if (step === 0) throw new Error("ValueError: slice step cannot be zero");

  let start: number;
  let stop: number;

  if (step > 0) {
    start =
      startRaw === undefined
        ? 0
        : startRaw < 0
          ? Math.max(0, n + startRaw)
          : Math.min(n, startRaw);
    stop =
      stopRaw === undefined
        ? n
        : stopRaw < 0
          ? Math.max(0, n + stopRaw)
          : Math.min(n, stopRaw);
  } else {
    start =
      startRaw === undefined
        ? n - 1
        : startRaw < 0
          ? Math.max(-1, n + startRaw)
          : Math.min(n - 1, startRaw);
    stop =
      stopRaw === undefined
        ? -1
        : stopRaw < 0
          ? Math.max(-1, n + stopRaw)
          : Math.min(n - 1, stopRaw);
  }

  const out: PyVal[] = [];
  if (step > 0) {
    for (let i = start; i < stop; i += step) out.push(seq[i]);
  } else {
    for (let i = start; i > stop; i += step) out.push(seq[i]);
  }

  if (isStr) return out.join("");
  if (isTup) return new PyTuple(out);
  return out;
}

function invokeMethod(
  target: PyVal,
  method: string,
  args: PyVal[],
  kwargs: Record<string, PyVal>
): PyVal {
  if (typeof target === "string") {
    switch (method) {
      case "strip":
        return target.trim();
      case "lstrip":
        return target.trimStart();
      case "rstrip":
        return target.trimEnd();
      case "upper":
        return target.toUpperCase();
      case "lower":
        return target.toLowerCase();
      case "title":
        return target.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
      case "capitalize":
        return target.length ? target[0].toUpperCase() + target.slice(1).toLowerCase() : "";
      case "split": {
        const sep = args[0] === undefined ? null : String(args[0]);
        if (sep === null) return target.trim() ? target.trim().split(/\s+/) : [];
        return target.split(sep);
      }
      case "join":
        return toArray(args[0]).map(pyStr).join(target);
      case "replace":
        return target.split(String(args[0])).join(String(args[1]));
      case "find":
        return target.indexOf(String(args[0]));
      case "count": {
        const sub = String(args[0]);
        if (!sub) return target.length + 1;
        return target.split(sub).length - 1;
      }
      case "startswith":
        return target.startsWith(String(args[0]));
      case "endswith":
        return target.endsWith(String(args[0]));
      case "isdigit":
        return target.length > 0 && /^\d+$/.test(target);
      case "isalpha":
        return target.length > 0 && /^[A-Za-zก-๙]+$/.test(target);
    }
  }

  if (Array.isArray(target)) {
    switch (method) {
      case "append":
        target.push(args[0]);
        return null;
      case "extend":
        target.push(...toArray(args[0]));
        return null;
      case "insert": {
        let idx = Number(args[0]);
        if (idx < 0) idx = Math.max(0, target.length + idx);
        target.splice(idx, 0, args[1]);
        return null;
      }
      case "pop": {
        if (target.length === 0) throw new Error("IndexError: pop from empty list");
        if (args.length === 0) return target.pop();
        let idx = Number(args[0]);
        if (idx < 0) idx += target.length;
        if (idx < 0 || idx >= target.length) throw new Error("IndexError: pop index out of range");
        return target.splice(idx, 1)[0];
      }
      case "remove": {
        const idx = target.findIndex((x) => pyEquals(x, args[0]));
        if (idx === -1) throw new Error("ValueError: list.remove(x): x not in list");
        target.splice(idx, 1);
        return null;
      }
      case "sort": {
        const rev = Boolean(kwargs.reverse);
        target.sort((a, b) => {
          const cmp =
            typeof a === "number" && typeof b === "number"
              ? a - b
              : String(a).localeCompare(String(b));
          return rev ? -cmp : cmp;
        });
        return null;
      }
      case "reverse":
        target.reverse();
        return null;
      case "count":
        return target.filter((x) => pyEquals(x, args[0])).length;
      case "index": {
        const idx = target.findIndex((x) => pyEquals(x, args[0]));
        if (idx === -1) throw new Error("ValueError: item not in list");
        return idx;
      }
      case "clear":
        target.length = 0;
        return null;
    }
  }

  if (isDict(target)) {
    switch (method) {
      case "keys":
        return Object.keys(target);
      case "values":
        return Object.values(target);
      case "items":
        return Object.entries(target).map(([k, v]) => new PyTuple([k, v]));
      case "get": {
        const k = String(args[0]);
        return hasOwn(target, k) ? target[k] : (args[1] ?? null);
      }
      case "pop": {
        const k = String(args[0]);
        if (!hasOwn(target, k)) {
          if (args.length > 1) return args[1];
          throw new Error(`KeyError: '${k}'`);
        }
        const val = target[k];
        delete target[k];
        return val;
      }
      case "update": {
        const other = args[0];
        if (isDict(other)) {
          for (const [k, v] of Object.entries(other)) {
            setDictEntry(target, k, v);
          }
        }
        return null;
      }
    }
  }

  if (target instanceof Set) {
    switch (method) {
      case "add":
        target.add(args[0]);
        return null;
      case "remove":
        if (!target.has(args[0])) throw new Error("KeyError: item not in set");
        target.delete(args[0]);
        return null;
      case "discard":
        target.delete(args[0]);
        return null;
      case "union":
        return new Set([...target, ...toArray(args[0])]);
      case "intersection": {
        const b = new Set(toArray(args[0]));
        return new Set([...target].filter((x) => b.has(x)));
      }
      case "difference": {
        const b = new Set(toArray(args[0]));
        return new Set([...target].filter((x) => !b.has(x)));
      }
    }
  }

  throw new Error(`AttributeError: '${pyTypeName(target)}' object has no method '${method}'`);
}

function resolveIdentifier(name: string, scope: Scope, ctx: ExecCtx): PyVal {
  if (scope.has(name)) return scope.get(name);

  const builtins: Record<string, (args: PyVal[], kwargs: Record<string, PyVal>) => PyVal> = {
    print: (args, kwargs) => {
      const sep = kwargs.sep !== undefined ? pyStr(kwargs.sep) : " ";
      const end = kwargs.end !== undefined ? pyStr(kwargs.end) : "\n";
      const line = args.map(pyStr).join(sep);
      if (end === "\n") {
        ctx.stdout.push(line);
      } else {
        if (ctx.stdout.length === 0) ctx.stdout.push(line + end);
        else ctx.stdout[ctx.stdout.length - 1] += line + end;
      }
      return null;
    },
    input: (args) => {
      const val = ctx.stdinIdx < ctx.stdin.length ? ctx.stdin[ctx.stdinIdx++] : "";
      if (args[0] !== undefined && String(args[0]).length > 0 && ctx.stdin.length === 0) {
        ctx.stdout.push(`${pyStr(args[0])}`);
      }
      return val;
    },
    len: (args) => {
      const v = args[0];
      if (typeof v === "string" || Array.isArray(v)) return v.length;
      if (v instanceof PyTuple) return v.items.length;
      if (v instanceof Set) return v.size;
      if (isDict(v)) return Object.keys(v).length;
      throw new Error(`TypeError: object of type '${pyTypeName(v)}' has no len()`);
    },
    range: (args) => {
      let start = 0;
      let stop = 0;
      let step = 1;
      if (args.length === 1) stop = Number(args[0]);
      else if (args.length === 2) {
        start = Number(args[0]);
        stop = Number(args[1]);
      } else if (args.length >= 3) {
        start = Number(args[0]);
        stop = Number(args[1]);
        step = Number(args[2]);
      }
      if (step === 0) throw new Error("ValueError: range() arg 3 must not be zero");
      const out: number[] = [];
      if (step > 0) {
        for (let i = start; i < stop && out.length < 5000; i += step) out.push(i);
      } else {
        for (let i = start; i > stop && out.length < 5000; i += step) out.push(i);
      }
      return out;
    },
    sum: (args) => toArray(args[0]).reduce<number>((acc, x) => acc + Number(x), 0),
    min: (args) => {
      const arr = args.length > 1 ? args : toArray(args[0]);
      return arr.reduce((a, b) => ((a as number) < (b as number) ? a : b));
    },
    max: (args) => {
      const arr = args.length > 1 ? args : toArray(args[0]);
      return arr.reduce((a, b) => ((a as number) > (b as number) ? a : b));
    },
    abs: (args) => Math.abs(Number(args[0])),
    round: (args) => {
      const num = Number(args[0]);
      const digits = args[1] !== undefined ? Number(args[1]) : 0;
      const factor = Math.pow(10, digits);
      return Math.round(num * factor) / factor;
    },
    sorted: (args, kwargs) => {
      const arr = [...toArray(args[0])];
      const rev = Boolean(kwargs.reverse);
      arr.sort((a, b) => {
        const cmp =
          typeof a === "number" && typeof b === "number"
            ? a - b
            : String(a).localeCompare(String(b));
        return rev ? -cmp : cmp;
      });
      return arr;
    },
    reversed: (args) => [...toArray(args[0])].reverse(),
    enumerate: (args) => {
      const start = args[1] !== undefined ? Number(args[1]) : 0;
      return toArray(args[0]).map((item, idx) => new PyTuple([start + idx, item]));
    },
    zip: (args) => {
      const seqs = args.map(toArray);
      const minLen = seqs.length ? Math.min(...seqs.map((s) => s.length)) : 0;
      const out: PyTuple[] = [];
      for (let i = 0; i < minLen; i++) out.push(new PyTuple(seqs.map((s) => s[i])));
      return out;
    },
    type: (args) => `<class '${pyTypeName(args[0])}'>`,
    int: (args) => {
      const n = parseInt(String(args[0]), 10);
      if (Number.isNaN(n)) throw new Error(`ValueError: invalid literal for int(): '${args[0]}'`);
      return n;
    },
    float: (args) => {
      const n = parseFloat(String(args[0]));
      if (Number.isNaN(n)) throw new Error(`ValueError: could not convert string to float`);
      return n;
    },
    str: (args) => (args.length === 0 ? "" : pyStr(args[0])),
    bool: (args) => pyBool(args[0]),
    list: (args) => (args.length === 0 ? [] : [...toArray(args[0])]),
    tuple: (args) => new PyTuple(args.length === 0 ? [] : toArray(args[0])),
    set: (args) => new Set(args.length === 0 ? [] : toArray(args[0])),
    dict: () => createNullDict(),
    ord: (args) => String(args[0]).charCodeAt(0),
    chr: (args) => String.fromCharCode(Number(args[0])),
  };

  if (hasOwn(builtins, name)) return builtins[name];
  throw new Error(`NameError: name '${name}' is not defined`);
}

// ============================================================================
// Block & Statement Runner
// ============================================================================

interface CodeLine {
  lineNo: number;
  indent: number;
  text: string;
}

function preprocessLines(code: string): CodeLine[] {
  const rawLines = code.replace(/\r\n/g, "\n").split("\n");
  const parsed: CodeLine[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].replace(/\t/g, "    ");
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const indent = line.length - line.trimStart().length;
    parsed.push({ lineNo: i + 1, indent, text: trimmed });
  }
  return parsed;
}

function collectBlock(lines: CodeLine[], startIdx: number, parentIndent: number): { block: CodeLine[]; nextIdx: number } {
  if (startIdx >= lines.length || lines[startIdx].indent <= parentIndent) {
    throw new Error(`IndentationError at line ${lines[startIdx - 1]?.lineNo ?? startIdx}: expected an indented block`);
  }
  const blockIndent = lines[startIdx].indent;
  const block: CodeLine[] = [];
  let i = startIdx;
  while (i < lines.length && lines[i].indent >= blockIndent) {
    block.push(lines[i]);
    i++;
  }
  return { block, nextIdx: i };
}

function assignTarget(targetStr: string, val: PyVal, scope: Scope, ctx: ExecCtx) {
  const t = targetStr.trim();
  // Unpacking: a, b = ...
  if (t.includes(",") && !t.includes("[")) {
    const names = t.split(",").map((s) => s.trim());
    const items = toArray(val);
    if (items.length !== names.length) {
      throw new Error(`ValueError: expected ${names.length} values to unpack, got ${items.length}`);
    }
    names.forEach((n, idx) => scope.set(n, items[idx]));
    return;
  }
  // Subscript assignment: arr[i] = val or dict[k] = val
  const subMatch = /^([A-Za-z_\u0E00-\u0E7F][A-Za-z0-9_\u0E00-\u0E7F]*)\[(.+)\]$/.exec(t);
  if (subMatch) {
    const container = scope.get(subMatch[1]);
    const keyVal = evalExprString(subMatch[2], scope, ctx);
    if (Array.isArray(container)) {
      let idx = Number(keyVal);
      if (idx < 0) idx += container.length;
      if (idx < 0 || idx >= container.length) throw new Error("IndexError: list assignment index out of range");
      container[idx] = val;
      return;
    }
    if (isDict(container)) {
      setDictEntry(container, String(keyVal), val);
      return;
    }
  }
  scope.set(t, val);
}

function splitTopLevelEq(text: string): { target: string; op: string; expr: string } | null {
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\" && i + 1 < text.length) {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) depth--;
    else if (depth === 0) {
      const two = text.slice(i, i + 2);
      if (["+=", "-=", "*=", "/=", "%="].includes(two)) {
        return { target: text.slice(0, i).trim(), op: two, expr: text.slice(i + 2).trim() };
      }
      if (ch === "=" && text[i + 1] !== "=" && text[i - 1] !== "!" && text[i - 1] !== "<" && text[i - 1] !== ">") {
        return { target: text.slice(0, i).trim(), op: "=", expr: text.slice(i + 1).trim() };
      }
    }
  }
  return null;
}

function runBlock(lines: CodeLine[], scope: Scope, ctx: ExecCtx): unknown {
  let i = 0;
  while (i < lines.length) {
    tickStep(ctx);
    const line = lines[i];
    const text = line.text;

    try {
      if (text === "pass") {
        i++;
        continue;
      }
      if (text === "break") return new BreakSignal();
      if (text === "continue") return new ContinueSignal();

      if (text === "return" || text.startsWith("return ")) {
        const expr = text.slice(6).trim();
        return new ReturnSignal(expr ? evalExprString(expr, scope, ctx) : null);
      }

      // Function definition
      const defMatch = /^def\s+([A-Za-z_\u0E00-\u0E7F][A-Za-z0-9_\u0E00-\u0E7F]*)\s*\((.*)\)\s*:$/.exec(text);
      if (defMatch) {
        const fnName = defMatch[1];
        const rawParams = defMatch[2].trim();
        const params = rawParams
          ? rawParams.split(",").map((p) => {
              const eq = p.indexOf("=");
              if (eq === -1) return { name: p.trim(), defExpr: null as string | null };
              return { name: p.slice(0, eq).trim(), defExpr: p.slice(eq + 1).trim() };
            })
          : [];
        const { block, nextIdx } = collectBlock(lines, i + 1, line.indent);
        const fnVal = (args: PyVal[], kwargs: Record<string, PyVal>) => {
          if (ctx.depth > 150) throw new Error("RecursionError: maximum recursion depth exceeded");
          ctx.depth++;
          try {
            const fnScope = new Scope(scope);
            params.forEach((p, idx) => {
              if (hasOwn(kwargs, p.name)) fnScope.set(p.name, kwargs[p.name]);
              else if (idx < args.length) fnScope.set(p.name, args[idx]);
              else if (p.defExpr !== null) fnScope.set(p.name, evalExprString(p.defExpr, scope, ctx));
              else throw new Error(`TypeError: ${fnName}() missing required argument '${p.name}'`);
            });
            const sig = runBlock(block, fnScope, ctx);
            if (sig instanceof ReturnSignal) return sig.value;
            return null;
          } finally {
            ctx.depth--;
          }
        };
        scope.set(fnName, fnVal);
        i = nextIdx;
        continue;
      }

      // if / elif / else
      if (text.startsWith("if ") && text.endsWith(":")) {
        const branches: { cond: string | null; block: CodeLine[] }[] = [];
        const firstCond = text.slice(3, -1).trim();
        const firstCollected = collectBlock(lines, i + 1, line.indent);
        branches.push({ cond: firstCond, block: firstCollected.block });
        i = firstCollected.nextIdx;

        while (i < lines.length && lines[i].indent === line.indent) {
          const nextText = lines[i].text;
          if (nextText.startsWith("elif ") && nextText.endsWith(":")) {
            const c = nextText.slice(5, -1).trim();
            const col = collectBlock(lines, i + 1, lines[i].indent);
            branches.push({ cond: c, block: col.block });
            i = col.nextIdx;
          } else if (nextText === "else:") {
            const col = collectBlock(lines, i + 1, lines[i].indent);
            branches.push({ cond: null, block: col.block });
            i = col.nextIdx;
            break;
          } else {
            break;
          }
        }

        for (const br of branches) {
          if (br.cond === null || pyBool(evalExprString(br.cond, scope, ctx))) {
            const sig = runBlock(br.block, scope, ctx);
            if (sig instanceof ReturnSignal || sig instanceof BreakSignal || sig instanceof ContinueSignal) {
              return sig;
            }
            break;
          }
        }
        continue;
      }

      // for loop
      const forMatch = /^for\s+(.+?)\s+in\s+(.+):$/.exec(text);
      if (forMatch) {
        const targetStr = forMatch[1];
        const iterVal = toArray(evalExprString(forMatch[2], scope, ctx));
        const { block, nextIdx } = collectBlock(lines, i + 1, line.indent);
        for (const item of iterVal) {
          tickStep(ctx);
          assignTarget(targetStr, item, scope, ctx);
          const sig = runBlock(block, scope, ctx);
          if (sig instanceof ReturnSignal) return sig;
          if (sig instanceof BreakSignal) break;
        }
        i = nextIdx;
        continue;
      }

      // while loop
      if (text.startsWith("while ") && text.endsWith(":")) {
        const condExpr = text.slice(6, -1).trim();
        const { block, nextIdx } = collectBlock(lines, i + 1, line.indent);
        while (pyBool(evalExprString(condExpr, scope, ctx))) {
          tickStep(ctx);
          const sig = runBlock(block, scope, ctx);
          if (sig instanceof ReturnSignal) return sig;
          if (sig instanceof BreakSignal) break;
        }
        i = nextIdx;
        continue;
      }

      // Assignment / augmented assignment
      const assign = splitTopLevelEq(text);
      if (assign) {
        const rhsVal = evalExprString(assign.expr, scope, ctx);
        if (assign.op === "=") {
          assignTarget(assign.target, rhsVal, scope, ctx);
        } else {
          const cur = scope.get(assign.target);
          if (assign.op === "+=") {
            const nextVal =
              typeof cur === "string" && typeof rhsVal === "string"
                ? cur + rhsVal
                : Array.isArray(cur) && Array.isArray(rhsVal)
                  ? [...cur, ...rhsVal]
                  : Number(cur) + Number(rhsVal);
            scope.set(assign.target, nextVal);
          } else if (assign.op === "-=") scope.set(assign.target, Number(cur) - Number(rhsVal));
          else if (assign.op === "*=") scope.set(assign.target, Number(cur) * Number(rhsVal));
          else if (assign.op === "/=") scope.set(assign.target, Number(cur) / Number(rhsVal));
          else if (assign.op === "%=") scope.set(assign.target, Number(cur) % Number(rhsVal));
        }
        i++;
        continue;
      }

      // Bare expression (e.g., print(...), arr.append(...))
      evalExprString(text, scope, ctx);
      i++;
    } catch (err) {
      if (err instanceof Error && !err.message.includes("line ")) {
        throw new Error(`บรรทัดที่ ${line.lineNo}: ${err.message}`);
      }
      throw err;
    }
  }
  return null;
}

export function runPythonCode(code: string, stdin: string[] = []): PythonRunResult {
  const ctx: ExecCtx = {
    stdout: [],
    stdin,
    stdinIdx: 0,
    steps: 0,
    depth: 0,
  };

  try {
    const lines = preprocessLines(code);
    const rootScope = new Scope();
    runBlock(lines, rootScope, ctx);
    return {
      ok: true,
      stdout: ctx.stdout,
      error: null,
      stepsExecuted: ctx.steps,
    };
  } catch (err) {
    return {
      ok: false,
      stdout: ctx.stdout,
      error: err instanceof Error ? err.message : "RuntimeError",
      stepsExecuted: ctx.steps,
    };
  }
}

export function gradePythonChallenge(code: string, testCases: PythonTestCase[]): PythonGradeResult {
  const results: PythonTestCaseResult[] = testCases.map((tc) => {
    const run = runPythonCode(code, tc.stdin ?? []);
    const actual = run.stdout.join("\n").trim();
    const expected = tc.expectedOutput.trim();
    const passed = run.ok && actual === expected;
    return {
      label: tc.label,
      passed,
      expected,
      actual: run.ok ? actual || "(ไม่มี Output)" : "",
      error: run.error ?? undefined,
    };
  });

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  return {
    passed: totalCount > 0 && passedCount === totalCount,
    passedCount,
    totalCount,
    score,
    results,
  };
}

