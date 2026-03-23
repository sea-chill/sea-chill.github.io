/* Did the Philadelphia Phillies win today?
 This script checks if the Phillies won on the current date (even with a doubleheader) and
 Special messages on certain days
 this script also sets the background and text color to match the Phllies uniform colors that day*/
/* Get the index for day of week (sunday = 0, monday = 1, etc.) */
/* this function is so the background and text correspond to the Phillies colors that day */
/* According to https://www.instagram.com/p/DUELgRVEWhE/ here is the plan for Phillies uniforms for 2026 */
/* Pinstrips for all home games that start after 6PM */
/* Grey Uniforms for all away games */
/* Powder Blue for all home games on Thursdays */
/* City Connect Blue/Yellow for all home games on Fridays */
/* Cream uniforms for all day home games except on Thursday and Friday */


/*these are global variables that I will use throughout the program.  I am defining them here so they can be easily updated if needed.  I am also defining them here so they can be easily accessed throughout the program.*/

const TEAM_ID = 143; // Philadelphia Phillies team ID in MLB API
const SPORT_ID = 1; // MLB sport ID in MLB API (1 for MLB, 11 for MiLB, etc.)
const LEAGUE_ID = 103; // National League

/**
 * Get today's date (YYYY-MM-DD) in local time.  The toISOString method returns the date in UTC time.
 */
function getTodayDate() {
  today = new Date();
  year = today.getFullYear();
  month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
  /*return new Date().toISOString().split("T")[0]; *//*this is utc time*/
}

 /* Get the index for day of week (sunday = 0, monday = 1, etc.) */
/* this function is so the background and text correspond to the Phillies colors that day */

function getDayOfWeek() {
  const today = new Date();
  return today.getDay(); 
}

/* Holiday check - I am not doing anything with this for now */
/* I want to add special messages on certain holidays, but I am not sure which holidays to add yet.  I will add this later. */

/*function getHolidayMessage() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  /*test code to set the day and month
  Tested and this function works*/
  /*note for later: need to add logic to end entire program if a holiday is detected*/

  /*const month = 1;
  const day = 1;*/
/*
  if (month === 12 && day === 25) return "🎄 Today is Christmas Day!";
  if (month === 1 && day === 1) return "🎉 Today is New Year's Day!";
  return null;
}*/

/**
 * Fetch schedule
 */
async function fetchSchedule() {
  let date = getTodayDate();

  /*test code to set the date*/
  /*date = "2025-08-10";*/
  /*there was a doubleheader on July 2, 2025*/
  /*game on July 1 was postponed */

  /*console.log(`Fetching schedule for date: ${date}`);*/

  const url = `https://statsapi.mlb.com/api/v1/schedule?teamId=${TEAM_ID}&sportId=${SPORT_ID}&date=${date}`;
  const res = await fetch(url);
  return res.json();
}

function backgroundAndTextColor(homeGame, gameHour) {

    let today = getTodayDate();
    today = "2026-03-28"; /*this is opening day for the 2026 season.  I am hardcoding this for now, but I will need to update this later to check if the date is opening day for the season.  This is because they will be wearing pinstripes regardless of if it is a day or night game. */
    if (today === "2026-03-28") { /*Opening Day is March 28, 2026.  This is a special case because they will be wearing pinstripes regardless of if it is a day or night game. */
        const philliesODElement = document.getElementById("phillies-color"); 
        const stateClass = "pinstripes";
        philliesODElement.classList.add(stateClass);
        return(stateClass);
    }

    const dayOfWeek = getDayOfWeek(); /*need day of week to see if Thursday or Friday for uniform color and background color on website*/
    /*dayOfWeek = 0;*//*get day of week with date input for testing purposes.  This will need to be updated later to get the day of week for the date of the game, not just today's date.*/
    if (dayOfWeek === 4 && homeGame) { /*Thursday*/
        const philliesPBElement = document.getElementById("phillies-color"); 
        const stateClass = "powder-blue";
        philliesPBElement.classList.add(stateClass);
        /*console.log(`Background and text color set to powder blue for today. Home game: ${homeGame}, Game hour: ${gameHour}, Day of week: ${dayOfWeek}, uniform: ${stateClass}`);*/
        return(stateClass);
    } else if (dayOfWeek === 5 && homeGame /* need to get if home or away.  This may not be a function*/) { /*Friday and home game*/
        const philliesCCElement = document.getElementById("phillies-color"); 
        const stateClass = "city-connect";
        philliesCCElement.classList.add(stateClass);
        /*console.log(`Background and text color set to city connect for today. Home game: ${homeGame}, Game hour: ${gameHour}, Day of week: ${dayOfWeek}, uniform: ${stateClass}`);*/
        return(stateClass);
    } else if (gameHour < 18 && homeGame) { /*day game and home game*/
        const philliesCreamElement = document.getElementById("phillies-color"); 
        const stateClass = "creme";
        philliesCreamElement.classList.add(stateClass);
        /*console.log(`Background and text color set to creme for today. Home game: ${homeGame}, Game hour: ${gameHour}, Day of week: ${dayOfWeek}, uniform: ${stateClass}`);*/
        return(stateClass);
    }else if (homeGame) {
        const philliesHGElement = document.getElementById("phillies-color"); 
        const stateClass = "pinstripes";
        philliesHGElement.classList.add(stateClass);
        /*console.log(`Background and text color set to pinstripes for today. Home game: ${homeGame}, Game hour: ${gameHour}, Day of week: ${dayOfWeek}, uniform: ${stateClass}`);*/
        return(stateClass);
    } else if (!homeGame) {
        const philliesAGElement = document.getElementById("phillies-color"); 
        const stateClass = "grey";
        philliesAGElement.classList.add(stateClass);
        /*console.log(`Background and text color set to grey for today. Home game: ${homeGame}, Game hour: ${gameHour}, Day of week: ${dayOfWeek}, uniform: ${stateClass}`);*/
        return(stateClass);
    } 
    
    return(null)
  }

/*
 * Main logic
 */
async function runDailyReport() {
 /* const holiday = getHolidayMessage();
  if (holiday) console.log(holiday); */
  /*Need to run this for opening day since they will be wearing pinstripes.
  Opening Day is March 28, 2026*/

  const scheduleData = await fetchSchedule();

  let gameStatus = "Hmmm...Not sure"; /* five states for status of the game. Use the MLB API definition for game status 
  which are strings. */

  /* the following line checks if either the date is invalid or if dates is null*/

  if (!scheduleData.dates || scheduleData.dates.length === 0) {
    let gameStatus = "No Game";
    /*console.log(`Phillies (team 143) did not play today. ${gameStatus}`); */ /*if there are no games, then the Phillies did not play today.*/
    const philliesResultElement = document.getElementById("phillies-gameOne-result"); 
    philliesResultElement.textContent = "The Phillies have no game scheduled today";
    const philliesDNPElement = document.getElementById("phillies-color"); 
        const stateClass = "pinstripes";
        philliesDNPElement.classList.add(stateClass);
      } 
  else {
    const games = scheduleData.dates[0].games;/*use pretty print on MLB API to get json structure*/

    /* check to get the background and text color set for the website based on the uniform colors for that day.  This is based on the day of the week and whether it is a home or away game. */
    
    /*are the phillies the home or away team? */
    const isHomeGame = games[0].teams.home.team.id === TEAM_ID; /*this checks if the first game is a home game.  If there is a doubleheader, both games will be home or away (except in spring training, but I am not checking for split squad games */  
    let gameHour = new Date(games[0].gameDate).getHours(); /*this gets the hour of the first game in 24 hour format.  
    I will use this to determine if it is a day game or a night game for the pinstripes uniform color and 
    background color on the website.  I will also need to check this for the doubleheader logic later. 
    I don't think the uniform color changes in second game of doubleheader */
    /*console.log(`Is it a home game? ${isHomeGame}. Game hour: ${gameHour}`); */
    backgroundAndTextColor(isHomeGame, gameHour);

    /*Account for doubleheaders */

    gameCount = scheduleData.dates[0].games.length;

    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const { gamePk } = game;
      /*console.log(`Game ${i + 1} ID: ${gamePk}`); */

      /*set labels for a doubleheader or not */

      if (gameCount == 2) {
        let philliesGameOneElement = document.getElementById("phillies-game-one");
        philliesGameOneElement.textContent = "Game One:";
        let philliesGameTwoElement = document.getElementById("phillies-game-two");
        philliesGameTwoElement.textContent = "Game Two:";
      }
      else {
        let philliesGameOneElement = document.getElementById("phillies-game-one");
        philliesGameOneElement.textContent = null;
        let philliesGameTwoElement = document.getElementById("phillies-game-two");
        philliesGameTwoElement.textContent = null;
      }

      const gameStatus = games[i].status.detailedState; /*this is the status of the first or second game.  
        If there is a doubleheader, there will be two games in the games array.  
        If there is only one game, there will be one game in the games array.  
        If there are no games, there will be no games in the games array.*/

      /* get game score difference to add more wording if a game is in progress */
      let homeScore = games[i].teams.home.score;
      let awayScore = games[i].teams.away.score;
      let scoreDifference = homeScore - awayScore;
      let goodScore = 0; /*this is a variable that I will use to determine if the Phillies are winning big, losing big, or if the score is close.  I will define winning big as being ahead by more than 5 runs and losing big as being behind by more than 5 runs. */

      if (games[i].teams.home.team.id === TEAM_ID && scoreDifference > 5) {
        goodScore = 5;
      }
      else if (games[i].teams.home.team.id === TEAM_ID && scoreDifference < -5) {
        goodScore = -5;
      }
            
      if (games[i].teams.away.team.id === TEAM_ID && scoreDifference > 5) {
        goodScore = -5;
      }
      else if (games[i].teams.away.team.id === TEAM_ID && scoreDifference < -5) {
        goodScore = 5;
      }
      
      /*console.log(`Home score: ${homeScore}, Away score: ${awayScore}, Score difference: ${scoreDifference}, Good score: ${goodScore}`); */

      /*console.log(`Game ${i + 1} status: ${gameStatus} Game Hour: ${gameHour}`);*/

      /* Now determine what should be output based on the game status */

      switch (gameStatus) {
        case "No Game":
          console.log("Phillies (team 143) did not play today.");
          let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
          philliesResultElementOne.textContent = "The Phillies did not play today";
          let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result");
          philliesResultElementTwo.textContent = null;
          break;
        case "Pre-Game":
        case "Scheduled":
          /*get time of first pitch and convert to local time for output.  This is in ISO format in the API so it is in UTC time.  I will need to convert it to local time for the output.  I will also need to account for the date change if the game is at night and the local time is the next day. */

          gameDateUTC = new Date(scheduleData.dates[0].games[i].gameDate);
          const localTime = new Date(gameDateUTC);
          gameHour = localTime.getHours(); /*update game hour to be in local time for the background and text color function.  This is because the game hour in UTC time may be different than the game hour in local time, which could affect the uniform color and background color on the website. */
          gameMinute = localTime.getMinutes();
          gameAMPM = gameHour >= 12 ? "PM" : "AM";
          const formattedHour = gameHour % 12 || 12; /*convert to 12 hour format*/
          const firstPitch = `${formattedHour}:${String(gameMinute).padStart(2, "0")} ${gameAMPM}`;

          if (gameCount == 2 && i == 0) {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            philliesResultElementOne.textContent = `Game 1 has not started yet. First pitch is at ${firstPitch}`;
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            philliesResultElementTwo.textContent = "Game 2 has not started yet";
          }
          else if (gameCount == 2 && i == 1) {
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            philliesResultElementTwo.textContent = `Game 2 has not started yet. First pitch is at ${firstPitch}`
          }
          else {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            philliesResultElementOne.textContent = `Phillies have a game scheduled today, but it has not started yet. First pitch is at ${firstPitch}`;
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result");
            philliesResultElementTwo.textContent = null;
          }
          /*console.log("Phillies have a game scheduled today, but it has not started yet.");*/
          break;
        case "Warmup":
          if (gameCount == 2 && i == 0) {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            philliesResultElementOne.textContent = "Game 1 has not started yet but the players are on the field and warming up";
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            philliesResultElementTwo.textContent = "Game 2 has not started yet";
          }
          else if (gameCount == 2 && i == 1) {
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            philliesResultElementTwo.textContent = "Game 2 has not started yet but the players are on the field and warming up"
          }
          else {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            philliesResultElementOne.textContent = "The game hasn't started yet but the players are on the field and warming up";
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result");
            philliesResultElementTwo.textContent = null;
          }
          /*console.log("The game hasn't started yet but the players are on the field and warming up");*/
          break;
        case "In Progress":
          if (gameCount == 2 && i == 0) {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            if (goodScore == 5) {
              philliesResultElementOne.textContent = "Game 1 is in progress and the Phillies are winning big!";
            }
            else if (goodScore == -5) {
              philliesResultElementOne.textContent = "Game 1 is in progress and the Phillies are losing big";
            }
            else {
              philliesResultElementOne.textContent = "Game 1 is in progress";
            }
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            philliesResultElementTwo.textContent = "Game 2 has not started yet";
          }
          else if (gameCount == 2 && i == 1) {
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            if (goodScore == 5) {
              philliesResultElementTwo.textContent = "Game 2 is in progress and the Phillies are winning big!";
            }
            else if (goodScore == -5) {
              philliesResultElementTwo.textContent = "Game 2 is in progress and the Phillies are losing big.";
            }
            else {
            philliesResultElementTwo.textContent = "Game 2 is in progress"
          }
        }
          else {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            if (goodScore == 5) {
              philliesResultElementOne.textContent = "The game is in progress and the Phillies are winning big!";
            }
            else if (goodScore == -5) {
              philliesResultElementOne.textContent = "The game is in progress and the Phillies are losing big.";
            }
            else {
              philliesResultElementOne.textContent = "The Phillies have a game in progress right now";
            }
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result");
            philliesResultElementTwo.textContent = null;
          }
          /*console.log("Phillies have a game in progress right now");*/
          break;
        case "Postponed":
          if (gameCount == 2 && i == 0) {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            philliesResultElementOne.textContent = "Game 1 has been postponed";
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            philliesResultElementTwo.textContent = "Game 2 has not started yet";
          }
          else if (gameCount == 2 && i == 1) {
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result"); 
            philliesResultElementTwo.textContent = "Game 2 has been postponed"
          }
          else {
            let philliesResultElementOne = document.getElementById("phillies-gameOne-result"); 
            philliesResultElementOne.textContent = "Today's game has been postponed";
            let philliesResultElementTwo = document.getElementById("phillies-gameTwo-result");
            philliesResultElementTwo.textContent = null;
          }
          /*console.log("Phillies have a game scheduled today, but it has been postponed.");*/
          break;
        case "Final":
        case "Completed Early":
          const home = game.teams.home;
          const away = game.teams.away;

          let teamWon = false;
          if (home.team.id === TEAM_ID && home.isWinner) teamWon = true 
          if (away.team.id === TEAM_ID && away.isWinner) teamWon = true;
        
          if (teamWon && i == 0) {
            /*console.log("🏆 Team 143 won today.");*/
            let philliesResultElementSix = document.getElementById("phillies-gameOne-result");
            philliesResultElementSix.textContent = "YES";
          }
          else if (teamWon && i == 1) {
            /*console.log("🏆 Team 143 won today.");*/
            let philliesResultElementSeven = document.getElementById("phillies-gameTwo-result");
            philliesResultElementSeven.textContent = "YES";
          }
          else if (!teamWon && i == 0) {
            /*console.log("❌ Team 143 did not win today.");*/
            let philliesResultElementSix = document.getElementById("phillies-gameOne-result");
            philliesResultElementSix.textContent = "NO";
          }
          else if (!teamWon && i == 1) {
            /*console.log("❌ Team 143 did not win today.");*/
            let philliesResultElementSeven = document.getElementById("phillies-gameTwo-result");
            philliesResultElementSeven.textContent = "NO";
          }
      }
  }
}
}
runDailyReport().catch(console.error);