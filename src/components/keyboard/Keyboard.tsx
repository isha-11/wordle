import { useCallback } from 'react';
import { FlexBox, FlexItem } from 'react-styled-flex';
import { Key } from './Key';
import { useAnimateKey } from './useAnimateKey';
import { useKeyPress } from './useKeyPress';
import { useVibration } from './useVibration';

type KeyRow = Array<KeyCode>;

const keyRows: [KeyRow, KeyRow, KeyRow] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['<ENT>', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<BKSP>'],
];

export interface KeyboardProps {
  keyMatchStatusMap: Partial<Record<KeyCode, MatchStatus>>;
  onKey: (code: KeyCode) => void;
}

export const Keyboard = ({ keyMatchStatusMap, onKey }: KeyboardProps) => {
  const animateKey = useAnimateKey();
  const vibrateKey = useVibration();

  const onKeyWrapper = useCallback(
    (keyCode: KeyCode) => {
      onKey(keyCode);
      animateKey(keyCode);
      vibrateKey();
    },
    [onKey, animateKey, vibrateKey],
  );
  useKeyPress(onKeyWrapper);

  return (
    <FlexBox
      as={'section'}
      aria-label={'keyboard'}
      gap={'0.25rem'}
      column
      width={'100%'}
    >
      {keyRows.map((keyRow, index) => (
        <Row
          key={index}
          rowIndex={index}
          keyRow={keyRow}
          onKey={onKeyWrapper}
          keyMatchStatusMap={keyMatchStatusMap}
        />
      ))}
    </FlexBox>
  );
};

const Row = ({
  rowIndex,
  keyRow,
  keyMatchStatusMap,
  onKey,
}: { rowIndex: number; keyRow: KeyRow } & KeyboardProps) => {
  return (
    <FlexBox aria-label='key-row' gap={'0.25rem'} center width={'100%'}>
      {rowIndex === 1 && <FlexItem flex={0.5} />}
      {keyRow.map((keyCode) => (
        <Key
          key={keyCode}
          code={keyCode}
          onClick={onKey}
          status={keyMatchStatusMap[keyCode]}
        />
      ))}
      {rowIndex === 1 && <FlexItem flex={0.5} />}
    </FlexBox>
  );
};
