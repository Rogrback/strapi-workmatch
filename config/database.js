module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT'),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL'),
    },
    // connection: {
    //   host: env('DATABASE_HOST', 'dpg-cfpl91h4rebfdatpbe9g-a.oregon-postgres.render.com'),
    //   port: env.int('DATABASE_PORT', 5432),
    //   database: env('DATABASE_NAME', 'sample_p3ii'),
    //   user: env('DATABASE_USERNAME', 'admin'),
    //   password: env('DATABASE_PASSWORD', 'BQHWL2KThukzwF5K74Sbtth16nya680I'),
    //   ssl: env.bool('DATABASE_SSL', true),
    // },
  },
});
