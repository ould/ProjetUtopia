const createError = require('http-errors')
const User = require('../Models/User.model')
const { userSchema } = require('../helpers/validation_schema')

module.exports = {


    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find();
            res.send(users)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },


    save: async (req, res, next) => {
        try {
            const result = await userSchema.validateAsync(req.body)
            result.creePar = req.payload.userId

            if (result._id)
                throw createError.Conflict(`${result._id} is already `)

            const user = new User(result)
            const saveduser = await user.save()
            const savefuserId = saveduser._id

            res.send(savefuserId)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const result = await userSchema.validateAsync(req.body)

            const doesExist = await User.findOne({ _id: result.id })
            if (!doesExist)
                throw createError.NotFound(`${result.id} not found`);

            result.modifiePar = req.payload.userId

            const filter = { _id: result.id };
            const updateduser = await User.findOneAndUpdate(filter, result, {
                returnOriginal: false
            });
            res.send(updateduser.id)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    get: async (req, res, next) => {
        try {
            const id = req.params.id

            const doesExist = await User.findOne({ _id: id })
            if (!doesExist)
                throw createError.NotFound(`${result} not found`);
            res.send(doesExist)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id

            const doesExist = await User.findOneAndDelete({ _id: id })
            res.send(doesExist.id)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
