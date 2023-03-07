'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
    async findOne(ctx) {
        try {
            const { id } = ctx.params;

            const entity = await strapi.db.query('plugin::users-permissions.user').findOne({
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
    },
    
}));
