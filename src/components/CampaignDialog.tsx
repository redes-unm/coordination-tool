import { useCallback } from 'react';
import { Campaign } from '@/types';
import * as Dialog from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { closeIcon } from '@/icons';
import styles from './CampaignDialog.module.css';
import EditableItemDisplay from './EditableItemDisplay';
import CampaignDisplay from './CampaignDisplay';
import CampaignEditFormContents from './CampaignEditFormContents';

type Props = {
  campaign: Campaign | undefined
  editing: boolean
  title?: string | undefined
  closeOnCancel?: boolean
  onClose: () => void
  onEdit: () => void
  onSave: (c: Campaign) => Promise<void>
  onDelete: (id: string) => Promise<void>
};

export default function CampaignDialog({
  campaign,
  editing,
  title,
  closeOnCancel,
  onSave,
  onDelete,
  onClose,
  onEdit,
}: Props) {
  return (
    <Dialog.Root
      open={!!campaign}
      onOpenChange={useCallback((open) => open || onClose(), [onClose])}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles['overlay']} />
        <Dialog.Content className={styles['content']} aria-describedby={undefined}>
          {campaign && (
            <>
              <Dialog.Title className={styles['title']}>
                {title ?? `Campaign: ${campaign.name}`}
              </Dialog.Title>
              <EditableItemDisplay
                item={campaign}
                editing={editing}
                onSave={onSave}
                onDelete={() => onDelete(campaign.id)}
                onCancel={closeOnCancel ? onClose : () => {}}
                onEdit={onEdit}
                Display={CampaignDisplay}
                EditFormContents={CampaignEditFormContents}
              />
              <Dialog.Close className={styles['close']}>
                <FontAwesomeIcon icon={closeIcon} />
                <span className="a11y-only">Close</span>
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
