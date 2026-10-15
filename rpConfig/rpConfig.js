const rpConfig = {
  apiKey: process.env.RP_API_KEY,
  endpoint: process.env.RP_ENDPOINT,
  project: process.env.RP_PROJECT,
  launch: process.env.RP_LAUNCH_NAME,
  mode: "DEFAULT",
  attributes: [
    {
      key: "id",
      value: "1111",
    },
  ],
  description: "My launch",
  includeTestSteps: true,
  debug: false,
};

module.exports = { rpConfig };
