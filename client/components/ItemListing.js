var getCollection = function(collectionParam) {
  return typeof collectionParam === 'string' ?
    window[collectionParam] :
    collectionParam;
};

var getSchema = function(collectionParam) {
  var collection = getCollection(collectionParam);

  return collection._c2._simpleSchema;
};

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
  countOf: function(field, item) {
    return item[field].length;
  },

  isTextual: function(field, item) {
    return _.isString(item[field]);
  },
  isBoolean: function(field, item) {
    return _.isBoolean(item[field]);
  },
  isArray: function(field, item) {
    return _.isArray(item[field]);
  },
  isObject: function(field, item) {
    return _.isObject(item[field]);
  },
  isNully: function(field, item) {
    return _.isNull(item[field]) || _.isUndefined(item[field]);
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

  dataFor: function(field, obj, ctx) {
    return obj[ctx.objectKey][field];
  },
});
