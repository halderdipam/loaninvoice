"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 *
 */
const { MoleculerClientError } = require("moleculer").Errors;
const _ = require("lodash");
const User = require("../models/User.model");
const Schema = require("../mixins/db.mixin");
const jwt = require("jsonwebtoken");
const express = require("express");

module.exports = {
	name: "user",
	mixins: [Schema()],
	model: User,

	settings: {},

	dependencies: [],

	actions: {
		create: {
			rest: {
				method: "POST",
				path: "/create",
			},
			async handler(ctx) {
				// console.log("req", req);
				const email = ctx.params.email;
				// const validateUser = await User.findOne({ email });
				const validateUser = await this.validUser(email);
				if (validateUser) {
					return Promise.reject(
						new MoleculerClientError("Email is exist!")
					);
				}
				const userdata = await User.create({
					...ctx.params,
				});
				const jwtToken = await this.jwtToken(userdata);
				// return jwtToken;
				// console.log("---------------------------------" + userdata);
				// return ctx.header('Authorization', jwtToken)
				return {
					success: true,
					payload: userdata,
					token: jwtToken,
					message: "Added New Loan service.",
				};
			},
		},

		update: {
			rest: {
				method: "PUT",
				path: "/:id",
			},
			auth: "required",
			async handler(ctx) {
				const notUpdateUser = await this.checkUserId(ctx.params.id);
				if (notUpdateUser === null) {
					returnPromise.reject(
						new MoleculerClientError({
							message: "This User/QA/Admin is not Registered.",
						})
					);
				}
				// taking user/QA/admin details :-
				const userDetails = {
					name: ctx.params.name,
					email: ctx.params.email,
				};
				const updateUserDetails = await this.updateUser(
					ctx.params.id,
					userDetails
				);

				return {
					success: true,

					message: "udated...",
				};
			},
		},

		resolveToken: {
			cache: {
				keys: ["token"],
				ttl: 60 * 60 // 1 hour
			},
			params: {
				token: "string"
			},
			async handler(ctx) {
				const decoded = await new this.Promise((resolve, reject) => {
					jwt.verify(ctx.params.token, "A0&MZC1*D67$@1E2QA3", (err, decoded) => {
						if (err)
							return reject(err);

						resolve(decoded);
					});
				});

				if (decoded.id)
					return this.getById(decoded.id);
			}
		},

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
		// initRoutes(app) {
		// 	app.post("/", this.header);

		// },

		// async header(res) {
		// 	try {
		// 		const data = await this.broker.call("user.create");
		// 		console.log(data);
		// 		return res.header("Authorization", data);
		// 	} catch (e) {
		// 		res.send(e.message);
		// 	}
		// },
		handleErr(res) {
			console.log("res", res);
			throw res;
			//return res.status(res.code || 500).send(res.message);
		},
		async updateUser(id, body) {
			return await User.updateOne({ _id: id }, { $set: body });
		},

		async checkUserId(id) {
			return await User.findOne({
				_id: id,
			});
		},
		async validUser(email) {
			return await User.findOne({
				email,
			});
		},
		jwtToken(user, res) {
			const token = jwt.sign(
				{
					id: user.id,
					name: user.name,
					email: user.email,
					password: user.password,
				},
				"A0&MZC1*D67$@1E2QA3",
				{
					expiresIn: "1d",
				}
			);
			return token;
		},
	},

	created() {
		// const app = express();
		// this.initRoutes(app);
		// this.app = app;
	},

	async started() {},

	async stopped() {},
};
