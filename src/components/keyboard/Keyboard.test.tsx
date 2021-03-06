import { getAllByRole, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { matchKeyColors, renderWithProviders } from '../../test-utils';
import { darkTheme } from '../../theme';
import { Keyboard } from './Keyboard';

describe('Keyboard', () => {
  it('should display all keys', () => {
    renderWithProviders(
      <Keyboard keyMatchStatusMap={{}} onKey={() => void 0} />,
    );
    const keys = screen.getAllByRole('button');

    expect(keys).toHaveLength(28);
    iterateAlphabets((alphabet) =>
      screen.getByRole('button', { name: alphabet }),
    );
    screen.getByRole('button', { name: 'ENTER' });
    screen.getByRole('button', { name: 'BK' });
  });

  it('should display all keys in QWERTY order', () => {
    renderWithProviders(
      <Keyboard keyMatchStatusMap={{}} onKey={() => void 0} />,
    );
    const getKeysInRow = (rowIndex: 0 | 1 | 2) => {
      const allRows = screen.getAllByLabelText('key-row');

      return [...getAllByRole(allRows[rowIndex], 'button')]
        .map((button) => button.textContent)
        .join(',');
    };

    expect(getKeysInRow(0)).toBe('Q,W,E,R,T,Y,U,I,O,P');
    expect(getKeysInRow(1)).toBe('A,S,D,F,G,H,J,K,L');
    expect(getKeysInRow(2)).toBe('ENTER,Z,X,C,V,B,N,M,BK');
  });

  it('should trigger onKey callback on clicking alphabet, <ENT>, <BKSP> buttons on display', () => {
    const onKey = jest.fn();
    renderWithProviders(<Keyboard keyMatchStatusMap={{}} onKey={onKey} />);

    iterateAlphabets((alphabet) => {
      userEvent.click(screen.getByRole('button', { name: alphabet }));
      expect(onKey).toBeCalledWith(alphabet.toLowerCase());
      onKey.mockReset();
    });

    userEvent.click(screen.getByRole('button', { name: 'ENTER' }));
    expect(onKey).toBeCalledWith('<ENT>');
    onKey.mockReset();

    userEvent.click(screen.getByRole('button', { name: 'BK' }));
    expect(onKey).toBeCalledWith('<BKSP>');
    onKey.mockReset();
  });

  it('should trigger onKey callback on typing uppercase alphabets from physical keyboard', () => {
    const onKey = jest.fn();
    renderWithProviders(<Keyboard keyMatchStatusMap={{}} onKey={onKey} />);

    iterateAlphabets((alphabet) => {
      userEvent.keyboard(alphabet.toUpperCase()); // uppercase alphabets
      expect(onKey).toBeCalledWith(alphabet.toLowerCase());
      expect(onKey).toBeCalledTimes(1);
      onKey.mockReset();
    });
  });

  it('should trigger onKey callback on typing lowercase alphabets from physical keyboard', () => {
    const onKey = jest.fn();
    renderWithProviders(<Keyboard keyMatchStatusMap={{}} onKey={onKey} />);

    iterateAlphabets((alphabet) => {
      userEvent.keyboard(alphabet.toLowerCase()); // lowercase alphabets
      expect(onKey).toBeCalledWith(alphabet.toLowerCase());
      expect(onKey).toBeCalledTimes(1);
      onKey.mockReset();
    });
  });

  it('should trigger onKey callback on typing <ENT>, <BKSP> from physical keyboard', () => {
    const onKey = jest.fn();
    renderWithProviders(<Keyboard keyMatchStatusMap={{}} onKey={onKey} />);

    // enter
    userEvent.keyboard('{enter}');
    expect(onKey).toBeCalledWith('<ENT>');
    expect(onKey).toBeCalledTimes(1);
    onKey.mockReset();

    // backspace
    userEvent.keyboard('{backspace}');
    expect(onKey).toBeCalledWith('<BKSP>');
    expect(onKey).toBeCalledTimes(1);
    onKey.mockReset();
  });

  it('should not trigger onKey callback on typing any keys other than alphabets, <ENT>, <BKSP>', () => {
    const onKey = jest.fn();
    renderWithProviders(<Keyboard keyMatchStatusMap={{}} onKey={onKey} />);

    // numbers
    userEvent.keyboard('1234567890');
    expect(onKey).not.toBeCalled();

    // special characters
    userEvent.keyboard('}]~`!@#$%^&*():\';"<>,//._-=+-');
    expect(onKey).not.toBeCalled();

    // tab
    userEvent.tab();
    expect(onKey).not.toBeCalled();

    // shift
    userEvent.keyboard('{shift}');
    expect(onKey).not.toBeCalled();

    // alt
    userEvent.keyboard('{alt}');
    expect(onKey).not.toBeCalled();
  });

  it('should trigger onKey callback on pressing any key with shift', () => {
    const onKey = jest.fn();
    renderWithProviders(<Keyboard keyMatchStatusMap={{}} onKey={onKey} />);

    userEvent.keyboard('{shift}r');
    expect(onKey).toBeCalledWith('r');
  });

  it('should not trigger onKey callback on pressing any key with ctrl or alt even if shift is also pressed', () => {
    const onKey = jest.fn();
    renderWithProviders(<Keyboard keyMatchStatusMap={{}} onKey={onKey} />);

    // alt
    userEvent.keyboard('{alt}r');
    expect(onKey).not.toBeCalled();
    userEvent.keyboard('{alt}{shift}r');
    expect(onKey).not.toBeCalled();

    // alt
    userEvent.keyboard('{ctrl}r');
    expect(onKey).not.toBeCalled();
    userEvent.keyboard('{ctrl}{shift}r');
    expect(onKey).not.toBeCalled();
  });

  it('should show key with color corresponding to key status in keyMatchStatusMap', () => {
    renderWithProviders(
      <Keyboard
        keyMatchStatusMap={{ a: 'MATCH', b: 'NO_MATCH', c: 'PARTIAL_MATCH' }}
        onKey={() => void 0}
      />,
    );

    matchKeyColors({
      A: darkTheme.bgColor.MATCH,
      B: darkTheme.bgColor.NO_MATCH,
      C: darkTheme.bgColor.PARTIAL_MATCH,
    });
  });
});

const iterateAlphabets = (
  callback: (alphabet: string, index: number) => void,
) => {
  for (let i = 0; i < 26; i++) {
    callback(String.fromCharCode(65 + i), i);
  }
};
