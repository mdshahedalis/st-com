const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Media",
  tableName: "media",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    file_name: {
      type: "varchar",
    },

    file_size: {
      type: "int",
    },

    display_order: {
      type: "int",
    },

    mime_type: {
      type: "enum",
      enum: ["image", "video", "document"],
    },

    media_type: {
      type: "enum",
      enum: ["thumbnail", "gallery", "cover"],
    },

    uploaded_at: {
      type: "timestamp",
      createDate: true,
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
    specialist: {
      type: "many-to-one",
      target: "Specialist",
      joinColumn: true,
      onDelete: "CASCADE",
    },
  },
});
