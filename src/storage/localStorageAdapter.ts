import { IStorageDriver, AppDatabaseState } from './storageInterface';
import { defaultSeedData } from './seedData';
import { AuditLog } from '../types';
import { GitHubStorageDriver } from './githubStorage';

const STORAGE_KEY = 'HYBRID_CIVIL_DB_STATE_V1';

export class LocalStorageAdapter implements IStorageDriver {
  private memoryState: AppDatabaseState | null = null;
  private githubStorage: GitHubStorageDriver;

  constructor() {
    this.githubStorage = new GitHubStorageDriver();
  }

  public async init(): Promise<void> {
    if (typeof window === 'undefined') {
      this.memoryState = JSON.parse(JSON.stringify(defaultSeedData));
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.memoryState = JSON.parse(stored);
      } else {
        this.memoryState = JSON.parse(JSON.stringify(defaultSeedData));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryState));
      }
    } catch (e) {
      console.error('Failed to load from localStorage, initializing default state:', e);
      this.memoryState = JSON.parse(JSON.stringify(defaultSeedData));
    }
  }

  public async getState(): Promise<AppDatabaseState> {
    if (!this.memoryState) {
      await this.init();
    }
    return this.memoryState!;
  }

  public async saveState(state: AppDatabaseState): Promise<void> {
    this.memoryState = state;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error('Failed to persist state to localStorage:', err);
      }
    }
  }

  public async saveRecord<T extends { id: string }>(
    collection: keyof AppDatabaseState,
    item: T
  ): Promise<T> {
    const state = await this.getState();
    const list = (state[collection] as unknown as T[]) || [];
    const index = list.findIndex((x) => x.id === item.id);

    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }

    (state[collection] as unknown as T[]) = list;
    await this.saveState(state);

    // Optional background commit to GitHub repo if configured
    if (this.githubStorage.isConfigured()) {
      this.githubStorage.commitCollectionData(collection, list, `Update ${collection} item ${item.id}`).catch(() => {});
    }

    return item;
  }

  public async deleteRecord(
    collection: keyof AppDatabaseState,
    id: string
  ): Promise<boolean> {
    const state = await this.getState();
    const list = (state[collection] as unknown as { id: string }[]) || [];
    const filtered = list.filter((x) => x.id !== id);

    if (filtered.length !== list.length) {
      (state[collection] as unknown as { id: string }[]) = filtered;
      await this.saveState(state);

      if (this.githubStorage.isConfigured()) {
        this.githubStorage.commitCollectionData(collection, filtered, `Delete ${collection} item ${id}`).catch(() => {});
      }
      return true;
    }
    return false;
  }

  public async logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const state = await this.getState();
    const auditItem: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    state.auditLogs = [auditItem, ...(state.auditLogs || [])];
    await this.saveState(state);
  }

  public async exportBackup(): Promise<string> {
    const state = await this.getState();
    return JSON.stringify(state, null, 2);
  }

  public async importBackup(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.companies && parsed.projects) {
        await this.saveState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public async syncToRemote(): Promise<{ success: boolean; message: string }> {
    if (!this.githubStorage.isConfigured()) {
      return {
        success: false,
        message: 'GitHub storage credentials (GITHUB_TOKEN / GITHUB_REPO) not configured. Currently using browser-isolated persistent storage with zero external leakage.',
      };
    }
    const state = await this.getState();
    return this.githubStorage.commitCollectionData('projects', state.projects, 'Manual sync triggered');
  }
}

export const defaultStorage = new LocalStorageAdapter();
