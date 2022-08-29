"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require("lodash");
const SelLoanStatus = require("../models/SelLoanStatus.model");
const Schema = require("../mixins/db.mixin");

module.exports = {
	name: "selloanstatus",
	mixins: [Schema()],
	model: SelLoanStatus,

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
					const selLoanStatus = await SelLoanStatus.create({
						...ctx.params,
					});

					return {
						success: true,
						status: 200,
						payload: selLoanStatus,
						message: "Added New Loan Status service...",
					};

					// return ctx.status(200).send(sell);
				} catch (err) {
					console.log(err);
					return this.handleErr(err);
					// return res.send({ success: false, exception: err.message });
				}
			},
		},

		LoanStatusUpdate: {
			rest: {
				method: "PUT",
				path: "/LoanStatusUpdate/:id",
			},
			async handler(ctx) {
				try {
					const loanStatusApproved = await this.loanStatusApproved(
						ctx.params.id,

						{
							...ctx.params,
						}
					);

					return {
						success: true,
						status: 200,

						message: {
							payload: loanStatusApproved.ok,
							message: "Loan status updated",
						},
					};
				} catch (err) {
					console.log(err);
					return this.handleErr(err.message);
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
		async loanStatusApproved(id, body) {
			return await SelLoanPro.updateOne({ _id: id }, { $set: body });
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
