"use strict";

const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose);
const uuid = require("node-uuid");
let Schema = mongoose.Schema;

let SelLoanPro = new Schema(
	{
		// - seller unique identifier number
		seluid: {
			type: String,
			unique: true,
			required: true,
			default: uuid.v1,
		},
		// - Seller Invoice Number
		selInvNo: {
			type: String,
			required: true,
		},
		selLoanAccNo:{
			type: String,
			trim: true,
			default :"sellercode-yyyymmdd",
			required: true,
		},

		selLoanStatus:{
			type: String,
			trim: true, 
		},
		
		// - Currency in Invoice
		selInvCurrency: {
			type: String,
			trim: true,
			required: true,
		},
		// - Seller Invoice Date
		selInvDate: {
			type: Date,
			default: Date.now,
			required: true,

		},
		// - Seller Invoice Loan Amount
		selInvAmt: {
			type: Float,
			trim: true,
			 required: true,
		},
		// - Seller Invoice Loan Term
		selInvTerm: {
			type: String,
			trim: true,
			 required: true,
		},
		// Seller PO Number
		selPoNo: {
			type: String,
			trim: true,
			//  required: true n,
		},
		// Seller PO Amount
		selPoAmt: {
			type: Float,
			trim: true,
			//  required: true,
		},
		// - Seller Delivery Number
		selDelNo: {
			type: String,
			trim: true,
			//  required: true,
		},
		// -Seller Delivery Amount
		selDelAmt: {
			type: Float,
			trim: true,
			//  required: true,
		},

		// - Seller Loan commission in percentage
		selLoanCommPct: {
			type: String,
			trim: true,
			//  required: true,
		},
		// -  Seller Loan commission in Fixed
		selLoanCommFix: {
			type: String,
			trim: true,
			//  required: true,
		},
		// this is a mix of % + Fixed of Seller Loan commission
		selLoanCommMix: {
			type: String,
			trim: true,
			//  required: true,
		},
		// - Seller Loan eligible Amount - this is the approved amount
		selLoanEligAmt: {
			type: Float,
			trim: true,
			//  required: true,
		},
		// -  Seller Loan eligible Amount currency
		selLoanEligCurrency: {
			type: String,
			trim: true,
			//  required: true,
		},
		// - This is last date the seller can apply for loan
		selLoanLastClaimDate: {
			type: Date,
			default: Date.now,
		},
		// - Seller can request for lower or equal to the Loan Amount
		selreqLoanAmt: {
			type: Float,
			trim: true,
			//  required: true,
		},
		// - Seller can request for Amount before the selLoanLastClaimDate

		selreqLoandate: {
			type: Date,
			default: Date.now,
			//  required: true,
		},

		selLoanLastClaimDate: {
			type: Date,
			default: Date.now,
		},
		// - Seller Loan commission Total Amount with Tax
		selLoanCommAmtTax: {
			type: Float,
			trim: true,
			//  required: true,
		},
		// - Seller Loan commission Total Amount without Tax

		selLoanCommAmtNTax: {
			type: Float,
			trim: true,
		},
		// Final settlement after the payment of Invoice in percentage
		selInvPaysetPct: {
			type: String,
			trim: true,
		},
		// - Final settlement after the payment of Invoice in fixed Amt
		selInvPaysetFix: {
			type: String,
			trim: true,
		},
		// Final payment Amount
		selInvFPaysetFix: {
			type: String,
			trim: true,
		},
		// Seller Loan Processing Amount  (Deduct commission from selLoanEligAmt +selInvPaysetAmt )
		selLoanProcAmt: {
			type: Float,
			trim: true,
		},
		// - Seller Loan Processing Date
		selLoanProcDate: {
			type: Date,
			default: Date.now,
		},
		// - Seller Loan Processing System Timestamp
		selLaonProcSysTSP: {
			type: Date,
			default: Date.now,
		},
		// - Seller Loan Processing Local Timestamp
		selLoanProcLocTSP: {
			type: Date,
			default: Date.now,
		},
		// Total num of Loan Installments
		selLoanTotInsta: {
			type: String,
			trim: true,
		},
		// Total Amount payed till date (sum of all the repay amount selLoanLastRe)
		selLoanTotRepay: {
			type: String,
			trim: true,
		},
		// -  Seller Loan repayment Penalty
		selLoanPayPent: {
			type: String,
			trim: true,
		},
		allLoans: [
			{
				// seller Loan Installment PayDate
				selLoanInstaDate: { type: Date, default: Date.now, trim: true },
				// - Seller Loan Installment Pay Amount
				selLoanInstaAmt: { type: Float, trim: true },
				// -  Seller Loan Installment Pay count
				selLoanInstaCount: { type: Number, trim: true },
				// seller Loan Installment REPay Date
				selLoanInstaRepayDate: {
					type: Date,
					default: Date.now,
					trim: true,
				},
				// - Seller Loan Installment REPay Amount
				selLoanInstaRepayAmt: { type: Float, trim: true },
				// Seller Loan Installment REPay count
				selLoanInstaRepayCount: { type: Number, trim: true},
				// this is the repay status oof each Loan
				selLoanInstaRepayStatus: { type: String, trim: true },
				
			},
		],
		loanProcessingdate: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	}
);

// Add full-text search index
SelLoanPro.index({
	//"$**": "text"
	title: "text",
	content: "text",
});

module.exports = mongoose.model("SelLoanPro", SelLoanPro, "SelLoanPro");
