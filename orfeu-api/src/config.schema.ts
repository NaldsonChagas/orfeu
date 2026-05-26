import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  LASTFM_API_KEY: Joi.string().required(),
  LASTFM_BASE_URL: Joi.string().required(),
});
