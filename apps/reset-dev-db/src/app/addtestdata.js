const { daysAgo } = require('@trivia-nx/days');

export default async function(storage) {
   if (storage.host !== 'localhost' && storage.host !== 'host.docker.internal') {
      throw new Error(`Yikes, trying to clear all data from elsewhere than localhost: "${storage.host}"`);
   }

   console.log('Populating Test Data');

   const tomorrow = daysAgo(-1);
   const today = daysAgo(0);
   const yesterday = daysAgo(1);
   const dayBeforeYesterday = daysAgo(2);
   const threeDaysAgo = daysAgo(3);
   
   var users = [

      { username: 'Scott G', startday: '2018-01-01', email: 'scott.glazer@igrafx.com'},
      { username: 'Jeremy C', startday: '2018-01-01', email: 'jeremyc@fobar.com' },
      { username: 'Ryan H', startday: '2018-01-01', email: 'ryanh@foobar.com' },
      { username: 'Ben M', startday: '2018-01-01', email: 'bmisky@foobar.com' }
     
   ];
   
   var questions = [
      { day: threeDaysAgo, q: 'What\'s the third letter of the Greek alphabet, after alpha and beta?', a: 'Gamma' },
      { day: dayBeforeYesterday, q: 'What craft that launched in 1947 was christened for a name of the Incan creator god Viracocha?' },
      { day: yesterday, q: 'What is the world\'s largest family-owned liquor company, headquartered in Bermuda since leaving Cuba in the 1960s?'},
      { day: today, q: 'What groundbreaking semi-synthetic fiber was originally called "viscose" or "artificial silk" when it was first made from wood pulp in 1894?'},
      { day: tomorrow, q: 'Plato\'s "Ring of Gyges" and the mythological Cap of Hades both possessed what unusual power?' }
   ];
   
   var guesses = [
      { day:  threeDaysAgo, userid: 2, guess: 'Gamma', correct: true},
      { day:  threeDaysAgo, userid: 3, guess: 'Chi', correct: false },
      { day:  threeDaysAgo, userid: 4, guess: 'delta', correct: false},
      { day:  threeDaysAgo, userid: 1, guess: 'gamma', correct: true},
     
      { day:  dayBeforeYesterday, userid: 2, guess: 'Kon-Tiki' },
      { day:  dayBeforeYesterday, userid: 3, guess: 'No idea' },
      { day:  dayBeforeYesterday, userid: 4, guess: 'Titanic'},
      { day:  dayBeforeYesterday, userid: 1, guess: 'SS Minnow'},

      { day: yesterday, userid: 2, guess: 'Bacardi'},
      { day: yesterday, userid: 3, guess: 'Patron'},
      { day: yesterday, userid: 4, guess: 'Malibu?'},

    //  { day: today, userid: 2, guess: 'Rayon'},
      { day: today, userid: 3, guess: 'Sweaters'},
      { day: today, userid: 4, guess: 'Polyester'}
   ];

   for (const user of users) {
      await storage.createUser(user.username, user.email, user.startday);
   }
   
  // await storage.startStopUser(4, dayBeforeYesterday);

   await storage.upsertQuestions(questions);

   for (const guess of guesses) {
      await storage.insertGuess(guess.day, guess.userid, guess.guess);
   }

   for (const question of questions) {
      if (question.a) {
         var dayGuesses = guesses.filter(guess => guess.day === question.day);
         await storage.insertAnswerAndGrades(question.day, question.a, dayGuesses);
      }
   }
};
