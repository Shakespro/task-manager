import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import express from "express";
import User from "../src/models/auth/UserModel.js";
import Token from "../src/models/auth/Token.js";
import {
  resetPassword,
  registerUser,
} from "../src/controllers/auth/userController.js";
import { protect } from "../src/middleware/authMiddleware.js";
import { accountLimiter } from "../src/middleware/rateLimits.js";
import { validPassword } from "../src/helpers/session.js";
import errorHandler from "../src/helpers/errorhandler.js";

function invoke(handler, req) {
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      clearCookie() {
        return this;
      },
      json(body) {
        resolve({ status: this.statusCode, body });
      },
    };
    handler(req, res, reject);
  });
}

test("reset tokens can only change a password once and invalidate old sessions", async (t) => {
  let available = true;
  let saves = 0;
  const user = {
    tokenVersion: 3,
    async save() {
      saves++;
    },
  };
  t.mock.method(Token, "findOneAndDelete", async (query) => {
    assert.ok(query.expiresAt.$gt <= Date.now());
    assert.notEqual(query.passwordResetToken, "test-token");
    if (!available) return null;
    available = false;
    return { userId: "test-user" };
  });
  t.mock.method(User, "findById", async () => user);
  const request = {
    params: { resetPasswordToken: "test-token" },
    body: { password: "example-password" },
  };
  const results = await Promise.all([
    invoke(resetPassword, request),
    invoke(resetPassword, request),
  ]);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
  assert.equal(saves, 1);
  assert.equal(user.tokenVersion, 4);
});

test("invalid passwords do not consume reset tokens", async (t) => {
  const consume = t.mock.method(Token, "findOneAndDelete", () => {
    throw new Error("Unexpected database access");
  });
  const result = await invoke(resetPassword, {
    params: { resetPasswordToken: "test" },
    body: { password: "short" },
  });
  assert.equal(result.status, 400);
  assert.equal(consume.mock.callCount(), 0);
  assert.equal(validPassword("🙂".repeat(19)), false);
});

test("missing registration fields stop before database access", async (t) => {
  const lookup = t.mock.method(User, "findOne", () => {
    throw new Error("Unexpected database access");
  });
  assert.equal((await invoke(registerUser, { body: {} })).status, 400);
  assert.equal(lookup.mock.callCount(), 0);
});

test("protected routes reject tokens issued before a password change", async (t) => {
  process.env.JWT_SECRET = "local-security-test-secret";
  t.mock.method(User, "findById", () => ({
    select: async () => ({ tokenVersion: 2 }),
  }));
  const token = jwt.sign(
    { id: "test-user", tokenVersion: 1 },
    process.env.JWT_SECRET,
  );
  assert.equal((await invoke(protect, { cookies: { token } })).status, 401);
});

test("account endpoints reject repeated attempts", async (t) => {
  const app = express();
  app.post("/", accountLimiter, (req, res) => res.sendStatus(200));
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/`;
  for (let i = 0; i < 5; i++)
    assert.equal((await fetch(url, { method: "POST" })).status, 200);
  assert.equal((await fetch(url, { method: "POST" })).status, 429);
});

test("production errors do not expose server details", async () => {
  const previous = process.env.RENDER;
  process.env.RENDER = "true";
  try {
    const result = await invoke(
      (req, res, next) =>
        errorHandler(new Error("private database detail"), req, res, next),
      {},
    );
    assert.deepEqual(result, {
      status: 500,
      body: { message: "An unexpected error occurred" },
    });
  } finally {
    if (previous === undefined) delete process.env.RENDER;
    else process.env.RENDER = previous;
  }
});
