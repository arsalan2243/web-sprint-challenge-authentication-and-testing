const db = require("../../data/dbConfig")
const Us = require("./users-model")

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

it("test env should be set", () => {
  expect(process.env.NODE_ENV).toBe("testing")
})

describe("getAll users model function", () => {
  beforeEach(async () => {
    await db("users").insert({ username: "ehsan", password: "1234" })
    await db("users").insert({ username: "jon", password: "4321" })
    await db("users").insert({ username: "tom", password: "1243" })
  })
  it("getAll shoud return at leat have one user", async () => {
    const users = await Us.getAll()
    expect(users).toHaveLength(3)
  })
})

describe("getById users model function", () => {
  let id
  beforeEach(async () => {
    id = await db("users").insert({ username: "ehsan", password: "1234" })
  })
  it("getById shoud return user with specified id", async () => {
    const user = await Us.getById(id)
    expect(user).toMatchObject({ username: "ehsan", password: "1234" })
  })
})

describe("insert users model function", () => {
  it("insert should add new user to the db", async () => {
    await Us.insert({ username: "ehsan", password: "1234" })
    await Us.insert({ username: "jon", password: "4321" })
    const allUsers = await db("users")
    expect(allUsers).toHaveLength(2)
  })
  it("insert should return a new user", async () => {
    const user = await Us.insert({ username: "ehsan", password: "1234" })
    expect(user).toMatchObject({ username: "ehsan", password: "1234" })
  })
})

describe("findBy users model function ", () => {
  it("findBy should return a user object", async () => {
    await db("users").insert({ username: "ehsan", password: "1234" })
    const user = await Us.findBy({ username: "ehsan" })
    expect(user).toMatchObject({ username: "ehsan", password: "1234" })
  })
  it("findBy shoud retun undefined if notting is found", async () => {
    const user = await Us.findBy({ username: "ehsan" })
    expect(user).toBe(undefined)
  })
})
