const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Specialist",
  tableName: "specialists",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    title: {
      type: "varchar",
    },
    slug: {
      type: "varchar",
    },
    description: {
      type: "text",
    },
    
    cover_image: {
      type: "varchar",
      nullable: true,
    },
    gallery_image_1: {
      type: "varchar",
      nullable: true,
    },
    gallery_image_2: {
      type: "varchar",
      nullable: true,
    },

    base_price: {
      type: "decimal",
    },
    platform_fee: {
      type: "decimal",
      nullable: true,
    },
    final_price: {
      type: "decimal",
      nullable: true,
    },
    duration_days: {
      type: "int",
    },
    average_rating: {
      type: "decimal",
      nullable: true,
    },
    total_number_of_ratings: {
      type: "int",
      default: 0,
    },
    is_draft: {
      type: "boolean",
      default: true,
    },
    verification_status: {
      type: "enum",
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    is_verified: {
      type: "boolean",
      default: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
    deleted_at: {
      type: "timestamp",
      deleteDate: true,
      nullable: true,
    },
  },

  relations: {
    media: {
      type: "one-to-many",
      target: "Media",
      inverseSide: "specialist",
    },
    service_offerings: {
      type: "one-to-many",
      target: "ServiceOffering",
      inverseSide: "specialist",
    },
  },
});