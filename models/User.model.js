"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: "Please fill in title",
		},
		email: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

// Add full-text search index
userSchema.index({
	//"$**": "text"
	title: "text",
	content: "text",
});

module.exports = mongoose.model("User", userSchema);
