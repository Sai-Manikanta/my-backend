const mongoose = require('mongoose');
const { Schema } = mongoose;

const FieldSchema = new Schema({
  type: Schema.Types.Mixed
  // name: { type: String, default: "ABCD" },
  // type: { type: String, default: "text" },
  // dataType: { type: String, default: "String" },
  // lengthAndType: { type: String, default: "" },
  // description: { type: String, default: "" },
  // status: { type: String, default: "optional" },
  // checked: { type: Boolean, default: false },
  // value: { type: String, default: "" },
});

const RequestParamsSchema = new Schema({
  fieldCategoryName: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function (v) {
        return typeof v === 'string' || v === false;
      },
      message: props => `${props.value} is not a valid type for fieldCategoryName! It should be either a string or false.`,
    },
  },
  fields: [Schema.Types.Mixed],
});

const StatusCodeSchema = new Schema({
  type: { type: String, required: true },
  statusCode: { type: String, required: true },
  message: { type: String, required: true },
});

const ResponseSchema = new Schema({
  description: { type: String, required: false },
  statusCodes: [StatusCodeSchema],
  responseParameters: [{ type: Schema.Types.Mixed }],
});

const DataSchema = new Schema({
  name: { type: String },
  apiEndPoint: { type: String },
  overview: { type: [String] },
  requestParams: [RequestParamsSchema],
  response: ResponseSchema,
});

const SandboxPageData = mongoose.model('SandboxPagesData', DataSchema);

module.exports = SandboxPageData
