
exports.groups = require("./functions/groups");
exports.users = require("./functions/user");
exports.invites = require("./functions/invites");
exports.transactions = require("./functions/transactions");

const admin = require('firebase-admin');
admin.initializeApp();