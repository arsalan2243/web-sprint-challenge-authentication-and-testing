const db = require("../../data/dbConfig")

const getAll = () => {
  return db("users")
}
const getById = async (id) => {
  const singleUser = await db("users").where("id", id).first()
  return singleUser
}
const insert = async (user) => {
  const [id] = await db("users").insert(user)
  const newuser = getById(id)
  return newuser
}

const findBy = async (filter) => {
  const found = await db("users").where(filter).first()
  return found
}

module.exports = {
  getAll,
  getById,
  insert,
  findBy,
}
