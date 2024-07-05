const zod = require('zod');

const signup = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string().min(8)
})

const signin = zod.object({
    username : zod.string().email(),
    password : zod.string()
})


const updateUser = zod.object({
    lastName : zod.string().optional(),
    password : zod.string().optional(),
    firstName : zod.string().optional()
})

module.exports = {
    signup,
    signin,
    updateUser
}