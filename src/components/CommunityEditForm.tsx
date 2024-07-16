import { Collaborator, Community } from '@/types';
import { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { throwErr } from '@/lib/util';
import { v4 as uuid } from 'uuid';
import btnStyles from '@/components/Button.module.css';
import dynamic from 'next/dynamic';
import {
  addIcon, closeIcon, communityAdminIcon, communityPrivateIcon, userIcon,
} from '@/icons';
import styles from './CommunityEditForm.module.css';
import TextInput from './TextInput';

const LocationPickerMap = dynamic(() => import('./map/LocationPickerMap'), { ssr: false });

type Props = {
  community: Community
  collaborators: Collaborator[]
  onCancel: () => void
  onSave: (community: Community, collaborators: Collaborator[]) => Promise<void>
  onDelete?: () => Promise<void>
};

export default function CommunityEditForm({
  community: initialCommunity,
  collaborators: initialCollaborators,
  onCancel,
  onSave,
  onDelete,
}: Props) {
  const [community, setCommunity] = useState(initialCommunity);
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setCollaborator = useCallback((id: string, fields: Partial<Collaborator>) => {
    setCollaborators((old) => {
      const i = old.findIndex((c) => c.id === id);
      const oldFields = old[i] ?? throwErr(`missing collaborator ${id}`);
      const newC = old.slice();
      newC[i] = { ...oldFields, ...fields };
      return newC;
    });
  }, []);

  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (e: unknown) {
      setError(`Error: ${e instanceof Error ? e.message : e}`);
    }
    setLoading(false);
  }, []);

  const handleSave = useCallback(
    async () => withLoading(() => onSave(community, collaborators)),
    [withLoading, onSave, community, collaborators],
  );

  return (
    <form className={styles['form']} action={handleSave}>
      <div className={styles['inputs']}>
        <div className={styles['label']}>Name</div>
        <div className={styles['contents']}>
          <TextInput
            label="name"
            labelAbove
            hideLabel
            value={community.name}
            onChange={(e) => setCommunity((old) => ({ ...old, name: e.target.value }))}
            required
          />
        </div>

        <div className={styles['label']}>Visibility</div>
        <div className={`${styles['contents']} ${styles['visibility']}`}>
          <div className={styles['value']}>
            <FontAwesomeIcon icon={communityPrivateIcon} />
            Private
          </div>
          <div className={styles['commentary']}>
            All communities are private in this version.
          </div>
        </div>

        <div className={styles['label']}>Description</div>
        <div className={`${styles['contents']} ${styles['description']}`}>
          <TextInput
            label="description"
            labelAbove
            hideLabel
            multiLine
            value={community.description}
            onChange={(e) => setCommunity((old) => ({ ...old, description: e.target.value }))}
          />
        </div>

        <div className={styles['label']}>Collaborators</div>
        <div className={`${styles['contents']} ${styles['collaborators']}`}>
          {collaborators.map((c, i) => (
            <div
              key={c.id}
              className={`${styles['collaborator']} ${styles[c.editable ? 'edit' : 'no-edit']}`}
            >
              {
                c.editable ? (
                  <>
                    <div className={styles['collab-inputs']}>
                      <div className={styles['label']}>Name</div>
                      <TextInput
                        label="Name"
                        labelAbove
                        hideLabel
                        value={c.name}
                        onChange={(e) => setCollaborator(c.id, { name: e.target.value })}
                        required
                        autoFocus={i === collaborators.length - 1}
                      />
                      <div className={styles['label']}>Role</div>
                      <TextInput
                        label="Role"
                        labelAbove
                        hideLabel
                        value={c.role}
                        onChange={(e) => setCollaborator(c.id, { role: e.target.value })}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className={`${btnStyles['btn']} ${btnStyles['danger']}`}
                      onClick={() => setCollaborators((old) => old.filter(({ id }) => id !== c.id))}
                    >
                      <FontAwesomeIcon icon={closeIcon} />
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles['icon']}>
                      <FontAwesomeIcon
                        icon={c.role === 'admin' ? communityAdminIcon : userIcon}
                      />
                    </div>
                    {`${c.name} (${c.role})`}
                  </>
                )
              }
            </div>
          ))}
          <button
            type="button"
            className={btnStyles['btn']}
            onClick={() => setCollaborators((old) => old.concat({
              id: uuid(),
              communityId: community.id,
              name: '',
              role: '',
              editable: true,
            }))}
          >
            <FontAwesomeIcon icon={addIcon} />
            Add
          </button>
        </div>

        <div className={styles['label']}>Location</div>
        <div className={`${styles['contents']} ${styles['location']}`}>
          <div className={styles['commentary']}>
            Choose a spot on the map below to center the map view of your community.
          </div>
          <LocationPickerMap
            location={community.mapCenter}
            onLocationChange={useCallback((l) => setCommunity((old) => ({
              ...old,
              mapCenter: l,
            })), [])}
          />
        </div>
      </div>

      { error && <div className={`error ${styles['error']}`}>{error}</div> }

      <div className={styles['buttons']}>
        <button
          type="button"
          className={btnStyles['btn']}
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        { onDelete && (
          <button
            type="button"
            className={`${btnStyles['btn']} ${btnStyles['danger']}`}
            onClick={() => withLoading(onDelete)}
            disabled={loading}
          >
            Delete
          </button>
        )}

        <button
          type="submit"
          className={`${btnStyles['btn']} ${btnStyles['solid']}`}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </form>
  );
}
