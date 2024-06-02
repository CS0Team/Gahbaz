export function isUserActive(lastActivity) {
    // Get the current date and time
    const currentDate = new Date();
  
    // Subtract 5 minutes from the current date and time
    const currentDateMinus5Minutes = new Date(currentDate.getTime() - 5 * 60 * 1000);
  
    // Compare the given date with the current date minus 5 minutes
    return lastActivity < currentDateMinus5Minutes;
  }