'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::empresa.empresa', ({ strapi }) => ({
    async findOne(ctx) {
        try {
            const { id } = ctx.params;

            const entity = await strapi.db.query('api::empresa.empresa').findOne({
                where: { ruc: id },
                populate: {
                    logo: true,
                    valores: true,
                    premios: true,
                    certificaciones: true,
                    premium: {
                        populate: true,
                    },
                },
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
    },

    async findCards(ctx) {
        ctx.query = { ...ctx.query}
        const query = ctx.request.query
        // const queryObj = ctx.request.query

        const filters = query && query.filters
        const valores = filters && filters.valores ? filters.valores : null
        const $null = valores ? valores.$null : null
        const por_que_nosotros = filters && filters.por_que_nosotros ? filters.por_que_nosotros : null
        const $null2 = por_que_nosotros ? por_que_nosotros.$null : null
        const premios = filters && filters.premios ? filters.premios : null
        const $null3 = premios ? premios.$null : null
        const certificaciones = filters && filters.certificaciones ? filters.certificaciones : null
        const $null4 = certificaciones ? certificaciones.$null : null
        const puestos_publicados = filters && filters.puestos_publicados ? filters.puestos_publicados : null
        const $null5 = puestos_publicados ? puestos_publicados.$null : null

        const offset = query && query.offset ? `offset ${query.offset}` : ''
        const limit = query && query.limit ? `limit ${query.limit}` : ''
        
        const sector_economico = filters && filters.sector_economico ? filters.sector_economico : null
        const region = filters && filters.region ? filters.region : null
        const trabajadores = filters && filters.trabajadores ? filters.trabajadores : null
        const $gte = trabajadores ? trabajadores.$gte : null
        const $lte = trabajadores ? trabajadores.$lte : null

        const ty = [sector_economico ? `sector_economico = '${sector_economico}'` : '',
            region ? `region = '${region}'` : '',
            $gte && $lte ? `trabajadores BETWEEN ${$gte} and ${$lte}` : '',
            $null && $null == $null2 ? $null == 'false' ? 'valores IS NOT NULL' :  `valores IS NULL` : '',
            $null2 && $null == $null2 ? $null2 == 'false' ? 'por_que_nosotros IS NOT NULL' :  `por_que_nosotros IS NULL` : '',

            $null3 && $null3 == $null4 ? $null3 == 'false' ? 'premios IS NOT NULL' :  `premios IS NULL` : '',
            $null4 && $null3 == $null4 ? $null4 == 'false' ? 'certificaciones IS NOT NULL' :  `certificaciones IS NULL` : '',
            
            $null5 ? $null5 == 'false' ? 'puestos_publicados IS NOT NULL' :  `puestos_publicados IS NULL` : ''        
            ].filter((item)=>item != '').join(' AND ').trim(); 
          
        const count = `select count(*) OVER() AS full_count
        FROM empresas as emp
        left join (select  max(ecd.entity_id) as entityId,
                array_remove(array_AGG(case when ecd.component_type = 'certificaciones.certificaciones' then ecd.field end), null) as certificaciones,
                array_remove(array_AGG(case when ecd.component_type = 'premios.premios' then ecd.field end), null) as premios,
                array_remove(array_AGG(case when ecd.component_type = 'valores.valores' then ecd.field end), null) as valores
        from empresas_components ecd) as asd on asd.entityId = emp.id     
        `

        const qy = `select emp.ruc, max(emp.nombre) as nombre, max(emp.trabajadores) as trabajadores, max(emp.sector_economico) as sector_economico, max(emp.region) as region, max(emp.por_que_nosotros) as nosotros,max(emp.puestos_publicados) as puestos_publicados, max(asd.certificaciones) as certificaciones, max(asd.premios) as premios, max(asd.valores) as valores
        FROM empresas as emp
        left join (select  max(ecd.entity_id) as entityId,
                array_remove(array_AGG(case when ecd.component_type = 'certificaciones.certificaciones' then ecd.field end), null) as certificaciones,
                array_remove(array_AGG(case when ecd.component_type = 'premios.premios' then ecd.field end), null) as premios,
                array_remove(array_AGG(case when ecd.component_type = 'valores.valores' then ecd.field end), null) as valores
        from empresas_components ecd) as asd on asd.entityId = emp.id  
        WHERE ${ty == null || ty == undefined || ty == '' ? '1=1' : ty} 
        group by ruc
        order by ruc
        ${offset}
        ${limit}        
        `
        console.log('uyyyy',ty)

        const test1 = await strapi.db.connection.raw(qy)
        const test = await strapi.db.connection.raw(count)
        console.log('----------')
        // console.log(query)
        return {test1, meta : {
            offset: query && +query.offset,
            limit: query && +query.limit,
            count: test.rowCount
        } }
      },    

      async find(ctx) {
        ctx.query = { ...ctx.query}
        const queryObj = ctx.request.query
        
        const [entries, count] = await strapi.db.query('api::empresa.empresa').findWithCount({
            populate: {
                logo: true,
                valores: true,
                premios: true,
                certificaciones: true,
                premium: {
                    populate: true,
                }
            },
            offset: queryObj.offset, 
            limit: 12,
        });
        const sanitizedResults = await this.sanitizeOutput(entries, ctx);
    
        return this.transformResponse(sanitizedResults, {
            offset: +queryObj.offset, 
            limit: 12,
            count
        });
      }, 
}));
