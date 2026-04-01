import {
  Annotation, Campaign, Collaborator, Community, CommunityData, Profile, Task, TrackStoreData,
} from '@/types';
import { DEFAULT_ANNOTATION_COLOR } from '@/lib/drawStyles';
import { SupabaseClient } from '@supabase/supabase-js';
import { Geometry } from 'geojson';
import { validate } from 'uuid';
import { Database } from './types.generated';
import { DbNotFoundError } from './errors';
import {
  getJoinedCount, handleError, decodePoint, encodePoint,
} from './util';

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
      creatorId: d.creatorid,
      name: d.name,
      description: d.description ?? '',
      collaboratorCount: getJoinedCount(d.collaborators),
    }));
  }

  async getCommunityData(id: string): Promise<CommunityData> {
    if (!validate(id)) {
      throw new DbNotFoundError();
    }

    const { data, error } = await this.client
      .from('communities')
      .select('*, campaigns(*, tasks(*)), collaborators(*), annotations(*, campaignannotations(campaignid))')
      .eq('id', id)
      .limit(1)
      .single();

    handleError(error);

    return {
      community: {
        id: data.id,
        creatorId: data.creatorid,
        name: data.name,
        description: data.description ?? '',
        mapCenter: data.mapcenter ? decodePoint(data.mapcenter) : undefined,
      },
      campaigns: data.campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? '',
        default: !!c.defaultforcommunity,
        communityId: c.communityid,
        type: c.type,
      })),
      tasks: data.campaigns
        .flatMap((c) => c.tasks.map((t) => ({
          id: t.id,
          campaignId: t.campaignid,
          name: t.name,
          description: t.description ?? '',
          date: t.duedate ? new Date(t.duedate) : null,
          priority: t.priority,
          status: t.status,
        }))),
      collaborators: data.collaborators.map((c) => ({
        id: c.id,
        communityId: c.communityid,
        userId: c.userid ?? undefined,
        name: c.name,
        role: c.role,
        editable: c.editable,
      })),
      annotations: data.annotations.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description ?? '',
        color: a.color ?? DEFAULT_ANNOTATION_COLOR,
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
      .select('*, tasks(count), campaignannotations(count)')
      .eq('communityid', communityId);

    handleError(error);

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description ?? '',
      type: d.type,
      communityId: d.communityid,
      default: !!d.defaultforcommunity,
      annotationCount: getJoinedCount(d.campaignannotations),
      taskCount: getJoinedCount(d.tasks),
    }));
  }

  async insertCampaign(c: Campaign) {
    const { error } = await this.client
      .from('campaigns')
      .insert({
        id: c.id,
        name: c.name,
        description: c.description,
        type: c.type,
        communityid: c.communityId,
      });

    handleError(error);
  }

  async updateCampaign(c: Campaign) {
    const { error } = await this.client
      .from('campaigns')
      .update({
        id: c.id,
        name: c.name,
        description: c.description,
        communityid: c.communityId,
        type: c.type,
      })
      .eq('id', c.id);

    handleError(error);
  }

  async deleteCampaign(id: string) {
    const { error } = await this.client
      .from('campaigns')
      .delete()
      .eq('id', id);

    handleError(error);
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

  async insertCommunity(c: Community, collaborators: Collaborator[]) {
    const { error } = await this.client
      .rpc('createcommunity', {
        community: {
          id: c.id,
          name: c.name,
          description: c.description,
          mapcenter: c.mapCenter && encodePoint(c.mapCenter),
          creatorid: c.creatorId,
        },
        collabs: collaborators.map((collab) => ({
          id: collab.id,
          communityid: collab.communityId,
          userid: collab.userId ?? null,
          name: collab.name,
          role: collab.role,
          editable: collab.editable,
        })),
      });

    handleError(error);
  }

  async updateCommunity(c: Community, collaborators: Collaborator[]) {
    const { error } = await this.client
      .rpc('editcommunity', {
        community: {
          id: c.id,
          name: c.name,
          description: c.description,
          mapcenter: c.mapCenter && encodePoint(c.mapCenter),
          creatorid: c.creatorId,
        },
        collabs: collaborators.map((collab) => ({
          id: collab.id,
          communityid: collab.communityId,
          userid: collab.userId ?? null,
          name: collab.name,
          role: collab.role,
          editable: collab.editable,
        })),
      });

    handleError(error);
  }

  async deleteCommunity(id: string) {
    const { error } = await this.client
      .from('communities')
      .delete()
      .eq('id', id);

    handleError(error);
  }

  async insertAnnotation(a: Annotation, communityId: string) {
    const { error } = await this.client
      .from('annotations')
      .insert({
        id: a.id,
        name: a.name,
        description: a.description,
        color: a.color,
        geo: a.geometry,
        type: a.type,
        communityid: communityId,
        visible: true,
      });

    handleError(error);

    const { error: caError } = await this.client
      .from('campaignannotations')
      .insert(a.campaignIds.map((cid) => ({ campaignid: cid, annotationid: a.id })));

    handleError(caError);
  }

  async upsertAnnotation(a: Annotation, communityId: string) {
    // update annotation itself
    const { error } = await this.client
      .from('annotations')
      .upsert({
        id: a.id,
        name: a.name,
        description: a.description,
        color: a.color,
        geo: a.geometry,
        type: a.type,
        communityid: communityId,
        visible: true,
      });

    handleError(error);

    // delete campaign-annotation mappings not in the specified set
    const { error: caDeleteError } = await this.client
      .from('campaignannotations')
      .delete()
      .eq('annotationid', a.id)
      .not('campaignid', 'in', `(${a.campaignIds.map((id) => `"${id}"`).join(',')})`);

    handleError(caDeleteError);

    // upsert specified campaign-annotation mappings
    const { error: caUpsertError } = await this.client
      .from('campaignannotations')
      .upsert(
        a.campaignIds.map((cid) => ({ campaignid: cid, annotationid: a.id })),
        { onConflict: 'campaignid, annotationid' },
      );

    handleError(caUpsertError);
  }

  async deleteAnnotation(id: string) {
    const { error } = await this.client
      .from('annotations')
      .delete()
      .eq('id', id);

    handleError(error);
  }

  async insertTask(t: Task) {
    const { error } = await this.client
      .from('tasks')
      .insert({
        id: t.id,
        name: t.name,
        description: t.description,
        priority: t.priority,
        status: t.status,
        duedate: t.date?.toISOString() ?? null,
        campaignid: t.campaignId,
      });

    handleError(error);
  }

  async updateTask(t: Task) {
    const { error } = await this.client
      .from('tasks')
      .update({
        id: t.id,
        name: t.name,
        description: t.description,
        priority: t.priority,
        status: t.status,
        duedate: t.date?.toISOString() ?? null,
        campaignid: t.campaignId,
      })
      .eq('id', t.id);

    handleError(error);
  }

  async deleteTask(id: string) {
    const { error } = await this.client
      .from('tasks')
      .delete()
      .eq('id', id);

    handleError(error);
  }

  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('userid', userId)
      .limit(1)
      .single();

    handleError(error);

    return { userId: data.userid, name: data.name };
  }

  async insertProfile(profile: Profile) {
    const { error } = await this.client
      .from('profiles')
      .insert({
        userid: profile.userId,
        name: profile.name,
      });

    handleError(error);
  }

  async insertTrackStoreData(trackStore: TrackStoreData[]) {
    const data = trackStore.map((item) => ({
      element: item.element,
      event: item.event,
      page: item.page,
      timestamp: item.timestamp.toISOString(),
      userid: item.userId,
    }));

    const { error } = await this.client
      .from('tracking')
      .insert(data);

    handleError(error);
  }
}
