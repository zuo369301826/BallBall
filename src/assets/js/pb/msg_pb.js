/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.Msg.Food', null, global);
goog.exportSymbol('proto.Msg.Map', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Msg.Food = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Msg.Food, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Msg.Food.displayName = 'proto.Msg.Food';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Msg.Food.prototype.toObject = function(opt_includeInstance) {
  return proto.Msg.Food.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Msg.Food} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Msg.Food.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    posx: +jspb.Message.getFieldWithDefault(msg, 2, 0.0),
    posy: +jspb.Message.getFieldWithDefault(msg, 3, 0.0),
    bg: +jspb.Message.getFieldWithDefault(msg, 4, 0.0),
    size: +jspb.Message.getFieldWithDefault(msg, 5, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Msg.Food}
 */
proto.Msg.Food.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Msg.Food;
  return proto.Msg.Food.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Msg.Food} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Msg.Food}
 */
proto.Msg.Food.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPosx(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPosy(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBg(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setSize(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Msg.Food.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Msg.Food.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Msg.Food} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Msg.Food.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getPosx();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getPosy();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getBg();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = message.getSize();
  if (f !== 0.0) {
    writer.writeFloat(
      5,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.Msg.Food.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.Msg.Food.prototype.setId = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional float posX = 2;
 * @return {number}
 */
proto.Msg.Food.prototype.getPosx = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 2, 0.0));
};


/** @param {number} value */
proto.Msg.Food.prototype.setPosx = function(value) {
  jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional float posY = 3;
 * @return {number}
 */
proto.Msg.Food.prototype.getPosy = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 3, 0.0));
};


/** @param {number} value */
proto.Msg.Food.prototype.setPosy = function(value) {
  jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float bg = 4;
 * @return {number}
 */
proto.Msg.Food.prototype.getBg = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 4, 0.0));
};


/** @param {number} value */
proto.Msg.Food.prototype.setBg = function(value) {
  jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional float size = 5;
 * @return {number}
 */
proto.Msg.Food.prototype.getSize = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 5, 0.0));
};


/** @param {number} value */
proto.Msg.Food.prototype.setSize = function(value) {
  jspb.Message.setProto3FloatField(this, 5, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Msg.Map = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.Msg.Map.repeatedFields_, null);
};
goog.inherits(proto.Msg.Map, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Msg.Map.displayName = 'proto.Msg.Map';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.Msg.Map.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Msg.Map.prototype.toObject = function(opt_includeInstance) {
  return proto.Msg.Map.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Msg.Map} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Msg.Map.toObject = function(includeInstance, msg) {
  var f, obj = {
    foodsNum: jspb.Message.getFieldWithDefault(msg, 1, 0),
    foodList: jspb.Message.toObjectList(msg.getFoodList(),
    proto.Msg.Food.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Msg.Map}
 */
proto.Msg.Map.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Msg.Map;
  return proto.Msg.Map.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Msg.Map} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Msg.Map}
 */
proto.Msg.Map.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setFoodsNum(value);
      break;
    case 2:
      var value = new proto.Msg.Food;
      reader.readMessage(value,proto.Msg.Food.deserializeBinaryFromReader);
      msg.addFood(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Msg.Map.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Msg.Map.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Msg.Map} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Msg.Map.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFoodsNum();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getFoodList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.Msg.Food.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 FOODS_NUM = 1;
 * @return {number}
 */
proto.Msg.Map.prototype.getFoodsNum = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.Msg.Map.prototype.setFoodsNum = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * repeated Food food = 2;
 * @return {!Array<!proto.Msg.Food>}
 */
proto.Msg.Map.prototype.getFoodList = function() {
  return /** @type{!Array<!proto.Msg.Food>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.Msg.Food, 2));
};


/** @param {!Array<!proto.Msg.Food>} value */
proto.Msg.Map.prototype.setFoodList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.Msg.Food=} opt_value
 * @param {number=} opt_index
 * @return {!proto.Msg.Food}
 */
proto.Msg.Map.prototype.addFood = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.Msg.Food, opt_index);
};


proto.Msg.Map.prototype.clearFoodList = function() {
  this.setFoodList([]);
};


goog.object.extend(exports, proto.Msg);