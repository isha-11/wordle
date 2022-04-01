type Action = {
  type: 'START_GAME';
  chosenWord: string;
};

// TODO: JsDoc
// TODO: Test
export const wordleReducer = (
  state: WordleState,
  action: Action,
): WordleState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        currentGame: {
          acceptedWords: [],
          chosenWord: action.chosenWord,
        },
        wordList: [action.chosenWord, ...state.wordList],
      };
  }
};