export interface RestErrorError {
  response: {
     data: {
        statusCode: number,
        message: string
     }
  }
}

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

export interface GetQuestionsData {
  earliestDay: string,
  latestDay: string
}

export interface SendLoginEmailRequestData {
  email: string
}

export interface SubmitGuessData {
  questionid: string,
  guess: string 
}

export interface SubmitGradesData {
  questionid: string,
  answer: string,
  grades: { userid: number, correct: boolean }[]
}

export interface EditAnswerData {
  questionid: string,
  answer: string
}

export interface EditGradeData {
  questionid: string,
  userid: number,
  correct: boolean
}