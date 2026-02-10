const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "PlatformFee",
  tableName: "platform_fee",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    tier_name: {
      type: "enum",
      enum: ["low", "medium", "high"],
    },

    min_value: {
      type: "int",
    },

    max_value: {
      type: "int",
    },

    platform_fee_percentage: {
      type: "decimal",
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
