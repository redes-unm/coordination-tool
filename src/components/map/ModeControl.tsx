import { Mode, modeDisplayNames } from '@/lib/mapboxDrawModes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { drawModeIcons, isIconDefinition } from '@/icons';
import styles from './ModeControl.module.css';

type Props = {
  mode: Mode
  onModeChange: (mode: Mode) => void
};

const modes: Mode[] = [
  'simple_select',
  'draw_point',
  'draw_line_string',
  'draw_rectangle',
  'draw_polygon',
];

function ModeIcon({
  icon: Icon,
  label,
}: { icon: (typeof drawModeIcons)[Mode], label: string }) {
  return isIconDefinition(Icon) ? (
    <span>
      <FontAwesomeIcon icon={Icon} />
      <span className="a11y-only">{label}</span>
    </span>
  ) : (
    <span>
      <Icon />
      <span className="a11y-only">{label}</span>
    </span>
  );
}

export default function ModeControl({
  mode,
  onModeChange,
}: Props) {
  return (
    <RadioGroup value={mode} onValueChange={onModeChange} className={styles['container']}>
      { modes.map((m) => (
        <RadioGroupItem
          key={m}
          value={m}
          title={modeDisplayNames[m]}
          className={styles['item']}
        >
          <ModeIcon icon={drawModeIcons[m]} label={modeDisplayNames[m]} />
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
