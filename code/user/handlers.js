"use strict";

const config = require("./config");
const db = require("moggies-db");
const mapper = require("./mapper");
const organisations = new db.Table(db.tableConfigs.organisations);

exports.getOrg = async (userId, response) => {
  try {
    const data = await organisations.getBySecondaryIndex(
      "UserOrganisations",
      userId
    );
    const org = await organisations.get(data.Items[0].OrganisationId, userId);
    console.log("org", JSON.stringify(org));
    response(200, org.Item, config.headers);
  } catch (err) {
    console.log(err);
    response(500, err, config.headers);
  }
};
