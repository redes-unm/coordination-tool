import { headers } from 'next/headers';
import { throwErr } from '@/lib/util';
import { DuplicateKeyError, InternalError, NotFoundError } from './errors';
import * as mockData from './mockData';
import {
  Annotation, Campaign, Community, Task, User,
} from './types';

const d = { ...mockData };
type Data = typeof d;

class MockDb {
  private data: Data = { ...mockData };

  async seed(data: Partial<Data>) {
    this.data = {
      communities: [],
      campaigns: [],
      annotations: [],
      campaignAnnotationPairings: [],
      tasks: [],
      users: [],
      collaborators: [],
      ...data,
    };
  }

  async getCommunities() {
    return this.data.communities;
  }

  async getCommunity(communityId: string) {
    return await this.getCommunityIfExists(communityId)
      ?? throwErr(new NotFoundError('community not found'));
  }

  async getCampaigns(communityId: string) {
    await this.getCommunity(communityId);
    return this.data.campaigns.filter((c) => c.communityId === communityId);
  }

  async getCampaign(campaignId: string) {
    return await this.getCampaignIfExists(campaignId)
      ?? throwErr(new NotFoundError('campaign not found'));
  }

  async getCampaignCount(communityId: string) {
    return (await this.getCampaigns(communityId)).length;
  }

  async getCommunityAnnotations(communityId: string) {
    await this.getCommunity(communityId);
    return this.data.annotations.filter((c) => c.communityId === communityId);
  }

  async getCommunityAnnotationCount(communityId: string) {
    return (await this.getCommunityAnnotations(communityId)).length;
  }

  async getCampaignAnnotations(campaignId: string) {
    await this.getCampaign(campaignId);
    return this.data.campaignAnnotationPairings
      .filter((p) => p.campaignId === campaignId)
      .map((p) => this.data.annotations.find((a) => a.id === p.annotationId))
      .filter((a): a is Annotation => !!a ?? throwErr(new InternalError('annotation for mapping not found')));
  }

  async getCampaignAnnotationCount(campaignId: string) {
    return (await this.getCampaignAnnotations(campaignId)).length;
  }

  async getAnnotations(campaignId: string) {
    await this.getCampaign(campaignId);

    const annotationIds = this.data.campaignAnnotationPairings
      .filter((p) => p.campaignId === campaignId)
      .map((p) => p.annotationId);

    return this.data.annotations.filter((a) => annotationIds.includes(a.id));
  }

  async getAnnotation(annotationId: string) {
    return await this.getAnnotationIfExists(annotationId)
      ?? throwErr(new NotFoundError('annotation not found'));
  }

  async getCampaignTasks(campaignId: string) {
    await this.getCampaign(campaignId);
    return this.data.tasks.filter((t) => t.campaignId === campaignId);
  }

  async getCommunityTasks(communityId: string) {
    await this.getCommunity(communityId);
    const campaigns = await this.getCampaigns(communityId);
    return (await Promise.all(campaigns.map((c) => this.getCampaignTasks(c.id)))).flat();
  }

  async getCommunityTaskCount(communityId: string) {
    return (await this.getCommunityTasks(communityId)).length;
  }

  async getUser(userId: string) {
    return await this.getUserIfExists(userId)
      ?? throwErr(new NotFoundError('user not found'));
  }

  async getUsers() {
    return this.data.users;
  }

  async getCommunityCollaborators(communityId: string) {
    await this.getCommunity(communityId);
    return this.data.collaborators
      .filter((c) => c.communityId === communityId)
      .map((c) => this.data.users.find((u) => u.id === c.userId))
      .filter((u): u is User => !!u ?? throwErr(new InternalError('user for collaborator not found')));
  }

  async getCommunityCollaboratorCount(communityId: string) {
    return (await this.getCommunityCollaborators(communityId)).length;
  }

  async insertCommunity(community: Community) {
    if (await this.getCommunityIfExists(community.id)) {
      throw new DuplicateKeyError('duplicate community id');
    }

    this.data.communities = [...this.data.communities, community];
  }

  async insertCampaign(campaign: Campaign) {
    if (await this.getCampaignIfExists(campaign.id)) {
      throw new DuplicateKeyError('duplicate campaign id');
    }

    await this.getCommunity(campaign.communityId);
    this.data.campaigns = [...this.data.campaigns, campaign];
  }

  async insertAnnotation(annotation: Annotation) {
    if (await this.getAnnotationIfExists(annotation.id)) {
      throw new DuplicateKeyError('duplicate annotation id');
    }

    await this.getCommunity(annotation.communityId);
    this.data.annotations = [...this.data.annotations, annotation];
  }

  async insertTask(task: Task) {
    if (this.data.tasks.filter((c) => c.id === task.id).length > 0) {
      throw new DuplicateKeyError('duplicate task id');
    }

    await this.getCampaign(task.campaignId);
    this.data.tasks = [...this.data.tasks, task];
  }

  async insertUser(user: User) {
    if (await this.getUserIfExists(user.id)) {
      throw new DuplicateKeyError('duplicate user id');
    }

    this.data.users = [...this.data.users, user];
  }

  async addAnnotationToCampaign(annotation: Annotation, campaign: Campaign) {
    await this.getAnnotation(annotation.id);
    await this.getCampaign(campaign.id);

    this.data.campaignAnnotationPairings = [
      ...this.data.campaignAnnotationPairings,
      {
        campaignId: campaign.id,
        annotationId: annotation.id,
      },
    ];
  }

  async addUserToCommunity(user: User, community: Community) {
    await this.getUser(user.id);
    await this.getCommunity(community.id);

    this.data.collaborators = [
      ...this.data.collaborators,
      {
        communityId: community.id,
        userId: user.id,
      },
    ];
  }

  private async getCommunityIfExists(communityId: string) {
    return this.data.communities.filter((c) => c.id === communityId)[0];
  }

  private async getCampaignIfExists(campaignId: string) {
    return this.data.campaigns.filter((c) => c.id === campaignId)[0];
  }

  private async getAnnotationIfExists(annotationId: string) {
    return this.data.annotations.filter((a) => a.id === annotationId)[0];
  }

  private async getUserIfExists(userId: string) {
    return this.data.users.filter((u) => u.id === userId)[0];
  }
}

let db: MockDb | undefined;

export default function getDb(): MockDb {
  // call headers function to force dynamic rendering
  headers();

  if (!db) {
    db = new MockDb();
  }

  return db;
}

export async function seedServer(serverBaseUrl: string, data: Partial<Data>) {
  const res = await fetch(`${serverBaseUrl}/mockDb/seed`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw Error(`failed to seed server: ${res.status}`);
  }
}
