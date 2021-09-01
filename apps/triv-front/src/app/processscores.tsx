import {  userFull, isUserActiveInYear, isUserActive } from '@trivia-nx/users';
import { questionPlus } from './types/question';
import { scoreObj, scoreCategoryDefinition } from './scorecategories';

interface scoreForUser {
   username: string,
   score: scoreObj
}

export interface processedScore extends scoreCategoryDefinition {
   scores: () => scoreForUser[],
   graphable: boolean
}

function getScoreCategoryResults(activeUsers: userFull[], gradedQuestions: questionPlus[], scoreCategory: scoreCategoryDefinition) : processedScore {
   
   let cachedScores: scoreForUser[];
   
   return {
      ...scoreCategory,
      scores: function() {
         if (!cachedScores) {
            cachedScores = activeUsers.map(user => ({
               username: user.username,
               score: scoreCategory.getUserScore(gradedQuestions, user)
            })).filter(item => item.score.outOf !== 0);
            
            cachedScores.sort((a,b) => b.score.value - a.score.value);
         }
         return cachedScores;
      },
      graphable: !!scoreCategory.getGraphData

   };
}

export function processScores(activeUsers: userFull[], questions: questionPlus[], scoreCategories: scoreCategoryDefinition[]): processedScore[] {
   
   // Filter out the graded questions
   const gradedQuestions = questions.filter(question => question.allGraded);

   // Get a scoring object for each of our categories
   // TODO need better naming here
   
   const categorizedScores = scoreCategories.map(function(scoreCategory) {
      return getScoreCategoryResults(activeUsers, gradedQuestions, scoreCategory); 
   }).filter(results => results.scores().length); // Calling scores() multiple times is OK, it's cached
   

   return categorizedScores
}



