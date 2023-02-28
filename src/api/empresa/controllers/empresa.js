'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::empresa.empresa', ({ strapi }) => ({
    async findOne(ctx) {
        try {
            const { id } = ctx.params;

            const entity = await strapi.db.query('api::empresa.empresa').findOne({
                where: { ruc: id }
            });
            if (!entity) {
                return {
                    data: null,
                    error: {
                        status: 404,
                        name: 'NotFoundError',
                        message: `El ruc ${id} no existe`,
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
