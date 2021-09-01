export interface questionRaw {
   day: string,
   q: string,
   a?: string | null,
}

export interface question extends questionRaw {
   id: string
}

export interface guessRaw {
   guessid: number,
   userid: number,
   username: string,
   guess: string,
   correct?: boolean
}

export interface guess extends guessRaw {
   day: string,
}

export interface guessesMap {
   [guessId: string]: guess
}

export interface questionPlus extends question {
   allGraded: boolean,
   guesses: guess[],
   guessesMap: Record<string, guess>
}


export interface questionWithGuesses extends questionRaw {
   guesses: guessRaw[]   
}