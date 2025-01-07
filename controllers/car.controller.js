const mongoose = require('mongoose');
const Car = require('../models/Car');
const carController = {};

carController.createCar = async (req, res, next) => {
	try {
		// YOUR CODE HERE
		const carData = req.body;
		const newCar = new Car(carData);
		const savedCar = await newCar.save();
		res.status(201).json({
			message:"Car created successfully!",
			car: savedCar,
		})
	} catch (err) {
		// YOUR CODE HERE
		res.status(500).json({
			messsage: "Failed to create car",
			error: err.message,
		})
		next(err)
	}
};

carController.getCars = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = 10; // Number of cars per page
		const skip = (page - 1) * limit;
		const searchQuery = req.query.search || '';

		    // Define the query filter
			const filter = {
				isDeleted: false,
				...(searchQuery && { Make: { $regex: searchQuery, $options: 'i' } }), // Case-insensitive search
			  };
		// YOUR CODE HERE
		const cars = await Car.find(filter).skip(skip).limit(limit);

			  // Get the total count of cars for pagination
			  const totalCars = await Car.countDocuments(filter);

			  res.status(200).json({
				message: 'Car fetched successfully!',
				cars: cars,
				totalPages: Math.ceil(totalCars / limit),
			  });
			} catch (err) {
			  res.status(500).json({ message: 'Failed to fetch cars.', error: err.message });
			  next(err)
			}
		  };

carController.editCar = async (req, res, next) => {
	try {
		// YOUR CODE HERE
		const carId = req.params.id;
		const updatedCarData = req.body;
		const updatedCar = await Car.findByIdAndUpdate(carId, updatedCarData, {new:true});
		if(!updatedCar) {
			return res.status(404).json({message:"Car not found"})
		}
		res.status(200).json({
			message: "Car updated successfully!",
			car: updatedCar
		})
	} catch (err) {
		// YOUR CODE HERE
		res.status(500).json({
			message: 'Failed to update car.',
			error: err.message,
		  });
		  next(err)
	}
};

carController.deleteCar = async (req, res, next) => {
	try {
		// YOUR CODE HERE
		const carId = req.params.id;
		const deletedCar = await Car.findByIdAndUpdate(carId, {isDeleted: true}, {new:true});
		if(!deletedCar) {
			return res.status(404).json({message: "Car not found!"});
		}
		res.status(200).json({
			message:"Car deleted successfully!",
			car: deletedCar
		})
	} catch (err) {
		// YOUR CODE HERE
		res.status(500).json({
			message: 'Failed to delete car.',
			error: err.message,
		  });
		  next(err)
	}
};

module.exports = carController;
