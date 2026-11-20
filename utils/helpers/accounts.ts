import { requireEnv } from './env';

export type Account = { id: string; email: string; apiKey: string };

const envName = (project: string) => project.toUpperCase().replace(/-/g, '_');

function account(id: string, emailVar: string, apiKeyVar: string): Account {
  return { id, email: requireEnv(emailVar), apiKey: process.env[apiKeyVar] || requireEnv('DSE_API_KEY') };
}

export const signInAccount = (project: string): Account =>
  account(project, `DSE_EMAIL_${envName(project)}`, 'DSE_API_KEY');

export const settingsAccount = (project: string): Account =>
  account(`settings-${project}`, `DSE_EMAIL_SETTINGS_${envName(project)}`, 'DSE_API_KEY_SETTINGS');

export const sharedAccount = (): Account => account('shared', 'DSE_EMAIL_SHARED', 'DSE_API_KEY');

export const passkeyAccount = (): Account => signInAccount('chrome-desktop');
