var getCollection = function(collectionParam) {
  return typeof collectionParam === 'string' ?
    window[collectionParam] :
    collectionParam;
};

var getSchema = function(collectionParam) {
  var collection = getCollection(collectionParam);

  return collection._c2._simpleSchema;
}

Template.ItemListing.helpers({
  title: function(ctx) {
    var collection = getCollection(ctx.collection);
    var title = collection && AppSchema.getDisplayName(collection);
    if (!title) throw new Error("Collection has no associated display name.", collection);

    return title;
  },
  fields: function(ctx) {
    var schema = getSchema(ctx.collection);

    return schema._firstLevelSchemaKeys;
  },

  labelFor: function(field, ctx) {
    var schema = getSchema(ctx.collection);

    return schema.schema(field).label;
  },
  dataFor: function(field, item) {
    return item[field];
  },
  countOf: function(array) {
    return array.length;
  },

  isTextual: function(data) {
    return _.isString(data);
  },
  isBoolean: function(data) {
    return _.isBoolean(data);
  },
  isArray: function(data) {
    return _.isArray(data);
  },
  isObject: function(data) {
    return _.isObject(data);
  },
});

Template.ItemListing_object.helpers({
  labelFor: function(field, ctx) {
    var schema = getSchema(ctx.ctx.collection);

    return schema.schema(ctx.objectKey + "." + field).label;
  },
  keysFor: function(objectKey, ctx) {
    var schema = getSchema(ctx.collection);

    return schema.objectKeys(objectKey);
  },

  dataFor: function(field, item) {
    return item[field];
  },
});
