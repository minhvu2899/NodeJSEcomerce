const Address = require("../models/addressModel");
const factory = require("./handlerFactory");
exports.updateDefaultAddress = async (req, res, next) => {
  console.log(req.body);
  const address = await Address.findOne({ isDefault: true });
  console.log(address);
  if (!address) {
    req.body.isDefault = true;
    return next();
  }
  console.log("id", req.params.id);
  if (address && address.id === req.params.id) {
    req.body.isDefault = true;
    return next();
  }
  address.isDefault = false;
  await address.save();
  next();
};
exports.getAllAddresses = factory.getAll(Address);
exports.getAddress = factory.getOne(Address);
exports.createAddress = factory.createOne(Address);
exports.updateAddress = factory.updateOne(Address);
exports.deleteAddress = factory.deleteOne(Address);
