import { Mode, modeDisplayNames } from '@/lib/mapboxDrawModes';
import { throwErr } from '@/lib/util';
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '@radix-ui/react-radio-group';

type Props = {
  mode: Mode
  onModeChange: (mode: Mode) => void
};

const cancelMode: Mode = 'simple_select';
const addModes: Mode[] = [
  'draw_polygon',
  'draw_point',
  'draw_line_string',
  'draw_rectangle',
];
const defaultAddMode = addModes[0] ?? throwErr('no add modes');

export default function AddAnnotationControl({
  mode,
  onModeChange,
}: Props) {
  return (
    <div>
      {
        addModes.includes(mode) ? (
          <>
            <RadioGroup value={mode} onValueChange={onModeChange}>
              { addModes.map((m) => (
                <RadioGroupItem key={m} value={m}>
                  <RadioGroupIndicator>X</RadioGroupIndicator>
                  {modeDisplayNames[m]}
                </RadioGroupItem>
              ))}
            </RadioGroup>
            <button type="button" onClick={() => onModeChange(cancelMode)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" onClick={() => onModeChange(defaultAddMode)}>
            Add annotation
          </button>
        )
      }
    </div>
  );
}
