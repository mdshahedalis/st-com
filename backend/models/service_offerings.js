const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "ServiceOffering",
  tableName: "service_offerings",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
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

  relations: {
    specialist: {
      type: "many-to-one",
      target: "Specialist",
      joinColumn: true,
      onDelete: "CASCADE",
    },

    service_offerings_master_list: {
      type: "many-to-one",
      target: "ServiceOfferingsMasterList",
      eager: true,
      joinColumn: true,
    },
  },
});
