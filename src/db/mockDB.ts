import { throwErr } from '@/lib/util';
import { DuplicateKeyError, InternalError, NotFoundError } from './errors';
import * as mockData from './mockData';
import {
  Annotation, Campaign, Community, Task, User,
} from './types';

class MockDb {
  private communities = mockData.communities;

  private campaigns = mockData.campaigns;

  private annotations = mockData.annotations;

  private campaignAnnotationPairings = mockData.campaignAnnotationPairings;

  private tasks = mockData.tasks;

  private users = mockData.users;

  private collaborators = mockData.collaborators;

  async getCommunities() {
    return this.communities;
  }

  async getCommunity(communityId: string) {
    return await this.getCommunityIfExists(communityId)
      ?? throwErr(new NotFoundError('community not found'));
  }

  async getCampaigns(communityId: string) {
    await this.getCommunity(communityId);
    return this.campaigns.filter((c) => c.communityId === communityId);
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
    return this.annotations.filter((c) => c.communityId === communityId);
  }

  async getCommunityAnnotationCount(communityId: string) {
    return (await this.getCommunityAnnotations(communityId)).length;
  }

  async getCampaignAnnotations(campaignId: string) {
    await this.getCampaign(campaignId);
    return this.campaignAnnotationPairings
      .filter((p) => p.campaignId === campaignId)
      .map((p) => this.annotations.find((a) => a.id === p.annotationId))
      .filter((a): a is Annotation => !!a ?? throwErr(new InternalError('annotation for mapping not found')));
  }

  async getCampaignAnnotationCount(campaignId: string) {
    return (await this.getCampaignAnnotations(campaignId)).length;
  }

  async getAnnotations(campaignId: string) {
    await this.getCampaign(campaignId);

    const annotationIds = this.campaignAnnotationPairings
      .filter((p) => p.campaignId === campaignId)
      .map((p) => p.annotationId);

    return this.annotations.filter((a) => annotationIds.includes(a.id));
  }

  async getAnnotation(annotationId: string) {
    return await this.getAnnotationIfExists(annotationId)
      ?? throwErr(new NotFoundError('annotation not found'));
  }

  async getTasks(campaignId: string) {
    await this.getCampaign(campaignId);
    return this.tasks.filter((t) => t.campaignId === campaignId);
  }

  async getUser(userId: string) {
    return await this.getUserIfExists(userId)
      ?? throwErr(new NotFoundError('user not found'));
  }

  async getUsers() {
    return this.users;
  }

  async getCommunityCollaborators(communityId: string) {
    await this.getCommunity(communityId);
    return this.collaborators
      .filter((c) => c.communityId === communityId)
      .map((c) => this.users.find((u) => u.id === c.userId))
      .filter((u): u is User => !!u ?? throwErr(new InternalError('user for collaborator not found')));
  }

  async getCommunityCollaboratorCount(communityId: string) {
    return (await this.getCommunityCollaborators(communityId)).length;
  }

  async insertCommunity(community: Community) {
    if (await this.getCommunityIfExists(community.id)) {
      throw new DuplicateKeyError('duplicate community id');
    }

    this.communities = [...this.communities, community];
  }

  async insertCampaign(campaign: Campaign) {
    if (await this.getCampaignIfExists(campaign.id)) {
      throw new DuplicateKeyError('duplicate campaign id');
    }

    await this.getCommunity(campaign.communityId);
    this.campaigns = [...this.campaigns, campaign];
  }

  async insertAnnotation(annotation: Annotation) {
    if (await this.getAnnotationIfExists(annotation.id)) {
      throw new DuplicateKeyError('duplicate annotation id');
    }

    await this.getCommunity(annotation.communityId);
    this.annotations = [...this.annotations, annotation];
  }

  async insertTask(task: Task) {
    if (this.tasks.filter((c) => c.id === task.id).length > 0) {
      throw new DuplicateKeyError('duplicate task id');
    }

    await this.getCampaign(task.campaignId);
    this.tasks = [...this.tasks, task];
  }

  async insertUser(user: User) {
    if (await this.getUserIfExists(user.id)) {
      throw new DuplicateKeyError('duplicate user id');
    }

    this.users = [...this.users, user];
  }

  async addAnnotationToCampaign(annotation: Annotation, campaign: Campaign) {
    await this.getAnnotation(annotation.id);
    await this.getCampaign(campaign.id);

    this.campaignAnnotationPairings = [
      ...this.campaignAnnotationPairings,
      {
        campaignId: campaign.id,
        annotationId: annotation.id,
      },
    ];
  }

  async addUserToCommunity(user: User, community: Community) {
    await this.getUser(user.id);
    await this.getCommunity(community.id);

    this.collaborators = [
      ...this.collaborators,
      {
        communityId: community.id,
        userId: user.id,
      },
    ];
  }

  private async getCommunityIfExists(communityId: string) {
    return this.communities.filter((c) => c.id === communityId)[0];
  }

  private async getCampaignIfExists(campaignId: string) {
    return this.campaigns.filter((c) => c.id === campaignId)[0];
  }

  private async getAnnotationIfExists(annotationId: string) {
    return this.annotations.filter((a) => a.id === annotationId)[0];
  }

  private async getUserIfExists(userId: string) {
    return this.users.filter((u) => u.id === userId)[0];
  }
}

let db: MockDb | undefined;

export default function getDb(): MockDb {
  if (!db) {
    db = new MockDb();
  }

  return db;
}
