const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
	{
	  Make: { type: String, required: true },
	  Model: { type: String, required: true },
	  Year: { type: Number, required: true },
	  engineFuelType: { type: String, required: false }, // Adapted to use underscores
	  
engineHP: { type: Number, required: false },
	  
engineCylinders: { type: Number, required: false },
	  transmissionType: { type: String, required: true },
	  
drivenWheels: { type: String, required: false },
	  numberOfDoors: { type: Number, required: false },
	  
marketCategory: { type: String, required: false }, // Optional
	  vehicleSize: { type: String, required: true },
	  vehicleStyle: { type: String, required: true },
	  highwayMPG: { type: Number, required: false }, // Capitalization adapted
	  cityMPG: { type: Number, required: false },
	  Popularity: { type: Number, required: false }, // Optional
	  MSRP: { type: Number, required: true },
	  isDeleted: { type: Boolean, default: false }
	},
	{
	  timestamps: true, // Automatically add createdAt and updatedAt fields
	  collection: 'cars', // Explicitly set the collection name
	}
  );

carSchema.pre(/^find/, function (next) {
	if (!('_conditions' in this)) return next();
	if (!('isDeleted' in carSchema.paths)) {
		delete this['_conditions']['all'];
		return next();
	}
	if (!('all' in this['_conditions'])) {
		//@ts-ignore
		this['_conditions'].isDeleted = false;
	} else {
		delete this['_conditions']['all'];
	}
	next();
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
