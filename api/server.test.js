// Write your tests here
const request = require("supertest")
const server = require("./server")
const db = require("../data/dbConfig")
const bcrypt = require("bcryptjs")

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db("users").truncate()
})
afterAll(async () => {
  await db.destroy()
})

test("sanity", () => {
  expect(true).toBe(true)
})

describe("server.js", () => {
  describe("[Get] /api/jokes", () => {
    it('return error "token required" when no token is provided', async () => {
      const res = await request(server).get("/api/jokes")
      expect(res.body.message).toBe("token required")
    })
    it('return error "invalid token" wrong token is given', async () => {
      const res = await request(server)
        .get("/api/jokes")
        .set("Authorization", "abcdefg")
      expect(res.body.message).toBe("invalid token")
    })
  })

  describe("[Post] /api/auth/register", () => {
    it('request with out username or password will give error "username and password required" ', async () => {
      const res = await request(server).post("/api/auth/register").send({
        username: "",
        password: "12345",
      })
      expect(res.body.message).toBe("username and password required")
    })
    it("the new user password will be saved in the database as a hashed password ", async () => {
      await request(server).post("/api/auth/register").send({
        username: "          jonny",
        password: "12345",
      })
      const newuser = await db("users").where("username", "jonny").first()
      expect(bcrypt.compareSync("12345", newuser.password)).toBeTruthy()
    })
  })

  describe("[Post] /api/auth/login", () => {
    test('respond with error "invalid credentials" when given invalid credentials', async () => {
      const res = await request(server).post("/api/auth/login").send({
        username: "ehsan",
        password: "1234",
      })
      expect(res.body.message).toBe("invalid credentials")
      expect(res.status).toBe(401)
    })
  })
  test('missing passowrd or username will return an error "username and password required"', async () => {
    const res = await request(server).post("/api/auth/login").send({
      username: "ehsan",
      password: "",
    })

    expect(res.body.message).toBe("username and password required")
    expect(res.status).toBe(401)
  })
})
