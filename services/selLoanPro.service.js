"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { MoleculerClientError } = require("moleculer").Errors;
const _ = require("lodash");
const SelLoanPro = require("../models/SelLoanPro.model");
const Schema = require("../mixins/db.mixin");

module.exports = {
	name: "selloanpro",
	mixins: [Schema()],
	model: SelLoanPro,

	settings: {},

	dependencies: [],

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	actions: {
		create: {
			rest: {
				method: "POST",
				path: "/create",
			},
			async handler(ctx) {
				try {
					const loanCreate = await SelLoanPro.create({
						...ctx.params,
					});

					return {
						success: true,
						status: 200,
						payload: loanCreate,
						message: "Loan Create Sucessfully.",
					};

					// return ctx.status(200).send(sell);
				} catch (err) {
					console.log(err);
					return this.handleErr(err);
					// return res.send({ success: false, exception: err.message });
				}
			},
		},

		LoanProcessApproved: {
			rest: {
				method: "PUT",
				path: "/LoanProcessApproved/:id",
			},
			async handler(ctx) {
				try {
					const isStatusApproved = await this.checkLoanId(
						ctx.params.id
					);
					if (
						isStatusApproved.selLoanStatus.toUpperCase() ===
						"APPROVED"
					) {
						return Promise.reject(
							new MoleculerClientError(
								"This Loan already APPROVED.."
							)
						);
					}

					const status = ctx.params.selLoanStatus;
					const loanStatusApproved = await this.loanStatusApproved(
						ctx.params.id,

						{
							selLoanStatus: status,
						}
					);

					return {
						success: true,
						status: 200,

						message: {
							payload: loanStatusApproved.ok,
							message: "APPROVED",
						},
					};
				} catch (err) {
					console.log(err);
					return this.handleErr(err.message);
				}
			},
		},

		LoanAccountCreate: {
			rest: {
				method: "PUT",
				path: "/LoanAccountCreate/:id",
			},
			async handler(ctx) {
				try {
					const isStatusApproved = await this.checkLoanId(
						ctx.params.id
					);

					if (
						isStatusApproved.selLoanStatus.toUpperCase() ===
						"APPROVED"
					) {
						const loanAccNo = ctx.params.selLoanAccNo;
						const loanStatusApproved =
							await this.loanStatusApproved(
								ctx.params.id,

								{
									selLoanAccNo: loanAccNo,
								}
							);

						return {
							success: true,
							status: 200,

							message: {
								payload: loanStatusApproved.ok,
								message: "Account created",
							},
						};
					} else {
						return Promise.reject(
							new MoleculerClientError(
								"Please approved your loan.."
							)
						);
					}
				} catch (err) {
					console.log(err);
					return this.handleErr(err.message);
				}
			},
		},

		allInvoice: {
			rest: {
				method: "GET",
				path: "/allInvoice",
			},

			async handler() {
				try {
					const allLoan = await SelLoanPro.find({});
					return {
						success: true,
						payload: allLoan,
						message: "All Loan service.",
					};
				} catch (err) {
					console.log(err);
					return this.handleErr(err);
				}
			},
		},
		// list: {
		// 	rest: "GET /sell",
		// },

		// get: {
		// 	rest: "GET /users/:id",
		// },

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			rest: "/welcome",
			params: {
				name: "string",
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				return this.handleErr({ message: "Welcome", code: 400 });
				//return `Welcome, ${ctx.params.name}`;
			},
		},
	},

	events: {},

	methods: {
		calculateInterest(principle) {
			if (principle >= 10000 && principle < 50000) {
				return 2;
			}
			if (principle >= 50000 && principle < 100000) {
				return 3;
			}

			if (principle >= 10000) {
				return 4;
			}
		},

		emi_calculator(principle, rate, time) {
			let emi;

			rate = rate / (12 * 100); // one month interest
			t = t * 12; // one month period 23-08-2022
			emi =
				(principle * rate * Math.pow(1 + rate, t)) /
				(Math.pow(1 + rate, t) - 1);

			return emi + 0.000414;
		},

		// utility function for calculating interest

		calculateAmount(principle, monthsToRepay, interestRate) {
			const applicationFee = 500;
			const p = principle;
			const interestPerMonth = (principle / 100) * interestRate;
			const totalInterest = interestPerMonth * monthsToRepay;
			console.log("totalInterest", totalInterest);
			console.log("interestPerMonth", interestPerMonth);

			const x = totalInterest + applicationFee + parseInt(p);

			return x;
		},
		async loanStatusApproved(id, body) {
			return await SelLoanPro.updateOne({ _id: id }, { $set: body });
		},
		// {selLoanStatus : value}

		async checkLoanId(id) {
			return await SelLoanPro.findOne({
				_id: id,
			});
		},

		handleErr(res) {
			console.log("res", res);
			throw res;
			//return res.status(res.code || 500).send(res.message);
		},
	},

	created() {},

	async started() {},

	async stopped() {},
};
