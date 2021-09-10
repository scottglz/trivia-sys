export interface GuessWire {
  guessid: number,
  day: string,
  userid: number,
  guess: string,
  correct: boolean | null
}

export interface QuestionWire {
   day: string,
   id: string,
   q: string,
   a: string | null,
   guesses: GuessWire[]
}