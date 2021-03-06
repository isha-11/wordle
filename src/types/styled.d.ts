import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: CSSProperties['color'];
    borderColor: {
      INITIAL: CSSProperties['borderColor'];
      HIGHLIGHT: CSSProperties['borderColor'];
    };
    bgColor: {
      BODY: CSSProperties['backgroundColor'];
      INITIAL: CSSProperties['backgroundColor'];
      MATCH: CSSProperties['backgroundColor'];
      NO_MATCH: CSSProperties['backgroundColor'];
      PARTIAL_MATCH: CSSProperties['backgroundColor'];
      KEY_PRESS: CSSProperties['backgroundColor'];
    };
  }
}
