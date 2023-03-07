'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::usuario.usuario', ({ strapi }) => ({ 
    async findOne(ctx) {
        try {
            const { id } = ctx.params;

            const entity = await strapi.db.query('api::usuario.usuario').findOne({
                where: { correo: id },
                populate: true
            });
            if (!entity) {
                return {
                    data: null,
                    error: {
                        status: 404,
                        name: 'NotFoundError',
                        message: `El correo ${id} no existe`,
                        details: {}
                    }
                };
            }
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error) {
            return ctx.send({ message: 'Ha ocurrido un error' }, 500);
        }
    },

    async update(ctx) {
        try {
            const { id } = ctx.params;

            const entity = await strapi.db.query('api::usuario.usuario').update({
                where: { correo: id }
            });
            if (!entity) {
                return {
                    data: null,
                    error: {
                        status: 404,
                        name: 'NotFoundError',
                        message: `El correo ${id} no existe`,
                        details: {}
                    }
                };
            }
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error) {            
            return ctx.send({ message: 'Ha ocurrido un error' }, 500);
        }
    }
 }));
