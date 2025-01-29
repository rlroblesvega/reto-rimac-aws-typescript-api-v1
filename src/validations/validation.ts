import Joi = require('joi');

export const payloadSchema = Joi.object({
  stock: Joi.string().required(),
  priceBuy: Joi.number().greater(0).required(),
  quantity: Joi.number().integer().positive().required(),
});


export const saveDataApisExternalsSchema = Joi.object({
    peopleId: Joi.string().required()
});