import {
  Annotation, AnnotationWithCampaigns, Campaign, Community, Task,
} from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Geometry } from 'geojson';
import { validate } from 'uuid';
import { Database } from './types.generated';
import { DbError, DbNotFoundError } from './errors';
import { getJoinedCount, handleError } from './util';

export default class Db {
  private client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  // Currently getting all communities. In the future, we'll also need to be
  // able to get only the communities for a given user.
  async getCommunities(): Promise<(Community & { collaboratorCount: number })[]> {
    const { data, error } = await this.client
      .from('communities')
      .select('*, collaborators(count)');

    handleError(error);

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description ?? '',
      collaboratorCount: getJoinedCount(d.collaborators),
    }));
  }

  async getCommunity(id: string): Promise<Community & {
    campaigns: { id: string, name: string }[],
    taskCount: number
    collaboratorCount: number
    annotations: AnnotationWithCampaigns[]
  }> {
    if (!validate(id)) {
      throw new DbNotFoundError();
    }

    const { data, error } = await this.client
      .from('communities')
      .select('*, campaigns(id, name, tasks(count)), collaborators(count), annotations(*, campaignannotations(campaignid))')
      .eq('id', id)
      .limit(1)
      .single();

    handleError(error);

    return {
      id: data.id,
      name: data.name,
      description: data.description ?? '',
      campaigns: data.campaigns.map((c) => ({ id: c.id, name: c.name })),
      taskCount: data.campaigns
        .map((c) => getJoinedCount(c.tasks))
        .reduce((sum, count) => sum + count, 0),
      collaboratorCount: getJoinedCount(data.collaborators),
      annotations: data.annotations.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description ?? '',
        type: a.type,
        geometry: a.geo as Geometry,
        campaignIds: a.campaignannotations.map((ca) => ca.campaignid),
      })),
    };
  }

  async getCampaigns(communityId: string): Promise<Campaign[]> {
    if (!validate(communityId)) {
      throw new DbNotFoundError();
    }

    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .eq('communityid', communityId);

    handleError(error);

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description ?? '',
      communityId: d.communityid,
    }));
  }

  async getCampaign(campaignId: string): Promise<Campaign & {
    tasks: Task[],
    annotations: Annotation[],
  }> {
    if (!validate(campaignId)) {
      throw new DbNotFoundError();
    }

    const { data, error } = await this.client
      .from('campaigns')
      .select('*, tasks(*), campaignannotations(annotations(*))')
      .eq('id', campaignId)
      .limit(1)
      .single();

    handleError(error);

    return {
      id: data.id,
      name: data.name,
      description: data.description ?? '',
      communityId: data.communityid,
      tasks: data.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description ?? '',
        priority: t.priority,
        status: t.status,
        date: t.duedate ? new Date(t.duedate) : null,
        campaignId: t.campaignid,
      })),
      annotations: data.campaignannotations.map((ca) => {
        const a = ca.annotations;
        if (!a) {
          throw new DbError('expected an annotation matching campaign annotation');
        }

        return {
          id: a.id,
          name: a.name,
          description: a.description ?? '',
          type: a.type,
          geometry: a.geo as Geometry,
        };
      }),
    };
  }

  async getCommunityName(id: string): Promise<string> {
    if (!validate(id)) {
      throw new DbNotFoundError();
    }

    const { data, error } = await this.client
      .from('communities')
      .select('name')
      .eq('id', id)
      .limit(1)
      .single();

    handleError(error);

    return data.name;
  }

  async getCampaignName(id: string): Promise<string> {
    if (!validate(id)) {
      throw new DbNotFoundError();
    }

    const { data, error } = await this.client
      .from('campaigns')
      .select('name')
      .eq('id', id)
      .limit(1)
      .single();

    handleError(error);

    return data.name;
  }

  async getCommunityTasks(id: string): Promise<Task[]> {
    if (!validate(id)) {
      throw new DbNotFoundError();
    }

    const { data, error } = await this.client
      .from('communities')
      .select('campaigns(tasks(*))')
      .eq('id', id)
      .limit(1)
      .single();

    handleError(error);

    return data.campaigns.reduce<Task[]>((allTasks, campaign) => {
      allTasks.push(...campaign.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description ?? '',
        priority: t.priority,
        status: t.status,
        date: t.duedate ? new Date(t.duedate) : null,
        campaignId: t.campaignid,
      })));

      return allTasks;
    }, []);
  }

  async insertAnnotation(a: Annotation, communityId: string) {
    const { error } = await this.client
      .from('annotations')
      .insert({
        id: a.id,
        name: a.name,
        description: a.description,
        geo: a.geometry,
        type: a.type,
        communityid: communityId,
        visible: true,
      });

    handleError(error);
  }

  async upsertAnnotation(a: Annotation, communityId: string) {
    const { error } = await this.client
      .from('annotations')
      .upsert({
        id: a.id,
        name: a.name,
        description: a.description,
        geo: a.geometry,
        type: a.type,
        communityid: communityId,
        visible: true,
      });

    handleError(error);
  }

  async deleteAnnotation(id: string) {
    const { error } = await this.client
      .from('annotations')
      .delete()
      .eq('id', id);

    handleError(error);
  }
}
