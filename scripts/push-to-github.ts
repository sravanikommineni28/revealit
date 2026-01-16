// Script to push code to GitHub
import { getGitHubClient, getGitHubUser } from '../server/lib/github';
import { execSync } from 'child_process';

async function pushToGitHub(repoName: string) {
  console.log('Connecting to GitHub...');
  
  const client = await getGitHubClient();
  const user = await getGitHubUser();
  
  console.log(`Authenticated as: ${user.login}`);
  
  // Check if repo exists
  let repoExists = false;
  try {
    await client.repos.get({
      owner: user.login,
      repo: repoName
    });
    repoExists = true;
    console.log(`Repository ${repoName} already exists`);
  } catch (e: any) {
    if (e.status === 404) {
      console.log(`Creating repository: ${repoName}`);
      await client.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'RevealIt - Before/After Photo Comparison App built with Expo & React Native',
        private: false,
        auto_init: false
      });
      console.log('Repository created successfully!');
    } else {
      throw e;
    }
  }
  
  const repoUrl = `https://github.com/${user.login}/${repoName}.git`;
  console.log(`Repository URL: ${repoUrl}`);
  
  // Get token for authenticated push
  const token = await getAccessTokenForPush();
  const authUrl = `https://${user.login}:${token}@github.com/${user.login}/${repoName}.git`;
  
  // Configure git remote
  try {
    execSync('git remote remove origin 2>/dev/null || true', { stdio: 'pipe' });
  } catch (e) {}
  
  execSync(`git remote add origin ${authUrl}`, { stdio: 'pipe' });
  console.log('Git remote configured');
  
  // Push to GitHub
  console.log('Pushing to GitHub...');
  try {
    execSync('git push -u origin main --force', { stdio: 'inherit' });
  } catch (e) {
    // Try with master branch
    try {
      execSync('git branch -M main', { stdio: 'pipe' });
      execSync('git push -u origin main --force', { stdio: 'inherit' });
    } catch (e2) {
      console.error('Push failed. Trying alternative approach...');
      throw e2;
    }
  }
  
  console.log('\nSuccess! Your code has been pushed to GitHub.');
  console.log(`View your repository at: https://github.com/${user.login}/${repoName}`);
}

async function getAccessTokenForPush(): Promise<string> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  return connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
}

// Run the script
const repoName = process.argv[2] || 'revealit';
pushToGitHub(repoName).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
