"use strict";

const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose);
const uuid = require("node-uuid");
let Schema = mongoose.Schema;

let SelLoanStatus = new Schema(
	{
		// seller unique identifier number
		seluid: {
			type: String,
			unique: true,
			 required: true,
			default: uuid.v1,
		},
		// -This is a rating from 1 to 10 where is rating of 10 is high
		selLoanHealth: {
			type: String,
            min : 1,
            max: 10
		},
		selLoanAccNo:{
			type: String,
			trim: true,
			default :"sellercode-yyyymmdd",
			required: true,
		},

		// - this is the last application currency
		selLastAppCurrency: {
			type: String,
		},
		// - This is the last Approved Loan date
		selLastAppDate: {
          type: Date, default: Date.now ,

		},
		// - This is the last Approved Loan Act
		selLastAppAmt: {
			type: Float,
		},
		// - This is the last Released Loan date
		selLastRelDate: { type: Date, default: Date.now },
		// This is the last Released Loan Act
		selLastRelAmt: {
			type: Float,
		},
		// - Seller Loan eligible Amount
		SelLoanEligAmt: {
			type: Float,
		},
		// - Seller Loan eligible date for claiming the loan
		SelLastEligDate: {
			type: Date,
			default: Date.now,
		},

		amt: [
			{
				// - this will be currency wise split
				selAmtCurrency: { type: String },
				// - this is the total amount approved till date
				selytdAmtApproved: { type: Float },
				// - this is the total amount that is realize to Seller bank account
				selytdAmtReleased: { type: Float },
				// - this is the total amount of Amount collected
				SelytdAmtCollected: { type: Float },
			},
		],

		data: {
			// - this will be in MM/YYYY
			calender: { type: Date, default: Date.now },
			ins: [
				{
					// - Currency of the Loan Amount
					selLoanCurrency: {
						type: Float,
					},
					// - seller total Amount outstanding for the mont Sel
					selLoanOutStandAmt: {
						type: Float,
					},
					// - seller repay Amount for the Month
					selLoanRepayAmt: {
						type: Float,
					},
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

// Add full-text search index
SelLoanStatus.index({
	//"$**": "text"
	title: "text",
	content: "text",
});

module.exports = mongoose.model("SelLoanStatus", SelLoanStatus);
