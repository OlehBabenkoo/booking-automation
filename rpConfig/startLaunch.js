const RPClient = require('@reportportal/client-javascript');
const { rpConfig } = require('./rpConfig');

const client = new RPClient(rpConfig);

const startLaunch = async () => {
  const { mode, launch, attributes, description } = rpConfig;
  const response = await client.startLaunch({ name: launch, mode, attributes, description }).promise;
  const launchId = response.id;

  return launchId;
};

module.exports = startLaunch;
