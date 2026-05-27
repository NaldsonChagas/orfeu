import * as Joi from 'joi';

export const addToLibrarySchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  artist: Joi.string().required(),
  imageUrl: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});
