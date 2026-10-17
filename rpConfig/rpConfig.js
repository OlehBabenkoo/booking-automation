const rpConfig = {
  apiKey: process.env.RP_API_KEY,
  endpoint: process.env.RP_ENDPOINT,
  project: process.env.RP_PROJECT,
  launch: process.env.RP_LAUNCH_NAME,
  mode: process.env.RP_MODE,
  attributes: [
    {
      key: "RUN_ID",
      value: process.env.RUN_ID,
    },
    {
      key: "BRANCH_NAME",
      value: process.env.BRANCH_NAME,
    },
  ],
  description: process.env.RUN_URL,
  includeTestSteps: true,
  debug: false,
};

module.exports = { rpConfig };
