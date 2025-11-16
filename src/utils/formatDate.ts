//Format the date to a more readable format

export const formatDate = (localtime: string): string => {

    const date = new Date(localtime.replace(' ', 'T')); 
  
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; 
    }
  
    return date.toLocaleDateString('en-US', {
      weekday: 'short',  
      day: 'numeric',    
      month: 'short',  
      year: 'numeric',  
    }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };