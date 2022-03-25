import { FlexBox } from 'react-styled-flex';
import styled from 'styled-components';

type WordboardRowProps =
  | {
      type: 'accepted';
      row: Letter[];
    }
  | {
      type: 'current' | 'empty';
      row: string[];
    };

export type Letter = { key: KeyCode; matchStatus: MatchStatus };

export const WordboardRow = ({ type, row }: WordboardRowProps) => {
  return (
    <FlexBox gap={'0.5rem'} aria-label={'guess-word'} data-word-type={type}>
      {type === 'accepted'
        ? row.map((letter, letterIdx) => (
            <Letter
              key={letterIdx}
              aria-label={'letter'}
              status={letter.matchStatus}
            >
              {letter.key}
            </Letter>
          ))
        : row.map((letter, letterIdx) => (
            <Letter key={letterIdx} aria-label={'letter'}>
              {letter}
            </Letter>
          ))}
    </FlexBox>
  );
};

const Letter = styled(FlexBox).attrs({ center: true })<{
  status?: MatchStatus;
}>`
  height: 3.5rem;
  width: 3.5rem;
  border: 2px solid
    ${({ status, theme }) => (status ? 'transparent' : theme.borderColor)};
  background-color: ${({ status, theme }) =>
    status ? theme.matchStatus[status] : undefined};
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
`;
