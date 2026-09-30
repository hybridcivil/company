import { AppDatabaseState } from './storageInterface';

export interface GitHubStorageConfig {
  owner: string;
  repo: string;
  branch: string;
  token?: string; // Only injected server-side or via secure headers
  apiBaseUrl?: string;
}

export class GitHubStorageDriver {
  private config: GitHubStorageConfig;

  constructor(config?: Partial<GitHubStorageConfig>) {
    this.config = {
      owner: config?.owner || 'hybrid-civil-org',
      repo: config?.repo || 'hybrid-civil-data-vault',
      branch: config?.branch || 'main',
      token: config?.token,
      apiBaseUrl: config?.apiBaseUrl || 'https://api.github.com',
    };
  }

  public isConfigured(): boolean {
    return Boolean(this.config.token && this.config.owner && this.config.repo);
  }

  /**
   * Syncs the given database partition or full snapshot to GitHub repository tree
   * Under /data/<collection>/data.json
   */
  public async commitCollectionData(
    collection: keyof AppDatabaseState,
    data: unknown,
    commitMessage: string
  ): Promise<{ success: boolean; commitSha?: string; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'GitHub storage not configured (GITHUB_TOKEN / GITHUB_REPO). Running in local persistent storage mode.',
      };
    }

    try {
      const path = `data/${collection}.json`;
      const contentStr = JSON.stringify(data, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(contentStr)));

      // Check if file exists to get SHA for update
      let sha: string | undefined;
      const getUrl = `${this.config.apiBaseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;
      
      const getRes = await fetch(getUrl, {
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // Put contents
      const putUrl = `${this.config.apiBaseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage || `Update ${collection} - ${new Date().toISOString()}`,
          content: encodedContent,
          branch: this.config.branch,
          sha: sha,
        }),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `GitHub API error: ${putRes.statusText}`);
      }

      const resData = await putRes.json();
      return {
        success: true,
        commitSha: resData?.commit?.sha,
        message: `Successfully synchronized ${collection} to GitHub private repo [${resData?.commit?.sha?.slice(0, 7)}]`,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown GitHub API sync error';
      return {
        success: false,
        message: `GitHub sync error: ${errorMessage}`,
      };
    }
  }

  /**
   * Read collection from GitHub private repository
   */
  public async fetchCollectionData<T>(collection: keyof AppDatabaseState): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const path = `data/${collection}.json`;
      const url = `${this.config.apiBaseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) return null;
      const fileData = await res.json();
      if (!fileData.content) return null;

      const decoded = decodeURIComponent(escape(atob(fileData.content.replace(/\s/g, ''))));
      return JSON.parse(decoded) as T;
    } catch (e) {
      console.warn(`Failed to fetch ${collection} from GitHub repo:`, e);
      return null;
    }
  }
}
