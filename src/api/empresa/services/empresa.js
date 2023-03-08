'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::empresa.empresa', ({ strapi }) =>  ({
  
    // Method 2: Wrapping a core service (leaves core logic in place)
    async find(...args) {  
      // Calling the default core controller
      const { results, pagination } = await super.find(...args);
  
      // some custom logic
      results.forEach(result => {
        result.counter = 1;
      });
  
      return { results, pagination };
    },
    
  }));
