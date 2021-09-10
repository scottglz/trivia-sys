import { GuessWire, QuestionWire } from "@trivia-nx/types";

export interface guessesMap {
   [guessId: string]: GuessWire
}

export interface questionPlus extends Omit<QuestionWire, 'guesses'> {
   allGraded: boolean,
   guessesMap: guessesMap
}
