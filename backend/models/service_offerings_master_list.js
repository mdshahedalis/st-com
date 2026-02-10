const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "ServiceOfferingsMasterList",
  tableName: "service_offerings_master_list",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    title: {
      type: "varchar",
    },

    description: {
      type: "text",
    },

    s3_key: {
      type: "varchar",
    },

    bucket_name: {
      type: "varchar",
    },

    created_at: {
      type: "timestamp",
      createDate: true,
    },

    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
