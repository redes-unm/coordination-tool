import { Mode, modeDisplayNames } from '@/lib/mapboxDrawModes';
import { IconDefinition, faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, SVGProps } from 'react';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import styles from './ModeControl.module.css';
import drawPolygon from '../../icons/draw-polygon.svg';
import drawPoint from '../../icons/draw-point.svg';
import drawLine from '../../icons/draw-line.svg';
import drawRectangle from '../../icons/draw-rectangle.svg';

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

const icons: { [m in Mode]: IconDefinition | FC<SVGProps<SVGElement>> } = {
  simple_select: faArrowPointer,
  draw_polygon: drawPolygon,
  draw_point: drawPoint,
  draw_line_string: drawLine,
  draw_rectangle: drawRectangle,
};

function isIconDefinition(i: unknown): i is IconDefinition {
  return !!(i && typeof i === 'object' && 'icon' in i);
}

function ModeIcon({
  icon: Icon,
  label,
}: { icon: IconDefinition | FC<SVGProps<SVGElement>>, label: string }) {
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
          <ModeIcon icon={icons[m]} label={modeDisplayNames[m]} />
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
