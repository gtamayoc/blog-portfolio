
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'gtamayoc';
const CONTENT_DIR_PROJECTS = path.join(__dirname, '../content/projects');
const CONTENT_DIR_ANDROID = path.join(__dirname, '../content/android');
const USER_AGENT = 'NEXT-JS-PORTFOLIO-SCRAPER';

// Construct dirs
[CONTENT_DIR_PROJECTS, CONTENT_DIR_ANDROID].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/**
 * Validates if the repository is a specific type based on topics or language or readme content
 */
function determineType(name, topics, language, description, readmeContent) {
    // Specific override for this portfolio
    if (name === 'blog-portfolio') return 'Project';

    const mobileKeywords = ['android', 'kotlin', 'ios', 'swift', 'react-native', 'flutter', 'pos', 'apk'];
    const safeLanguage = (language || '').toLowerCase();
    const safeDesc = (description || '').toLowerCase();
    const safeReadme = (readmeContent || '').toLowerCase();

    if (topics.some(topic => mobileKeywords.includes(topic.toLowerCase())) ||
        mobileKeywords.includes(safeLanguage) ||
        mobileKeywords.some(k => safeDesc.includes(k)) ||
        mobileKeywords.some(k => safeReadme.includes(k))) {
        return 'Mobile App';
    }
    return 'Project';
}

/**
 * Fetch a URL and return parsed JSON or raw string
 */
function fetchUrl(url, token, isJson = true) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': USER_AGENT,
                ...(token && { 'Authorization': `token ${token}` }),
                ...(isJson ? {} : { 'Accept': 'application/vnd.github.raw+json' })
            }
        };

        https.get(url, options, (res) => {
            let body = '';

            if (res.statusCode >= 400 && res.statusCode !== 404) {
                if (res.statusCode === 403) console.warn('Rate limit exceeded or access denied.');
                // 404 is acceptable for missing README
                if (res.statusCode !== 404) {
                    reject(new Error(`GitHub API returned status: ${res.statusCode} for ${url}`));
                    return;
                }
            }

            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 404) resolve(null);
                else resolve(isJson ? JSON.parse(body) : body);
            });
        }).on('error', reject);
    });
}

/**
 * Fetch data from GitHub API with pagination
 */
async function fetchRepos(url, token) {
    let results = [];
    let page = 1;

    while (true) {
        const pageUrl = `${url}&page=${page}`;
        console.log(`Fetching repos page ${page}...`);
        const data = await fetchUrl(pageUrl, token, true);

        if (!Array.isArray(data) || data.length === 0) break;
        results = results.concat(data);
        page++;
    }

    return results;
}

function formatDate(isoString) {
    if (!isoString) return '';
    return isoString.split('T')[0]; // YYYY-MM-DD
}

async function main() {
    try {
        const token = process.env.GITHUB_TOKEN;
        const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner&sort=updated`;

        console.log(`Starting scrape for user: ${GITHUB_USERNAME}`);
        if (!token) console.warn('No GITHUB_TOKEN provided. Using public API limits (60/hr).');

        const repos = await fetchRepos(url, token);
        console.log(`Found ${repos.length} repositories.`);

        for (const repo of repos) {
            if (repo.fork) continue; // Skip forks if desired

            // Fetch README
            console.log(`Fetching README for ${repo.name}...`);
            const readmeContent = await fetchUrl(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`, token, false);

            const topics = Array.isArray(repo.topics) ? repo.topics : [];
            const type = determineType(repo.name, topics, repo.language, repo.description, readmeContent);
            const targetDir = type === 'Mobile App' ? CONTENT_DIR_ANDROID : CONTENT_DIR_PROJECTS;
            const otherDir = type === 'Mobile App' ? CONTENT_DIR_PROJECTS : CONTENT_DIR_ANDROID;

            // Enforcement: Cleanup if exists in other directory
            const conflictPath = path.join(otherDir, `${repo.name}.mdx`);
            if (fs.existsSync(conflictPath)) {
                fs.unlinkSync(conflictPath);
                console.log(`Removed conflicting file: ${conflictPath}`);
            }


            const mdxContent = `---
title: "${repo.name}"
description: "${(repo.description || '').replace(/"/g, '\\"')}"
repo: "${repo.html_url}"
date: "${formatDate(repo.created_at)}"
lastUpdated: "${formatDate(repo.updated_at)}"
tags: [${topics.map(t => `"${t}"`).join(', ')}]
stack: ["${repo.language || 'Unspecified'}"]
---

${readmeContent || 'No README provided.'}
`;

            const outputPath = path.join(targetDir, `${repo.name}.mdx`);
            fs.writeFileSync(outputPath, mdxContent);
            console.log(`Generated: ${outputPath}`);
        }

        console.log('Scraping completed successfully.');

    } catch (error) {
        console.error('Error scraping repositories:', error.message);
        process.exit(1);
    }
}

main();
