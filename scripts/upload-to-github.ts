// Upload files to GitHub using the API (without git operations)
import { getGitHubClient, getGitHubUser } from '../server/lib/github';
import * as fs from 'fs';
import * as path from 'path';

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.cache',
  '.expo',
  'static-build',
  '.replit',
  'replit.nix',
  '.upm',
  '.config',
  '.local',
  'generated-icon.png',
  'generated-splash.png',
  'tmp',
  '.breakpoints',
  'package-lock.json',
  'attached_assets'
];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (shouldIgnore(relativePath)) continue;
    
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

async function uploadToGitHub(repoName: string) {
  console.log('Connecting to GitHub...');
  
  const client = await getGitHubClient();
  const user = await getGitHubUser();
  
  console.log(`Authenticated as: ${user.login}`);
  console.log(`Uploading to: ${user.login}/${repoName}`);
  
  // First, initialize the repo with a README if it's empty
  console.log('Initializing repository...');
  try {
    await client.repos.createOrUpdateFileContents({
      owner: user.login,
      repo: repoName,
      path: 'README.md',
      message: 'Initial commit',
      content: Buffer.from('# RevealIt\n\nBefore/After Photo Comparison App built with Expo & React Native\n').toString('base64')
    });
    console.log('Repository initialized with README');
  } catch (e: any) {
    if (e.status === 422) {
      console.log('README already exists, continuing...');
    } else {
      throw e;
    }
  }
  
  // Get the main branch reference
  const { data: ref } = await client.git.getRef({
    owner: user.login,
    repo: repoName,
    ref: 'heads/main'
  });
  
  const baseTreeSha = ref.object.sha;
  
  // Get the commit to find the tree
  const { data: baseCommit } = await client.git.getCommit({
    owner: user.login,
    repo: repoName,
    commit_sha: baseTreeSha
  });
  
  const baseDir = process.cwd();
  const files = getAllFiles(baseDir);
  
  console.log(`Found ${files.length} files to upload`);
  
  // Create blobs for each file
  const tree: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];
  
  let uploaded = 0;
  for (const file of files) {
    const filePath = path.join(baseDir, file);
    const content = fs.readFileSync(filePath);
    const base64Content = content.toString('base64');
    
    try {
      const { data: blob } = await client.git.createBlob({
        owner: user.login,
        repo: repoName,
        content: base64Content,
        encoding: 'base64'
      });
      
      tree.push({
        path: file,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
      
      uploaded++;
      process.stdout.write(`\rUploaded ${uploaded}/${files.length} files`);
    } catch (e: any) {
      console.error(`\nFailed to upload ${file}: ${e.message}`);
    }
  }
  
  console.log('\n\nCreating commit tree...');
  
  // Create tree
  const { data: treeData } = await client.git.createTree({
    owner: user.login,
    repo: repoName,
    tree: tree,
    base_tree: baseCommit.tree.sha
  });
  
  // Create commit
  const { data: commit } = await client.git.createCommit({
    owner: user.login,
    repo: repoName,
    message: 'RevealIt - Before/After Photo Comparison App\n\nBuilt with Expo & React Native\n\nFeatures:\n- Select before/after images from camera or photo library\n- Interactive slider with haptic feedback\n- Save and share comparisons\n- Beautiful animated landing page',
    tree: treeData.sha,
    parents: [baseTreeSha]
  });
  
  console.log('Updating main branch...');
  
  // Update main branch reference
  await client.git.updateRef({
    owner: user.login,
    repo: repoName,
    ref: 'heads/main',
    sha: commit.sha
  });
  
  console.log('\nSuccess! Your code has been uploaded to GitHub.');
  console.log(`View your repository at: https://github.com/${user.login}/${repoName}`);
}

const repoName = process.argv[2] || 'revealit';
uploadToGitHub(repoName).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
