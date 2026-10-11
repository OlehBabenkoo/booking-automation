const rpConfig = {
  apiKey: "<API_KEY>",
  endpoint: "https://your.reportportal.server/api/v2",
  project: "Your reportportal project name",
  launch: "Your launch name",
  attributes: [
    {
      key: "key",
      value: "value",
    },
    {
      value: "value",
    },
  ],
  description: "Your launch description",
};

module.exports = { rpConfig };
